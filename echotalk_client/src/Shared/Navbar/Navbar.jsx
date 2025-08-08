import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { Bell } from "lucide-react";
import logo from "../../assets/echotalk_logo.png";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [announcementCount, setAnnouncementCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      setUser(loggedUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch("https://echotalk-server.vercel.app/announcement-count")
      .then((res) => res.json())
      .then((data) => {
        if (data?.count) {
          setAnnouncementCount(data.count);
        }
      })
      .catch(() => setAnnouncementCount(0));
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-md px-4 lg:px-10">
      {/* Left: Logo */}
      <div className="flex-1 flex justify-start items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <img src={logo} alt="Logo" className="w-14 h-12" />
          <span className="hidden sm:inline">EchoTalk</span>
        </Link>
      </div>

      {/* Center: Nav Links */}
      <div className="flex-1 hidden md:flex justify-center items-center gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "btn btn-sm btn-ghost text-primary font-semibold"
              : "btn btn-sm btn-ghost"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/membership"
          className={({ isActive }) =>
            isActive
              ? "btn btn-sm btn-ghost text-primary font-semibold"
              : "btn btn-sm btn-ghost"
          }
        >
          Membership
        </NavLink>
      </div>

      {/* Right: Notification + Auth */}
      <div className="flex-1 hidden md:flex justify-end items-center gap-4">
        {announcementCount > 0 && (
          <Link to="/announcements" className="btn btn-ghost btn-sm relative">
            <Bell className="w-5 h-5" />
            <span className="badge badge-error badge-xs absolute top-0 right-0">
              {announcementCount}
            </span>
          </Link>
        )}

        {!user ? (
          <Link
            to="/login"
            className="btn btn-primary btn-sm rounded-full px-4"
          >
            Join Us
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user?.photoURL || "/user.png"} alt="User" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li className="text-center font-semibold pointer-events-none">
                {user?.displayName || "User"}
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/logout" className="text-error">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      <div className="dropdown dropdown-end md:hidden">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/membership">Membership</NavLink>
          </li>

          {user && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
          {!user ? (
            <li>
              <Link to="/login">Join Us</Link>
            </li>
          ) : (
            <li>
              <Link to="/logout" className="text-error">
                Logout
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
