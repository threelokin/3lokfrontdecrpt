// import React, { useEffect, useState, useRef, useContext } from 'react';
// import { useLocation } from 'react-router-dom';
// import { NewsContext } from '../context/NewsContext';
// import Skeleton from './Skeleton';
// import NewsArticle from './NewsArticle';
// import { truncateDescription, isValidDescription, fallbackImage, formatDate, handleShare } from '../utils/utils';
// import throttle from 'lodash/throttle';
// import { unstable_batchedUpdates } from 'react-dom';
// import CryptoJS from 'crypto-js';

// const NewsList = ({ language, onScroll = () => {} }) => {
//   const { news, setNews, nextPage, setNextPage, scrollPosition, setScrollPosition } = useContext(NewsContext);
//   const [loading, setLoading] = useState(false);
//   const [usePrimaryApi, setUsePrimaryApi] = useState(true);
//   const containerRef = useRef(null);
//   const location = useLocation();

//   useEffect(() => {
//     // Restore scroll position on home page
//     if (location.pathname === '/' && containerRef.current) {
//       containerRef.current.scrollTop = scrollPosition;
//     }
//   }, [location.pathname, scrollPosition]);

//   const decryptData = (encryptedData) => {
//     const key = CryptoJS.enc.Hex.parse(import.meta.env.VITE_KEY); // Convert the secret key to a buffer
//     const iv = CryptoJS.enc.Hex.parse(encryptedData.iv); // Convert the IV to a buffer

//     const encrypted = CryptoJS.enc.Hex.parse(encryptedData.encryptedData);
//     const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, { iv: iv });

//     return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
//   };

//   useEffect(() => {
//     const fetchNews = async () => {
//       const baseUrl = usePrimaryApi
//         ? ' https://api.3lok.in/telugu/news'
//         : ' https://api.3lok.in/telugutwo/news';
//       const url = language === 'telugu'
//         ? `${baseUrl}`
//         : ' https://api.3lok.in/english/news';

//       try {
//         const nowTime = new Date();
//         const storedTimestamp = localStorage.getItem('nextPageTimestamp');
//         const storedNextPage = localStorage.getItem('nextPage');

//         let timeDifference = 0;
//         if (storedTimestamp) {
//           // Parse timestamp correctly and calculate difference in hours
//           const previousTime = new Date(storedTimestamp);
//           timeDifference = (nowTime - previousTime) / (1000 * 60 * 60); // in hours
//         }

//         // Use stored nextPage if within 2-hour limit
//         if (storedNextPage && timeDifference < 2) {
//           const response = await fetch(`${baseUrl}?page=${storedNextPage}`);
//           if (!response.ok) throw new Error('Failed to fetch data using nextPage');
//           const encryptedData = await response.json();
//           const data = decryptData(encryptedData);

//           unstable_batchedUpdates(() => {
//             setNews(data.results);
//             setNextPage(data.nextPage);
//             localStorage.setItem('nextPage', data.nextPage);
//             localStorage.setItem('nextPageTimestamp', nowTime.toISOString()); // Save as ISO format
//           });
//         } else {
//           // Fetch fresh news
//           const response = await fetch(url);
//           if (!response.ok) throw new Error('Failed to fetch initial data');
//           const encryptedData = await response.json();
//           const data = decryptData(encryptedData);

//           unstable_batchedUpdates(() => {
//             setNews(data.results);
//             setNextPage(data.nextPage);
//             localStorage.setItem('nextPage', data.nextPage);
//             localStorage.setItem('nextPageTimestamp', nowTime.toISOString()); // Save as ISO format
//           });
//         }
//       } catch (error) {
//         if (language === 'telugu') {
//           setUsePrimaryApi(prev => !prev);
//         }
//       }
//     };

//     if (news.length === 0) {
//       fetchNews();
//     }
//   }, [language, news.length, setNews, setNextPage, usePrimaryApi]);

//   const loadMore = async () => {
//     if (!nextPage || loading) return;

//     setLoading(true);
//     const baseUrl = usePrimaryApi
//       ? ` https://api.3lok.in/telugu/news?page=${nextPage}`
//       : ` https://api.3lok.in/telugutwo/news?page=${nextPage}`;
//     const url = language === 'telugu'
//       ? baseUrl
//       : ` https://api.3lok.in/english/news?page=${nextPage}`;

//     try {
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Failed to fetch more data');
//       const encryptedData = await response.json();
//       const data = decryptData(encryptedData);

//       unstable_batchedUpdates(() => {
//         setNews([...news, ...data.results]);
//         setNextPage(data.nextPage);
//         localStorage.setItem('nextPage', data.nextPage);
//         localStorage.setItem('nextPageTimestamp', new Date().toISOString()); // Save ISO
//       });
//     } catch (error) {
//       if (language === 'telugu') {
//         setUsePrimaryApi(prev => !prev);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Prefetch next page when user is about to reach the last few articles
//   const prefetchNextPage = async () => {
//     if (!nextPage || loading) return;

