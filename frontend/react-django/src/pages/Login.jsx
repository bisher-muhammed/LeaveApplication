import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setUserAuthentication } from '../Redux/authenticationSlice';

function Login() {
  const baseURL = import.meta.env.VITE_REACT_APP_API_URL || "http://127.0.0.1:8000";
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setErrors] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, password } = formData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(baseURL + '/api/accounts/login/', formData);
      const { access, refresh, user_id, email, username, first_name, last_name, is_manager } = response.data;

      localStorage.setItem('token', JSON.stringify(response.data));  // Stores the full response data
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);  // Corrected this line

      const userDetails = {
        user_id,
        email,
        username,
        first_name,
        last_name,
        isAuthenticated: true,
        is_manager,
      };

      dispatch(setUserAuthentication(userDetails));
      toast.success('Login successful');
      console.log(is_manager); 

      if (is_manager) {
        navigate('/manager/home');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrors('Invalid email or password');
      toast.error('Invalid login credentials');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-4 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> */}
            <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Sign in   </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                    <div className="mt-2">
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={email}
                            onChange={handleChange}
                            autoComplete="email" 
                            required 
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    </div>
                    <div className="mt-2">
                        <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            value={password}
                            onChange={handleChange}
                            autoComplete="current-password" 
                            required 
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <button type="submit" className="flex w-full justify-center rounded-md bg-teal-400 text-black hover:bg-slate-300 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Sign in
                    </button>
                </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Sign up
                </Link>
            </p>
        </div>
    </div>
);
};

export default Login;