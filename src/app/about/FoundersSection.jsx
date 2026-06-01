'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const founders = [
    {
        id: 'shrikant',
        name: 'Mr. Shrikant Limbachiya',
        role: 'Co-Founder & Head Chef',
        desc: 'Shrikant leads our culinary innovation, bringing years of expertise to every recipe. He ensures that every product leaving our kitchen meets the "luxury" standard we promise.',
        img: '/assets/images/shrikant.jpg'
    },
    {
        id: 'mihir',
        name: 'Mr. Mihirkumar Patel',
        role: 'Co-Founder & Business Head',
        desc: 'Mihirkumar is the driving force behind our operations and strategy. His vision is to make NCM the most loved bakery destination in the region through exceptional service.',
        img: '/assets/images/mihir.jpg'
    }
];

export default function FoundersSection() {
    const [selectedFounder, setSelectedFounder] = useState(null);

    return (
        <section className="about-section">
            <h2 className="section-title">Meet the Visionaries</h2>
            <div className="founders-grid">
                {founders.map((founder) => (
                    <div 
                        key={founder.id} 
                        className="founder-card" 
                        onClick={() => setSelectedFounder(founder)}
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        title="Click to view details"
                    >
                        <div className="founder-img-wrapper" style={{ margin: 0, transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <img src={founder.img} alt={founder.name} className="founder-img" />
                        </div>
                        <h3 className="founder-name" style={{ marginTop: '20px', marginBottom: 0, fontSize: '1.1rem', textAlign: 'center' }}>{founder.name}</h3>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedFounder && (
                    <div 
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(54, 4, 10, 0.4)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}
                        onClick={() => setSelectedFounder(null)}
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '40px', borderRadius: '24px', maxWidth: '400px', width: '90%', textAlign: 'center', position: 'relative', boxShadow: '0 25px 50px -12px rgba(107, 15, 26, 0.35)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setSelectedFounder(null)}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.05)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', transition: '0.2s' }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <div className="founder-img-wrapper" style={{ margin: '0 auto 20px', width: '120px', height: '120px' }}>
                                <img src={selectedFounder.img} alt={selectedFounder.name} className="founder-img" />
                            </div>
                            <h3 className="founder-name" style={{ margin: '0 0 5px 0' }}>{selectedFounder.name}</h3>
                            <p className="founder-role" style={{ margin: '0 0 20px 0' }}>{selectedFounder.role}</p>
                            <p className="founder-desc" style={{ margin: 0 }}>{selectedFounder.desc}</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