//     setLoading(true);
//     const baseUrl = usePrimaryApi
//       ? ` https://api.3lok.in/telugu/news?page=${nextPage}`
//       : ` https://api.3lok.in/telugutwo/news?page=${nextPage}`;
//     const url = language === 'telugu'
//       ? baseUrl
//       : ` https://api.3lok.in/english/news?page=${nextPage}`;

//     try {
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Failed to prefetch data');
//       const encryptedData = await response.json();
//       const data = decryptData(encryptedData);

//       unstable_batchedUpdates(() => {
//         setNews([...news, ...data.results]);
//         setNextPage(data.nextPage);
//         localStorage.setItem('nextPage', data.nextPage);
//         localStorage.setItem('nextPageTimestamp', new Date().toISOString()); // Save ISO
//       });
//     } catch (error) {
//       if (language === 'telugu') {
//         setUsePrimaryApi(prev => !prev);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Prefetch when user is about to reach the last few articles
//     if (news.length > 0 && news.length % 7 === 0) {
//       prefetchNextPage();
//     }
//   }, [news.length]);

//   // Throttled scroll event handler
//   const handleScroll = throttle(() => {
//     if (containerRef.current) {
//       const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//       unstable_batchedUpdates(() => {
//         setScrollPosition(scrollTop);
//         const buffer = 500;
//         if (scrollTop + clientHeight >= scrollHeight - buffer) {
//           loadMore();
//         }
//         onScroll(scrollTop);
//       });
//     }
//   }, 100);

//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.addEventListener('scroll', handleScroll);
//     }
//     return () => {
//       if (containerRef.current) {
//         containerRef.current.removeEventListener('scroll', handleScroll);
//       }
//     };
//   }, [handleScroll]);

//   return (
//     <div ref={containerRef} className="h-screen overflow-y-scroll pt-16" >
//       {news.length === 0 ? (
//         <Skeleton />
//       ) : (
//         news.map(article => {
//           if (!isValidDescription(article.description)) return null;
//           return (
//             <NewsArticle
//               key={article.article_id}
//               article={article}
//               fallbackImage={fallbackImage}
//               formatDate={formatDate}
//               truncateDescription={truncateDescription}
//               handleShare={handleShare}
//               language={language}
//             />
//           );
//         })
//       )}
//       {loading && <div className="text-center p-4">Loading...</div>}
//     </div>
//   );
// };

// export default NewsList;





import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { NewsContext } from '../context/NewsContext';
import Skeleton from './Skeleton';
import NewsArticle from './NewsArticle';
import { truncateDescription, isValidDescription, fallbackImage, formatDate, handleShare } from '../utils/utils';
import throttle from 'lodash/throttle';
import { unstable_batchedUpdates } from 'react-dom';
import CryptoJS from 'crypto-js';

