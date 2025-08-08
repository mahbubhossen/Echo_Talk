import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthProvider";
import { FaTrash, FaCommentDots } from "react-icons/fa";

const MyPosts = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myPosts", user?.email, page],
    queryFn: async () => {
      const res = await fetch(
        `https://echotalk-server.vercel.app/posts/user/${user?.email}?page=${page}&limit=${limit}`
      );
      return res.json();
    },
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        `https://echotalk-server.vercel.app/posts/${id}`,
        {
          method: "DELETE",
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myPosts", user?.email, page]);
    },
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  const totalPages = Math.ceil(data?.total / limit);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">My Posts</h2>

      {isLoading ? (
        <div className="text-center py-10">Loading your posts...</div>
      ) : isError ? (
        <div className="text-center py-10 text-red-500">
          Failed to load posts
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm md:text-base">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Votes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.posts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  data.posts.map((post, idx) => (
                    <tr key={post._id}>
                      <td>{(page - 1) * limit + idx + 1}</td>
                      <td>{post.title}</td>
                      <td>{(post.upVote || 0) - (post.downVote || 0)}</td>
                      <td className="flex gap-2">
                        <button className="btn btn-sm btn-outline">
                          <FaCommentDots />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="btn btn-sm btn-error text-white"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2 flex-wrap">
              {[...Array(totalPages).keys()].map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n + 1)}
                  className={`btn btn-sm ${
                    page === n + 1 ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {n + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyPosts;
