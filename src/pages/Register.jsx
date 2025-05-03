import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate(); //  Moved here

  // State to handle form inputs
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    revenue: "",
    no_of_employees: 0,
    gst_no: "",
    pancard_no: "",
    mobile: "",
    category: "",
  });

  // State to handle form errors
  const [errors, setErrors] = useState({});
  const [allCategory, setAllCategory] = useState([]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Select Category
  const handleSelectChange = (e) => {
    const { name, selectedOptions } = e.target;

    const selectedValues = Array.from(selectedOptions)
      .map((option) => Number(option.value)) // Convert to numbers
      .join(","); // Store as a comma-separated string of numbers

    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedValues,
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.firstname) newErrors.firstname = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/[A-Za-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      newErrors.password = "Password must contain both letters and numbers";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.revenue) {
      newErrors.revenue = "Revenue is required";
    } else {
      const revenueArray = formData.revenue.split(",");
      if (
        revenueArray.length !== 3 ||
        !revenueArray.every((r) => /^\d+$/.test(r))
      ) {
        newErrors.revenue =
          "Revenue must contain exactly three comma-separated numeric values";
      }
    }

    if (!formData.no_of_employees && formData.no_of_employees !== 0) {
      newErrors.no_of_employees = "Number of employees is required";
    } else if (!Number.isInteger(Number(formData.no_of_employees))) {
      newErrors.no_of_employees = "Number of employees must be an integer";
    }

    if (!formData.category || formData.category.length === 0) {
      newErrors.category = "At least one category must be selected";
    }

    // --------------------- More Category validation API ---------------------
    // if (!formData.category || formData.category.trim() === "") {
    //   newErrors.category = "At least one category must be selected";
    // } else {
    //   const categoryArray = formData.category.split(',');
    //   if (!categoryArray.every(id => /^\d+$/.test(id))) {
    //     newErrors.category = "Category must contain only valid numeric IDs";
    //   }
    // }

    if (!formData.pancard_no)
      newErrors.pancard_no = "PAN card number is required";
    if (!formData.gst_no) newErrors.gst_no = "GST number is required";
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    return newErrors;
  };

  // Fetch API to get data
  useEffect(() => {
    axios.get("https://rfpdemo.velsof.com/api/categories").then(({ data }) => {
      const categoryData = Object.values(data.categories);
      setAllCategory(
        categoryData.filter((categoryData) => categoryData.status == "Active")
      );
      // setAllCategory(categoryData)
    });
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      try {
        // Sending response to api
        const response = await axios.post(
          "https://rfpdemo.velsof.com/api/registervendor",
          formData
        );

        const { token, user } = response.data;

        if (token) {
          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        alert("Registered successfully!");

        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
          revenue: "",
          no_of_employees: "",
          gst_no: "",
          pancard_no: "",
          mobile: "",
          category: [],
        });

        console.log(response.data);

        // Redirect to home page
        navigate("/");
      } catch (error) {
        console.log("Error", error);
        alert(
          "Registration failed. " +
            (error?.response?.data?.message || error.message)
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
                      <h5 className="text-primary">Welcome to RFP System!</h5>
                      <p>Register as Vendor</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="firstname">First Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            placeholder="Enter firstname"
                          />
                          {errors.firstname && (
                            <div className="text-danger">
                              {errors.firstname}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="lastname">Last Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            placeholder="Enter lastname"
                          />
                          {errors.lastname && (
                            <div className="text-danger">{errors.lastname}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="email">Email*</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter Email"
                          />
                          {errors.email && (
                            <div className="text-danger">{errors.email}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="password">Password*</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter Password"
                          />
                          {errors.password && (
                            <div className="text-danger">{errors.password}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="confirmPassword">
                            Confirm Password*
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm Password"
                          />
                          {errors.confirmPassword && (
                            <div className="text-danger">
                              {errors.confirmPassword}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="revenue">
                            Revenue (Last 3 Years in Lacks)*
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="revenue"
                            name="revenue"
                            value={formData.revenue}
                            onChange={handleInputChange}
                            placeholder="Enter Revenue"
                          />
                          {errors.revenue && (
                            <div className="text-danger">{errors.revenue}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="no_of_employees">
                            No of Employees*
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="no_of_employees"
                            name="no_of_employees"
                            value={formData.no_of_employees}
                            onChange={handleInputChange}
                            placeholder="Enter No of Employees"
                          />
                          {errors.no_of_employees && (
                            <div className="text-danger">
                              {errors.no_of_employees}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="gst_no">GST No*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="gst_no"
                            name="gst_no"
                            value={formData.gst_no}
                            onChange={handleInputChange}
                            placeholder="Enter GST No"
                          />
                          {errors.gst_no && (
                            <div className="text-danger">{errors.gst_no}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="pancard_no">PAN No*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="pancard_no"
                            name="pancard_no"
                            value={formData.pancard_no}
                            onChange={handleInputChange}
                            placeholder="Enter PAN No"
                          />
                          {errors.pancard_no && (
                            <div className="text-danger">
                              {errors.pancard_no}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="mobile">Phone No*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            placeholder="Enter Phone No"
                          />
                          {errors.mobile && (
                            <div className="text-danger">{errors.mobile}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <label htmlFor="category">category*</label>
                          {/* <select
                            className="form-control"
                            multiple
                            id="category"
                            name="category"
                            value={
                              formData.category
                                ? formData.category.split(",")
                                : []
                            }
                            onChange={handleSelectChange}
                          >
                            {allCategory.map((categoryData) => (
                              <option
                                key={categoryData.id}
                                value={categoryData.id}
                              >
                                {categoryData.name}
                              </option>
                            ))}
                          </select> */}

                          <select
                            className="form-control"
                            multiple
                            id="category"
                            name="category"
                            value={
                              formData.category
                                ? formData.category.split(",").map(Number) // Convert string to array of numbers
                                : []
                            }
                            onChange={handleSelectChange}
                          >
                            {allCategory.map((categoryData) => (
                              <option
                                key={categoryData.id}
                                value={categoryData.id}
                              >
                                {categoryData.name}
                              </option>
                            ))}
                          </select>

                          {errors.category && (
                            <div className="text-danger">{errors.category}</div>
                          )}
                        </div>
                      </div>

                      <div className="p-2 mt-3">
                        <button
                          className="btn btn-primary btn-block waves-effect waves-light"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="mt-5 text-center">
              <p>
                &copy; Copyright <i className="mdi mdi-heart text-danger"></i>{" "}
                RFP System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
