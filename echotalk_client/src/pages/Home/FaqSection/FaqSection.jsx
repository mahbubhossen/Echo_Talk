import React from "react";

const FaqSection = () => {
  const faqs = [
    {
      question: "What is EchoTalk?",
      answer:
        "EchoTalk is a modern community platform where users can create, share, and explore posts on various topics using tags. You can also comment, upvote/downvote, and report inappropriate content.",
    },
    {
      question: "How do I search for posts?",
      answer:
        "You can use the search bar on the homepage to search posts by tags. Just type your desired tag and click 'Search'.",
    },
    {
      question: "Do I need an account to interact?",
      answer:
        "Yes, to comment, upvote, downvote, or post content you need to create an account. Viewing posts is free for everyone.",
    },
    {
      question: "How do I report inappropriate comments?",
      answer:
        "Next to each comment, there is a 'Report' button. Clicking it will notify the moderators for review.",
    },
    {
      question: "Can I share posts on social media?",
      answer:
        "Yes! Each post has social media share buttons so you can easily share interesting posts with your friends.",
    },
  ];

  return (
    <section className="py-16 bg-gray-100 mx-6 rounded-2xl mt-12">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              tabIndex={0}
              className="collapse collapse-arrow border border-gray-200 bg-white rounded-box"
            >
              <div className="collapse-title text-lg font-medium text-gray-800">
                {faq.question}
              </div>
              <div className="collapse-content text-gray-600">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
