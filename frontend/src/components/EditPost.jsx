// components/EditPost.jsx
import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, updatePost } = useContext(AppContext);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const post = posts.find(p => p._id === id);
    if (post) {
      setContent(post.content);
      setLoading(false);
    } else {
      toast.error('Post not found');
      navigate('/home');
    }
  }, [id, posts, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updatePost(id, content);
      if (success) {
        navigate(-1); // Go back to previous page
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="px-4 py-4 flex items-center sticky top-0 bg-white z-10 border-b">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm border border-gray-200"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold ml-4">Edit Post</h1>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit your post..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
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
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;