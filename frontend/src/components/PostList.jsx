// // import { useContext } from 'react';
// // import { AppContext } from '../context/AppContext';
// // import moment from 'moment';
// // import { assets } from '../assets/assets';
// // import { useNavigate } from 'react-router-dom';

// // const PostList = ({ posts: postsProp }) => {
// //   const { posts: contextPosts, isLoadingPosts, userdata, deletePost } = useContext(AppContext);
// //   const navigate = useNavigate()
// //   // Use posts from props if provided, otherwise from context
// //   const posts = postsProp || contextPosts;

// //   if (isLoadingPosts && !postsProp) {
// //     return (
// //       <div className="flex justify-center py-8">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //       </div>
// //     );
// //   }

  
// //   const handleProfileClick = (userId) => {
// //     navigate(`/view-users/${userId}`);
// //   };
  
// //   return (
// //     <div className="space-y-6">
// //       {posts.length === 0 ? (
// //         <div className="text-center py-8 text-gray-500">
// //           No posts yet. Be the first to post!
// //         </div>
// //       ) : (
// //         posts.map(post => (
// //           <div key={post._id} className="bg-white rounded-lg shadow p-6">
// //             <div className="flex justify-between items-start mb-4">
// //               <div className="flex items-start">
// //                 <img 
// //                   src={ post.author?.photo  ||  assets.user_image } 
// //                   alt="User avatar" 
// //                   className="w-10 h-10 rounded-full mr-3 cursor-pointer hover:opacity-80"
// //                   onClick={()=>handleProfileClick(post.author?._id)}
// //                 />
// //                 <div>
// //                   <h3 className="font-semibold">{post.author?.name}</h3>
// //                   <p className="text-gray-500 text-sm">
// //                     @{post.author?.username} · {moment(post.createdAt).fromNow()}
// //                   </p>
// //                 </div>
// //               </div>
              
        
// //             </div>
            
// //             <p className="whitespace-pre-line">{post.content}</p>
            
// //             <div className="flex items-center mt-4 pt-4 border-t">
// //               <button className="flex items-center text-gray-500 hover:text-blue-500 mr-4">
// //                 <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
// //                 </svg>
// //                 Like
// //               </button>
// //               <button className="flex items-center text-gray-500 hover:text-blue-500">
// //                 <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
// //                 </svg>
// //                 Comment
// //               </button>
// //             </div>
// //           </div>
// //         ))
// //       )}
// //     </div>
// //   );
// // };

// // export default PostList;
//  import { useContext, useState } from 'react';
// import { AppContext } from '../context/AppContext';
// import moment from 'moment';
// import { assets } from '../assets/assets';
// import { useNavigate } from 'react-router-dom';

// const PostList = ({ posts: postsProp }) => {
//   const { posts: contextPosts, isLoadingPosts, userdata, deletePost, likePost,updatePostInContext } = useContext(AppContext);
//   const navigate = useNavigate();
//   const posts = postsProp || contextPosts;

//   // Track liked posts locally for instant UI feedback
//   const [localLikes, setLocalLikes] = useState({});
//    const [localLoading, setLocalLoading] = useState({});
//   if (isLoadingPosts && !postsProp) {
//     return (
//       <div className="flex justify-center py-8">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   const handleProfileClick = (userId) => {
//     navigate(`/view-users/${userId}`);
//   };

//   const handleLike = async (postId) => {
//     if (!userdata?.user?._id) {
//       navigate('/login'); // Redirect if not logged in
//       return;
//     }
//     // Prevent double clicks
//     if (localLoading[postId]) return;
//     setLocalLoading(prev => ({ ...prev, [postId]: true }));

//     try {
//       // Get current post state
//       const post = posts.find(p => p._id === postId);
//       const isCurrentlyLiked = post.likes.includes(userdata.user._id);
      
//       // Optimistic update - update context directly
//       const updatedPost = {
//         ...post,
//         likes: isCurrentlyLiked 
//           ? post.likes.filter(id => id !== userdata.user._id)
//           : [...post.likes, userdata.user._id]
//       };
      
//       updatePostInContext(updatedPost); // Add this function to your context

//       // Call API
//       await likePost(postId);
//     } catch (error) {
//       console.error('Like error:', error);
//       // Optionally revert the optimistic update here
//     } finally {
//       setLocalLoading(prev => ({ ...prev, [postId]: false }));
//     }
//   };


