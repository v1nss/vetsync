import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function RegisterVetProPage() {
  const [vetCards, setVetCards] = useState([{
    id: Date.now(),
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialty: '',
    showPassword: false,
    showConfirmPassword: false,
    errors: {}
  }]);

  const handleChange = (id, field, value) => {
    setVetCards(prev => prev.map(card => {
      if (card.id === id) {
        const updated = { ...card, [field]: value };
        if (card.errors[field]) {
          updated.errors = { ...card.errors, [field]: '' };
        }
        return updated;
      }
      return card;
    }));
  };

  const togglePasswordVisibility = (id, field) => {
    setVetCards(prev => prev.map(card => 
      card.id === id ? { ...card, [field]: !card[field] } : card
    ));
  };

  const validateCard = (card) => {
    const errors = {};
    if (!card.fullName.trim()) errors.fullName = 'Full name is required';
    if (!card.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(card.email)) errors.email = 'Invalid email format';
    if (!card.password) errors.password = 'Password is required';
    else if (card.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!card.confirmPassword) errors.confirmPassword = 'Please confirm password';
    else if (card.password !== card.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!card.phone.trim()) errors.phone = 'Phone number is required';
    if (!card.specialty) errors.specialty = 'Specialty is required';
    return errors;
  };

  const addMoreCard = () => {
    setVetCards(prev => [...prev, {
      id: Date.now(),
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      specialty: '',
      showPassword: false,
      showConfirmPassword: false,
      errors: {}
    }]);
  };

  const removeCard = (id) => {
    if (vetCards.length > 1) {
      setVetCards(prev => prev.filter(card => card.id !== id));
    }
  };

  const handleSubmitAll = () => {
    let hasErrors = false;
    const updatedCards = vetCards.map(card => {
      const errors = validateCard(card);
      if (Object.keys(errors).length > 0) {
        hasErrors = true;
        return { ...card, errors };
      }
      return card;
    });

    if (hasErrors) {
      setVetCards(updatedCards);
      return;
    }

    const accountsData = vetCards.map(card => ({
      fullName: card.fullName,
      email: card.email,
      phone: card.phone,
      specialty: card.specialty
    }));

    console.log('Creating vet professional accounts:', accountsData);
    alert(`Successfully created ${vetCards.length} vet professional account(s)!`);
    
    // Reset to single empty card
    setVetCards([{
      id: Date.now(),
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      specialty: '',
      showPassword: false,
      showConfirmPassword: false,
      errors: {}
    }]);
  };

  return (
    <section className="min-h-screen bg-background py-8">
      <div className="bg-white sm:p-8 rounded-2xl sm:shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/vetsync-logo-wname.png" alt="VetSync Logo" className="h-12 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold">Create Vet Professional Accounts</h2>
          <p className="text-gray-600 mt-2">Add veterinary professionals to your clinic</p>
        </div>

        <div className="space-y-4">
          {vetCards.map((card, index) => (
            <div key={card.id} className="bg-white rounded-2xl sm:p-6 p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Vet Professional #{index + 1}</h3>
                {vetCards.length > 1 && (
                  <button
                    onClick={() => removeCard(card.id)}
                    className="text-red-600 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="label-required block text-sm text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={card.fullName}
                    onChange={(e) => handleChange(card.id, 'fullName', e.target.value)}
                    className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                    placeholder="Enter full name"
                  />
                  {card.errors.fullName && <p className="text-red-500 text-xs mt-1">{card.errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="label-required block text-sm text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={card.email}
                    onChange={(e) => handleChange(card.id, 'email', e.target.value)}
                    className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                    placeholder="email@example.com"
                  />
                  {card.errors.email && <p className="text-red-500 text-xs mt-1">{card.errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="label-required block text-sm text-gray-700 mb-2">Create Password</label>
                  <div className="flex items-center w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl">
                    <input
                      type={card.showPassword ? "text" : "password"}
                      value={card.password}
                      onChange={(e) => handleChange(card.id, 'password', e.target.value)}
                      className="focus:outline-none w-full outline-none text-sm"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(card.id, 'showPassword')}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {card.showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                  {card.errors.password && <p className="text-red-500 text-xs mt-1">{card.errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="label-required block text-sm text-gray-700 mb-2">Confirm Password</label>
                  <div className="flex items-center w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl">
                    <input
                      type={card.showConfirmPassword ? "text" : "password"}
                      value={card.confirmPassword}
                      onChange={(e) => handleChange(card.id, 'confirmPassword', e.target.value)}
                      className="focus:outline-none w-full outline-none text-sm"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(card.id, 'showConfirmPassword')}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {card.showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                  {card.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{card.errors.confirmPassword}</p>}
                </div>

                {/* Phone & Specialty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="label-required block text-sm text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={card.phone}
                      onChange={(e) => handleChange(card.id, 'phone', e.target.value)}
                      className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                      placeholder="(+63) 912-345-6789"
                    />
                    {card.errors.phone && <p className="text-red-500 text-xs mt-1">{card.errors.phone}</p>}
                  </div>
                  <div>
                    <label className="label-required block text-sm text-gray-700 mb-2">Specialty</label>
                    <select
                      value={card.specialty}
                      onChange={(e) => handleChange(card.id, 'specialty', e.target.value)}
                      className="focus:outline-none w-full text-sm px-4 py-3 border border-gray-300 rounded-2xl"
                    >
                      <option value="">Select specialty</option>
                      <option value="general">General Practice</option>
                      <option value="surgery">Surgery</option>
                      <option value="dentistry">Dentistry</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="ophthalmology">Ophthalmology</option>
                      <option value="emergency">Emergency & Critical Care</option>
                      <option value="other">Other</option>
                    </select>
                    {card.errors.specialty && <p className="text-red-500 text-xs mt-1">{card.errors.specialty}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <button
            onClick={addMoreCard}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-primary hover:text-primary transition"
          >
            + Add Another Vet Professional
          </button>

          {/* Submit All Button */}
          <button
            onClick={handleSubmitAll}
            className="w-full bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] transition"
          >
            Create All Accounts ({vetCards.length} Professional{vetCards.length !== 1 ? 's' : ''})
          </button>
        </div>
      </div>
    </section>
  );
}