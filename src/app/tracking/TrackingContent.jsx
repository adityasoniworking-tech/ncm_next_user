'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function TrackingContent() {
    const [inputId, setInputId] = useState('');
    const [trackedOrder, setTrackedOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const unsubRef = useRef(null);

    useEffect(() => {
        return () => {
            if (unsubRef.current) unsubRef.current();
        };
    }, []);

    const handleTrack = () => {
        if (!inputId.trim()) {
            setError('Please enter Order ID');
            return;
        }

        setError('');
        setLoading(true);

        if (unsubRef.current) unsubRef.current(); // cleanup previous listener

        unsubRef.current = onSnapshot(doc(db, 'orders', inputId.trim()), (docSnap) => {
            setLoading(false);
            if (docSnap.exists()) {
                setTrackedOrder({ id: docSnap.id, ...docSnap.data() });
            } else {
                setTrackedOrder(null);
                setError('Order ID not found. Please check and try again.');
            }
        }, (err) => {
            console.error("Tracking Error:", err);
            setLoading(false);
            setError("Error fetching order details.");
        });
    };

    // Auto-trigger track from URL params
    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl && idFromUrl !== inputId) {
            setInputId(idFromUrl);
            setLoading(true);
            setError('');
            if (unsubRef.current) unsubRef.current();
            unsubRef.current = onSnapshot(doc(db, 'orders', idFromUrl.trim()), (docSnap) => {
                setLoading(false);
                if (docSnap.exists()) {
                    setTrackedOrder({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setTrackedOrder(null);
                    setError('Order ID not found. Please check and try again.');
                }
            }, (err) => {
                console.error("Tracking Error:", err);
                setLoading(false);
                setError("Error fetching order details.");
            });
        }
    }, [searchParams]);

    // Calculate scooter position based on status
    const getProgress = (status) => {
        if (!status) return { width: '0%', left: '-15px', steps: 1 };
        const s = status.toLowerCase();

        if (s === "pending") {
            return { width: '0%', left: '-15px', steps: 1 };
        } else if (s === "accepted" || s === "confirmed") {
            return { width: '33.33%', left: 'calc(33.33% - 15px)', steps: 2 };
        } else if (s === "ready" || s === "ready for pickup" || s === "out for delivery") {
            return { width: '66.66%', left: 'calc(66.66% - 15px)', steps: 3 };
        } else if (s === "delivered" || s === "picked up") {
            return { width: '100%', left: 'calc(100% - 20px)', steps: 4 };
        }

        return { width: '0%', left: '-15px', steps: 1 }; // default
    };

    const progress = trackedOrder ? getProgress(trackedOrder.status) : { width: '0%', left: '-15px', steps: 0 };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'No date';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return 'No time';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="tracking-wrapper">
            <motion.div
                className="tracking-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="section-title">Track Your Order</h1>
                <div className="track-input-group">
                    <input
                        type="text"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                        placeholder="Enter Order ID..."
                    />
                    <button className="track-btn" onClick={handleTrack} disabled={loading}>
                        {loading ? 'Tracking...' : 'Track Now'}
                    </button>
                </div>

                {error && <p style={{ color: '#d9534f', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}

                {trackedOrder && (
                    <motion.div
                        id="trackingResult"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '20px', borderLeft: '5px solid #6b0f1a' }}>
                            <p style={{ margin: '5px 0' }}><strong>Order ID:</strong> <span>{trackedOrder.id}</span></p>
                            <p style={{ margin: '5px 0' }}><strong>Date:</strong> <span>{formatDate(trackedOrder.timestamp)}</span></p>
                            <p style={{ margin: '5px 0' }}><strong>Time:</strong> <span>{formatTime(trackedOrder.timestamp)}</span></p>
                            <p style={{ margin: '5px 0' }}><strong>Status:</strong> <span>{trackedOrder.status}</span></p>
                        </div>

                        <div className="scooter-track-container">
                            <div className="track-bg-line"></div>
                            <div id="activeProgressLine" style={{ width: progress.width }}></div>

                            <div id="scooterIcon" style={{ left: progress.left }}>
                                <i className="fa-solid fa-motorcycle"></i>
                            </div>

                            <div className="track-steps-labels">
                                <div className={`track-step ${progress.steps >= 1 ? 'step-active' : ''}`} id="step-1">
                                    <div className="dot"></div>
                                    <p className="step-label">Placed</p>
                                </div>
                                <div className={`track-step ${progress.steps >= 2 ? 'step-active' : ''}`} id="step-2">
                                    <div className="dot"></div>
                                    <p className="step-label">Confirmed</p>
                                </div>
                                <div className={`track-step ${progress.steps >= 3 ? 'step-active' : ''}`} id="step-3">
                                    <div className="dot"></div>
                                    <p className="step-label">Ready</p>
                                </div>
                                <div className={`track-step ${progress.steps >= 4 ? 'step-active' : ''}`} id="step-4">
                                    <div className="dot"></div>
                                    <p className="step-label">Delivered</p>
                                </div>
                            </div>
                        </div>

                        {/* View Bill Button */}
                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <button
                                onClick={() => {
                                    router.push(`/bill?id=${trackedOrder.id}`);
                                }}
                                style={{
                                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 25px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: '0.3s',
                                    boxShadow: '0 4px 10px rgba(40,167,69,0.3)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <i className="fa-solid fa-file-invoice" /> View Bill
                            </button>
                        </div>

                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
