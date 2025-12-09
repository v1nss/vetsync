import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth()
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
            // Attempt login
            const user = await login(email, password);
            
            // Navigate based on user type
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
                
                if (status === 400 || status === 401) {
                    errorMessage = data?.error || data?.message || "Invalid email or password.";
                } else if (status === 404) {
                    errorMessage = data?.error || data?.message || "Account not found.";
                } else if (status === 500) {
                    errorMessage = "Server error. Please try again later.";
                } else {
                    errorMessage = data?.error || data?.message || "Login failed. Please try again.";
                }
            } else if (err.request) {
                // Request made but no response
                errorMessage = "Network error. Please check your connection.";
            } else {
                // Something else happened
                errorMessage = err.message || "An unexpected error occurred.";
            }
            
            setLoginError(errorMessage);
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
                    
                    <div className="text-center mt-4">
                        <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </section>
    );
}