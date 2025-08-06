import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { FiMessageSquare, FiHeart } from "react-icons/fi";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    posts = [],
    users = [],
    userdata,
    deletePost,
  } = useContext(AppContext);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (userdata?.user?._id === id) {
      setProfileUser(userdata.user);
      setLoading(false);
      return;
    }

    const userFromList = users.find((user) => user._id === id);
    if (userFromList) {
      setProfileUser(userFromList);
      setLoading(false);
      return;
    }

    const postWithUser = posts.find((post) => post?.author?._id === id);
    if (postWithUser) {
      setProfileUser(postWithUser.author);
      setLoading(false);
      return;
    }

    setProfileUser(null);
    setLoading(false);
  }, [id, posts, users, userdata]);

  const userPosts = posts.filter((post) => post?.author?._id === id);

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
    }
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  if (loading) {
    return <div className="text-center py-8">Loading user...</div>;
  }

  if (!profileUser) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">User not found</h2>
        <p>
          The user you're looking for doesn't exist or hasn't created any
          content yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-4 flex items-center sticky top-0 bg-white z-10 border-b">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm border border-gray-200 flex-shrink-0"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold ml-4 truncate max-w-[calc(100%-5rem)]">
          {profileUser.name}'s Profile
        </h1>
      </div>

      {/* Profile Content */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start mb-6">
            <img
              src={profileUser.photo || assets.user_image || "/default-avatar.png"}
              alt="User avatar"
              className="w-20 h-20 rounded-full mr-4 object-cover flex-shrink-0 border border-gray-200"
              onClick={()=>navigate(`/view-user/image/${profileUser._id}`)}
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold truncate">{profileUser.name}</h1>
              <p className="text-gray-600 truncate">@{profileUser.username}</p>
              {profileUser.bio && (
                <div className="mt-2 text-gray-700">
                  {showFullBio ? (
                    <p className="whitespace-pre-line break-words">
                      {profileUser.bio}
                    </p>
                  ) : (
                    <p className="whitespace-pre-line break-words line-clamp-2">
                      {profileUser.bio}
                    </p>
                  )}
                  {profileUser.bio.length > 100 && (
                    <button
                      onClick={toggleBio}
                      className="text-blue-500 hover:text-blue-700 text-sm mt-1 focus:outline-none"
                    >
                      {showFullBio ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between text-center border-t border-b py-4">
            <div>
              <p className="font-bold">{userPosts.length}</p>
              <p className="text-gray-600">Posts</p>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center min-w-0">
                    <img
                      src={post.author?.photo || assets.user_image || "/default-avatar.png"}
                      alt={post.author?.name}
                      className="w-10 h-10 rounded-full mr-3 flex-shrink-0 object-cover border border-gray-200"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">
                        {post.author?.name}
                      </h3>
                      <p className="text-gray-500 text-sm truncate">
                        @{post.author?.username}
                      </p>
                    </div>
                  </div>
                  {userdata?.user?._id === post.author?._id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/edit-post/${post._id}`)}
                        className="text-blue-500 hover:text-blue-700 flex-shrink-0"
                        aria-label="Edit post"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                        aria-label="Delete post"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                {post.content && (
                  <p className="mb-3 whitespace-pre-line break-words">
                    {post.content}
                  </p>
                )}

                {/* Responsive Image */}
                {post.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt="Post content"
                      className="w-full h-auto max-h-96 object-contain"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                      <FiHeart />
                      <span>{post.likes?.length || 0}</span>
                    </button>
                    <button
                      className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                      onClick={() => navigate(`/post/${post._id}`)}
                    >
                      <FiMessageSquare />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No posts yet</p>
            {userdata?.user?._id === profileUser._id && (
              <Link
                to="/home"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded inline-block"
              >
                Create your first post
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;