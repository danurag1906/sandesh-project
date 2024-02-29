// UpdateBill.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import e from "express";

const UpdateBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    billno: "",
    companyname: "",
    amount: "",
  });

  useEffect(() => {
    // Fetch the existing bill data and populate the form
    const fetchBillData = async () => {
      try {
        const res = await fetch(`/api/getBillById/${id}`);
        const resData = await res.json();
        setFormData(resData.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBillData();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log(token);

    if (token == null) {
      // console.log('use effect');
      navigate("/signin");
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken);
        // You can access user information from decodedToken here
        const { email } = decodedToken;
        // console.log(userId);
        // Example: check if the user has the 'admin' role
        if (email !== import.meta.env.VITE_USER_EMAIL) {
          navigate("/signin");
        }
      } catch (error) {
        // Handle decoding error
        // console.error('Error decoding token:', error);
        navigate("/signin");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/updateBill/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      // Redirect to the home page after updating
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-slate-200 p-8 shadow-md rounded-md"
      >
        <div className="mb-4">
          <label
            htmlFor="billno"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Bill No:
          </label>
          <input
            type="text"
            id="billno"
            name="billno"
            value={formData.billno}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter Bill No"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="companyname"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Company Name:
          </label>
          <input
            type="text"
            id="companyname"
            name="companyname"
            value={formData.companyname}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter Company Name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter Amount"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateBill;
