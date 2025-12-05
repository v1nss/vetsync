import { useState, useEffect } from "react";
import { FaTimes, FaCamera, FaUser } from "react-icons/fa";
import DriveImage from "../DriveImage";

export default function AddVetModal({ isOpen, onClose, onSubmit, vet }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    license_number: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [existingProfileImage, setExistingProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vet) {
      setFormData({
        name: vet.name || vet.full_name || "",
        email: vet.email || "",
        password: "",
        specialization: vet.specialization || "",
        license_number: vet.license_number || "",
      });
      // Set existing profile image for display
      if (vet.profile_image_url) {
        setExistingProfileImage(vet.profile_image_url);
      } else {
        setExistingProfileImage(null);
      }
      setProfilePreview(null);
      setProfilePicture(null);
    } else {
      setFormData({ name: "", email: "", password: "", specialization: "", license_number: "" });
      setProfilePicture(null);
      setProfilePreview(null);
      setExistingProfileImage(null);
    }
    setErrors({});
  }, [vet, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, 
        profilePicture: "Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed." 
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
    // Clear existing image when new one is selected
    setExistingProfileImage(null);
    
    const reader = new FileReader();
    reader.onloadend = () => { setProfilePreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, profilePicture);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {vet ? "Edit Vet Professional" : "Add Vet Professional"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Profile Picture Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : existingProfileImage ? (
                  <DriveImage
                    image={existingProfileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    fallbackIcon={false}
                  />
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
          {vet && existingProfileImage && !profilePreview && (
            <p className="text-xs text-gray-500 text-center">Current profile picture</p>
          )}
          {errors.profilePicture && (
            <p className="text-red-500 text-xs text-center">{errors.profilePicture}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary"
              placeholder="Dr. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary"
              placeholder="john@clinic.com"
            />
          </div>

          {!vet && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!vet}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary"
                placeholder="Create password"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary"
              placeholder="e.g., Surgery, General Practice"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary"
              placeholder="VET-2023-001"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90"
            >
              {vet ? "Update" : "Add"} Vet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}