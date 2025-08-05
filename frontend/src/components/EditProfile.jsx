import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera } from 'react-icons/fa';

const EditProfile = () => {
  const { userdata, updateUserProfile, updateUserPhoto } = useContext(AppContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: userdata?.user?.name || '',
    bio: userdata?.user?.bio || ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(userdata?.user?.photo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setIsPhotoUploading(true);
      try {
        const success = await updateUserPhoto(userdata.user._id, file);
        if (success) {
          setPhotoPreview(URL.createObjectURL(file));
        }
      } finally {
        setIsPhotoUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await updateUserProfile(
        userdata.user._id,
        formData.name,
        formData.bio
      );
      
      if (success) {
        navigate(`/user-profile/${userdata.user._id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userdata) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="max-w-2xl mx-auto px-1 py-1 flex items-center justify-start gap-14 mb-6 mt-2 lg:mt-5 lg:min-h-[calc(100vh-5rem)] lg:items-center">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm border border-gray-200"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h2 className="text-2xl font-bold mb-0 text-center">Edit Profile</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No photo</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className={`absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition ${
                isPhotoUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isPhotoUploading}
            >
              {isPhotoUploading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaCamera className="text-sm" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              className="hidden"
              disabled={isPhotoUploading}
            />
          </div>
          <p className="text-sm text-gray-500">
            {isPhotoUploading ? 'Uploading...' : 'Click camera icon to change photo'}
          </p>
        </div>
        
        {/* Rest of your form remains the same */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={50}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={200}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center ${
              isSubmitting ? 'opacity-70' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;