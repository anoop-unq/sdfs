import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from 'react-toastify';
import HomePage from "./pages/HomePage";
import UserProfile from "./components/UserProfile";
import { AddBio } from "./components/AddBio";
import EditProfile from "./components/EditProfile";
import EditPost from "./components/EditPost";


function App() {
  return (
   <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <Routes>
      <Route path="/" element={<Home/>}/>
      {/* <Route path="/login" element={<Login/>}/> */}
        <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Login />} />

      <Route path="/email-verify" element={<EmailVerify/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/home" element={<HomePage />}/>
      <Route path="/user-profile/:id" element={<UserProfile />} />
      <Route path="/add-bio/:id" element={<AddBio />}/>
      <Route path="/edit-profile/:id" element={<EditProfile />}/>
      <Route path="/edit-post/:id" element={<EditPost />}/>
    </Routes>
  
   </div>
  );
}

export default App;
