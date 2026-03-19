import React, { useState, useEffect } from 'react';
import Search from "./Search/Search";
import "./ModelGallery.css";

const MatchFace = () => {
    const [products, setProducts] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (selectedFolder) {
            const filtered = products.filter(product => product.folder === selectedFolder);
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [selectedFolder, products]);

    const handleFolderSelect = (folder, searchResult) => {
        setSelectedFolder(folder);
        setProducts(searchResult);
    };

    return (
        <div>
            <div className="grid grid-cols-6 gap-4">
                <div className="col-start-2 col-span-4" style={{
                    "marginTop": "6pc", "display": "flex",
                    "justify-content": " center"
                }}><Search onFolderSelect={handleFolderSelect} /></div>
            </div>
        </div>
    );
};

export default MatchFace;
