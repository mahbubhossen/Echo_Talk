import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminProfile = () => {
  const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    fetch("https://echotalk-server.vercel.app/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch("https://echotalk-server.vercel.app/tags")
      .then((res) => res.json())
      .then(setTags);
  }, []);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag) return;

    const res = await fetch("https://echotalk-server.vercel.app/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag }),
    });

    if (res.ok) {
      const added = await res.json();
      setTags([...tags, added]);
      setNewTag("");
    }
  };

  const chartData = {
    labels: ["Posts", "Comments", "Users"],
    datasets: [
      {
        label: "Site Data",
        data: [stats.posts, stats.comments, stats.users],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-base-200 p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-6">
        <img
          src={user?.photoURL}
          alt="Admin"
          className="w-24 h-24 rounded-full border-2 border-primary"
        />
        <div>
          <h2 className="text-2xl font-bold">{user?.displayName}</h2>
          <p className="text-sm">{user?.email}</p>
          <p className="mt-2">
            <span className="font-medium">Total Posts:</span> {stats.posts}
          </p>
          <p>
            <span className="font-medium">Total Comments:</span>{" "}
            {stats.comments}
          </p>
          <p>
            <span className="font-medium">Total Users:</span> {stats.users}
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-base-100 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Site Overview</h3>
        <div className="max-w-xs md:max-w-sm mx-auto">
          <Pie data={chartData} />
        </div>
      </div>

      {/* Tag Management */}
      <div className="bg-base-100 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Add Tag</h3>
        <form onSubmit={handleAddTag} className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Enter tag name"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <button className="btn btn-primary">Add</button>
        </form>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag._id} className="badge badge-outline badge-primary">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
