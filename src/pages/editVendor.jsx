import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const EditVendorForm = ({ initialData, onSubmit, onCancel }) => {
  const navigate = useNavigate(); //  Moved here
  const location = useLocation();

  const [vendorData, setVendorData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    revenue: '',
    employees: '',
    gstNo: '',
    panNo: '',
    phoneNo: '',
    categories: []
  });

  useEffect(() => {
    if (initialData) {
      setVendorData(initialData);
    } else if (location.state?.user) {
      setVendorData(location.state.user);
    }
  }, [initialData, location.state]);

  const categoriesList = [
    { value: '1', label: 'Software' },
    { value: '2', label: 'Hardware' },
    { value: '3', label: 'Office Furniture' },
    { value: '4', label: 'Stationery' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setVendorData({ ...vendorData, categories: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(vendorData);
  };

  const handleCancel = () => {
    if (location.state?.from === 'userList') {
      navigate(-1);
    } else {
      navigate('/users');
    }
  };

  const handleUpdate = () => {
      navigate('/users');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Vendor</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="firstName" placeholder="First Name" className="form-input h-8 text-base border-2" value={vendorData.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" className="form-input h-8 text-base border-2" value={vendorData.lastName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="form-input h-8 text-base border-2" value={vendorData.email} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="revenue" placeholder="Revenue (Last 3 Years in Lacs)" className="form-input h-8 text-base border-2" value={vendorData.revenue} onChange={handleChange} required />
          <input type="text" name="employees" placeholder="No of Employees" className="form-input h-8 text-base border-2" value={vendorData.employees} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="gstNo" placeholder="GST No" className="form-input h-8 text-base border-2" value={vendorData.gstNo} onChange={handleChange} required />
          <input type="text" name="panNo" placeholder="PAN No" className="form-input h-8 text-base border-2" value={vendorData.panNo} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="phoneNo" placeholder="Phone No" className="form-input h-8 text-base border-2" value={vendorData.phoneNo} onChange={handleChange} required />
          <select name="categories" multiple className="form-input h-32" value={vendorData.categories} onChange={handleMultiSelect} required>
            {categoriesList.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button type="submit" className="btn btn-primary" onClick={handleUpdate}>Update</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditVendorForm;