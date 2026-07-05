'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../../context/CartContext';

const BottomNav = ({ user, setIsAuthModalOpen, setIsCartModalOpen }) => {
    const pathname = usePathname();
    const { cartCount } = useCart();

    const navItems = [
        { name: 'Home', path: '/', icon: 'fa-solid fa-house' },
        { name: 'Menu', path: '/menu', icon: 'fa-solid fa-cake-candles' }, 
        { name: 'Cart', action: () => setIsCartModalOpen(true), icon: 'fa-solid fa-cart-shopping', badge: cartCount },
        { name: 'Contact', path: '/contact', icon: 'fa-solid fa-envelope' },
        { name: user ? 'Profile' : 'Login', path: user ? '/profile' : null, action: user ? null : () => setIsAuthModalOpen(true), icon: 'fa-solid fa-user' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item, idx) => (
                item.path ? (
                    <Link href={item.path} key={idx} className={`bottom-nav-item ${pathname === item.path ? 'active' : ''}`}>
                        <div className="icon-wrapper">
                            <i className={item.icon}></i>
                            {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
                        </div>
                        <span>{item.name}</span>
                    </Link>
                ) : (
                    <div key={idx} className="bottom-nav-item" onClick={item.action}>
                        <div className="icon-wrapper">
                            <i className={item.icon}></i>
                            {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
                        </div>
                        <span>{item.name}</span>
                    </div>
                )
            ))}
        </nav>
    );
};

export default BottomNav;
