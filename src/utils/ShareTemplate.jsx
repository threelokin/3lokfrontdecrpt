import React from 'react';

const ShareTemplate = ({ article, fallbackImage, truncateDescription, language }) => {
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
  const logo = '/logo.png';


  const trimEnglishText = (text) => {
    const englishTextRegex = /^[A-Za-z0-9\s.,!?:-|]+/;
    const match = text.match(englishTextRegex);
    if (match) {
      return text.slice(match[0].length).trim();
    }
    return text;
  };

  const trimmedTitle = language === 'telugu' ? trimEnglishText(article.title) : article.title;
  const trimmedDescription = language === 'telugu' ? trimEnglishText(article.description) : article.description;

  return (
    <div className="share-template ">
        <div className='flex justify-between'>
          <img src={logo} alt="3Lok News" className='h-10' />

          </div>
      <div className="share-image ">
        <img
          src={isValidImageUrl ? article.image_url : fallbackImage}
          alt={article.title}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
      </div>
      <div className="share-content px-2 pb-4">
        <h2 className="share-title text-lg text-black font-semibold  leading-8">{trimmedTitle}</h2>
        <p className="share-description">{truncateDescription(trimmedDescription)}</p>
      </div>
      <h1 className='font-bold text-xs/[12px] border-t-2 pb-4 w-full text-center'>Download 3lok News App On Playstore</h1>
    </div>
  );
};

export default ShareTemplate;
