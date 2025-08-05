// components/PostForm.jsx
import { useContext, useState, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

axios.defaults.withCredentials = true;

const PostForm = () => {
  const { createPost, islogged, userdata } = useContext(AppContext);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const success = await createPost(content);
      if (success) {
        setContent('');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [content, createPost, isSubmitting]);

  const navigateToProfile = (id) => {
    navigate(`/user-profile/${id}`);
  };

  const navigateToEditProfile = (id) => {
    navigate(`/edit-profile/${id}`);
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  if (!islogged) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start flex-1 min-w-0"> {/* Add flex-1 and min-w-0 */}
          <img 
            src={userdata?.user?.photo || assets.user_image || '/default-avatar.png'} 
            alt="User avatar" 
            className="w-10 h-10 rounded-full mr-3 cursor-pointer flex-shrink-0"
            onClick={() => navigateToProfile(userdata.user._id)}
          />
          <div className="min-w-0 flex-1"> {/* Add min-w-0 and flex-1 */}
            <h3 className="font-semibold truncate">{userdata?.name}</h3>
            <p className="text-gray-500 text-sm truncate">@{userdata?.user?.username}</p>
            {userdata?.user?.bio && (
              <div className="text-gray-500 text-sm mt-1">
                {showFullBio ? (
                  <p className="whitespace-pre-line break-words">{userdata.user.bio}</p>
                ) : (
                  <p className="whitespace-pre-line break-words line-clamp-2">
                    {userdata.user.bio}
                  </p>
                )}
                {userdata.user.bio.length > 100 && (
                  <button
                    onClick={toggleBio}
                    className="text-blue-500 hover:text-blue-700 text-sm mt-1 focus:outline-none"
                  >
                    {showFullBio ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Edit Profile Button */}
        <button
          onClick={() => navigateToEditProfile(userdata.user._id)}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg transition-colors
                     md:px-4 md:py-2 flex-shrink-0 ml-2"
          aria-label="Edit profile"
        >
          <span className="hidden sm:inline">Edit Profile</span>
          <span className="sm:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          required
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {content.length}/500 characters
          </span>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;