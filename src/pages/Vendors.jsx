import React, { useEffect, useState } from "react";
import axios from "axios";

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      // Fetching api to list vendor list
      const token = localStorage.getItem("token");
      const response = await axios.get("https://rfpdemo.velsof.com/api/vendorlist", {
        headers: { Authorization: token },
      });
      console.log(response.data)
      if (response.data.response === "success") {
        setVendors(response.data.vendors);
      } else {
        setError("Failed to fetch vendors.");
      }
    } catch (err) {
      setError("Error fetching vendor data.");
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      
      // Make API call to approve vendor
      const response = await axios.put(
        "https://rfpdemo.velsof.com/api/rfp/approveVendor",
        {
          user_id: userId,
          status: "approved",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data)
      // Check if the API response is successful
      if (response.data.response === "success") {
        // Update status locally after successful API call
        setVendors((prevVendors) =>
          prevVendors.map((v) =>
            v.user_id === userId ? { ...v, status: "Approved" } : v
          )
        );
      } else {
        alert("Failed to approve vendor. Try again.");
      }
    } catch (err) {
      alert("Failed to approve vendor.");
      console.error(err);
    }
  };

  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentVendors = vendors.slice(startIndex, startIndex + entriesPerPage);
  const totalPages = Math.ceil(vendors.length / entriesPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Vendors List</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">S. No.</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">No. of Employees</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentVendors.map((vendor, index) => (
                  <tr key={vendor.user_id}>
                    <td className="px-4 py-2">{startIndex + index + 1}</td>
                    <td className="px-4 py-2">{vendor.name}</td>
                    <td className="px-4 py-2">{vendor.email}</td>
                    <td className="px-4 py-2">{vendor.mobile}</td>
                    <td className="px-4 py-2">{vendor.no_of_employees}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vendor.status === "Approved"
                            ? "bg-green-200 text-green-800"
                            : vendor.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {vendor.status !== "Approved" && (
                        <button
                          onClick={() => approveVendor(vendor.user_id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Vendor;
