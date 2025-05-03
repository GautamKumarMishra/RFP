import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      // Sample data
      const data = [
        { id: 1, firstName: 'Aman', lastName: 'Sharma', email: 'aman@gmail.com', status: 'Active' },
        { id: 2, firstName: 'Gagan', lastName: 'Kumar', email: 'gagan456@gmail.com', status: 'Active' },
        { id: 3, firstName: 'Vinay', lastName: 'Singh', email: 'vinay009@gmail.com', status: 'Active' },
        { id: 4, firstName: 'Ravi', lastName: 'Raj', email: 'ravi@gmail.com', status: 'Inactive' },
      ];
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? user.status === (statusFilter === '1' ? 'Active' : 'Inactive') : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-content my-0 py-0">
      <div className="container-fluid">
        {/* Title & Breadcrumb */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between mt-0 pt-0">
              <h4 className="mb-0 font-size-18">User List</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Users</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Filter</h5>
                <form onSubmit={e => e.preventDefault()}>
                  <div className="row">
                    <div className="col-lg-4 col-md-4">
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text"><i className="mdi mdi-magnify"></i></div>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          value={search}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <select
                        className="form-control"
                        value={statusFilter}
                        onChange={handleStatusChange}
                      >
                        <option value="">Select Status</option>
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-4 text-right">
                      <button type="submit" className="btn btn-primary mb-2">Submit</button>
                      <button type="button" className="btn btn-secondary ml-2 mb-2" onClick={handleReset}>Reset</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Users</h4>
                <div className="table-responsive">
                  <table className="table mb-0 listingData dt-responsive">
                    <thead>
                      <tr>
                        <th>S. No.</th>
                        <th>First name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr key={user.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge badge-pill ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{user.status}</span>
                          </td>
                          <td>
                            <button
                              className="text-primary mr-2 border-0 bg-transparent"
                              onClick={() => navigate('/editvendor', { state: { user, from: 'userList' } })}
                            >
                              Edit
                            </button>
                            <button
                              className="text-danger border-0 bg-transparent"
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Users;