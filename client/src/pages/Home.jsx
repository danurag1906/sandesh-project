// import React, { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// // import jwtDecode from 'jwt-decode';
// // import BillForm from '../components/BillForm'
// import AllBills from '../components/AllBills'

// export default function Home() {

//   const navigate=useNavigate()

//   useEffect(()=>{
//     const token=localStorage.getItem('token')
//     // console.log(token);
//     if(token==null){
//       console.log('use effect');
//       navigate('/signin')
//     }
//     // if(token){
//     //   const user=jwtDecode(token)
//     //   if(user!=='admin'){
//     //     navigate('/signin')
//     //   }
//     // }
//   },[])

//   return (
//     <div className='' >
//         {/* <div className=' w-1/3 p-5' >
//             <BillForm/>
//         </div> */}
//          <div className='' >
//             <AllBills/>
//         </div>
//     </div>
    
//   )
// }


import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
// import BillForm from '../components/BillForm'
import AllBills from '../components/AllBills';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log(token);

    if (token == null) {
      // console.log('use effect');
      navigate('/signin');
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken);
        // You can access user information from decodedToken here
        const { userId} = decodedToken;
        // console.log(userId);
        // Example: check if the user has the 'admin' role
        if (userId !== import.meta.env.VITE_USER_ID) {
          navigate('/signin');
        }
      } catch (error) {
        // Handle decoding error
        // console.error('Error decoding token:', error);
        navigate('/signin');
      }
    }
  }, []);

  return (
    <div className=''>
      {/* <div className=' w-1/3 p-5' >
          <BillForm/>
      </div> */}
      <div className=''>
        <AllBills />
      </div>
    </div>
  );
}
