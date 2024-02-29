// FormComponent.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BillForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    billno: "",
    companyname: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle form submission logic here
    setLoading(true);
    // setError(false)

    try {
      const res = await fetch("/api/createBill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log(data);
      if (data.success == false) {
        setError(data.message);
        setLoading(false);
      }
      setError(null);
      setLoading(false);
      // console.log('Form submitted:', formData);
    } catch (error) {
      setLoading(false);
      setError(error);
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

        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {error && <p className="bg-red-700 mt-5">{error}</p>}
    </div>
  );
};

export default BillForm;
