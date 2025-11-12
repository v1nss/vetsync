import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../../global/api/user";
import { loginUser } from "../../global/api/auth";
import { useAuth } from "../../context/AuthContext";
import { registerClinic } from "../../global/api/clinic";

export default function RegisterClinicPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const receivedUserData = location.state;

  if (!receivedUserData) return navigate("/register");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    contact_number: "",
    email: "",
    hours: "",
    description: "",
  });

  const [files, setFiles] = useState({
    picture: null,
    license: null,
  });

  const [previews, setPreviews] = useState({
    picture: null,
    license: null,
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors((prev) => ({
          ...prev,
          [type]: "File size must be less than 5MB",
        }));
        return;
      }
      setFiles((prev) => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => ({ ...prev, [type]: reader.result }));
      reader.readAsDataURL(file);
      if (errors[type]) setErrors((prev) => ({ ...prev, [type]: "" }));
    }
  };

  const removeFile = (type) => {
    setFiles((prev) => ({ ...prev, [type]: null }));
    setPreviews((prev) => ({ ...prev, [type]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Clinic name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    // if (!formData.city.trim()) newErrors.city = 'City is required';
    // if (!formData.state.trim()) newErrors.state = 'State is required';
    // if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.contact_number.trim()) newErrors.contact_number = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    // if (!formData.hours.trim()) newErrors.hours = 'Operating hours are required';
    // if (!files.picture) newErrors.picture = 'Clinic picture is required';
    // if (!files.license) newErrors.license = 'License/permit is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitStatus("pending");

    // const clinic_address = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`;
    const updatedUserData = {
      ...receivedUserData.user, // keep existing user fields
      clinic_name: formData.name, // overwrite clinic_name
    };

    try {
      // register user
      const registerResponse = await registerUser(updatedUserData);

      // automatically log in the user
      const { user, token } = await loginUser(
        updatedUserData.email,
        updatedUserData.password
      );
      login(user, token);
      // register the clinic (only after user is registered and logged in)
      const clinicResponse = await registerClinic(formData, token);

      setSubmitStatus("submitted");
    } catch (err) {
      console.error("Error during registration process:", err.message);
      setSubmitStatus(null);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background py-8">
      <div className="bg-white sm:p-8 rounded-2xl sm:shadow-lg w-full max-w-xl">
        <img
          src="/vetsync-logo-wname.png"
          alt="VetSync Logo"
          className="h-12 mx-auto mb-6"
        />
        <h2 className="text-2xl font-semibold text-center">
          Register Your Clinic
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Complete the form to register your veterinary clinic
        </p>

        <div className="space-y-4">
          {/* Clinic Name */}
          <div>
            <label className="label-required block text-sm text-gray-700 mb-2">
              Clinic Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
              placeholder="Enter clinic name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="label-required block text-sm text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
              placeholder="Enter street address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label-required block text-sm text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                placeholder="City"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="label-required block text-sm text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                placeholder="State"
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
            <div>
              <label className="label-required block text-sm text-gray-700 mb-2">
                ZIP
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                placeholder="ZIP"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
              )}
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-required block text-sm text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                placeholder="(+63) 912-345-6789"
              />
              {errors.contact_number && (
                <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>
              )}
            </div>
            <div>
              <label className="label-required block text-sm text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                placeholder="clinic@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <label className="label-required block text-sm text-gray-700 mb-2">
              Operating Hours
            </label>
            <input
              type="text"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
              placeholder="e.g., Mon-Fri 9AM-5PM"
            />
            {errors.hours && (
              <p className="text-red-500 text-xs mt-1">{errors.hours}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl resize-none"
              placeholder="Brief description of your clinic..."
            />
          </div>

          {/* Clinic Picture */}
          <div>
            <label className="label-required block text-sm text-gray-700 mb-2">
              Clinic Picture
            </label>
            {previews.picture ? (
              <div className="border border-gray-300 rounded-2xl p-4">
                <img
                  src={previews.picture}
                  alt="Clinic"
                  className="w-full h-48 object-cover rounded-2xl mb-3"
                />
                <button
                  onClick={() => removeFile("picture")}
                  className="w-full py-2 text-sm text-red-600 border border-red-600 rounded-2xl hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-2xl p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "picture")}
                  className="hidden"
                  id="picture"
                />
                <label htmlFor="picture" className="cursor-pointer">
                  <p className="text-sm text-gray-600 mb-2">
                    Upload clinic picture
                  </p>
                  <span className="inline-block px-4 py-2 bg-primary text-white text-sm rounded-2xl hover:bg-[#FEA08E] transition">
                    Choose File
                  </span>
                </label>
              </div>
            )}
            {errors.picture && (
              <p className="text-red-500 text-xs mt-1">{errors.picture}</p>
            )}
          </div>

          {/* License */}
          <div>
            <label className="label-required block text-sm text-gray-700 mb-2">
              License/Permit
            </label>
            {previews.license ? (
              <div className="border border-gray-300 rounded-2xl p-4">
                <img
                  src={previews.license}
                  alt="License"
                  className="w-full h-48 object-cover rounded-2xl mb-3"
                />
                <button
                  onClick={() => removeFile("license")}
                  className="w-full py-2 text-sm text-red-600 border border-red-600 rounded-2xl hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-2xl p-6 text-center">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, "license")}
                  className="hidden"
                  id="license"
                />
                <label htmlFor="license" className="cursor-pointer">
                  <p className="text-sm text-gray-600 mb-2">
                    Upload license/permit
                  </p>
                  <span className="inline-block px-4 py-2 bg-primary text-white text-sm rounded-2xl hover:bg-[#FEA08E] transition">
                    Choose File
                  </span>
                </label>
              </div>
            )}
            {errors.license && (
              <p className="text-red-500 text-xs mt-1">{errors.license}</p>
            )}
          </div>

          {submitStatus === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-2xl text-sm">
              <p className="font-semibold mb-1">✓ Registration Submitted!</p>
              <p>
                Your clinic registration is pending approval from the system
                administrator. You will be notified once your clinic is
                approved.
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitStatus === "pending"}
            className="w-full bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitStatus === "pending"
              ? "Registration Submitted"
              : "Register Clinic"}
          </button>
        </div>
      </div>
    </section>
  );
}
