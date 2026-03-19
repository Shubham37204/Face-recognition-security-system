// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const Testimonial = () => {
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   const fetchReviews = async () => {
//     try {
//       const response = await fetch('http://127.0.0.1:5000/fetch_reviews');
//       if (!response.ok) {
//         throw new Error('Failed to fetch reviews');
//       }
//       const data = await response.json();
//       setReviews(data);
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//     }
//   };

//   const renderStarRating = (rating) => {
//     const stars = [];
//     for (let i = 0; i < rating; i++) {
//       stars.push(
//         <svg key={i} className="text-yellow-500 w-4 h-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor">
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//         </svg>
//       );
//     }
//     return stars;
//   };

//   return (
//     <div className="bg-gradient-to-b from-gray-100 to-gray-200">
//       <section className="px-4 py-12 md:py-24">
//         <Link to="/ReviewForm">
//           <button style={{ marginBottom: "-4pc", marginLeft: "8pc" }}
//             className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none" type="button">
//             Add
//           </button>
//         </Link>
//         <div className="max-w-screen-xl mx-auto">
//           <h2 className="font-black text-black text-center text-3xl leading-none uppercase max-w-2xl mx-auto mb-12">What Listeners Are Saying</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//             {reviews.map((review, index) => (
//               <div key={index} className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
//                 <div className="flex flex-col mb-4">
//                   <div className="flex justify-between items-center">
//                     <p><strong></strong> {review.name}</p>
//                     <div className="text-sm">
//                       <p><strong></strong> {renderStarRating(review.rating)}</p>
//                     </div>
//                   </div>
//                   <p className="mt-2 text-gray-600"><strong></strong> {review.email}</p>
//                 </div>
//                 <p className="text-lg font-light text-gray-800" style={{
//                   display: "flex", marginTop: "4pc", justifyContent: "center"
//                 }}>{review.review}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Testimonial;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Testimonial = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/fetch_reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <svg key={i} className="text-yellow-500 w-4 h-4 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200">
      <section className="px-4 py-12 md:py-24">
        <Link to="/ReviewForm">
          <button style={{ marginBottom: "-4pc", marginLeft: "8pc" }}
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none" type="button">
            Add
          </button>
        </Link>
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-black text-black text-center text-3xl leading-none uppercase max-w-2xl mx-auto mb-12">What Listeners Are Saying</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
                  <div className="flex flex-col mb-4">
                    <div className="flex justify-between items-center">
                      <p><strong></strong> {review.name}</p>
                      <div className="text-sm">
                        <p><strong></strong> {renderStarRating(review.rating)}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600"><strong></strong> {review.email}</p>
                  </div>
                  <p className="text-lg font-light text-gray-800" style={{
                    display: "flex", marginTop: "4pc", justifyContent: "center"
                  }}>{review.review}</p>
                </div>
              ))
            ) : (
              <p> No reviews available</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Testimonial;