const NewsList = ({ language, onScroll = () => {} }) => {
  const { news, setNews, nextPage, setNextPage, scrollPosition, setScrollPosition } = useContext(NewsContext);
  const [loading, setLoading] = useState(false);
  const [usePrimaryApi, setUsePrimaryApi] = useState(true);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [loadingArticleId, setLoadingArticleId] = useState(null); // Track loading state for each article
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Restore scroll position on home page
    if (location.pathname === '/' && containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [location.pathname, scrollPosition]);

  const decryptData = (encryptedData) => {
    const key = CryptoJS.enc.Hex.parse(import.meta.env.VITE_KEY); // Convert the secret key to a buffer
    const iv = CryptoJS.enc.Hex.parse(encryptedData.iv); // Convert the IV to a buffer

    const encrypted = CryptoJS.enc.Hex.parse(encryptedData.encryptedData);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, { iv: iv });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };

  useEffect(() => {
    const fetchNews = async () => {
      const baseUrl = usePrimaryApi
        ? ' https://api.3lok.in/telugu/news'
        : ' https://api.3lok.in/telugutwo/news';
      const url = language === 'telugu'
        ? `${baseUrl}`
        : ' https://api.3lok.in/english/news';

      try {
        const nowTime = new Date();
        const storedTimestamp = localStorage.getItem('nextPageTimestamp');
        const storedNextPage = localStorage.getItem('nextPage');

        let timeDifference = 0;
        if (storedTimestamp) {
          // Parse timestamp correctly and calculate difference in hours
          const previousTime = new Date(storedTimestamp);
          timeDifference = (nowTime - previousTime) / (1000 * 60 * 60); // in hours
        }

        // Use stored nextPage if within 2-hour limit
        if (storedNextPage && timeDifference < 2) {
          const response = await fetch(`${baseUrl}?page=${storedNextPage}`);
          if (!response.ok) throw new Error('Failed to fetch data using nextPage');
          const encryptedData = await response.json();
          const data = decryptData(encryptedData);

          unstable_batchedUpdates(() => {
            setNews(data.results);
            setNextPage(data.nextPage);
            localStorage.setItem('nextPage', data.nextPage);
            localStorage.setItem('nextPageTimestamp', nowTime.toISOString()); // Save as ISO format
          });
        } else {
          // Fetch fresh news
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed to fetch initial data');
          const encryptedData = await response.json();
          const data = decryptData(encryptedData);

          unstable_batchedUpdates(() => {
            setNews(data.results);
            setNextPage(data.nextPage);
            localStorage.setItem('nextPage', data.nextPage);
            localStorage.setItem('nextPageTimestamp', nowTime.toISOString()); // Save as ISO format
          });
        }
      } catch (error) {
        if (language === 'telugu') {
          setUsePrimaryApi(prev => !prev);
        }
      }
    };

    if (news.length === 0) {
      fetchNews();
    }
  }, [language, news.length, setNews, setNextPage, usePrimaryApi]);

  const loadMore = async () => {
    if (!nextPage || loading) return;

    setLoading(true);
    const baseUrl = usePrimaryApi
      ? ` https://api.3lok.in/telugu/news?page=${nextPage}`
      : ` https://api.3lok.in/telugutwo/news?page=${nextPage}`;
    const url = language === 'telugu'
      ? baseUrl
      : ` https://api.3lok.in/english/news?page=${nextPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch more data');
      const encryptedData = await response.json();
      const data = decryptData(encryptedData);

      unstable_batchedUpdates(() => {
        setNews([...news, ...data.results]);
        setNextPage(data.nextPage);
        localStorage.setItem('nextPage', data.nextPage);
        localStorage.setItem('nextPageTimestamp', new Date().toISOString()); // Save ISO
      });
    } catch (error) {
      if (language === 'telugu') {
        setUsePrimaryApi(prev => !prev);
      }
    } finally {
      setLoading(false);
    }
  };

  // Prefetch next page when user is about to reach the last few articles
  const prefetchNextPage = async () => {
    if (!nextPage || loading) return;

    setLoading(true);
    const baseUrl = usePrimaryApi
      ? ` https://api.3lok.in/telugu/news?page=${nextPage}`
      : ` https://api.3lok.in/telugutwo/news?page=${nextPage}`;
    const url = language === 'telugu'
      ? baseUrl
      : ` https://api.3lok.in/english/news?page=${nextPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to prefetch data');
      const encryptedData = await response.json();
      const data = decryptData(encryptedData);

      unstable_batchedUpdates(() => {
        setNews([...news, ...data.results]);
        setNextPage(data.nextPage);
        localStorage.setItem('nextPage', data.nextPage);
        localStorage.setItem('nextPageTimestamp', new Date().toISOString()); // Save ISO
      });
    } catch (error) {
      if (language === 'telugu') {
        setUsePrimaryApi(prev => !prev);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prefetch when user is about to reach the last few articles
    if (news.length > 0 && news.length % 7 === 0) {
      prefetchNextPage();
    }
  }, [news.length]);

  // Throttled scroll event handler
  const handleScroll = throttle(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      unstable_batchedUpdates(() => {
        setScrollPosition(scrollTop);
        const buffer = 500;
        if (scrollTop + clientHeight >= scrollHeight - buffer) {
          loadMore();
        }
        onScroll(scrollTop);
      });
    }
  }, 100);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const handleSpeakerClick = useCallback(async (article) => {
    setLoadingArticleId(article.article_id); // Set loading state to true

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset the audio to the beginning
      audioRef.current = null;
    }

    const textToSpeak = `${article.title}. ${article.description}`; // Add a period between title and description

    try {
      let audioBlob;

      if (language === 'telugu') {
        const encodedText = encodeURIComponent(textToSpeak);
        const apiUrl = `https://ttsfornews.vercel.app/tts?text=${encodedText}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch TTS audio');
        audioBlob = await response.blob();
      } else {
        const apiUrl = 'https://ttsenglish.vercel.app/english';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textToSpeak }),
        });
        if (!response.ok) throw new Error('Failed to fetch TTS audio');
        audioBlob = await response.blob();
      }

      const audioUrl = URL.createObjectURL(audioBlob);

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.play();
      setCurrentPlayingId(article.article_id);

      newAudio.onended = () => {
        setCurrentPlayingId(null);
      };

      newAudio.onplaying = () => {
        setLoadingArticleId(null); // Set loading state to false when audio starts playing
      };
    } catch (error) {
      console.error('Error fetching TTS audio:', error);
      setLoadingArticleId(null); // Set loading state to false on error
    }
  }, [language]);


  const handlePauseClick = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset the audio to the beginning
      audioRef.current = null;
      setCurrentPlayingId(null);
    }
  }, []);

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll pt-16" >
      {news.length === 0 ? (
        <Skeleton />
      ) : (
        news.map(article => {
          if (!isValidDescription(article.description)) return null;
          return (
            <NewsArticle
              key={article.article_id}
              article={article}
              fallbackImage={fallbackImage}
              formatDate={formatDate}
              truncateDescription={truncateDescription}
              handleShare={handleShare}
              language={language}
              isPlaying={currentPlayingId === article.article_id}
              isLoading={loadingArticleId === article.article_id} // Pass loading state
              handleSpeakerClick={() => handleSpeakerClick(article)}
              handlePauseClick={handlePauseClick}
            />
          );
        })
      )}
      {loading && <div className="text-center p-4">Loading...</div>}
    </div>
  );
};

export default NewsList;

