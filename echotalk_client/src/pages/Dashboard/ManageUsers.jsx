import React, { useEffect, useState } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  const fetchUsers = async (search = "", pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://echotalk-server.vercel.app/admin/users?search=${search}&page=${pageNum}&limit=${limit}`
      );
      const data = await res.json();
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchText, page);
  }, [searchText, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(searchText, 1);
  };

  const makeAdmin = async (email) => {
    const confirm = window.confirm(
      "Are you sure you want to make this user an admin?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `https://echotalk-server.vercel.app/admin/users/make-admin/${email}`,
        {
          method: "PATCH",
        }
      );
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        fetchUsers(searchText, page);
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Users</h2>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col md:flex-row items-center gap-2"
      >
        <input
          type="text"
          placeholder="Search by username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered w-full max-w-sm"
        />
        <button className="btn btn-primary">Search</button>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Membership</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === "admin"
                              ? "badge-success"
                              : "badge-secondary"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.isMember ? (
                          <span className="badge badge-info">Member</span>
                        ) : (
                          <span className="badge badge-warning">Free</span>
                        )}
                      </td>
                      <td>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => makeAdmin(user.email)}
                            className="btn btn-sm btn-outline btn-success"
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                className={`btn btn-sm ${
                  page === num + 1 ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setPage(num + 1)}
              >
                {num + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
