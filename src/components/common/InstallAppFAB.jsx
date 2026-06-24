'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function InstallAppFAB() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isStandaloneApp, setIsStandaloneApp] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        // Check if running as installed PWA
        const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        setIsStandaloneApp(checkStandalone);

        if (checkStandalone) return; // Don't run anything else if already installed
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Define the timing sequence
        const runSequence = () => {
            // Show for 10 seconds
            setIsVisible(true);
            
            timerRef.current = setTimeout(() => {
                // Hide after 10 seconds
                setIsVisible(false);
                
                // Wait 1 minute (60,000 ms), then repeat
                timerRef.current = setTimeout(() => {
                    runSequence();
                }, 60000);
            }, 10000);
        };

        // Start sequence on initial load
        runSequence();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            alert('To install the app, look for the install icon in your address bar or browser menu.');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false); // Hide permanently if they installed
        }
    };

    if (isStandaloneApp || !isVisible) return null;

    return (
        <>
            <style>
                {`
                    .install-fab {
                        position: fixed;
                        left: 25px;
                        bottom: 25px;
                        z-index: 9999;
                        background: linear-gradient(135deg, #c5a059 0%, #a68545 100%);
                        color: #fff;
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 6px 20px rgba(197, 160, 89, 0.4);
                        cursor: pointer;
                        border: 2px solid rgba(255, 255, 255, 0.15);
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        animation: pulse-fab-subtle 2.5s infinite;
                    }
                    .install-fab:hover {
                        transform: translateY(-4px) scale(1.08);
                        box-shadow: 0 10px 30px rgba(197, 160, 89, 0.6);
                        background: linear-gradient(135deg, #d8b46e 0%, #b89856 100%);
                        animation: none; /* Stop pulse on hover */
                    }
                    .install-fab svg {
                        width: 26px;
                        height: 26px;
                        transition: transform 0.3s ease;
                    }
                    .install-fab:hover svg {
                        transform: translateY(2px);
                    }
                    @keyframes pulse-fab-subtle {
                        0% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0.5); }
                        70% { box-shadow: 0 0 0 15px rgba(197, 160, 89, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0); }
                    }
                    @media (max-width: 768px) {
                        .install-fab {
                            width: 50px;
                            height: 50px;
                            left: 15px;
                            bottom: 15px;
                        }
                        .install-fab svg {
                            width: 22px;
                            height: 22px;
                        }
                    }
                `}
            </style>
            <div
                className="install-fab"
                onClick={handleInstallClick}
                title="Install App"
            >
                <ArrowDownTrayIcon />
            </div>
        </>
    );
}
