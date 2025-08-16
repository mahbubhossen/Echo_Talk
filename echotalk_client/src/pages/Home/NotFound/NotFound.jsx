import React from "react";
import { Link } from "react-router"; // আপনার প্রজেক্টে যেটা ইউজ করছেন সেটাই রাখলাম

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-base-200">
      {/* Illustration */}
      <div className="mb-6">
        <svg
          width="220"
          height="160"
          viewBox="0 0 220 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow"
        >
          <rect x="10" y="20" width="200" height="120" rx="14" fill="#f1f5f9" />
          <rect x="22" y="36" width="176" height="16" rx="8" fill="#e2e8f0" />
          <rect x="22" y="60" width="140" height="16" rx="8" fill="#e2e8f0" />
          <rect x="22" y="84" width="120" height="16" rx="8" fill="#e2e8f0" />
          <circle cx="180" cy="108" r="14" fill="#8abc48" />
          <text x="110" y="125" textAnchor="middle" fontSize="36" fontWeight="700" fill="#8abc48">
            404
          </text>
        </svg>
      </div>

      {/* Texts */}
      <h1 className="text-4xl font-extrabold mb-2">
        Page <span className="text-[#8abc48]">Not Found</span>
      </h1>
      <p className="text-gray-500 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Actions */}
      <div className="mt-6">
        <Link to="/" className="btn btn-primary rounded-full px-6">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
