import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactGA from "react-ga4"

const categories = [
   "business", "crime",  "entertainment",
  "food", "health", "lifestyle", "politics", "science", "sports",
  "technology",  "world", "other"
];

const categoryImages = {
  'business': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2021/06_jun/23_wed/img_1624461180685_722.jpg?)',
  'crime': 'url(https://st4.depositphotos.com/13533222/27924/v/450/depositphotos_279248912-stock-illustration-criminal-pointing-gun-and-officer.jpg)',
  'entertainment': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2021/06_jun/23_wed/img_1624464945012_439.jpg?)',
  'food': 'url(https://watermark.lovepik.com/background/20211021/large/lovepik-brown-cartoon-food-hand-drawn-texture-background-image_450042220.jpg)',
  'health': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2020/12_dec/26_sat/img_1608994151293_594.jpg?)',
  'lifestyle': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2024/01_jan/2_tue/img_1704204102427_482.jpg?)',
  'politics': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2021/06_jun/23_wed/img_1624464346448_194.jpg?)',
  'science': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2021/06_jun/23_wed/img_1624473418833_711.jpg?)',
  'sports': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2021/06_jun/23_wed/img_1624464513890_381.jpg?)',
  'technology': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2021/06_jun/23_wed/img_1624464616755_571.jpg?)',
  'world': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2021/06_jun/23_wed/img_1624465494460_113.jpg?)',
  'other': 'url(https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2021/06_jun/23_wed/img_1624460796166_669.jpg?)',
};

const languageMap = {
  'telugu': 'te',
  'english': 'en',
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const language = localStorage.getItem('language') || 'english';
  const languageCode = languageMap[language];

  const fetchSuggestions = async (query) => {
    const url = `https://pipedapi.reallyaweso.me/opensearch/suggestions/?query=${query}%20news`;
    const response = await fetch(url);
    const data = await response.json();
    setSuggestions(data[1].slice(0, 5)); // Limit suggestions to top 5
  };


  ReactGA.send({
    hitType: "pageview",
    page: "/search",
    title: "Search",
    });
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length >= 4) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const trimmedQuery = suggestion.replace(/\s*news$/i, ''); // Remove "news" from the end of the suggestion
    setSearchTerm(trimmedQuery);
    navigate('/search-results', { state: { searchTerm: trimmedQuery, languageCode } });
    setSuggestions([]);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setSuggestions([]);
    navigate('/search-results', { state: { category, languageCode, backgroundImage: categoryImages[category] } });

    ReactGA.event({

        category: 'Categories Button ',

        action: 'Click on "Categories" button',

        label: 'Button'

    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const query = searchTerm.trim();
      setSearchTerm(query);
      navigate('/search-results', { state: { searchTerm: query, languageCode } });
      setSuggestions([]);
    }
  };

  return (
    <div className="p-4 my-14">
        <h1 className='text-lg font-semibold mb-2 text-center'>Search Here</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Search News..."
        className="w-full p-2 border border-gray-500 rounded-lg "
      />
      {suggestions.length > 0 && (
        <div className="mt-2 bg-white border border-gray-300 rounded">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2 text-center">Categories</h2>
        <div className="flex flex-wrap justify-center ">
          {categories.map((category, index) => (

            <div
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`relative p-2 m-1 border-2 rounded-md border-gray-400 cursor-pointer shadow-xl flex ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              style={{
                width: '110px',
                height: '130px',
                backgroundImage: categoryImages[category],
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute bottom-0 left-0 w-full ml-1 text-black text-sm text-left font-bold">
                {category}
              </div>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
