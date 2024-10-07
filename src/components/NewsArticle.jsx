import React from 'react';
import { FaShare } from "react-icons/fa";
import html2canvas from 'html2canvas';
import ShareTemplate from '../utils/ShareTemplate';
import { createRoot } from 'react-dom/client'; // Import createRoot
import ReactGA from "react-ga4"

const NewsArticle = React.memo(({ article, fallbackImage, formatDate, truncateDescription, handleShare, language }) => {
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
  ];

  const isValidImageUrl = article.image_url && !invalidImages.includes(article.image_url);

  const trimEnglishText = (text) => {
    const englishTextRegex = /^[A-Za-z0-9\s.,!?:'-|-]+/;
    const match = text.match(englishTextRegex);
    if (match) {
      return text.slice(match[0].length).trim();
    }
    return text;
  };

  const trimmedTitle = language === 'telugu' ? trimEnglishText(article.title) : article.title;
  const trimmedDescription = language === 'telugu' ? trimEnglishText(article.description) : article.description;

  const scrollType = localStorage.getItem('scrollType') || 'non-sticky';

  const sourceIconUrl = article.source_icon && article.source_icon.includes('https://www.andhrajyothy.com/')
    ? 'https://www.andhrajyothy.com/assets/images/defaultImg.jpeg'
    : article.source_icon || "https://www.andhrajyothy.com/assets/images/defaultImg.jpeg";

  const handleShareClick = async () => {
    const container = document.createElement('div');
    container.style.width = '300px'; // Set a fixed width for the container
    container.style.height = 'auto'; // Set height to auto to fit content
    container.style.position = 'relative';
    container.style.display = 'none'; // Initially hide the container

    ReactGA.event({
        category: 'Share Button',
        action: 'Click on "Share" button',
        label: 'Button'
    });

    // Use createRoot to render the ShareTemplate component
    const root = createRoot(container);
    root.render(<ShareTemplate article={article} fallbackImage={fallbackImage} truncateDescription={truncateDescription} language={language} />);

    // Append the container to the body to ensure it's in the DOM
    document.body.appendChild(container);

    // Ensure the element is fully rendered before capturing
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 500ms

    // Make the container visible before capturing
    container.style.display = 'block';

    try {
        const canvas = await html2canvas(container, {
            useCORS: true,
            allowTaint: false,
        });
        const image = canvas.toDataURL('image/jpeg');

        const blob = await (await fetch(image)).blob();
        const file = new File([blob], `article-${article.article_id}.jpg`, { type: 'image/jpeg' });

        const dataToSend = {
            title: article.title,
            description: truncateDescription(article.description),
            imageUrl: image // Send the image data URL
        };

      
        if (navigator.share) {
            await navigator.share({
                title: article.title,
                text: truncateDescription(article.description),
                files: [file],
            });
            window.ReactNativeWebView.postMessage(JSON.stringify(dataToSend));
        } else {
            window.ReactNativeWebView.postMessage(JSON.stringify(dataToSend));
        }
    } catch (error) {
        console.error('Error sharing:', error);
    } finally {
        // Clean up the container
        root.unmount();
        container.remove();
    }
};


  return (
    <div
      key={article.article_id}
      id={`article-${article.article_id}`}
      className="mb-4 py-2 px-2 rounded-lg flex flex-col relative mx-2 bg-white"
      style={{
        userSelect: 'none',
        // scrollSnapAlign: scrollType === 'sticky' ? 'start' : 'none'
      }}
    >
        <div className='flex p-2 place-items-center w-full mb-1'>
            <img src={sourceIconUrl} className='w-8 h-8 rounded-full border-2 border-black' />
            <div className='flex justify-between px-2 w-full place-items-center'>
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="left-1 px-1 text-sm font-bold text-black">{article.source_name}</a>
            {/* <p className="text-xs text-gray-600">{formatDate(article.pubDate)}</p> */}
            </div>
        </div>
      <div className="relative" style={{ paddingBottom: '56.25%' }}>
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={isValidImageUrl ? article.image_url : fallbackImage}
          alt={article.title}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
      </div>
      <div className='px-2'>
        <h2 className="text-xl text-black font-semibold mt-2 leading-8" style={{ userSelect: 'none' }}>{trimmedTitle}</h2>
        <p className="text-lg text-gray-800 mt-1 overflow-hidden leading-8" style={{ userSelect: 'none' }}>{truncateDescription(trimmedDescription)}</p>
      </div>
      <div className='flex justify-between p-2'>
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="left-1 py-2 text-red-500 animate-pulse"   onClick={() => {

ReactGA.event({

    category: 'Read Morw',

    action: 'Click on "Read More" button',

    label: 'Button'

});

}}>Read More</a>
        <button
          onClick={handleShareClick}
          className="mt-1 right-4 p-2 text-blue-700 text-lg"
        >
          <FaShare />
        </button>
      </div>
    </div>
  );
});

export default NewsArticle;
