import React, { useState } from "react";
import { useNavigate } from "react-router";

import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const Banner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const res = await fetch(
        `https://echotalk-server.vercel.app/posts/search?tag=${searchTerm}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-4">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 text-white text-center rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Find Posts by Tag 🔍
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search by tag, e.g., education"
            className="input input-bordered w-full text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Replace button with AwesomeButton */}
          <AwesomeButton
            type="primary"
            onPress={handleSearch}
            className="w-full sm:w-auto"
          >
            Search
          </AwesomeButton>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post) => (
              <div
                key={post._id}
                onClick={() => navigate(`/post-details/${post._id}`)}
                className="bg-white text-black p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  👤 {post.authorName}
                </p>
                <p className="text-sm text-gray-600">🏷️ {post.tag}</p>
                <p className="text-sm text-gray-600">
                  💬 Comments: {post.commentCount || 0}
                </p>
                <p className="text-sm text-gray-600">
                  ⬆️ {post.upVote || 0} ⬇️ {post.downVote || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
