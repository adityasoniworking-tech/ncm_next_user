'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function VoucherContent() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({});
    const [ordersRequired, setOrdersRequired] = useState(10);
    const [pendingRewards, setPendingRewards] = useState([]);

    useEffect(() => {
        let unsubUser = () => {};
        let unsubRewards = () => {};
        let unsubSettings = () => {};

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(true);

                const { onSnapshot } = await import('firebase/firestore');

                // Settings listener
                const settingsRef = doc(db, 'settings', 'loyalty');
                unsubSettings = onSnapshot(settingsRef, (snap) => {
                    if (snap.exists()) {
                        setOrdersRequired(snap.data().ordersRequired || 10);
                    }
                });

                // User Profile listener
                const userRef = doc(db, 'users', currentUser.uid);
                unsubUser = onSnapshot(userRef, (snap) => {
                    if (snap.exists()) {
                        setProfileData(snap.data());
                    }
                    setLoading(false);
                });

                // Pending Rewards listener
                const rewardsRef = collection(db, 'rewards');
                const q = query(rewardsRef, where('userId', '==', currentUser.uid), where('status', '==', 'pending'));
                unsubRewards = onSnapshot(q, (snapshot) => {
                    const rewards = [];
                    snapshot.forEach((d) => rewards.push({ id: d.id, ...d.data() }));
                    setPendingRewards(rewards);
                });

            } else {
                setUser(null);
                setLoading(false);
                router.push('/');
            }
        });

        return () => {
            unsubscribeAuth();
            unsubUser();
            unsubRewards();
            unsubSettings();
        };
    }, [router]);

    if (!user && !loading) return null;

    return (
        <div className="voucher-page-container" style={styles.container}>
            <div style={styles.content}>
                <header style={styles.header}>
                    <h1 style={{ margin: 0, color: '#6b0f1a' }}>My Vouchers</h1>
                    <p style={{ color: '#555', marginTop: '10px' }}>Track your loyalty score and available rewards.</p>
                </header>

                {loading || !user ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', flexDirection: 'column' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#6b0f1a' }}></i>
                        <p style={{ marginTop: '15px', color: '#666' }}>Loading your voucher details...</p>
                    </div>
                ) : (
                    <>
                        <div className="voucher-card" style={styles.voucherCard}>
                            <h2 style={{ margin: '0 0 20px 0', color: '#6b0f1a', fontSize: '1.4rem' }}>
                                <i className="fa-solid fa-crown" style={{ marginRight: '10px' }}></i>
                                Loyalty Status
                            </h2>
                    
                    <div style={{ textAlign: 'center', padding: '20px', background: '#fdfdfd', borderRadius: '15px', border: '1px solid #eee' }}>
                        <p style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#444' }}>
                            Orders to next reward: <b>{Math.max(0, ordersRequired - (profileData.currentCycleOrders || 0))}</b>
                        </p>
                        <div style={{ background: '#e0e0e0', height: '12px', borderRadius: '6px', overflow: 'hidden', margin: '0 auto', maxWidth: '400px' }}>
                            <div style={{ 
                                width: `${((profileData.currentCycleOrders || 0) / ordersRequired) * 100}%`, 
                                height: '100%', 
                                background: 'var(--primary)',
                                transition: 'width 0.5s ease-in-out'
                            }}></div>
                        </div>
                        <p style={{ margin: '15px 0 0 0', fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>
                            {profileData.currentCycleOrders || 0} / {ordersRequired} Orders Completed
                        </p>
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: '#888' }}>
                            Complete {ordersRequired} orders to unlock a special loyalty reward.
                        </p>
                    </div>
                </div>

                {pendingRewards.length > 0 && (
                    <div className="voucher-card" style={{ ...styles.voucherCard, marginTop: '30px' }}>
                        <h2 style={{ margin: '0 0 20px 0', color: '#6b0f1a', fontSize: '1.4rem' }}>
                            <i className="fa-solid fa-gift" style={{ marginRight: '10px' }}></i>
                            Your Rewards
                        </h2>
                        {pendingRewards.map((reward) => (
                            <div key={reward.id} style={{ display: 'flex', alignItems: 'center', background: '#f0fdf4', border: '1px dashed #4ade80', padding: '15px', borderRadius: '12px', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ fontSize: '2rem', color: '#16a34a', minWidth: '50px', textAlign: 'center' }}>
                                    <i className="fa-solid fa-ticket"></i>
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#166534', fontSize: '1.1rem' }}>
                                        {reward.discountType === 'percentage' ? `${reward.discountAmount}% Discount` : `₹${reward.discountAmount} Off`}
                                    </h3>
                                    <p style={{ margin: 0, color: '#15803d', fontSize: '0.9rem' }}>Congratulations! You've unlocked a discount reward. Apply it during checkout.</p>
                                </div>
                                <div>
                                    <span onClick={() => router.push('/menu')} style={{ background: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(22,163,74,0.3)', display: 'inline-block' }}>Order Now</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="voucher-card" style={{ ...styles.voucherCard, marginTop: '30px', background: '#fffcfc' }}>
                    <h2 style={{ margin: '0 0 20px 0', color: '#6b0f1a', fontSize: '1.2rem' }}>
                        <i className="fa-solid fa-circle-info" style={{ marginRight: '10px' }}></i>
                        How Our Loyalty Program Works
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ textAlign: 'center', padding: '15px', background: 'white', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <div style={{ background: '#fcf8f8', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: '#6b0f1a', fontSize: '1.2rem', fontWeight: 'bold' }}>1</div>
                            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Place an Order</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Every completed order earns you 1 point towards your loyalty goal.</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '15px', background: 'white', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <div style={{ background: '#fcf8f8', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: '#6b0f1a', fontSize: '1.2rem', fontWeight: 'bold' }}>2</div>
                            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Reach {ordersRequired} Orders</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Fill your progress bar by completing {ordersRequired} delicious orders with us.</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '15px', background: 'white', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <div style={{ background: '#fcf8f8', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: '#6b0f1a', fontSize: '1.2rem', fontWeight: 'bold' }}>3</div>
                            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Enjoy Rewards</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Unlock an exclusive free item or discount on your next purchase!</p>
                        </div>
                    </div>
                </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '40px 5%', background: '#fcf8f8', minHeight: '80vh' },
    content: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '30px', textAlign: 'left' },
    voucherCard: { 
        background: 'white', 
        borderRadius: '24px', 
        boxShadow: '0 15px 40px rgba(0,0,0,0.06)', 
        padding: '40px',
        border: '1px solid #f0f0f0' 
    }
};
