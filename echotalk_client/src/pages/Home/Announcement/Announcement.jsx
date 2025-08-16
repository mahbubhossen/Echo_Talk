import React, { useEffect, useState } from "react";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("https://echotalk-server.vercel.app/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data));
  }, []);

  return (
    <div id="announcements" className="p-4">
      {announcements.length > 0 && (
        <section className="bg-blue-50 rounded-xl p-4 shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to My Site!</h1>
          <h2 className="text-xl font-semibold mb-3">📢 Announcements</h2>
          <ul className="space-y-3">
            {announcements.map((a) => (
              <li
                key={a._id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <h3 className="text-lg font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-600">{a.description}</p>
                <div className="text-xs text-gray-500 mt-1">
                  By {a.authorName} • {new Date(a.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Announcement;
