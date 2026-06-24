'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '../../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../common/AuthModal';
import CartModal from '../common/CartModal';
import SuccessModal from '../common/SuccessModal';
import LogoutModal from '../common/LogoutModal';
import PWAUpdater from '../common/PWAUpdater';
import InstallAppFAB from '../common/InstallAppFAB';
import { useCart } from '../../context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
// Note: PWA Updater and Install Prompt might need specific Next.js implementation
// For now we'll keep them as placeholders or import if migrated

export default function ClientLayout({ children }) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const router = useRouter();

    const [user, setUser] = useState(null);
    const { cartCount } = useCart();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handler = () => {
            if (auth.currentUser) {
                setUser({ ...auth.currentUser });
            }
        };
        const authModalHandler = () => setIsAuthModalOpen(true);

        window.addEventListener('userProfileUpdated', handler);
        window.addEventListener('openAuthModal', authModalHandler);
        
        return () => {
            window.removeEventListener('userProfileUpdated', handler);
            window.removeEventListener('openAuthModal', authModalHandler);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('cachedUserName');
            router.push('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const pathname = usePathname();

    return (
        <>
            <Header 
                user={user} 
                setIsAuthModalOpen={setIsAuthModalOpen} 
                setIsLogoutModalOpen={setIsLogoutModalOpen} 
            />

            <main>{children}</main>

            <Footer />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <CartModal
                isOpen={isCartModalOpen}
                onClose={() => setIsCartModalOpen(false)}
            />

            <SuccessModal />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
            />

            <PWAUpdater />

            {/* Floating Cart Button */}
            <div
                className="fab"
                id="cartBtnFloating"
                onClick={() => setIsCartModalOpen(true)}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <ShoppingCartIcon style={{ width: '32px', height: '32px' }} />
                </div>
                <span id="cart-count" style={{ display: cartCount > 0 ? 'flex' : 'none' }}>
                    {cartCount}
                </span>
            </div>

            <InstallAppFAB />
        </>
    );
}
