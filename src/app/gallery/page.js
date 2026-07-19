'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import './Gallery.css';

export default function GalleryPage() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedImage, setSelectedImage] = useState(null);
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'gallery'), (snapshot) => {
            const imgData = [];
            snapshot.forEach((doc) => {
                imgData.push({ id: doc.id, ...doc.data() });
            });
            // Reverse so newest uploads show first
            setImages(imgData.reverse());
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Extract unique categories dynamically based on uploaded images
    const categories = useMemo(() => {
        const cats = new Set(images.map(img => img.category));
        return ['All', ...Array.from(cats)].sort();
    }, [images]);

    const filteredImages = useMemo(() => {
        if (activeCategory === 'All') return images;
        return images.filter(img => img.category === activeCategory);
    }, [images, activeCategory]);

    // Reset visible count when category changes
    useEffect(() => {
        setVisibleCount(12);
    }, [activeCategory]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    const openModal = (img) => setSelectedImage(img);
    const closeModal = () => setSelectedImage(null);

    return (
        <div className="gallery-page">
            <div className="gallery-hero">
                <h1 className="gallery-title">Our Masterpieces</h1>
                <p className="gallery-subtitle">A visual treat of our freshly baked creations. From elegant wedding cakes to decadent brownies, explore what we've baked with love.</p>
                
                {images.length > 4 && (
                    <div className="gallery-slider">
                        <div className="slider-track">
                            {/* Original Set */}
                            {images.slice(0, 15).map((img, idx) => (
                                <div key={`slide-a-${img.id || idx}`} className="slider-item" onClick={() => openModal(img)}>
                                    <img src={img.url} alt={img.title || "Gallery Image"} loading="lazy" />
                                </div>
                            ))}
                            {/* Duplicated Set for infinite loop effect */}
                            {images.slice(0, 15).map((img, idx) => (
                                <div key={`slide-b-${img.id || idx}`} className="slider-item" onClick={() => openModal(img)}>
                                    <img src={img.url} alt={img.title || "Gallery Image"} loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="gallery-container">
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#888' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '15px' }}></i>
                        <p>Loading gallery...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className="empty-gallery">
                        <i className="fa-regular fa-images"></i>
                        <h3>Gallery is empty</h3>
                        <p>We are updating our gallery. Check back soon for sweet updates!</p>
                    </div>
                ) : (
                    <>
                        <div className="gallery-filters">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="masonry-grid">
                            {filteredImages.slice(0, visibleCount).map((img, index) => (
                                <div 
                                    key={img.id} 
                                    className="masonry-item" 
                                    onClick={() => openModal(img)}
                                    style={{ animationDelay: `${index % 12 * 0.05}s` }}
                                >
                                    <img src={img.url} alt={img.title} loading="lazy" />
                                    <div className="masonry-overlay">
                                        <span className="overlay-category">{img.category}</span>
                                        <h3 className="overlay-title">{img.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {visibleCount < filteredImages.length && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', width: '100%' }}>
                                <button 
                                    onClick={handleLoadMore}
                                    className="filter-btn"
                                    style={{ padding: '15px 40px', fontSize: '1.05rem', backgroundColor: '#fff', border: '2px solid var(--primary)', color: 'var(--primary)' }}
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedImage && (
                <div className="image-modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={closeModal}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <img src={selectedImage.url} alt={selectedImage.title} className="modal-img" />
                        <div className="modal-caption">
                            <h3 className="modal-title">{selectedImage.title}</h3>
                            <span className="modal-category">{selectedImage.category}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
