import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterUser() {
  // const [formData, setFormData] = React.useState({
  //   name: '',
  //   email: '',
  //   password: '',
  //   phoneNumber: ''
  // });

  // const navigate = useNavigate();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Submitting form data:", formData);
  //   axios.post('https://deploy-mood-tracker.onrender.com/user/register', formData)
  //     .then(result => {
  //       alert("Registratin successful!🥳 please login to continue!");
  //       // console.log("Registration successful:", result.data);
  //       navigate('/login')
  //        // redirect after successful registration
  //     })
  //     .catch(err => {
  //       console.error("Registration failed:", err.response?.data || err.message);
  //       alert(err.response?.data?.message || "Registration failed");

  //       //bug: if user already exists, redirect to login page
  //       // if(response.error.message==='User already exists. Please login to continue!')navigate('/login');
  //     });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: ''
  });

  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate email in real-time
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : 'Please enter a valid email address'
      }));
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Prepare data: ensure email and phoneNumber are empty strings if missing
  const dataToSend = {
    name: formData.name.trim(),
    email: formData.email ? formData.email.trim() : "",
    password: formData.password,
    phoneNumber: formData.phoneNumber ? formData.phoneNumber.trim() : ""
  };

  // Require at least one of email or phoneNumber
  if (dataToSend.email === "" && dataToSend.phoneNumber === "") {
    alert("Please enter either an email or a phone number.");
    return;
  }

  // Validate email format if provided
  if (dataToSend.email !== "" && !validateEmail(dataToSend.email)) {
    setErrors(prev => ({
      ...prev,
      email: 'Please enter a valid email address'
    }));
    return;
  }

  axios.post('https://deploy-mood-tracker.onrender.com/user/register', dataToSend)
    .then(result => {
      alert("Registration successful! 🥳 Please login to continue!");
      navigate('/login');
    })
    .catch(err => {
      console.error("Registration failed:", err.response?.data || err.message);
      if (err.response?.data?.message === 'User already exists. Please login to continue!') {
        alert('User already exists. Please login to continue!');
        navigate('/login');
      } else {
        alert(err.response?.data?.message || "Registration failed");
      }
    });
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
        <input
          type="text"
          placeholder="Enter name"
          name="name"
          id="name"
          autoComplete='off'
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />

        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          name="email"
          id="email"
          autoComplete='off'
          onChange={(e)=>setFormData({...formData,email:e.target.value})}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />

        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          id="password"
          autoComplete='off'
          onChange={(e)=>setFormData({...formData,password:e.target.value})}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />

        <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
        <input
          type="text"
          placeholder="Enter phone number"
          name="phoneNumber"
          id="phoneNumber"
          autoComplete='off'
          onChange={(e)=>setFormData({...formData,phoneNumber:e.target.value})}
          pattern="\d{10}"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />

        <button 
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        onClick={handleSubmit}
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to='/login' className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterUser;
