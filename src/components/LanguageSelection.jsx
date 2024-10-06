import React, { useState } from 'react';

const LanguageSelection = ({ onSelect }) => {
  const [language, setLanguage] = useState('');

  const handleSelect = (selectedLanguage) => {
    localStorage.setItem('language', selectedLanguage);
    onSelect(selectedLanguage);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Select Language</h1>
      <div className="flex space-x-4">
        <button onClick={() => handleSelect('telugu')} className="bg-gray-800 text-white px-4 py-2 rounded">తెలుగు</button>
        <button onClick={() => handleSelect('english')} className="bg-gray-800 text-white px-4 py-2 rounded">English</button>
      </div>
    </div>
  );
};

export default LanguageSelection;
