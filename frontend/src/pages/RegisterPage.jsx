import { Link } from "react-router-dom";
import { useState } from "react";
import { FaChevronLeft, FaEye, FaEyeSlash, FaCamera, FaUser } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { registerUser, checkEmailExists } from "../global/api/user";
import SuccessModal from "../components/SuccessModal";
import TermsModal from "../components/TermsModal";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    user_type: "",
    phone_number: "",
    address: "",
    clinic_name: "",
    password: "",
  });
  const countryCode = "+63"; 

  const handleRoleChange = (role) => {
    setUserType(role);
    setUser(prev => ({ ...prev, user_type: role }));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow numbers, spaces, hyphens, and parentheses
    const numericValue = value.replace(/[^\d\s\-()]/g, '');
    setUser((prev) => ({ ...prev, phone_number: numericValue }));
    if (errors.phone_number) setErrors((prev) => ({ ...prev, phone_number: "" }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, 
        profilePicture: "Invalid file type. Only PNG, JPG, and JPEG are allowed." 
      }));
      e.target.value = "";
      return;
    }

    if (file.size > 5000000) {
      setErrors(prev => ({ ...prev, profilePicture: "File must be less than 5MB" }));
      e.target.value = "";
      return;
    }

    setProfilePicture(file);
    setErrors(prev => ({ ...prev, profilePicture: "" }));
    
    const reader = new FileReader();
    reader.onloadend = () => { setProfilePreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    // if (!user.full_name.trim() || user.full_name.trim().length < 2) 
    //   newErrors.full_name = "Full name must be at least 2 characters";
    if (!user.first_name.trim() || user.first_name.trim().length < 2) 
      newErrors.first_name = "First name must be at least 2 characters";
    if (!user.last_name.trim() || user.last_name.trim().length < 2) 
      newErrors.last_name = "Last name must be at least 2 characters";
    if (!user.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) 
      newErrors.email = "Invalid email format";
    if (!user.phone_number.trim()) newErrors.phone_number = "Phone number is required";
    else {
      const digitsOnly = user.phone_number.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) 
        newErrors.phone_number = "Phone number must be between 7 and 15 digits";
    }
    if (user.user_type === "pet_owner" && !user.address.trim()) 
      newErrors.address = "Address is required";
    if (!user.password) newErrors.password = "Password is required";
    else if (user.password.length < 8) newErrors.password = "Minimum 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(user.password)) 
      newErrors.password = "Must contain uppercase, lowercase, and number";
    if (user.password !== confirmPassword) 
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Check email exists with proper error handling
      const emailExists = await checkEmailExists(user.email);
      if (emailExists) {
        setErrors({ email: "Email already registered" });
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Email check error:", err);
      // Continue with registration even if email check fails
    }

    if (user.user_type === "clinic_admin") {
      // Format phone number with country code before navigating
      const userWithPhone = {
        ...user,
        phone_number: countryCode + " " + user.phone_number.replace(/\D/g, '')
      };
      navigate("/register-clinic", { state: { user: userWithPhone, profilePicture } });
      setIsSubmitting(false);
      return;
    }

    try {
      var formData = new FormData();
      // Combine country code with phone number
      const userWithPhone = {
        ...user,
        phone_number: countryCode + " " + user.phone_number.replace(/\D/g, '')
      };
      formData.append('user', JSON.stringify(userWithPhone));
      if (profilePicture) formData.append('file', profilePicture);
      
      await registerUser(formData);
      setShowSuccessModal(true); // This should trigger the modal
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate(user.user_type === "clinic_admin" ? "/register-clinic" : "/");
  };


  const handleBack = () => {
    setUserType("");
    setProfilePicture(null);
    setProfilePreview(null);
    setConfirmPassword("");
    setErrors({});
    setUser({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      user_type: "",
      clinic_name: "",
      password: "",
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white sm:p-8 p-6 rounded-2xl sm:shadow-lg w-full max-w-lg">
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

            {/* General error message */}
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Profile Picture Upload */}
              <div className="mb-6">
                <div className="flex justify-center">
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
                {errors.profilePicture && (
                  <p className="text-red-500 text-xs text-center mt-2">{errors.profilePicture}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="first-name">
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  className={`focus:outline-none w-full text-sm px-4 py-3 border rounded-2xl ${ errors.full_name ? 'border-red-500' : 'border-gray-300' }`}
                  placeholder="Enter your first name"
                  onChange={handleOnChange}
                  name="first_name"
                  value={user.first_name}
                />
                {errors.first_name && ( <p className="text-red-500 text-xs mt-1">{errors.first_name}</p> )}
              </div>

              <div className="mb-4">
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="last-name">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  className={`focus:outline-none w-full text-sm px-4 py-3 border rounded-2xl ${ errors.full_name ? 'border-red-500' : 'border-gray-300' }`}
                  placeholder="Enter your last name"
                  onChange={handleOnChange}
                  name="last_name"
                  value={user.last_name}
                />
                {errors.last_name && ( <p className="text-red-500 text-xs mt-1">{errors.last_name}</p> )}
              </div>

              <div className="mb-4">
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className={`focus:outline-none w-full text-sm px-4 py-3 border rounded-2xl ${ errors.email ? 'border-red-500' : 'border-gray-300' }`}
                  placeholder="Enter your email"
                  onChange={handleOnChange}
                  name="email"
                  value={user.email}
                />
                {errors.email && ( <p className="text-red-500 text-xs mt-1">{errors.email}</p> )}
              </div>

              <div className="mb-4">
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="phone_number">Contact Number</label>
                <div className="flex gap-2 w-full">
                  <div className="flex items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-700 text-sm font-medium whitespace-nowrap shrink-0">
                    🇵🇭 +63
                  </div>
                  <input
                    type="tel"
                    id="phone_number"
                    className={`focus:outline-none flex-1 min-w-0 text-sm px-4 py-3 border rounded-2xl ${ errors.phone_number ? 'border-red-500' : 'border-gray-300' }`}
                    placeholder="912 345 6789"
                    onChange={handlePhoneNumberChange}
                    name="phone_number"
                    value={user.phone_number}
                    maxLength={15}
                  />
                </div>
                {errors.phone_number && ( <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p> )}
              </div>

              {user.user_type === "pet_owner" && (
                <div className="mb-4">
                  <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="address">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className={`focus:outline-none w-full text-sm px-4 py-3 border rounded-2xl ${ errors.address ? 'border-red-500' : 'border-gray-300' }`}
                    placeholder="Enter your address"
                    onChange={handleOnChange}
                    name="address"
                    value={user.address}
                  />
                  {errors.address && ( <p className="text-red-500 text-xs mt-1">{errors.address}</p> )}
                </div>
              )}

              <div className="mb-4">
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="password">
                  Create Password
                </label>
                <div className={`flex items-center w-full text-sm px-4 py-3 border rounded-2xl ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <input
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
                {errors.password && ( <p className="text-red-500 text-xs mt-1">{errors.password}</p> )}
                <p className="text-xs text-gray-500 mt-1">At least 8 characters with uppercase, lowercase, and number</p>
              </div>

              <div className="mb-6">
                <label className="label-required block text-sm text-gray-700 mb-2" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <div className={`flex items-center w-full text-sm px-4 py-3 border rounded-2xl ${ errors.confirmPassword ? 'border-red-500' : 'border-gray-300' }`}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    className="focus:outline-none w-full outline-none text-sm"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors(prev => ({ ...prev, confirmPassword: "" }));
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && ( <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p> )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start gap-2 mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary hover:underline font-medium"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !termsAccepted}
                className="w-full bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] transition disabled:opacity-50"
              >
                {isSubmitting ? "Registering..." : "Register"}
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

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleModalClose}
        userType={userType}
      />

      {/* Terms Modal */}
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setShowTermsModal(false);
        }}
      />
    </section>
  );
}