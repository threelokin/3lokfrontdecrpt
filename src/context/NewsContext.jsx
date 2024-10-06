import React, { createContext, useState } from 'react';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <NewsContext.Provider value={{ news, setNews, nextPage, setNextPage, scrollPosition, setScrollPosition }}>
      {children}
    </NewsContext.Provider>
  );
};
