import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";


const POSTS_PER_PAGE = 5;

const AllPosts = () => {
  const [page, setPage] = useState(1);
  const [sortByPopularity, setSortByPopularity] = useState(false);
  const navigate = useNavigate();

  // Fetch posts with pagination and sorting
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", page, sortByPopularity],
    queryFn: async () => {
      const baseUrl = sortByPopularity
        ? `https://echotalk-server.vercel.app/posts/popular?page=${page}&limit=${POSTS_PER_PAGE}`
        : `https://echotalk-server.vercel.app/posts?page=${page}&limit=${POSTS_PER_PAGE}`;
      const res = await fetch(baseUrl);
      return res.json();
    },
  });

  // Fetch total post count for pagination
  const { data: totalCount = 0 } = useQuery({
    queryKey: ["postCount"],
    queryFn: async () => {
      const res = await fetch("https://echotalk-server.vercel.app/posts/total");
      const data = await res.json();
      return data.count;
    },
  });

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div id="all-posts" className="p-4 max-w-5xl mx-auto">
      {/* Sort by Popularity */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">All Posts</h2>
        <button
          onClick={() => setSortByPopularity(!sortByPopularity)}
          className="btn btn-outline btn-sm"
        >
          {sortByPopularity ? "Sort by Latest" : "Sort by Popularity"}
        </button>
      </div>

      {/* Post List */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => navigate(`/post-details/${post._id}`)}
            className="border rounded-lg p-4 shadow-sm bg-base-100 hover:shadow-md cursor-pointer transition-all"
          >
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-2">
              <img
                src={post.authorImage}
                alt="Author"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{post.authorName}</h4>
                <p className="text-sm text-gray-500">{post.createdAt}</p>
              </div>
            </div>

            {/* Title & Tag */}
            <h3 className="text-lg font-bold mb-2">{post.title}</h3>
            <p className="text-sm text-primary mb-1">
              Tag: <span className="font-medium">{post.tag}</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-between text-sm text-gray-600 mt-3 gap-y-2">
              <p>💬 Comments ({post.commentCount || 0})</p>
              <p>⬆️ UpVotes: {post.upVote || 0}</p>
              <p>⬇️ DownVotes: {post.downVote || 0}</p>
              <p>🔥 Popularity: {(post.upVote || 0) - (post.downVote || 0)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center flex-wrap gap-2">
        {[...Array(totalPages).keys()].map((n) => (
          <button
            key={n + 1}
            onClick={() => setPage(n + 1)}
            className={`btn btn-sm ${
              page === n + 1 ? "btn-primary" : "btn-outline"
            }`}
          >
            {n + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;
