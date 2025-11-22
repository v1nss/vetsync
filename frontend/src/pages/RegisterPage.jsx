import { Link } from "react-router-dom";
import { useState } from "react";
import { FaChevronLeft, FaEye, FaEyeSlash, FaCamera, FaUser } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { registerUser, checkEmailExists } from "../global/api/user";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [user, setUser] = useState({
    full_name: "",
    email: "",
    user_type: "",
    clinic_name: "",
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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]

    if (!file) {
      // setErrorMessage
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      // setErrorMessage("Invalid file type. Only PNG, JPG, and JPEG are allowed.");
      e.target.value = ""; // Reset the input field
      return;
    }

    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailExists = await checkEmailExists(user.email);
    if (emailExists) {
      alert("Email is already registered. Please use a different email.");
      return;
    }
    if (user.user_type === "clinic_admin") {
      // Additional validation for clinic admin can be added here
      navigate("/register-clinic", { state: { user, profilePicture } });
      return;
    }

    try {
      var formData = new FormData();
      formData.append('user', JSON.stringify(user)); 

      if (profilePicture) {
        formData.append('file', profilePicture); 
      }

      const res = await registerUser(formData);
      //TODO: this should be redirected to "/"
      if (res.status === 200) {
        console.log("Registered:", res.data);
        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

  const handleBack = () => {
    setUserType("");
    setProfilePicture(null);
    setProfilePreview(null);
    setUser({
      full_name: "",
      email: "",
      user_type: "",
      clinic_name: "",
      password: "",
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white sm:p-8 rounded-2xl sm:shadow-lg w-full max-w-lg">
        <img src="/vetsync-logo-wname.png" alt="VetSync Logo" className="h-12 mx-auto my-8" />
        
        {/* Role Selection Step */}
        {!userType && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Welcome to VetSync</h2>
            <p className="text-gray-600 mb-8">Let's get started! Please select your role:</p>
            
            <div className="space-y-4 mb-6">
              <button
                type="button"
                onClick={() => handleRoleChange("pet_owner")}
                className="w-full px-6 py-6 rounded-2xl border border-gray-300 hover:border-primary hover:bg-primary/5 transition text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">Pet Owner</h3>
                    <p className="text-sm text-gray-600 mt-1">Book appointments for your pets and manage their health records</p>
                  </div>
                  <div className="text-3xl">🐾</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("clinic_admin")}
                className="w-full px-6 py-6 rounded-2xl border border-gray-300 hover:border-primary hover:bg-primary/5 transition text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">Clinic Admin</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage your veterinary clinic and connect with pet owners</p>
                  </div>
                  <div className="text-3xl">🏥</div>
                </div>
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
              </p>
            </div>
          </div>
        )}

        {/* Registration Form Step */}
        {userType && (
          <div>
            <div className="mb-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex gap-1 items-center text-primary hover:underline text-sm mb-2"
              >
                <FaChevronLeft /> Back to role selection
              </button>
              <h2 className="text-2xl font-semibold">
                {userType === "pet_owner" ? "Pet Owner" : "Clinic Admin"} Registration
              </h2>
              <p className="text-gray-600 mt-1">
                {userType === "pet_owner" 
                  ? "Join VetSync and connect with top vets near you." 
                  : "Register your clinic and start managing appointments."}
              </p>
            </div>

            <form onSubmit={handleSubmit} method="POST">
              {/* Profile Picture Upload */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-3xl"><FaUser /></span>
                    )}
                  </div>
                  <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/80 transition">
                    <FaCamera className="text-sm" />
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="name">
                  Full Name
                </label>
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

              {/* Clinic Name - Only shown for Clinic Admin */}
              {/* {userType === "clinic_admin" && (
                <div>
                  <div className="mb-4">
                    <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="clinic_name">
                      Clinic Name
                    </label>
                    <input
                      required
                      type="text"
                      id="clinic_name"
                      className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                      placeholder="Enter your clinic name"
                      onChange={handleOnChange}
                      name="clinic_name"
                      value={user.clinic_name}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="clinic_address">
                      Clinic Address
                    </label>
                    <input
                      required
                      type="text"
                      id="clinic_address"
                      className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                      placeholder="Enter your clinic address"
                      onChange={handleOnChange}
                      name="clinic_address"
                      value={user.clinic_address}
                    />
                  </div>
                </div>
              )} */}

              <div className="mb-4">
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
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
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="password">
                  Create Password
                </label>
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
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="confirm-password">
                  Confirm Password
                </label>
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

              <button 
                type="submit" 
                className="w-full bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] transition"
              >
                Register
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}