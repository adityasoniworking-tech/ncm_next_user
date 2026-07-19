'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import {
    InformationCircleIcon,
    Bars3Icon,
    EnvelopeIcon,
    PhotoIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

const BottomNav = ({ user, setIsAuthModalOpen, setIsCartModalOpen }) => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Menu', path: '/menu', icon: Bars3Icon },
        { name: 'Gallery', path: '/gallery', icon: PhotoIcon },
        { name: 'Custom Order', path: '/custom-order', icon: SparklesIcon },
        { name: 'About', path: '/about', icon: InformationCircleIcon },
        { name: 'Contact', path: '/contact', icon: EnvelopeIcon },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                    <Link href={item.path} key={idx} className={`bottom-nav-item ${pathname === item.path ? 'active' : ''}`}>
                        <div className="icon-wrapper">
                            <Icon style={{ width: '24px', height: '24px' }} />
                        </div>
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNav;
