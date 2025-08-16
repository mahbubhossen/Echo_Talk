import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router";

const AddPost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const [postCount, setPostCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tagOptions, setTagOptions] = useState([]);

  // Fetch post count, membership, and tags
  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        const [countRes, statusRes, tagsRes] = await Promise.all([
          fetch(
            `https://echotalk-server.vercel.app/posts/count?email=${user.email}`
          ),
          fetch(`https://echotalk-server.vercel.app/user/${user.email}/status`),
          fetch("https://echotalk-server.vercel.app/tags"),
        ]);

        const countData = await countRes.json();
        const statusData = await statusRes.json();
        const tagsData = await tagsRes.json();

        setPostCount(countData.count || 0);
        setIsMember(statusData.isMember || false);

        // Format tags for react-select
        const formattedTags = tagsData.map((tag) => ({
          value: tag.name,
          label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
        }));
        setTagOptions(formattedTags);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const onSubmit = async (data) => {
    if (!isMember && postCount >= 5) {
      alert(
        "You have reached your 5 posts limit. Please become a member to post more."
      );
      return;
    }

    const post = {
      authorImage: user?.photoURL,
      authorName: user?.displayName,
      authorEmail: user?.email,
      title: data.title,
      description: data.description,
      tag: data.tag?.value || "general",
      upVote: parseInt(data.upVote) || 0,
      downVote: parseInt(data.downVote) || 0,
      createdAt: new Date().toLocaleString(),
    };

    const res = await fetch("https://echotalk-server.vercel.app/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    const result = await res.json();
    if (result.insertedId) {
      alert("Post added successfully!");
      reset();
      setPostCount((prev) => prev + 1);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (!isMember && postCount >= 5) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-semibold mb-4">
          You've reached your limit of 5 posts. Become a member to continue
          posting!
        </p>
        <button
          onClick={() => navigate("/membership")}
          className="btn btn-primary"
        >
          Become a Member
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("authorImage")}
          type="text"
          value={user?.photoURL || ""}
          readOnly
          className="input input-bordered w-full"
        />

        <input
          {...register("authorName")}
          type="text"
          value={user?.displayName || ""}
          readOnly
          className="input input-bordered w-full"
        />

        <input
          {...register("authorEmail")}
          type="email"
          value={user?.email || ""}
          readOnly
          className="input input-bordered w-full"
        />

        <input
          {...register("title", { required: true })}
          type="text"
          placeholder="Post Title"
          className="input input-bordered w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">Title is required</p>
        )}

        <textarea
          {...register("description", { required: true })}
          placeholder="Post Description"
          className="textarea textarea-bordered w-full"
          rows={5}
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm">Description is required</p>
        )}

        {/* Dropdown from MongoDB tags */}
        <Controller
          name="tag"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={tagOptions}
              placeholder="Select a tag"
              isSearchable
              className="react-select-container text-black"
              classNamePrefix="react-select"
            />
          )}
        />

        <input
          {...register("upVote")}
          type="number"
          placeholder="UpVote (default 0)"
          className="input input-bordered w-full"
          defaultValue={0}
          min={0}
        />

        <input
          {...register("downVote")}
          type="number"
          placeholder="DownVote (default 0)"
          className="input input-bordered w-full"
          defaultValue={0}
          min={0}
        />

        <button className="btn btn-primary w-full mt-4" type="submit">
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
