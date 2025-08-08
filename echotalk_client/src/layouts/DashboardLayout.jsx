import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import { getAuth } from "firebase/auth";
import { auth } from "../firebase/firebase";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("user");

  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    if (!userEmail) return;

    fetch(`https://echotalk-server.vercel.app/users/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setUserRole(data.role || "user");
      })
      .catch(() => {
        setUserRole("user");
      });
  }, [userEmail]);

  return (
    <div className="min-h-screen md:grid md:grid-cols-12">
      {/* Sidebar */}
      <aside
        className={`bg-base-200 p-4 shadow-md ${
          menuOpen ? "block" : "hidden"
        } md:block md:col-span-3 lg:col-span-2`}
      >
        {/* Go Home Button */}
        <div className="mb-4">
          <Link to="/" className="btn btn-outline btn-sm w-full">
            Go to Home
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {/* User-only routes */}
          {userRole !== "admin" && (
            <>
              <Link
                to="/dashboard/profile"
                className="btn btn-sm btn-ghost w-full text-left"
              >
                My Profile
              </Link>
              <Link
                to="/dashboard/add-post"
                className="btn btn-sm btn-ghost w-full text-left"
              >
                Add Post
              </Link>
              <Link
                to="/dashboard/my-posts"
                className="btn btn-sm btn-ghost w-full text-left"
              >
                My Posts
              </Link>
            </>
          )}

          {/* Admin-only routes */}
          {userRole === "admin" && (
            <>
              <Link
                to="/dashboard/admin-profile"
                className="btn btn-sm btn-ghost w-full text-left"
              >
                Admin Profile
              </Link>
              <Link
                to="/dashboard/manage-users"
                className="btn btn-sm btn-ghost w-full text-left"
              >
                Manage Users
              </Link>
              <Link
                to="/dashboard/reported-comments"
                className="btn btn-sm btn-ghost w-full text-left"
              >
                Reported Comments
              </Link>
              <Link
                to="/dashboard/announcement"
                className="btn btn-sm btn-ghost w-full text-left"
              >
                Make Announcement
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-9 lg:col-span-10 p-4 w-full">
        {/* Mobile toggle button */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-sm btn-outline"
          >
            {menuOpen ? "Hide Menu" : "Show Menu"}
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
