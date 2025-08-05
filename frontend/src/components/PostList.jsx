import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import moment from 'moment';
import { assets } from '../assets/assets';

const PostList = ({ posts: postsProp }) => {
  const { posts: contextPosts, isLoadingPosts, userdata, deletePost } = useContext(AppContext);
  
  // Use posts from props if provided, otherwise from context
  const posts = postsProp || contextPosts;

  if (isLoadingPosts && !postsProp) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts yet. Be the first to post!
        </div>
      ) : (
        posts.map(post => (
          <div key={post._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start">
                <img 
                  src={assets.user_image || '/default-avatar.png'} 
                  alt="User avatar" 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{post.author?.name}</h3>
                  <p className="text-gray-500 text-sm">
                    @{post.author?.username} · {moment(post.createdAt).fromNow()}
                  </p>
                </div>
              </div>
              
              {userdata?._id === post.author?._id && (
                <button 
                  onClick={() => deletePost(post._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            
            <p className="whitespace-pre-line">{post.content}</p>
            
            <div className="flex items-center mt-4 pt-4 border-t">
              <button className="flex items-center text-gray-500 hover:text-blue-500 mr-4">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Like
              </button>
              <button className="flex items-center text-gray-500 hover:text-blue-500">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comment
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;