import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const NewsDetailPage = () => {
  const [newsDetail, setNewsDetail] = useState({ title: '', image: '', content: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const url = searchParams.get('url');

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch('https://streamback.vercel.app/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: `https://www.andhrajyothy.com${url}` }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i];
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data) {
                const parsedData = JSON.parse(data);
                setNewsDetail((prevDetail) => {
                  const newDetail = {
                    ...prevDetail,
                    title: parsedData.title || prevDetail.title,
                    image: parsedData.image || prevDetail.image,
                    content: parsedData.content ? prevDetail.content + parsedData.content : prevDetail.content,
                  };

                  // Check if title and image are loaded
                  if (newDetail.title && newDetail.image) {
                    setLoading(false);
                  }

                  return newDetail;
                });
              }
            }
          }

          buffer = lines[lines.length - 1];
        }
      } catch (err) {

        setError(err);
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center ">
          <div className="text-xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold">Sorry This page is not available right now.</h1>
          <h1 className="text-xl font-bold">Our AI is under development</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 my-14">
      <h1 className="text-3xl font-bold mb-4">{newsDetail.title}</h1>
      <img src={newsDetail.image} alt={newsDetail.title} className="w-full h-64 object-cover mb-4 rounded-lg" />
      <div className="prose leading-10">
        <ReactMarkdown>{newsDetail.content}</ReactMarkdown>
        <h2 className='w-full text-center text-gray-500'>Our AI is under Beta Mode So It Can Make Mistakes.</h2>
      </div>
    </div>
  );
};

export default NewsDetailPage;
