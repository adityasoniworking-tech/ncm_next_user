'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Header = ({ user, setIsAuthModalOpen, setIsLogoutModalOpen }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loyaltyData, setLoyaltyData] = useState({ currentCycleOrders: 0, rewardEligibility: false, ordersRequired: 10 });
    const dropdownRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (user) {
            const fetchLoyalty = async () => {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const settingsRef = doc(db, 'settings', 'loyalty');
                    
                    const [docSnap, settingsSnap] = await Promise.all([
                        getDoc(docRef),
                        getDoc(settingsRef)
                    ]);
                    
                    let ordersRequired = 10;
                    if (settingsSnap.exists()) {
                        ordersRequired = settingsSnap.data().ordersRequired || 10;
                    }

                    if (docSnap.exists()) {
                        setLoyaltyData({
                            currentCycleOrders: docSnap.data().currentCycleOrders || 0,
                            rewardEligibility: docSnap.data().rewardEligibility || false,
                            ordersRequired: ordersRequired
                        });
                    } else {
                        setLoyaltyData(prev => ({ ...prev, ordersRequired }));
                    }
                } catch (error) {
                    console.error("Error fetching loyalty in header:", error);
                }
            };
            fetchLoyalty();
        }
    }, [user]);

    const NavLink = ({ to, children, onClick }) => {
        const isActive = pathname === to;
        return (
            <Link 
                href={to} 
                onClick={onClick}
                className={isActive ? 'active' : ''}
            >
                {children}
            </Link>
        );
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const styles = {
        dropdown: {
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'white',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            padding: '10px',
            minWidth: '200px',
            marginTop: '10px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            border: '1px solid #eee',
            animation: 'fadeInUp 0.3s ease-out'
        }
    };

    return (
        <header className="main-header" id="main-header">
            <Link href="/" className="logo">
                <img src="/assets/images/logo.png" alt="Logo" style={{ height: '35px', width: 'auto' }} />
                <span className="hide-on-mobile">nuttychocomorsels</span>
            </Link>

            <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="navLinks">
                <div className="nav-capsule">
                    <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</NavLink>
                    <NavLink to="/menu" onClick={() => setIsMobileMenuOpen(false)}>Menu</NavLink>
                    <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink>
                    {!user && (
                        <button
                            onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                            className="contact-btn hide-on-desktop"
                            style={{ marginTop: '10px' }}
                        >
                            Login
                        </button>
                    )}
                </div>
            </nav>

            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div id="auth-section" style={{ display: 'flex', alignItems: 'center' }}>
                    {user ? (
                        <div className="avatar-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
                            <div
                                className="user-avatar"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                title="Account Menu"
                                style={{
                                    cursor: 'pointer',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '2px solid var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isDropdownOpen ? 'var(--primary)' : '#fff0f0',
                                    transition: '0.3s'
                                }}
                            >
                                <span style={{ color: isDropdownOpen ? 'white' : 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                                </span>
                            </div>

                            {isDropdownOpen && (
                                <div className="profile-dropdown" style={styles.dropdown}>
                                    <div className="dropdown-item" onClick={() => { router.push('/profile'); setIsDropdownOpen(false); }}>
                                        <i className="fa-solid fa-user-circle"></i> Personal Profile
                                    </div>
                                    <div className="dropdown-item" onClick={() => { router.push('/orders'); setIsDropdownOpen(false); }}>
                                        <i className="fa-solid fa-box"></i> My Orders
                                    </div>
                                    <div className="dropdown-item" onClick={() => { router.push('/voucher'); setIsDropdownOpen(false); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px', background: '#fcf8f8', borderRadius: '8px', marginBottom: '5px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b0f1a', fontWeight: 'bold' }}>
                                            <i className="fa-solid fa-ticket"></i> My Voucher
                                        </div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>
                                            {loyaltyData.rewardEligibility ? (
                                                <span style={{ color: '#2e7d32', fontWeight: 'bold' }}><i className="fa-solid fa-gift"></i> Reward Available!</span>
                                            ) : (
                                                <span style={{ color: '#555' }}>Score: {loyaltyData.currentCycleOrders} / {loyaltyData.ordersRequired}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="dropdown-item logout" onClick={() => { setIsLogoutModalOpen(true); setIsDropdownOpen(false); }} style={{ color: '#dc3545' }}>
                                        <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="contact-btn hide-on-mobile"
                        >
                            Login
                        </button>
                    )}
                </div>

                <div
                    className="mobile-toggle"
                    id="menuBtn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <i className="fa-solid fa-bars"></i>
                </div>
            </div>
        </header>
    );
};

export default Header;
