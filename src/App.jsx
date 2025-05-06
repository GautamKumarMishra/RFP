import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
// import RFP from "./pages/RFP";
import Users from "./pages/Users";
import Register from "./pages/Register";
import Login from "./pages/Login";
// import CreateRFPForm from "./pages/RFP";
// import ListRfp from "./pages/RFP";
import ListRfp from "./pages/RFP/ListRFP";
import EditVendorForm from "./pages/editVendor";
import AddRFP from "./pages/RFP/AddRFP";
import Categories from "./pages/Categories";
// import CreateRfp from "./pages/AddRFP";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendors" element={<Vendors />} />
          {/* <Route path="rfp" element={<CreateRFPForm />} /> */}
          {/* <Route path="rfp" element={<AddRFP />} /> */}
          {/* <Route path="/create" element={<ListRfp />} />  */}
          <Route path="/rfp" element={<ListRfp />} />
          <Route path="/editvendor" element={<EditVendorForm />} /> 
          <Route path="/categories" element={<Categories />} /> 
          <Route path="/createRFP" element={<AddRFP />} /> 
          
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
