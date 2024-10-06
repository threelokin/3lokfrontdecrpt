import React from 'react';
import { Link } from 'react-router-dom';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const TopNav = ({ visible, onLanguageSelect }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = React.useState(false);
  const [language, setLanguage] = React.useState(localStorage.getItem('language') || 'en');

  React.useEffect(() => {
    setLanguage(localStorage.getItem('language') || 'english');
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setLanguageMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setLanguageMenuOpen(false);
  };

  const logo = '/logo.png';

  const englishNavItems = {
    home: 'Home',
    about: 'About',
  };
  const navItems = {
    english: englishNavItems,
    telugu: {
      home: 'Home',
      about: 'About',
    }
  };

  return (
    <>
      <div className={`fixed top-0 left-0 w-full bg-white shadow-md z-40 h-14 transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <span>
              <div className='-mt-3'>
                <img src={logo} alt="3Lok News" className='h-20' />
              </div>
            </span>
          </div>
          <div className="flex items-center">
            {!menuOpen && (
              <button onClick={toggleMenu} className="text-black-900 text-2xl mr-3 focus:outline-none -mt-3">
                <HiMenuAlt3 />
              </button>
            )}
            {menuOpen && (
              <button onClick={closeMenu} className="text-2xl absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
                <IoClose />
              </button>
            )}
          </div>
        </nav>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-30 transition-transform duration-300 ease-in-out">
          <div className="text-black text-center flex items-center justify-center h-full">
            <ul className="space-y-4">
              <li>
                <Link to="/" onClick={closeMenu} className="text-2xl">{navItems[language].home}</Link>
              </li>
              <li>
                <Link to="/about" onClick={closeMenu} className="text-2xl">{navItems[language].about}</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
