import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRFP = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item_name: "",
    rfp_no: "",
    quantity: "",
    last_date: "",
    minimum_price: "",
    maximum_price: "",
    categories: "",
    vendors: "",
    item_description: "",
  });

  const [errors, setErrors] = useState({});
  const [allCategory, setAllCategory] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);

  useEffect(() => {
    // For mapping category id and vendor id
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://rfpdemo.velsof.com/api/vendorlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const vendors = response.data.vendors || [];
        setAllVendors(vendors);
        setFilteredVendors(vendors); // initially show all
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  // All category
  useEffect(() => {
    axios.get("https://rfpdemo.velsof.com/api/categories").then(({ data }) => {
      const categoryData = Object.values(data.categories);
      setAllCategory(categoryData.filter((c) => c.status === "Active"));
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);

    setFormData((prev) => ({
      ...prev,
      [name]: selectedValues.join(","),
    }));

    // Filter vendors when category is selected
    if (name === "categories") {
      const matchedVendors = allVendors.filter(
        (vendor) => selectedValues.includes(vendor.categories) // vendor.categories is a string like "112"
      );
      setFilteredVendors(matchedVendors);
    }
  };
  // Check validation
  const validateForm = () => {
    const errors = {};
    const {
      item_name,
      rfp_no,
      quantity,
      last_date,
      minimum_price,
      maximum_price,
      categories,
      vendors,
      item_description,
    } = formData;

    if (!item_name.trim()) errors.item_name = "Item name is required.";
    if (!rfp_no.trim()) errors.rfp_no = "RFP number is required.";
    if (!quantity) errors.quantity = "Quantity is required.";
    else if (!Number.isInteger(Number(quantity)))
      errors.quantity = "Quantity must be an integer.";

    if (!last_date) errors.last_date = "Last date is required.";
    else if (new Date(last_date) <= new Date())
      errors.last_date = "Last date must be in the future.";

    if (!minimum_price) errors.minimum_price = "Minimum price is required.";
    else if (isNaN(minimum_price))
      errors.minimum_price = "Minimum price must be a number.";

    if (!maximum_price) errors.maximum_price = "Maximum price is required.";
    else if (isNaN(maximum_price))
      errors.maximum_price = "Maximum price must be a number.";
    else if (parseFloat(maximum_price) < parseFloat(minimum_price)) {
      errors.maximum_price = "Max price should be >= Min price.";
    }

    if (!categories) errors.categories = "At least one category is required.";
    if (!vendors) errors.vendors = "At least one vendor is required.";
    if (!item_description.trim())
      errors.item_description = "Item description is required.";

    return errors;
  };

  // On submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://rfpdemo.velsof.com/api/createrfp",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("RFP created successfully!");
        setFormData({
          item_name: "",
          rfp_no: "",
          quantity: "",
          last_date: "",
          minimum_price: "",
          maximum_price: "",
          categories: "",
          vendors: "",
          item_description: "",
        });
        console.log("Response Data ", response.data);
        navigate("/rfp");
      } catch (error) {
        alert(
          "Add RFP failed. " + (error?.response?.data?.message || error.message)
        );
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="account-pages my-5 pt-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-8">
            <div className="card overflow-hidden">
              <div className="bg-soft-primary">
                <div className="row">
                  <div className="col-12">
                    <div className="text-primary p-4">
                      <h3 className="text-primary">Add New RFP</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      {/* Item Name */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Item Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="item_name"
                            value={formData.item_name}
                            onChange={handleInputChange}
                            placeholder="Enter item name"
                          />
                          {errors.item_name && (
                            <div className="text-danger">
                              {errors.item_name}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RFP No */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>RFP No*</label>
                          <input
                            type="text"
                            className="form-control"
                            name="rfp_no"
                            value={formData.rfp_no}
                            onChange={handleInputChange}
                            placeholder="Enter RFP no"
                          />
                          {errors.rfp_no && (
                            <div className="text-danger">{errors.rfp_no}</div>
                          )}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Quantity*</label>
                          <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            placeholder="Enter Quantity"
                          />
                          {errors.quantity && (
                            <div className="text-danger">{errors.quantity}</div>
                          )}
                        </div>
                      </div>

                      {/* Last Date */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Last Date*</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            name="last_date"
                            value={formData.last_date}
                            onChange={handleInputChange}
                          />
                          {errors.last_date && (
                            <div className="text-danger">
                              {errors.last_date}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Min Price */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Minimum Price*</label>
                          <input
                            type="number"
                            className="form-control"
                            name="minimum_price"
                            value={formData.minimum_price}
                            onChange={handleInputChange}
                            placeholder="Enter Min Price"
                          />
                          {errors.minimum_price && (
                            <div className="text-danger">
                              {errors.minimum_price}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Max Price */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Maximum Price*</label>
                          <input
                            type="number"
                            className="form-control"
                            name="maximum_price"
                            value={formData.maximum_price}
                            onChange={handleInputChange}
                            placeholder="Enter Max Price"
                          />
                          {errors.maximum_price && (
                            <div className="text-danger">
                              {errors.maximum_price}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Category*</label>
                          <select
                            className="form-control"
                            multiple
                            name="categories"
                            value={
                              formData.categories
                                ? formData.categories.split(",")
                                : []
                            }
                            onChange={handleSelectChange}
                          >
                            {allCategory.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          {errors.categories && (
                            <div className="text-danger">
                              {errors.categories}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Vendors */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Vendors*</label>
                          <select
                            className="form-control"
                            multiple
                            name="vendors"
                            value={
                              formData.vendors
                                ? formData.vendors.split(",")
                                : []
                            }
                            onChange={handleSelectChange}
                          >
                            {filteredVendors.map((vendor) => (
                              <option
                                key={vendor.user_id}
                                value={vendor.user_id}
                              >
                                {vendor.name}
                              </option>
                            ))}
                          </select>

                          {errors.vendors && (
                            <div className="text-danger">{errors.vendors}</div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Description*</label>
                          <textarea
                            className="form-control"
                            name="item_description"
                            value={formData.item_description}
                            onChange={handleInputChange}
                          ></textarea>
                          {errors.item_description && (
                            <div className="text-danger">
                              {errors.item_description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">
                      Submit RFP
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRFP;
