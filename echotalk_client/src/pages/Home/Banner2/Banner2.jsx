import React from "react";
import bannerImg from "../../../assets/banner.png"; // 🔹 এখানে তোমার ইমেজ দিবে

const Banner2 = () => {
  return (
    <section className="bg-gray-50 py-12 mt-20 mx-4">
      <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">
        
        {/* Left Side: Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
             Welcome to <span className="text-primary">EchoTalk</span>
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            EchoTalk is a modern community platform where you can share ideas, 
            explore posts by tags, and engage with people worldwide. Comment, 
            upvote, or report — your voice matters. Join now and be part of a 
            growing digital community.
          </p>
          
        </div>

        {/* Right Side: Image */}
        <div className="flex-1">
          <img
            src={bannerImg}
            alt="EchoTalk Banner"
            className="w-full max-w-md mx-auto "
          />
        </div>
      </div>
    </section>
  );
};

export default Banner2;
