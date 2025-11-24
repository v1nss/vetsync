import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";

import {AuthContext} from "../context/AuthContext.jsx"
import { loginUser } from "../global/api/auth.jsx";
import { checkEmailExists } from "../global/api/user.jsx";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Check if email exists first
            const emailExists = await checkEmailExists(email);
            if (!emailExists) {
                setErrors({ email: "Email not registered. Please sign up first." });
                setIsLoading(false);
                return;
            }

            const { user, token } = await loginUser(email, password);
            login(user, token);
            console.log("Logged in user:", user);
            
            switch (user.user_type) {
                case "clinic_admin":
                    navigate("/admin/clinic", { replace: true });
                    break;
                case "system_admin":
                    navigate("/admin/system/clinics", { replace: true });
                    break;
                case "vet_professional":
                    navigate("/vet-appointments", { replace: true });
                    break;
                default:
                    navigate("/", { replace: true });
            }
        } catch (err) {
            console.error("Login error:", err);
            
            // Handle different error types
            let errorMessage = "Invalid email or password. Please try again.";
            
            if (err.response) {
                // Server responded with error
                const status = err.response.status;
                const data = err.response.data;
                
                if (status === 400) {
                    errorMessage = data?.message || data?.error || "Invalid credentials. Please check your email and password.";
                } else if (status === 401) {
                    errorMessage = "Invalid email or password.";
                } else if (status === 404) {
                    errorMessage = "Account not found. Please check your email.";
                } else if (status === 500) {
                    errorMessage = "Server error. Please try again later.";
                } else {
                    errorMessage = data?.message || data?.error || "Login failed. Please try again.";
                }
            } else if (err.request) {
                // Request made but no response
                errorMessage = "Network error. Please check your connection.";
            } else {
                // Something else happened
                errorMessage = err.message || "An unexpected error occurred.";
            }
            
            setLoginError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: "" }));
        }
        if (loginError) {
            setLoginError("");
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: "" }));
        }
        if (loginError) {
            setLoginError("");
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-white sm:p-8 rounded-2xl sm:shadow-lg w-full max-w-lg">
                <img src="/vetsync-logo-wname.png" alt="VetSync Logo" className="h-12 mx-auto my-8" />
                <h2 className="text-2xl font-semibold text-center">Welcome Back!</h2>
                <p className="text-center text-gray-600 mb-6">Sync up with the best vets near you.</p>
                
                {loginError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {loginError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={`w-full text-sm px-4 py-3 border rounded-2xl focus:outline-none ${
                                errors.email ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-primary"
                            }`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>
                    
                    <div className="mb-2 relative">
                        <label className="block text-sm text-gray-700 mb-2" htmlFor="password">Password</label>
                        <div className={`flex items-center w-full text-sm px-4 py-3 border rounded-2xl ${
                            errors.password ? "border-red-500 focus-within:ring-2 focus-within:ring-red-200" : "border-gray-300 focus-within:ring-2 focus-within:ring-primary"
                        }`}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full outline-none text-sm"
                                placeholder="Enter your password"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                disabled={isLoading}
                            >
                                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <input type="checkbox" id="remember" className="mr-2" />
                            <label htmlFor="remember" className="text-sm text-gray-700">Remember Me</label>
                        </div>
                        <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                    
                    <div className="flex items-center my-4">
                        <hr className="flex-1 border-t border-gray-300" />
                        <span className="mx-2 text-gray-500">or</span>
                        <hr className="flex-1 border-t border-gray-300" />
                    </div>
                    
                    <div className="flex justify-center gap-4">
                        <button 
                            type="button"
                            className="flex items-center justify-center border border-gray-300 rounded-full p-4 hover:bg-gray-100 transition disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <FcGoogle className="h-5 w-5" />
                        </button>
                        <button 
                            type="button"
                            className="flex items-center justify-center border border-gray-300 rounded-full p-4 hover:bg-gray-100 transition disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <FaFacebook className="text-blue-600 h-5 w-5" />
                        </button>
                    </div>
                    
                    <div className="text-center mt-4">
                        <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </section>
    );
}