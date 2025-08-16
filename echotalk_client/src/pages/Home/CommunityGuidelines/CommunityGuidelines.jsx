import React from "react";

const CommunityGuidelines = () => {
  return (
    <section className="bg-base-100 rounded-2xl py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 ">
          Community Guidelines
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-10">
          At <span className="font-semibold">EchoTalk</span>, we believe in
          building a safe and engaging community. To keep the platform positive
          and helpful, please follow these guidelines:
        </p>

        <div className="grid gap-6 md:grid-cols-2 text-left">
          <div className="card bg-base-200 shadow-md p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">✅ Be Respectful</h3>
            <p className="text-gray-600">
              Treat others with kindness. Avoid hate speech, personal attacks,
              or harassment.
            </p>
          </div>

          <div className="card bg-base-200 shadow-md p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">💡 Stay Relevant</h3>
            <p className="text-gray-600">
              Keep your posts and comments on-topic and useful to the community.
            </p>
          </div>

          <div className="card bg-base-200 shadow-md p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">🚫 No Spam</h3>
            <p className="text-gray-600">
              Avoid posting promotional or repetitive content. Spam will be
              removed.
            </p>
          </div>

          <div className="card bg-base-200 shadow-md p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">🔒 Report Issues</h3>
            <p className="text-gray-600">
              If you find inappropriate content, please report it so our team
              can take action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityGuidelines;
