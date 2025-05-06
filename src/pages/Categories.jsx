

import React, { useEffect, useState } from "react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [modalError, setModalError] = useState("");
  const [addError, setAddError] = useState("");

  const entriesPerPage = 5;

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch category data
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://rfpdemo.velsof.com/api/categories",
        {
          headers: { Authorization: token },
        }
      );
      console.log(response.data)
      if (response.data.response === "success") {
        const formatted = Object.values(response.data.categories);
        setCategories(formatted);
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (err) {
      setError("Error fetching categories.");
    } finally {
      setLoading(false);
    }
  };
  // Action button activate/ deactivate
  const toggleCategoryStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      const response = await axios.post(
        // "https://rfpdemo.velsof.com/api/toggleCategoryStatus",
        { id, status: newStatus },
        { headers: { Authorization: token } }
      );

      if (response.data.response === "success") {
        // Instead of updating state, just reload data or navigate
        fetchCategories(); // or navigate("/categories") if this is a sub-route
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Error updating category status.");
    }
  };

  // const handleAddCategory = async () => {
  //   if (!newCategory.trim()) {
  //     setModalError("Category name cannot be empty.");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.post(
  //       "https://rfpdemo.velsof.com/api/addCategory",
  //       { name: newCategory },
  //       { headers: { Authorization: token } }
  //     );

  //     if (
  //       response.data.response === "error" &&
  //       response.data.error === "Category already exist"
  //     ) {
  //       setModalError("Category already exists.");
  //     } else if (response.data.response === "success") {
  //       alert("Category added successfully.");
  //       setShowModal(false);
  //       setNewCategory("");
  //       setModalError("");
  //       fetchCategories(); // refresh list
  //     } else {
  //       setModalError("Something went wrong.");
  //     }
  //   } catch (error) {
  //     setModalError("Error adding category.");
  //   }
  // };

  // Pagination
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentCategories = categories.slice(
    startIndex,
    startIndex + entriesPerPage
  );
  const totalPages = Math.ceil(categories.length / entriesPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Categories List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Add Category
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-bold mb-4">Add New Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
            />
            {addError && <p className="text-red-600 text-sm">{addError}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    const response = await axios.post(
                      "https://rfpdemo.velsof.com/api/categories",
                      { name: newCategory },
                      { headers: { Authorization: token } }
                    );
                    if (response.data.response === "error") {
                      if (response.data.error === "Category already exist") {
                        setAddError("Category already exists");
                      } else {
                        setAddError("Something went wrong.");
                      }
                    } else if (response.data.response === "success") {
                      alert("Category added successfully.");
                      setShowModal(false);
                      setNewCategory("");
                      fetchCategories(); // Refresh categories
                    }
                  } catch (err) {
                      setAddError("Error adding category.");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto ">
            <table className="min-w-full border divide-y  divide-gray-200">
              <thead className="bg-gray-800 h-12">
                <tr className="text-white">
                  <th className="px-4 py-2">S. No.</th>
                  <th className="px-4 py-2">Category Name</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCategories.map((category, index) => (
                  <tr key={category.id}>
                    <td className="px-4 py-2">{startIndex + index + 1}</td>
                    <td className="px-4 py-2">{category.name}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-md font-medium text-white ${
                          category.status === "Active"
                            ? "bg-green-600"
                            : "bg-red-500"
                        }`}
                      >
                        {category.status === "Active" ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() =>
                          toggleCategoryStatus(category.id, category.status)
                        }
                        className={`py-2 px-3 rounded font-bold text-md ${
                          category.status === "Active"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {category.status === "Active"
                          ? "DEACTIVATE"
                          : "ACTIVATE"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

export default Categories;
