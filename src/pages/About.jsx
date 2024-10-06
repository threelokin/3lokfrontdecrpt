import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen my-14">
      <div className=" mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">About 3Lok News</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              3Lok News App is dedicated to providing the latest and most accurate news from Telangana, Andhra Pradesh, and beyond. Our mission is to keep you informed with the most relevant and timely news, leveraging the power of AI to deliver personalized and insightful content.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>AI-powered news recommendations</li>
              <li>Real-time updates from trusted sources</li>
              <li>Personalized news feed based on your interests</li>
              <li>Multi-language support (English and Telugu)</li>
              <li>User-friendly interface with easy navigation</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-700">
              We envision a future where everyone has access to reliable and personalized news, empowering them to make informed decisions. By integrating AI, we aim to revolutionize the way news is consumed, making it more relevant and engaging for our users.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions or feedback, please feel free to reach out to us at <a href="mailto:threelok.in@gmail.com" className="text-blue-600 hover:underline">threelok.in@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
