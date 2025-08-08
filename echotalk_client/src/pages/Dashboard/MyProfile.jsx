import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthProvider";

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  // Badge status
  const { data: status } = useQuery({
    queryKey: ["status", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `https://echotalk-server.vercel.app/user/${user.email}/status`
      );
      return res.json();
    },
    enabled: !!user?.email,
  });

  // Recent posts
  const { data: recentPosts = [] } = useQuery({
    queryKey: ["recentPosts", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `https://echotalk-server.vercel.app/user/${user.email}/recent-posts`
      );
      return res.json();
    },
    enabled: !!user?.email,
  });

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-base-100 p-6 rounded-lg shadow-md">
        <img
          src={user.photoURL}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-primary"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            {user.displayName}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
          <div className="mt-3 flex justify-center sm:justify-start">
            {status ? (
              status.isMember ? (
                <span className="badge badge-gold text-sm">🥇 Gold Member</span>
              ) : (
                <span className="badge badge-bronze text-sm">
                  🥉 Bronze Member
                </span>
              )
            ) : (
              <span className="badge badge-bronze text-sm">
                🥉 Bronze Member
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-base-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
          Recent Posts
        </h3>
        {recentPosts.length > 0 ? (
          <ul className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {recentPosts.map((p) => (
              <li
                key={p._id}
                className="border p-4 rounded-lg hover:shadow transition"
              >
                <h4 className="font-bold text-lg">{p.title}</h4>
                <p className="text-sm text-gray-500">{p.createdAt}</p>
                <p className="text-gray-700 mt-1">
                  {p.description.slice(0, 100)}...
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center sm:text-left">
            No recent posts.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
