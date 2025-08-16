import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Home/Login/Login";
import Register from "../pages/Home/Register/Register";
import Logout from "../pages/Home/Logout/Logout";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyProfile from "../pages/Dashboard/MyProfile";
import AddPost from "../pages/Dashboard/AddPost";
import MyPosts from "../pages/Dashboard/MyPosts";
import PostDetails from "../pages/Home/AllPosts/PostDetails";
import Membership from "../pages/Home/Membership/Membership";
import AdminProfile from "../pages/Dashboard/AdminProfile";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import ReportedComments from "../pages/Dashboard/ReportedComments";
import MakeAnnouncement from "../pages/Dashboard/MakeAnnouncement";
import NotFound from "../pages/Home/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/logout",
        Component: Logout,
      },
      {
        path: "/post-details/:id",
        element: <PostDetails />,
      },
      {
        path: "/membership",
        element: <PrivateRoute>
          <Membership />
        </PrivateRoute>,
      }
    ],
  },
  {
  path: "/dashboard",
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    // User routes
    {
      path: "profile",
      element: <MyProfile />,
    },
    {
      path: "add-post",
      element: <AddPost />,
    },
    {
      path: "my-posts",
      element: <MyPosts />,
    },

    // Admin routes 
    {
      path: "admin-profile",
      element: <AdminProfile />,
    },
    {
      path: "manage-users",
      element: <ManageUsers />,
    },
    {
      path: "reported-comments",
      element: <ReportedComments />,
    },
    {
      path: "announcement",
      element: <MakeAnnouncement />,
    },
  ],
},

]);
