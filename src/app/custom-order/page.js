'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function CustomOrderPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        occasion: 'Birthday',
        flavor: 'Chocolate',
        servings: '',
        neededBy: '',
        details: ''
    });

    const [pageConfig, setPageConfig] = useState({
        eyebrowTitle: 'Custom Orders',
        mainTitle: "Dream it. We'll bake it.",
        subtitle: "Share the vibe, the flavors, the occasion — anything on your mind. We'll get back within a few hours.",
        heroImage: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        formTitle: 'Tell us about your cake',
        formSubtitle: "We'll reply on WhatsApp — fastest way to get you sorted.",
        feature1: 'Any flavor',
        feature2: 'Any theme',
        feature3: 'Any occasion',
        feature4: '48-hr notice',
        occasionsList: 'Birthday, Anniversary, Wedding, Baby shower, Corporate, Just because',
        flavorsList: 'Chocolate, Pistachio-Kunafa, Salted caramel, Red velvet, Nutella, Biscoff, Blueberry',
        whatsappNumber: '919999999999'
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'pageConfigs', 'customOrder'), (docSnap) => {
            if (docSnap.exists()) {
                setPageConfig((prev) => ({ ...prev, ...docSnap.data() }));
            }
        });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Construct WhatsApp message
        const messageText = `*New Custom Cake Order*

*Name:* ${formData.name}
*Phone:* +91 ${formData.phone}
*Occasion:* ${formData.occasion}
*Flavor:* ${formData.flavor}
*Servings:* ${formData.servings}
*Needed By:* ${formData.neededBy}

*Details:* ${formData.details}`;
            
        const phoneNumber = pageConfig.whatsappNumber || '919999999999'; 
        window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(messageText)}`, '_blank');
    };

    return (
        <div className="custom-order-container" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
            <div style={{ textAlign: 'center', marginBottom: '15px', padding: '0 5%' }}>
                <span style={{ display: 'inline-block', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>{pageConfig.eyebrowTitle}</span>
                <h1 className="main-title" style={{ fontSize: '2rem', marginTop: '0', marginBottom: '12px' }}>{pageConfig.mainTitle}</h1>
                <p className="sub-text" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {pageConfig.subtitle}
                </p>
            </div>

            <div className="hero-section-premium" style={{ alignItems: 'flex-start', minHeight: 'auto', paddingTop: '5px', paddingBottom: '5px', gap: '30px' }}>
                <div className="hero-content-left" style={{ justifyContent: 'center' }}>
                    <div className="hero-image-wrapper" style={{ transform: 'none', marginBottom: '10px', borderRadius: '15px' }}>
                        <img 
                            src={pageConfig.heroImage} 
                            alt="Beautiful custom cake" 
                            className="hero-featured-image"
                            style={{ width: '100%', height: '280px', objectFit: 'cover' }}
                        />
                    </div>
                    
                    <div className="features-grid-premium">
                        <div style={{ textAlign: 'center', background: 'white', padding: '10px 5px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '3px' }}><i className="fa-solid fa-cake-candles"></i></div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#555' }}>{pageConfig.feature1}</span>
                        </div>
                        <div style={{ textAlign: 'center', background: 'white', padding: '10px 5px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '3px' }}><i className="fa-solid fa-palette"></i></div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#555' }}>{pageConfig.feature2}</span>
                        </div>
                        <div style={{ textAlign: 'center', background: 'white', padding: '10px 5px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '3px' }}><i className="fa-solid fa-champagne-glasses"></i></div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#555' }}>{pageConfig.feature3}</span>
                        </div>
                        <div style={{ textAlign: 'center', background: 'white', padding: '10px 5px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '3px' }}><i className="fa-regular fa-calendar"></i></div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#555' }}>{pageConfig.feature4}</span>
                        </div>
                    </div>
                </div>
                
                <div className="hero-visual-right" style={{ justifyContent: 'center' }}>
                    <div className="contact-form-premium" style={{ width: '100%', padding: '20px', borderRadius: '15px' }}>
                        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.6rem', marginBottom: '2px', color: '#6b0f1a' }}>{pageConfig.formTitle}</h2>
                        <p className="sub-text" style={{ fontSize: '0.85rem', marginBottom: '15px' }}>{pageConfig.formSubtitle}</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid-premium">
                                <div className="form-group-premium" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Your Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Aarohi" required style={{ padding: '10px', borderRadius: '8px' }} />
                                </div>
                                <div className="form-group-premium" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Phone</label>
                                    <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', border: '1px solid #cccccc' }}>
                                        <span style={{ padding: '10px 12px', background: '#fdfdfd', borderRight: '1px solid #cccccc', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', color: '#555', fontWeight: 'bold', fontSize: '0.9rem' }}>+91</span>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" required style={{ padding: '10px', borderRadius: '0 8px 8px 0', border: 'none', width: '100%', outline: 'none', background: 'transparent' }} />
                                    </div>
                                </div>
                                
                                <div className="form-group-premium" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Occasion</label>
                                    <select name="occasion" value={formData.occasion} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cccccc', fontSize: '0.95rem', background: '#fdfdfd' }}>
                                        {pageConfig.occasionsList.split(',').map(o => o.trim()).filter(Boolean).map(o => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group-premium" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Flavor</label>
                                    <select name="flavor" value={formData.flavor} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cccccc', fontSize: '0.95rem', background: '#fdfdfd' }}>
                                        {pageConfig.flavorsList.split(',').map(f => f.trim()).filter(Boolean).map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group-premium" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Servings</label>
                                    <input type="number" name="servings" value={formData.servings} onChange={handleChange} placeholder="6" required style={{ padding: '10px', borderRadius: '8px' }} />
                                </div>
                                <div className="form-group-premium" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Needed By</label>
                                    <input type="date" name="neededBy" value={formData.neededBy} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px' }} />
                                </div>
                                
                                <div className="form-group-premium" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Anything Else?</label>
                                    <textarea name="details" value={formData.details} onChange={handleChange} placeholder="Colors, message on cake, dietary notes..." style={{ minHeight: '50px', padding: '10px', borderRadius: '8px' }}></textarea>
                                </div>
                            </div>
                            
                            <button type="submit" className="submit-btn-premium" style={{ padding: '12px', marginTop: '12px', borderRadius: '8px', fontSize: '1rem' }}>
                                <i className="fa-brands fa-whatsapp"></i> Send request via WhatsApp
                            </button>
                            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#888', marginTop: '8px' }}>
                                <i className="fa-regular fa-clock"></i> We usually reply within a couple of hours.
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
