import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import CryptoJS from 'crypto-js';

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, category, languageCode } = location.state || {};
  const [searchResults, setSearchResults] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const initialFetchRef = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  const decryptData = (encryptedData) => {
    const key = CryptoJS.enc.Hex.parse(import.meta.env.VITE_KEY); // Convert the secret key to a buffer
    const iv = CryptoJS.enc.Hex.parse(encryptedData.iv); // Convert the IV to a buffer

    const encrypted = CryptoJS.enc.Hex.parse(encryptedData.encryptedData);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, { iv: iv });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };

  useEffect(() => {
    if ((searchTerm || category) && !initialFetchRef.current) {
      initialFetchRef.current = true;
      fetchResults(searchTerm, category);
    }
  }, [searchTerm, category, languageCode]);

  useEffect(() => {
    if (inView && nextPage && !loading) {
      fetchResults(searchTerm, category, nextPage);
    }
  }, [inView, nextPage, loading, searchTerm, category, languageCode]);

  const fetchResults = async (query, category, page = null) => {
    setLoading(true);
    const baseUrl = ` https://api.3lok.in/search?language=${languageCode}`;
    const url = page
      ? query
        ? `${baseUrl}&q=${encodeURIComponent(query)}&page=${page}`
        : `${baseUrl}&category=${encodeURIComponent(category)}&page=${page}`
      : query
      ? `${baseUrl}&q=${encodeURIComponent(query)}`
      : `${baseUrl}&category=${encodeURIComponent(category)}`;
    const response = await fetch(url);
    const encryptedData = await response.json();
    const data = decryptData(encryptedData);
    if (data.results && data.results.length > 0) {
      setSearchResults(prevResults => [...prevResults, ...data.results]);
      setNextPage(data.nextPage);
    } else {
      setNextPage(null);
    }
    setLoading(false);
  };

  const truncateDescription = (description) => {
    if (!description) return '';
    if (description.length > 380) {
      return description.slice(0, 380) + '...';
    }
    return description;
  };

  const isValidDescription = (description) => {
    return description && description.split(' ').length > 10;
  };

  const fallbackImage = '/alternate.jpg';

  const invalidImages = [
    'https://www.andhrajyothy.com/assets/images/defaultImg.jpeg',
    'https://st1.latestly.com/wp-content/uploads/2018/03/default-img-01-784x441.jpg',
    'https://static.india.com/wp-content/themes/icom/images/default-big.svg',
    'https://st1.latestly.com/wp-content/uploads/2018/03/default-img-01-380x214.jpg',
    'https://st1.latestly.com/wp-content/uploads/2018/03/default-img-02-380x214.jpg',
    'https://img.theweek.in/content/dam/week/wire-updates/the-week-pti-wire-updates.jpg',
    'https://media.andhrajyothy.com/media/2024/20240727/Breaking_News_62adeb0dfa_v_jpg.webp',
    'https://www.thehindu.com/theme/images/th-online/1x1_spacer.png',
    'https://static.toiimg.com/thumb/msid-47529300,imgsize-110164,width-400,height-225,resizemode-72/47529300.jpg',
    'https://images.hindustantimes.com/default/1600x900.jpg'
    // Add other known invalid URLs here if needed
  ];

  return (
    <div className="p-2">
      {searchTerm && <h2 className="text-lg font-semibold mt-14">Showing results for search: {searchTerm}</h2>}
      {category && <h2 className="text-lg font-semibold">Showing results for category: {category}</h2>}
      {loading && <div className="text-center p-4">Loading...</div>}
      <div className="">
        {searchResults.length > 0 ? (
          searchResults.map((article, index) => {
            const isValidImageUrl = article.image_url && !invalidImages.includes(article.image_url);
            if (!isValidDescription(article.description)) return null;

            return (
              <div key={article.article_id} className="mb-4 shadow-2xl py-8 px-4 rounded-lg">
                <img
                  src={isValidImageUrl ? article.image_url : fallbackImage}
                  alt={article.title}
                  className="w-full h-52 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = fallbackImage; // Use fallback image when original fails
                  }}
                />
                <h2 className="text-lg font-semibold mt-4">{article.title}</h2>
                <p className="text-m text-gray-600 mt-2 mb-4 overflow-hidden leading-8">{truncateDescription(article.description)}</p>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="absolute right-6 text-blue-500">Read more</a>
                {index === searchResults.length - 1 && <div ref={ref}></div>}
              </div>
            );
          })
        ) : (
          <div className="text-center p-4 mt-10"><p></p></div>
        )}
      </div>
      {nextPage ? (
        <div className="text-center mt-8">
          {loading ? 'Loading...' : 'Scroll down to load more'}
        </div>
      ) : (
        !loading && initialFetchRef.current && (
          <div className="text-center ">
            {searchTerm && <h2 className="text-lg font-semibold">No More News found on: {searchTerm}</h2>}
            {category && <h2 className="text-lg font-semibold">No More News found on: {category}</h2>}
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-700 text-white px-4 py-2 mb-16 rounded mt-4"
            >
              Go Back
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default SearchResults;