//   return (
//     <div className="space-y-6">
//       {posts.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">
//           No posts yet. Be the first to post!
//         </div>
//       ) : (
//         posts.map(post => {
//           const isLiked = localLikes[post._id] ?? 
//                          post.likes?.includes(userdata?.user?._id);
//           const likeCount = post.likes?.length || 0;
//           const isLoading = localLoading[post._id];

//           return (
//             <div key={post._id} className="bg-white rounded-lg shadow p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="flex items-start">
//                   <img 
//                     src={post.author?.photo || assets.user_image} 
//                     alt="User avatar" 
//                     className="w-10 h-10 rounded-full mr-3 cursor-pointer hover:opacity-80"
//                     onClick={() => handleProfileClick(post.author?._id)}
//                   />
//                   <div>
//                     <h3 className="font-semibold">{post.author?.name}</h3>
//                     <p className="text-gray-500 text-sm">
//                       @{post.author?.username} · {moment(post.createdAt).fromNow()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <p className="whitespace-pre-line">{post.content}</p>
              
//               <div className="flex items-center mt-4 pt-4 border-t">
//                 <button 
//                 className={`flex items-center mr-4 ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 onClick={() => handleLike(post._id)}
//                 disabled={isLoading}
//               >
//                   <svg 
//                     className="w-5 h-5 mr-1" 
//                     fill={isLiked ? 'currentColor' : 'none'} 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                   >
//                     <path 
//                       strokeLinecap="round" 
//                       strokeLinejoin="round" 
//                       strokeWidth="2" 
//                       d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
//                     />
//                   </svg>
//                   {likeCount}
//                 </button>
//                 <button className="flex items-center text-gray-500 hover:text-blue-500">
//                   <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                   </svg>
//                   Comment
//                 </button>
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// };

// export default PostList; 

import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import moment from 'moment';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostList = ({ posts: postsProp }) => {
  const { posts: contextPosts, isLoadingPosts, userdata, deletePost, likePost, updatePostInContext } = useContext(AppContext);
  const navigate = useNavigate();
  const posts = postsProp || contextPosts;

  axios.defaults.withCredentials=true
  // Track liked posts locally for instant UI feedback
  const [localLikes, setLocalLikes] = useState({});
  const [localLoading, setLocalLoading] = useState({});

  if (isLoadingPosts && !postsProp) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleProfileClick = (userId) => {
    navigate(`/view-users/${userId}`);
  };

  const handleLike = async (postId) => {
    if (!userdata?.user?._id) {
      navigate('/login');
      return;
    }
    
    if (localLoading[postId]) return;
    setLocalLoading(prev => ({ ...prev, [postId]: true }));

    try {
      const post = posts.find(p => p._id === postId);
      const isCurrentlyLiked = post.likes.includes(userdata.user._id);
      
      const updatedPost = {
        ...post,
        likes: isCurrentlyLiked 
          ? post.likes.filter(id => id !== userdata.user._id)
          : [...post.likes, userdata.user._id]
      };
      
      updatePostInContext(updatedPost);
      await likePost(postId);
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLocalLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts yet. Be the first to post!
        </div>
      ) : (
        posts.map(post => {
          const isLiked = localLikes[post._id] ?? post.likes?.includes(userdata?.user?._id);
          const likeCount = post.likes?.length || 0;
          const isLoading = localLoading[post._id];

          return (
            <div key={post._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start">
                  <img 
                    src={post.author?.photo || assets.user_image} 
                    alt="User avatar" 
                    className="w-10 h-10 rounded-full mr-3 cursor-pointer hover:opacity-80 object-cover"
                    onClick={() => handleProfileClick(post.author?._id)}
                  />
                  <div>
                    <h3 className="font-semibold">{post.author?.name}</h3>
                    <p className="text-gray-500 text-sm">
                      @{post.author?.username} · {moment(post.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
              
              {post.content && (
                <p className="whitespace-pre-line mb-4">{post.content}</p>
              )}
              
              {post.imageUrl && (
                <div className="mb-4">
                  <img 
                    src={post.imageUrl} 
                    alt="Post content" 
                    className="w-full h-auto max-h-96 rounded-lg object-contain"
                  />
                </div>
              )}
              
              <div className="flex items-center mt-4 pt-4 border-t">
                <button 
                  className={`flex items-center mr-4 ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleLike(post._id)}
                  disabled={isLoading}
                >
                  <svg 
                    className="w-5 h-5 mr-1" 
                    fill={isLiked ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  {likeCount}
                </button>
                <button className="flex items-center text-gray-500 hover:text-blue-500">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comment
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PostList;