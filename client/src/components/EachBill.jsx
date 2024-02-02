import React from 'react';
import { Link } from 'react-router-dom';

const EachBill = ({ bill,onDelete }) => {
  const { billno, companyname, amount,_id } = bill;


  const handleDelete=async(billId)=>{
    const res=await fetch(`/api/deleteBill/${billId}`,{
        method:'DELETE'
    })

    const resData=await res.json()
    console.log(resData.message);

    onDelete(billId)

  }

  return (
    <div className='flex m-5 p-5 bg-slate-200 rounded-md shadow-md'>
      <div>
        <h3 className='text-xl font-bold mb-2'>Bill No: {billno}</h3>
        <p className='text-gray-700 mb-2'>Company Name: {companyname}</p>
        <p className='text-gray-700'>Amount: Rs.{amount}</p>
        <div className='my-5' >
        <Link to={`/updateBill/${_id}`} className='bg-green-500 text-white px-4 py-2 rounded-md mr-2'>
            Update
          </Link>
        <button onClick={()=>handleDelete(bill._id)}  className='bg-red-500 text-white px-4 py-2 rounded-md'>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default EachBill;
