import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useForm } from "react-hook-form";

const MakeAnnouncement = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const announcement = {
      authorImage: user?.photoURL,
      authorName: user?.displayName,
      title: data.title,
      description: data.description,
    };

    const res = await fetch(
      "https://echotalk-server.vercel.app/announcements",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      }
    );

    const result = await res.json();
    if (result.insertedId) {
      setMessage(" Announcement posted!");
      reset();
    } else {
      setMessage(" Failed to post announcement.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Make Announcement</h2>
      {message && <p className="mb-4 text-center text-green-600">{message}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Author Name */}
        <input
          type="text"
          value={user?.displayName || ""}
          readOnly
          className="input input-bordered w-full"
        />
        {/* Author Image */}
        <input
          type="text"
          value={user?.photoURL || ""}
          readOnly
          className="input input-bordered w-full"
        />
        {/* Title */}
        <input
          {...register("title", { required: true })}
          type="text"
          placeholder="Announcement Title"
          className="input input-bordered w-full"
        />
        {/* Description */}
        <textarea
          {...register("description", { required: true })}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          rows="5"
        ></textarea>
        {/* Submit */}
        <button className="btn btn-primary w-full" type="submit">
          Post Announcement
        </button>
      </form>
    </div>
  );
};

export default MakeAnnouncement;
