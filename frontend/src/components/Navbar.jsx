import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { userdata, backendUrl, setIsLogged, setUserData } = useContext(AppContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/logout");
      data.success && setIsLogged(false);
      data.success && setUserData(false);
      console.log(userdata.name);
      navigate("/");
      toast.success(`${userdata.name} Log Out `);
    } catch (error) {
      toast.error(data.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/verify-otp");
      if (data.success) {
        await navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
  <nav
  className={`fixed top-0 left-0 w-full z-50 px-6 sm:px-8 md:px-12 transition-all duration-300 ease-in-out ${
    isScrolled
      ? 'bg-white shadow-md backdrop-blur-md py-3'
      : 'bg-transparent py-5'
  }`}
>
  <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
    <img
      src={assets.logo}
      alt="Logo"
      className={`h-10 transition-all duration-300 ${
        isScrolled ? 'scale-90' : 'scale-100'
      }`}
    />
    {userdata ? (
      <div className="relative">
        <div
          onClick={() => setShowMenu((prev) => !prev)}
          className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer text-sm font-semibold shadow hover:shadow-md transition"
        >
          {userdata.name[0].toUpperCase()}
        </div>

        {showMenu && (
          <div className="absolute top-10 right-0 z-50 bg-white text-black rounded-lg shadow-lg py-2 w-40 animate-fadeIn">
            <ul className="text-sm">
              {!userdata.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Log out
              </li>
            </ul>
          </div>
        )}
      </div>
    ) : (
      <button
        className="px-6 py-2 bg-white border border-gray-300 text-gray-800 rounded-full shadow-sm transition-all duration-300 hover:bg-gray-100 hover:shadow-md min-w-max"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    )}
  </div>
</nav>

  );
};