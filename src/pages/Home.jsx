import React from 'react';
import NewsList from '../components/NewsList';
import ReactGA from "react-ga4"

const Home = ({ language }) => {
  const handleScroll = (scrollTop) => {
    // Handle scroll logic here if needed
  };

  ReactGA.send({
    hitType: "pageview",
    page: "/",
    title: "Home",
    });

  return (
    <div className="h-screen bg-gray-300">
      <NewsList language={language} onScroll={handleScroll} />
    </div>
  );
};

export default Home;
