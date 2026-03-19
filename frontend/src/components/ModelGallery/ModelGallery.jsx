import React, { useState } from 'react';
import "./ModelGallery.css"

const ModelGallery = () => {
  const imageContext = require.context('../../../../backend/saved faces', true, /\.(jpg)$/);
  const images = imageContext.keys().map(imageContext);

  const productsPerRow = 5;
  const productsPerPage = 100;

  const productData = images.slice(0,).map((image, index) => ({
    id: index + 1,
    name: `Image ${index + 1}`,
    image,
  }));


  const numRows = Math.ceil(productsPerPage / productsPerRow);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, productData.length);

  const currentProducts = productData.slice(startIndex, endIndex);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  return (
    <div style={{marginTop : "5pc"}}>
      <h1 className="text-center text-3xl font-bold " style={{ marginBottom: "-3pc" }}>Model Gallery</h1>
      <section
        id="Projects" style={{ marginTop: "5.5pc" }}
        className="upper w-fit mx-auto grid grid-cols-4 gap-y-8 gap-x-4 justify-items-center justify-center mb-5">
        {currentProducts.map((product) => (
          <div key={product.id} className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
            <a href="#">
              <img src={product.image} alt={product.name} className="h-80 w-72 object-cover rounded-t-xl" />
              <div className="px-4 py-3 w-72">
                <p className="text-lg font-bold text-black truncate block capitalize">{product.name}</p>
              </div>
            </a>
          </div>
        ))}
      </section>
      <div className="flex justify-center" style={{ marginTop: "15pc" }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50">
          Previous
        </button>
        <span className="mx-2">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={endIndex >= productData.length}
          className="mx-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
};

export default ModelGallery;
