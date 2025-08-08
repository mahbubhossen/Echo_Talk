import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { useNavigate } from "react-router";

const Membership = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Check membership status on component mount
  useEffect(() => {
    if (user?.email) {
      fetch(`https://echotalk-server.vercel.app/user/${user.email}/status`)
        .then((res) => res.json())
        .then((data) => {
          setIsMember(data.isMember);
        })
        .catch((err) => console.error("Error fetching membership status", err));
    }
  }, [user]);

  const handleBecomeMember = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://echotalk-server.vercel.app/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setIsMember(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error("Membership Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6 text-center">
        <h2 className="text-2xl font-bold">Become a Gold Member ✨</h2>
        <p>
          Pay <span className="font-semibold">৳100 / $1</span> to become a
          member.
        </p>

        {isMember ? (
          <p className="text-green-600 font-semibold">
            You are already a Gold Member! 🎉
          </p>
        ) : success ? (
          <p className="text-green-600 font-semibold">
            You're now a Gold Member!
          </p>
        ) : (
          <button
            onClick={handleBecomeMember}
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay & Join Membership"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Membership;
