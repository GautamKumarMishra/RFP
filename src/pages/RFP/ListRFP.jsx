import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const ListRfp = () => {
  const navigate = useNavigate();
  const [rfpList, setRfpList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const [authToken] = useState(() => localStorage.getItem("authToken") || "");

  useEffect(() => {
    const fetchRfps = async () => {
      // token for authentication
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      if (!userId || !token) {
        console.error("User ID or token not found");
        return;
      }

      try {
        // Rfp for user
        const response = await axios.get(
          `https://rfpdemo.velsof.com/api/rfp/getrfp/${userId}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.response === "success") {
          setRfpList(response.data.rfps);
        } else {
          console.error(
            "Error fetching RFPs:",
            response.data.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error(
          "API Error:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchRfps();
  }, []);

  // Pagination
  const totalPages = Math.ceil(rfpList.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentRfps = rfpList.slice(startIndex, startIndex + entriesPerPage);

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow-md p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold">RFP List</h4>
          <button
            onClick={() => navigate("/createRFP")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add RFP
          </button>
        </div>

        <div id="rfpTable" className="overflow-x-auto w-full">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">RFP No.</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Last Date</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRfps.map((rfp, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{startIndex + index + 1}</td>
                  <td className="px-4 py-2">{rfp.rfp_no}</td>
                  <td className="px-4 py-2">{rfp.item_name}</td>
                  <td className="px-4 py-2">{rfp.last_date}</td>
                  <td className="px-4 py-2">
                    ₹{rfp.minimum_price} - ₹{rfp.maximum_price}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        rfp.rfp_status === "closed"
                          ? "bg-red-100 text-red-800"
                          : rfp.applied_status === "open"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rfp.rfp_status === "closed"
                        ? "Closed"
                        : rfp.applied_status === "open"
                        ? "Open"
                        : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:underline mr-2">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListRfp;
