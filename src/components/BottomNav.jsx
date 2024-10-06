import React from 'react';
import { NavLink } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";
import { RiRobot2Fill, RiSettings4Fill, RiSearch2Fill } from "react-icons/ri";

const BottomNav = ({ visible }) => {
  return (
    <nav className={`bg-white p-4 h-16 flex justify-around items-center fixed bottom-0 w-full shadow-[0_35px_60px_15px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out `}>
      <NavLink
        to="/"
        className={({ isActive }) => `nav-link ${isActive ? 'text-blue-700 text-3xl' : 'text-gray-500 text-xl'}`}
      >
        <GoHomeFill />
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) => `nav-link ${isActive ? 'text-blue-700 text-3xl' : 'text-gray-500 text-xl'}`}
      >
        <RiSearch2Fill />
      </NavLink>
      <NavLink
        to="/discovery"
        className={({ isActive }) => `nav-link ${isActive ? 'text-blue-700 text-3xl' : 'text-gray-500 text-xl'}`}
      >
        <RiRobot2Fill />
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) => `nav-link ${isActive ? 'text-blue-700 text-3xl' : 'text-gray-500 text-xl'}`}
      >
        <RiSettings4Fill />
      </NavLink>
    </nav>
  );
};

export default BottomNav;
