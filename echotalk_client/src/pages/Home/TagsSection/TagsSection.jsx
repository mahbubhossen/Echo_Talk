import React, { useEffect, useState } from "react";

const TagsSection = ({ onTagSelect }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch("https://echotalk-server.vercel.app/tags")
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);

  return (
    <section className="max-w-7xl mx-auto p-4 mt-12">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Browse by Tags
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tagObj) => (
          <button
            key={tagObj._id}
            onClick={() => onTagSelect(tagObj.name)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md transition"
            title={`Search posts tagged '${tagObj.name}'`}
          >
            #{tagObj.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TagsSection;
