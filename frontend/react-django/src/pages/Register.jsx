import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function Register() {
  const baseURL = "http://127.0.0.1:8000"
  const [formData, setFormData] = useState({
    username: "",  // Added username here
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    cpassword: "",
    is_manager: false,
  })

  const [errors, setErrors] = useState([])
  const navigate = useNavigate()

  const { username, email, first_name, last_name, password, cpassword, is_manager } = formData

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Check if passwords match
    if (password !== cpassword) {
      setErrors([{ detail: "Passwords do not match" }])
      return
    }

    try {
      const response = await axios.post(baseURL + "/api/accounts/register/", formData)

      console.log(response.data)

      // Show success toast message
      toast.success("Registration successful! Redirecting to login...")

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setErrors(err.response?.data || [])
      toast.error("Registration failed!")
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Sign Up
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleChange}
              autoComplete="username"
              required
              className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={first_name}
              onChange={handleChange}
              autoComplete="given-name"
              required
              className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={last_name}
              onChange={handleChange}
              autoComplete="family-name"
              required
              className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="cpassword" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password
            </label>
            <input
              id="cpassword"
              name="cpassword"
              type="password"
              value={cpassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors.cpassword && <p className="text-red-500 text-sm">{errors.cpassword}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-teal-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
            >
              Create account
            </button>
          </div>

          {errors.detail && <p className="text-red-500 text-sm">{errors.detail}</p>}

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
