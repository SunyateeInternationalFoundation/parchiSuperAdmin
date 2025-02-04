import React, { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useDispatch } from "react-redux";
import { setAuthState } from "../../store/adminSlice";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    emailOrPhone: "",
    password: "",
  });
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const emailOrPhoneRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { emailOrPhone, password } = formData;

    if (!emailOrPhone) {
      newErrors.emailOrPhone = "Email or phone is required.";
    } else if (
      !/\S+@\S+\.\S+/.test(emailOrPhone) &&
      !/^\d+$/.test(emailOrPhone)
    ) {
      newErrors.emailOrPhone = "Please enter a valid email or phone.";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const res = await signInWithEmailAndPassword(
          auth,
          formData.emailOrPhone,
          formData.password
        );
        const user = res.user;
        // store in user collection 
        
        // Store user data in Redux
        dispatch(setAuthState({
            token: user.accessToken,
            loggedIn: true,
          }));
          navigate('/dashboard')
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          password: "Invalid email or password.", 
        }));
        passwordRef.current.focus();
      }
    } else {
      if (errors.emailOrPhone) {
        emailOrPhoneRef.current.focus();
      } else if (errors.password) {
        passwordRef.current.focus();
      } else {
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="https://st2.depositphotos.com/4035913/6124/i/450/depositphotos_61243833-stock-photo-letter-v-logo.jpg"
            alt="Stockifly"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please login to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="emailOrPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Email or Phone
              </label>
              <div className="mt-1">
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="text"
                  required
                  ref={emailOrPhoneRef}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.emailOrPhone ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Please Enter Email or Phone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                />
                {errors.emailOrPhone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.emailOrPhone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  ref={passwordRef}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Please Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>

          <div className="flex flex-col items-center space-y-2 text-sm">
            <a
              href="#reset-password"
              className="font-medium text-blue-500 hover:text-blue-600"
            >
              Reset Password
            </a>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
