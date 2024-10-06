import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/profile.jpg'; // Replace with your profile image path
import { FaEdit } from 'react-icons/fa'; // Import the edit icon
import ReactGA from "react-ga4"

const generateRandomGuestId = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'guest-';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const Settings = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'english');
  const [profile, setProfile] = useState(localStorage.getItem('profile') || generateRandomGuestId());
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [scrollType, setScrollType] = useState(localStorage.getItem('scrollType') || 'non-sticky');
  const navigate = useNavigate();

  useEffect(() => {
    // Generate a new guest ID if it doesn't exist in local storage
    if (!localStorage.getItem('profile')) {
      const newGuestId = generateRandomGuestId();
      localStorage.setItem('profile', newGuestId);
      setProfile(newGuestId);
      setEditedProfile(newGuestId);
    }
  }, []);

  ReactGA.send({
    hitType: "pageview",
    page: "/settings",
    title: "Settings",
    });

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    // Clear the cached nextPage and its timestamp to ensure fresh news is fetched
    localStorage.removeItem('nextPage');
    localStorage.removeItem('nextPageTimestamp');

    localStorage.setItem('language', selectedLanguage);
    setLanguage(selectedLanguage);
    navigate('/'); // Navigate to the home page
    window.location.reload(); // Refresh the page to trigger the fresh fetch
  };


  const handleClearCache = () => {
    localStorage.clear();
    alert('Cache cleared. Please refresh the page.');
    window.location.reload();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleProfileChange = (e) => {
    setEditedProfile(e.target.value);
  };

  const handleSaveProfile = () => {
    localStorage.setItem('profile', editedProfile);
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleScrollTypeChange = (e) => {
    const selectedScrollType = e.target.value;
    localStorage.setItem('scrollType', selectedScrollType);
    setScrollType(selectedScrollType);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Settings</h1>
      <div className="flex flex-col space-y-4 w-64">
        <div className="flex flex-col items-center">
          <img src={profileImage} alt="Profile" className="w-28 border-2 rounded-full mb-2" />
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editedProfile}
                onChange={handleProfileChange}
                className="border-2 border-gray-300 rounded-md p-1"
              />
              <button onClick={handleSaveProfile} className="bg-green-500 text-white px-2 py-1 rounded">
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center ml-4 space-x-2">
              <p className="text-md font-bold text-gray-600">{profile}</p>
              <button onClick={handleEditClick}>
                <FaEdit className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
          <select id="language" value={language} onChange={handleLanguageChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="english">English</option>
            <option value="telugu">Telugu</option>
          </select>
        </div>
        <div>
          {/* <label htmlFor="scrollType" className="block text-sm font-medium text-gray-700">Scroll Type</label>
          <select id="scrollType" value={scrollType} onChange={handleScrollTypeChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="sticky">Sticky</option>
            <option value="non-sticky">Non-Sticky</option>
          </select> */}
        </div>
        <div>
          {/* <button onClick={handleClearCache} className="bg-red-500 text-white px-4 py-2 rounded">
            Clear Cache
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
