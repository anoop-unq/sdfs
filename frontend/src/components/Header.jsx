import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaNetworkWired, FaSearch, FaChartLine } from "react-icons/fa";
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { userdata } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-br from-white to-gray-50 py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">

        {/* Left Section */}
        <div className="space-y-6 md:space-y-8 lg:space-y-10 mt-10 md:mt-0" data-aos="fade-right">
          
          {/* 👋 Greeting - Increased margin-top for mobile */}
          <div className="flex items-center gap-3 justify-center lg:justify-start mt-6 md:mt-0">
            <img src={assets.hand_wave} alt="wave" className="h-10 w-10 md:h-8 md:w-8" />
            <h4 className="text-3xl md:text-2xl sm:text-3xl font-semibold text-gray-800 font-['Inter']">
              Hi, {userdata ? userdata.name : "Connector!"}
            </h4>
          </div>

          {/* 🖼️ Image shown below greeting on mobile */}
          <div className="flex lg:hidden mt-8 justify-center" data-aos="fade-up">
            <img
              src={assets.header_img}
              alt="Smart Linked Illustration"
              className="w-full max-w-xs sm:max-w-md rounded-xl shadow-xl"
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight text-center lg:text-left font-['Plus_Jakarta_Sans'] mt-6 md:mt-0">
            Welcome to <span className="text-blue-600">Smart Linked</span> 🔗
          </h1>

          {/* Subheading */}
          <p className="text-gray-600 text-lg sm:text-xl max-w-xl text-center lg:text-left mx-auto lg:mx-0 font-['Inter'] mt-4">
            Connect, network, and grow your professional relationships in one powerful platform.
          </p>

          {userdata && (
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-6">
              {[
                {
                  icon: <FaUserFriends className="text-blue-500 text-3xl mb-3" />,
                  title: "Build Connections",
                  desc: "Expand your professional network effortlessly.",
                },
                {
                  icon: <FaNetworkWired className="text-purple-500 text-3xl mb-3" />,
                  title: "Smart Networking",
                  desc: "Discover relevant professionals in your industry.",
                },
                {
                  icon: <FaSearch className="text-green-500 text-3xl mb-3" />,
                  title: "Advanced Search",
                  desc: "Find exactly who you're looking for with powerful filters.",
                },
                {
                  icon: <FaChartLine className="text-yellow-500 text-3xl mb-3" />,
                  title: "Growth Analytics",
                  desc: "Track your network growth and engagement metrics.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-lg transition duration-300 text-center"
                  data-aos="zoom-in"
                  data-aos-delay={i * 100}
                >
                  <div className="flex flex-col items-center">
                    {item.icon}
                    <h3 className="text-lg font-semibold text-gray-800 font-['Inter']">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 font-['Inter']">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="pt-6 sm:pt-4 text-center lg:text-left">
            <button
              onClick={() => navigate(userdata ? "/home" : "/signup")}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:scale-[1.02] transition duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-['Inter']"
            >
              {userdata ? "Explore Network" : "Join Now - It's Free"}
            </button>
          </div>
        </div>

        {/* 🖼️ Image for desktop view */}
        <div className="hidden lg:flex justify-end" data-aos="fade-left">
          <img
            src={assets.header_img}
            alt="Smart Linked Illustration"
            className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl rounded-xl shadow-xl transform hover:scale-[1.01] transition duration-500"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;