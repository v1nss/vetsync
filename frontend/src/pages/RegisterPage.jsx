import { Link } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function RegisterPage() {
  const [userType, setUserType] = useState("pet_owner");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [user, setUser] = useState({
    full_name: "",
    email: "",
    user_type:"",
    // phoneNumber: "",
    password: "",
  });

  const handleRoleChange = (role) => {
    setUserType(role);
    setUser(prev => ({ ...prev, user_type: role })); 
    chooseRole(role);
  };

  const chooseRole = (role) => {
    if (role === "pet_owner") {
      console.log("Pet Owner selected");
    } else if (role === "clinic_admin") {
      console.log("Clinic Admin selected");
    }
  };

  const handleOnChange = (e) => {
  const { name, value } = e.target;
  setUser((prev) => ({ ...prev, [name]: value }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const res = await axios.post(`${BACKEND_URL}/users/register`, {
      full_name: user.full_name,
      email: user.email,
      user_type: userType,
      password: user.password,
    //   address: user.address,         // optional
    //   clinic_name: user.clinic_name, // optional
    });

      if (res.status === 200) {
        console.log("✅ Registered:", res.data);
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

    return (
        <section className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-white sm:p-8 rounded-2xl sm:shadow-lg w-full max-w-md">
                <img src="/vetsync-logo-wname.png" alt="VetSync Logo" className="h-12 mx-auto my-8" />
                <h2 className="text-2xl font-semibold text-center">Create Your Account</h2>
                <p className="text-center text-gray-600 mb-6">Join VetSync and connect with top vets near you.</p>
                <form
                    onSubmit={handleSubmit}
                    method="POST"
                >
                    {/* Choose Role: Pet Owner or Clinic Admin */}
                    <label className="block text-sm text-gray-700 mb-2">I am a:</label>
                    <div className="flex justify-center mb-6 space-x-4">
                        <button
                            type="button"
                            onClick={() => handleRoleChange("pet_owner")}
                            className={`flex-1 px-4 py-3 rounded-2xl transition
                            ${userType === "pet_owner" ? "bg-primary text-white" : "bg-white border border-gray-300 text-black hover:bg-gray-300"}
                            `}
                        >
                            Pet Owner
                        </button>

                        <button
                            type="button"
                            onClick={() => handleRoleChange("clinic_admin")}
                            className={`flex-1 px-4 py-3 rounded-2xl transition
                            ${userType === "clinic_admin" ? "bg-primary text-white" : "bg-white border border-gray-300 text-black hover:bg-gray-300"}
                            `}
                        >
                            Clinic Admin
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="name">Full Name</label>
                        <input
                            required
                            type="text"
                            id="name"
                            className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                            placeholder="Enter your full name"
                            onChange={handleOnChange}
                            name="full_name"
                            value={user.full_name}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            required
                            type="email"
                            id="email"
                            className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                            placeholder="Enter your email"
                            onChange={handleOnChange}
                            name="email"
                            value={user.email}
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="password">Create Password</label>
                        <div className="flex items-center w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="focus:outline-none w-full outline-none text-sm"
                                placeholder="Enter your password"
                                onChange={handleOnChange}
                                name="password"
                                value={user.password}
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
                    <div className="mb-8">
                        <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="password">Confirm Password</label>
                        <div className="flex items-center w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl">
                            <input
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                className="focus:outline-none w-full outline-none text-sm"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] transition">
                        Register
                    </button>
                    <div className="text-center mt-4">
                        <p className="text-gray-600">Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link></p>
                    </div>
                </form>
            </div>
        </section>
    );
}