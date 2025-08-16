import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthProvider";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { Dialog } from "@headlessui/react";
import Pagination from "../../../Shared/Pagination/Pagination";

const COMMENTS_PER_PAGE = 5;

const PostDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [expandedComment, setExpandedComment] = useState(null);
  const [feedbackSelections, setFeedbackSelections] = useState({});
  const [commentPage, setCommentPage] = useState(1);

  const shareUrl = `${window.location.origin}/post/${id}`;

  // Fetch post details
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await fetch(`https://echotalk-server.vercel.app/posts/${id}`);
      return res.json();
    },
  });

  // Fetch comments with pagination
  const {
    data: commentsData = { totalComments: 0, comments: [] },
    isLoading: isCommentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", id, commentPage],
    queryFn: async () => {
      const res = await fetch(
        `https://echotalk-server.vercel.app/comments/${id}?page=${commentPage}&limit=${COMMENTS_PER_PAGE}`
      );
      return res.json();
    },
  });

  // Mutations for votes
  const upvote = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `https://echotalk-server.vercel.app/posts/${id}/upvote`,
        { method: "PATCH" }
      );
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["post", id]),
  });

  const downvote = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `https://echotalk-server.vercel.app/posts/${id}/downvote`,
        { method: "PATCH" }
      );
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["post", id]),
  });

  // Add new comment
  const addComment = useMutation({
    mutationFn: async (text) => {
      const res = await fetch(`https://echotalk-server.vercel.app/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: id,
          authorEmail: user.email,
          text,
          createdAt: new Date().toLocaleString(),
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      refetchComments();
      setCommentText("");
    },
  });

  // Report comment
  const reportComment = async (commentId, feedback, commentText) => {
    try {
      const res = await fetch(`https://echotalk-server.vercel.app/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          feedback,
          commentText,
          reporterEmail: user.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedbackSelections((prev) => ({
          ...prev,
          [commentId]: { ...prev[commentId], reported: true },
        }));
      } else {
        alert(data.message || "Failed to report comment.");
      }
    } catch (err) {
      console.error("Report failed", err);
    }
  };

  if (isPostLoading)
    return <div className="text-center py-10">Loading post...</div>;

  const feedbackOptions = [
    "Offensive language",
    "Spam or scam",
    "Irrelevant content",
  ];
  const totalPages = Math.ceil(commentsData.totalComments / COMMENTS_PER_PAGE);

  return (
    <div className="p-4 mt-24 max-w-3xl mx-auto space-y-6">
      {/* Post */}
      <div className="border rounded-lg p-4 shadow bg-base-100">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={post.authorImage}
            alt="Author"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h4 className="font-semibold">{post.authorName}</h4>
            <p className="text-xs text-gray-500">{post.createdAt}</p>
          </div>
        </div>
        <h2 className="text-xl font-bold mt-2">{post.title}</h2>
        <p className="mt-2">{post.description}</p>
        <span className="mt-3 inline-block text-sm badge badge-outline">
          {post.tag}
        </span>

        <div className="mt-4 flex gap-3 items-center flex-wrap">
          <button
            onClick={() => upvote.mutate()}
            className="btn btn-sm btn-outline"
            disabled={!user}
          >
            👍 {post.upVote}
          </button>
          <button
            onClick={() => downvote.mutate()}
            className="btn btn-sm btn-outline"
            disabled={!user}
          >
            👎 {post.downVote}
          </button>
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border rounded-lg p-4 shadow bg-base-100">
        <h3 className="font-semibold mb-4">
          Comments ({commentsData.totalComments})
        </h3>

        {user ? (
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 input input-bordered"
            />
            <button
              className="btn btn-primary"
              onClick={() =>
                commentText.trim() && addComment.mutate(commentText)
              }
            >
              Comment
            </button>
          </div>
        ) : (
          <p className="text-sm text-red-600">Please login to comment.</p>
        )}

        {isCommentsLoading ? (
          <p>Loading comments...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Comment</th>
                    <th>Feedback</th>
                    <th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {commentsData.comments.map((c) => {
                    const isLong = c.text.length > 20;
                    const selectedFeedback =
                      feedbackSelections[c._id]?.feedback || "";
                    const isReported =
                      feedbackSelections[c._id]?.reported || false;

                    return (
                      <tr key={c._id}>
                        <td className="text-xs">{c.authorEmail}</td>
                        <td>
                          {isLong ? (
                            <>
                              {c.text.slice(0, 20)}...
                              <button
                                onClick={() => setExpandedComment(c)}
                                className="link link-primary text-xs ml-1"
                              >
                                Read More
                              </button>
                            </>
                          ) : (
                            c.text
                          )}
                        </td>
                        <td>
                          <select
                            className="select select-bordered select-xs"
                            onChange={(e) =>
                              setFeedbackSelections((prev) => ({
                                ...prev,
                                [c._id]: {
                                  feedback: e.target.value,
                                  reported: false,
                                },
                              }))
                            }
                            value={selectedFeedback}
                          >
                            <option value="">Select</option>
                            {feedbackOptions.map((f, i) => (
                              <option key={i} value={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn btn-xs btn-error"
                            onClick={() =>
                              reportComment(c._id, selectedFeedback, c.text)
                            }
                            disabled={!selectedFeedback || isReported}
                          >
                            {isReported ? "Reported" : "Report"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={commentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCommentPage(page)}
            />
          </>
        )}
      </div>

      {/* Expanded Comment Modal */}
      {expandedComment && (
        <Dialog
          open={true}
          onClose={() => setExpandedComment(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Full Comment</h2>
            <p>{expandedComment.text}</p>
            <div className="text-right mt-4">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setExpandedComment(null)}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default PostDetails;
