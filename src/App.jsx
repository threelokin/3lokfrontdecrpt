import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import LanguageSelection from './components/LanguageSelection';
import Home from './pages/Home';
import Search from './pages/Search';
import SearchResults from './components/SearchResults';
import Discovery from './pages/Discovery';
import Settings from './pages/Settings';
import { NewsProvider } from './context/NewsContext';
import AboutPage from './pages/About';
import NewsDetailPage from './components/NewsDetailPage';
import CommentsPage from './components/CommentsPage';
import ReactGA from 'react-ga4';




const App = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || '');
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  ReactGA.initialize('G-P7RJWD9FTT');

  useEffect(() => {
    if (!language) {
      setLanguage('');
    }
  }, [language]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      if (currentScrollTop > lastScrollTop) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollTop(currentScrollTop);
    };

    const handleTap = () => {
      setNavVisible(true);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleTap);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleTap);
    };
  }, [lastScrollTop]);

  if (!language) {
    return <LanguageSelection onSelect={setLanguage} />;
  }

  return (
    <NewsProvider>
      <Router>
        <TopNav visible={navVisible} />
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/comments/:articleId" element={<CommentsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/ainews" element={<NewsDetailPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <BottomNav visible={navVisible} />
      </Router>
    </NewsProvider>
  );
};

export default App;
