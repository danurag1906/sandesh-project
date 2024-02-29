import React, { useEffect, useState } from "react";
import EachBill from "./EachBill";
import { useNavigate } from "react-router-dom";

export default function AllBills() {
  const [allBills, setAllBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    billno: "",
    companyname: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBills = allBills.filter((bill) =>
    bill.companyname.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    fetchAllBills();
  };

  const fetchAllBills = async () => {
    try {
      const res = await fetch("/api/getAllBills");
      const resData = await res.json();
      const reversedBills = resData.data.reverse();
      // console.log(resData.data);
      setAllBills(reversedBills);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllBills();
  }, []);

  const handleBillDelete = async (billId) => {
    fetchAllBills();
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="flex mx-auto mt-8">
      {/* Search Input */}
      <div className="m-5 fixed">
        <label
          htmlFor="search"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Search by Company Name:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-md"
          placeholder="Search Company "
        />
      </div>
      <div className=" fixed w-1/3 mt-24 ml-2 ">
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
        <button
          onClick={handleSignOut}
          className="bg-green-600 p-3 m-3 ml-10 rounded-md font-bold"
        >
          Sign out
        </button>
      </div>

      <div className="md:w-2/3  absolute right-0 ">
        <div>
          {filteredBills.length > 0 &&
            filteredBills.map((bill) => (
              <EachBill key={bill.id} bill={bill} onDelete={handleBillDelete} />
            ))}
        </div>
      </div>
    </div>
  );
}
