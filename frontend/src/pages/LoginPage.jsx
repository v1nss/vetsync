import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <section className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-white sm:p-8 rounded-2xl sm:shadow-lg w-full max-w-md">
                <img src="/vetsync-logo-wname.png" alt="VetSync Logo" className="h-12 mx-auto my-8" />
                <h2 className="text-2xl font-semibold text-center">Welcome Back!</h2>
                <p className="text-center text-gray-600 mb-6">Sync up with the best vets near you.</p>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-2 relative">
                        <label className="block text-sm text-gray-700 mb-2" htmlFor="password">Password</label>
                        <div className="flex items-center w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full outline-none text-sm"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <input type="checkbox" id="remember" className="mr-2" />
                            <label htmlFor="remember" className="text-sm text-gray-700">Remember Me</label>
                        </div>
                        <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] transition">
                        Login
                    </button>
                    <div className="flex items-center my-4">
                        <hr className="flex-1 border-t border-gray-300" />
                        <span className="mx-2 text-gray-500">or</span>
                        <hr className="flex-1 border-t border-gray-300" />
                    </div>
                    <div className="flex justify-center gap-4">
                        <button className="flex items-center justify-center border border-gray-300 rounded-full p-4 hover:bg-gray-100 transition">
                            <FcGoogle className="h-5 w-5" />
                        </button>
                        <button className="flex items-center justify-center border border-gray-300 rounded-full p-4 hover:bg-gray-100 transition">
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