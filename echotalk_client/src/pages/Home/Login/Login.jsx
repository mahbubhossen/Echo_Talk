import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase/firebase";
import { AuthContext } from "../../../context/AuthProvider";
import { useForm } from "react-hook-form";

const JoinUs = () => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit } = useForm();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);

  // Send email to backend to get token and store it
  const getToken = async (email) => {
    try {
      const res = await fetch("https://echotalk-server.vercel.app/jwt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
    } catch (err) {
      console.error("JWT fetch error:", err);
    }
  };

  const onSubmit = async ({ email, password }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await getToken(result.user.email);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await getToken(result.user.email);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Join Us</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            {...register("email", { required: true })}
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            {...register("password", { required: true })}
          />
          <button className="btn btn-primary w-full">Login</button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="divider">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default JoinUs;
