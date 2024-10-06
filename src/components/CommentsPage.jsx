import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { formatDistanceToNow } from 'date-fns'; // Import date-fns for time formatting
import { RiSendPlane2Fill } from "react-icons/ri";

const CommentsPage = () => {
  const [comments, setComments] = useState([]); // Provide a default value as an empty array
  const [newComment, setNewComment] = useState('');
  const { articleId } = useParams(); // Use useParams to get the articleId
  const textareaRef = useRef(null);

  useEffect(() => {
    fetch(`https://jsondbnews.vercel.app/posts/${articleId}`)
      .then(response => response.json())
      .then(data => {
        setComments(data.comments || []); // Ensure comments is always an array
      })

  }, [articleId]);

  const handleCommentSubmit = () => {
    const guest = localStorage.getItem('profile') || 'Guest';
    const time = new Date().toISOString();

    fetch(`https://jsondbnews.vercel.app/posts/${articleId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        guest,
        comment: newComment,
        time
      })
    })
      .then(() => {
        // Refetch the updated data
        fetch(`https://jsondbnews.vercel.app/posts/${articleId}`)
          .then(response => response.json())
          .then(data => {
            setComments(data.comments || []); // Ensure comments is always an array
            setNewComment('');
          })

      })

  };

  // Function to generate a random background color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Handle Enter key press in textarea
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  // Function to adjust textarea height
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scrollHeight
    }
  };

  // Adjust textarea height when newComment changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [newComment]);

  return (
    <div className='mt-14'>
      <h2 className='text-lg font-bold p-2'>Comments</h2>
      <div className='max-h-[75vh] overflow-y-auto'> {/* Assign a fixed height and make it scrollable */}
        {comments.length === 0 ? (
          <div className='flex justify-center items-center h-[75vh]'>
            <p className='text-lg text-gray-500'>Be the first person to comment</p>
          </div>
        ) : (
          comments.slice().reverse().map((comment, index) => {
            const bgColor = getRandomColor();
            const timeAgo = formatDistanceToNow(new Date(comment.time), { addSuffix: true });

            return (
              <div className='w-full flex items-start space-x-4 mb-4' key={index}>
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 rounded-full ml-2' style={{ backgroundColor: bgColor }}>
                    <div className='flex items-center justify-center h-full text-white text-lg font-bold'>
                      {comments.length - index} {/* Adjust numbering logic */}
                    </div>
                  </div>
                </div>
                <div className='w-[70%] flex flex-col space-y-1 '>
                <div className=' bg-gray-200  p-2 rounded-lg'>
                  <p className='text-lg font-bold'>{comment.guest}</p>
                  <p className='text-lg'>{comment.comment}</p>
                  </div>
                  <p>{timeAgo}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className='absolute bottom-10 w-full p-2 flex border-t-2'>
        <div className='relative w-full'>
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown} // Add keydown event listener
            placeholder="Add a comment..."
            className='w-full p-2 pr-12 outline-none resize-none overflow-hidden' // Ensure textarea takes full width and has padding for button
            style={{ resize: 'none' }} // Disable manual resizing
          />
          <button
            onClick={handleCommentSubmit}
            className='absolute  right-2 bottom-8 text-xl text-blue-800 px-2 rounded'
          >
            <RiSendPlane2Fill />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
