// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Logout = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/user/logout', {
//         method: 'POST',
//         credentials: 'include', // if using cookies for auth
//       });

//       if (response.ok) {
//         localStorage.removeItem('user'); // Optional: clear user data
//         navigate('/login'); // redirect after logout
//       } else {
//         console.error('Logout failed');
//       }
//     } catch (error) {
//       console.error('An error occurred during logout:', error);
//     }
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       className="text-[#42bfdd] hover:text-[#084b83] px-3 py-2 rounded-md text-sm font-medium transition-colors"
//     >
//       Logout
//     </button>
//   );
// };

// export default Logout;

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx'; // adjust path as needed

const Logout = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useContext(AuthContext); // Destructure from context

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/user/logout', {
        method: 'POST',
        credentials: 'include', // if using cookies for auth
      });

      if (response.ok) {
        localStorage.removeItem('user'); // Optional
        // setUser(null);                   // Clear user context
        // setAuthState(false);      // Set auth status to false
        navigate('/login');             // Redirect
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-[#42bfdd] hover:text-[#084b83] px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Logout
    </button>
  );
};

export default Logout;
