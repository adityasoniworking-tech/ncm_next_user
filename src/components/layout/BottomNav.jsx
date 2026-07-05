'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import {
    HomeIcon,
    InformationCircleIcon,
    Squares2X2Icon,
    ShoppingCartIcon,
    EnvelopeIcon,
    UserIcon
} from '@heroicons/react/24/outline';
const BottomNav = ({ user, setIsAuthModalOpen, setIsCartModalOpen }) => {
    const pathname = usePathname();
    const { cartCount } = useCart();

    const navItems = [
        { name: 'Home', path: '/', icon: HomeIcon },
        { name: 'About', path: '/about', icon: InformationCircleIcon },
        { name: 'Menu', path: '/menu', icon: Squares2X2Icon }, 
        { name: 'Cart', action: () => setIsCartModalOpen(true), icon: ShoppingCartIcon, badge: cartCount },
        { name: 'Contact', path: '/contact', icon: EnvelopeIcon },
        { name: user ? 'Profile' : 'Login', path: user ? '/profile' : null, action: user ? null : () => setIsAuthModalOpen(true), icon: UserIcon },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item, idx) => {
                const Icon = item.icon;
                return item.path ? (
                    <Link href={item.path} key={idx} className={`bottom-nav-item ${pathname === item.path ? 'active' : ''}`}>
                        <div className="icon-wrapper">
                            <Icon style={{ width: '24px', height: '24px' }} />
                            {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
                        </div>
                        <span>{item.name}</span>
                    </Link>
                ) : (
                    <div key={idx} className="bottom-nav-item" onClick={item.action}>
                        <div className="icon-wrapper">
                            <Icon style={{ width: '24px', height: '24px' }} />
                            {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
                        </div>
                        <span>{item.name}</span>
                    </div>
                );
            })}
        </nav>
    );
};

export default BottomNav;
