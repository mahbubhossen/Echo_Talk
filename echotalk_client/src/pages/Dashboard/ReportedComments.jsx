import { useEffect, useState } from "react";

const ReportedComments = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const limit = 10;

  // Calculate total pages safely
  const totalPages = Math.max(1, Math.ceil(totalReports / limit));

  const fetchReports = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://echotalk-server.vercel.app/reports?page=${pageNumber}&limit=${limit}`
      );
      const data = await res.json();

      // Protect against undefined
      setReports(Array.isArray(data.reports) ? data.reports : []);
      setTotalReports(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const handleDelete = async (commentId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirm) return;

    const res = await fetch(
      `https://echotalk-server.vercel.app/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      fetchReports(page);
    } else {
      alert("Failed to delete comment.");
    }
  };

  const handleIgnore = async (reportId) => {
    const res = await fetch(
      `https://echotalk-server.vercel.app/reports/${reportId}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      fetchReports(page);
    } else {
      alert("Failed to ignore report.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Reported Comments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : reports?.length === 0 ? (
        <p>No reported comments found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Comment ID</th>
                  <th>Reporter</th>
                  <th>Feedback</th>
                  <th>Reported At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={r._id}>
                    <td>{(page - 1) * limit + i + 1}</td>
                    <td className="max-w-xs whitespace-pre-wrap break-all">
                      {r.commentId}
                    </td>
                    <td>{r.reporterEmail}</td>
                    <td className="text-sm">{r.feedback}</td>
                    <td>{new Date(r.reportedAt).toLocaleString()}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => handleDelete(r.commentId)}
                        className="btn btn-xs btn-error"
                        disabled={loading}
                      >
                        Delete Comment
                      </button>
                      <button
                        onClick={() => handleIgnore(r._id)}
                        className="btn btn-xs btn-outline"
                        disabled={loading}
                      >
                        Ignore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`btn btn-sm ${
                  page === index + 1 ? "btn-primary" : "btn-outline"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportedComments;
