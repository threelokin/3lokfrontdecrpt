import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client'; // Import createRoot
import ShareTemplate from './ShareTemplate';

export const truncateDescription = (description) => {
  if (!description) return '';
  if (description.length > 380) {
    return description.slice(0, 380) + '...';
  }
  return description;
};

export const isValidDescription = (description) => {
  return description && description.split(' ').length > 10;
};

export const fallbackImage = '/alternate.jpg';

export const formatDate = (pubDate) => {
  const date = new Date(pubDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export const handleShare = async (article, fallbackImage) => {
  const container = document.createElement('div');
  container.style.width = '300px'; // Set a fixed width for the container
  container.style.height = 'auto'; // Set height to auto to fit content
  container.style.position = 'relative';

  // Use createRoot to render the ShareTemplate component
  const root = createRoot(container);
  root.render(<ShareTemplate article={article} fallbackImage={fallbackImage} />);

  // Ensure the element is fully rendered before capturing
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const canvas = await html2canvas(container, {
      useCORS: true,
      allowTaint: false,
    });
    const image = canvas.toDataURL('image/jpeg');

    const blob = await (await fetch(image)).blob();
    const file = new File([blob], `article-${article.article_id}.jpg`, { type: 'image/jpeg' });

    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: truncateDescription(article.description),
        files: [file],
      });
    } else {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        title: article.title,
        description: truncateDescription(article.description),
        imageUrl: article.imageUrl
      }));
    }
  } catch (error) {
  
  } finally {
    // Clean up the container
    root.unmount();
    container.remove();
  }
};
