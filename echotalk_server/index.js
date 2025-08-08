const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const secret = process.env.JWT_SECRET;

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qoghsen.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, { useUnifiedTopology: true });

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Forbidden" });
    req.user = decoded;
    next();
  });
}

// Main function
async function run() {
  try {
    // await client.connect();
    console.log("MongoDB Connected");

    const db = client.db("echoTalk_DB");
    const usersCollection = db.collection("users");
    const postsCollection = db.collection("posts");
    const commentsCollection = db.collection("comments");
    const tagsCollection = db.collection("tags");
    const reportsCollection = db.collection("reports");

    // Home route
    app.get("/", (req, res) => {
      res.send("EchoTalk Server is Running");
    });

    app.post("/jwt", async (req, res) => {
      const { email } = req.body;

      if (!email) return res.status(400).send({ message: "Email required" });

      const token = jwt.sign({ email }, secret, { expiresIn: "7d" });

      res.send({ token });
    });

    app.get("/admin/data", verifyToken, async (req, res) => {
      // only if token is valid
      res.send({ message: "This is protected data!" });
    });

    // Save or update user
    app.post("/users", async (req, res) => {
      const { email, displayName, photoURL } = req.body;

      if (!email) {
        return res.status(400).send({ error: "Email is required" });
      }

      const result = await usersCollection.updateOne(
        { email },
        {
          $set: { displayName, photoURL },
          $setOnInsert: {
            isMember: false,
            role: "user",
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      res.send({ success: true, upserted: result.upsertedCount > 0 });
    });

    // Get user info including role by email
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      if (!user) return res.status(404).send({ message: "User not found" });
      res.send(user);
    });

    // Get recent 3 posts by user
    app.get("/user/:email/recent-posts", async (req, res) => {
      const email = req.params.email;
      const posts = await postsCollection
        .find({ authorEmail: email })
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray();
      res.send(posts);
    });

    // Temporarily make this user admin via browser-accessible GET
    app.get("/make-initial-admin", async (req, res) => {
      const result = await usersCollection.updateOne(
        { email: "admin@gmail.com" },
        { $set: { role: "admin" } }
      );

      if (result.modifiedCount > 0) {
        res.send("User promoted to admin.");
      } else {
        res.send(" User not found or already admin.");
      }
    });

    // Add new tag
    app.post("/tags", async (req, res) => {
      const { name } = req.body;
      if (!name) return res.status(400).send({ message: "Tag is required" });

      const existing = await tagsCollection.findOne({ name });
      if (existing) {
        return res.status(400).send({ message: "Tag already exists" });
      }

      const result = await tagsCollection.insertOne({ name });
      res.send(result);
    });

    // Get all tags
    app.get("/tags", async (req, res) => {
      try {
        const tags = await tagsCollection.find().toArray();
        res.send(tags);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch tags", error: err });
      }
    });

    // Get all users with search + pagination
    app.get("/admin/users", async (req, res) => {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {
        displayName: { $regex: search, $options: "i" },
      };

      try {
        const users = await usersCollection
          .find(query)
          .skip(skip)
          .limit(limit)
          .toArray();
        const total = await usersCollection.countDocuments(query);
        res.send({ users, total });
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch users" });
      }
    });

    //  Promote user to admin
    app.patch("/admin/users/make-admin/:email", async (req, res) => {
      const email = req.params.email;

      try {
        const result = await usersCollection.updateOne(
          { email },
          { $set: { role: "admin" } }
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "User promoted to admin." });
        } else {
          res.send({
            success: false,
            message: "User not found or already admin.",
          });
        }
      } catch (err) {
        res.status(500).send({ error: "Failed to promote user" });
      }
    });

    app.get("/admin/stats", async (req, res) => {
      const userCount = await usersCollection.estimatedDocumentCount();
      const postCount = await postsCollection.estimatedDocumentCount();
      const commentCount = await commentsCollection.estimatedDocumentCount();

      res.send({
        users: userCount,
        posts: postCount,
        comments: commentCount,
      });
    });

    // Get user membership status
    app.get("/user/:email/status", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send({ isMember: user?.isMember || false });
    });

    // Set membership true for a user
    app.post("/membership", async (req, res) => {
      const { email } = req.body;
      await usersCollection.updateOne(
        { email },
        { $set: { isMember: true } },
        { upsert: true }
      );
      res.send({ success: true });
    });

    // Get total number of posts by user
    app.get("/posts/count", async (req, res) => {
      const email = req.query.email;
      const count = await postsCollection.countDocuments({
        authorEmail: email,
      });
      res.send({ count });
    });

    // Create new post
    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await postsCollection.insertOne(post);
      res.send(result);
    });
    // Get posts with pagination + comment counts
    app.get("/posts", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      const posts = await postsCollection
        .aggregate([
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "comments",
              let: { postId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$postId", { $toString: "$$postId" }],
                    },
                  },
                },
              ],
              as: "comments",
            },
          },
          {
            $addFields: {
              commentCount: { $size: "$comments" },
            },
          },
          {
            $project: {
              comments: 0,
            },
          },
        ])
        .toArray();

      res.send(posts);
    });

    //  Paginated posts by user email
    app.get("/posts/user/:email", async (req, res) => {
      const email = req.params.email;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      try {
        const query = { authorEmail: email };
        const posts = await postsCollection
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        const total = await postsCollection.countDocuments(query);

        res.send({ posts, total });
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch user posts", error });
      }
    });

    // Popular posts with comment count fix
    app.get("/posts/popular", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      const posts = await postsCollection
        .aggregate([
          {
            $addFields: {
              voteDiff: { $subtract: ["$upVote", "$downVote"] },
            },
          },
          { $sort: { voteDiff: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "comments",
              let: { postId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$postId", { $toString: "$$postId" }],
                    },
                  },
                },
              ],
              as: "comments",
            },
          },
          {
            $addFields: {
              commentCount: { $size: "$comments" },
            },
          },
          { $project: { comments: 0 } },
        ])
        .toArray();

      res.send(posts);
    });

    app.get("/posts/search", async (req, res) => {
      const tag = req.query.tag;
      if (!tag) return res.status(400).send([]);

      try {
        const posts = await postsCollection
          .aggregate([
            {
              $match: {
                tag: { $regex: new RegExp(tag, "i") },
              },
            },
            {
              $lookup: {
                from: "comments",
                let: { postId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$postId", { $toString: "$$postId" }],
                      },
                    },
                  },
                ],
                as: "comments",
              },
            },
            {
              $addFields: {
                commentCount: { $size: "$comments" },
              },
            },
            {
              $project: {
                comments: 0,
              },
            },
          ])
          .toArray();

        res.send(posts);
      } catch (error) {
        console.error("Search error:", error);
        res.status(500).send([]);
      }
    });

    // Get total number of all posts
    app.get("/posts/total", async (req, res) => {
      const count = await postsCollection.estimatedDocumentCount();
      res.send({ count });
    });

    // Count comments by post title
    app.get("/comments/count", async (req, res) => {
      const title = req.query.title;
      if (!title) return res.status(400).send({ count: 0 });

      const count = await commentsCollection.countDocuments({
        postTitle: title,
      });

      res.send({ count });
    });

    // Delete a post
    app.delete("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await postsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Get single post with comment count
    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const post = await postsCollection.findOne({ _id: new ObjectId(id) });
      const commentCount = await commentsCollection.countDocuments({
        postId: id,
      });
      res.send({ ...post, commentCount });
    });

    // Upvote post
    app.patch("/posts/:id/upvote", async (req, res) => {
      const id = req.params.id;
      const result = await postsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { upVote: 1 } }
      );
      res.send(result);
    });

    // Downvote post
    app.patch("/posts/:id/downvote", async (req, res) => {
      const id = req.params.id;
      const result = await postsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { downVote: 1 } }
      );
      res.send(result);
    });

    // Add comment
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      const result = await commentsCollection.insertOne(comment);
      res.send(result);
    });

    // POST: Add a new announcement
    app.post("/announcements", async (req, res) => {
      const announcement = req.body;
      if (!announcement.title || !announcement.description) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      announcement.createdAt = new Date();
      const result = await db
        .collection("announcements")
        .insertOne(announcement);
      res.send({ success: true, insertedId: result.insertedId });
    });

    // GET: All announcements (most recent first)
    app.get("/announcements", async (req, res) => {
      const announcements = await db
        .collection("announcements")
        .find()
        .sort({ createdAt: -1 })
        .toArray();
      res.send(announcements);
    });

    // GET: Announcement count
    app.get("/announcement-count", async (req, res) => {
      const count = await db.collection("announcements").countDocuments();
      res.send({ count });
    });

    app.get("/comments/:postId", async (req, res) => {
      const { postId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      const commentsCollection = db.collection("comments");

      const totalComments = await commentsCollection.countDocuments({ postId });
      const comments = await commentsCollection
        .find({ postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      res.send({
        totalComments,
        comments,
      });
    });

    // Report a comment
    app.post("/reports", async (req, res) => {
      const { commentId, reporterEmail, feedback, commentText } = req.body;

      if (!commentId || !reporterEmail || !feedback || !commentText) {
        return res.status(400).send({ error: "All fields are required" });
      }

      try {
        // Prevent duplicate report by same user for same comment
        const existingReport = await reportsCollection.findOne({
          commentId,
          reporterEmail,
        });

        if (existingReport) {
          return res
            .status(409)
            .send({ message: "You have already reported this comment" });
        }

        const report = {
          commentId,
          reporterEmail,
          feedback,
          commentText,
          reportedAt: new Date(),
        };

        const result = await reportsCollection.insertOne(report);

        res.send({
          success: true,
          message: "Comment reported successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error reporting comment:", error);
        res.status(500).send({ error: "Failed to report comment" });
      }
    });

    //  Updated GET /reports with pagination
    app.get("/reports", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      try {
        const total = await reportsCollection.countDocuments();
        const reports = await reportsCollection
          .find({})
          .skip(skip)
          .limit(limit)
          .sort({ reportedAt: -1 })
          .toArray();

        res.send({ total, reports });
      } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).send({ error: "Failed to fetch reports" });
      }
    });

    // Delete a report (Ignore)
    app.delete("/reports/:id", async (req, res) => {
      const reportId = req.params.id;

      try {
        const result = await reportsCollection.deleteOne({
          _id: new ObjectId(reportId),
        });

        if (result.deletedCount > 0) {
          res.send({ success: true });
        } else {
          res.status(404).send({ message: "Report not found" });
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).send({ error: "Failed to delete report" });
      }
    });

    // Delete a comment
    app.delete("/comments/:id", async (req, res) => {
      const commentId = req.params.id;
      const result = await commentsCollection.deleteOne({
        _id: new ObjectId(commentId),
      });

      // Also delete report related to this comment
      await reportsCollection.deleteMany({ commentId });

      if (result.deletedCount > 0) {
        res.send({ success: true });
      } else {
        res.status(404).send({ message: "Comment not found" });
      }
    });
  } catch (err) {
    console.error("MongoDB error:", err);
  }
}

run();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
// module.exports = serverless(app);
