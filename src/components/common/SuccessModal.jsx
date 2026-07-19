'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';

const SuccessModal = () => {
    const router = useRouter();
    const { successData, closeSuccess } = useCart();
    if (!successData) return null;

    const orderId = successData.id || '';

    const handleTrack = () => {
        closeSuccess();
        router.push(`/tracking?id=${orderId}`);
    };

    const handleDownloadBill = () => {
        closeSuccess();
        router.push(`/bill?id=${orderId}`);
    };

    return (
        <div id="successModal" className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 99999 }}>
            <div className="success-modal-content" style={{ background: '#1a1a1a', color: 'white', padding: 40, borderRadius: 25, textAlign: 'center', border: '2px solid #c5a059', maxWidth: 380, width: '90%', position: 'relative' }}>
                <div style={{ fontSize: '4rem', marginBottom: 15 }}>🍰</div>
                <h2 className="success-title" style={{ fontFamily: "'Playfair Display', serif", color: '#c5a059', marginBottom: 10 }}>Sweet Success!</h2>
                <p className="success-subtitle" style={{ color: '#ccc', fontSize: '0.95rem', marginBottom: 8, display: 'inline-block' }}>Chef has received your order! 👨‍🍳</p>
                
                <div className="freshness-box" style={{ background: 'rgba(197, 160, 89, 0.1)', borderLeft: '3px solid #c5a059', padding: '10px 15px', borderRadius: '0 8px 8px 0', textAlign: 'left', margin: '15px 0' }}>
                    <p style={{ color: '#e0e0e0', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                        <strong>✨ Freshness Guarantee:</strong> Our chefs bake everything freshly from scratch. Please allow <strong>3-4 hours</strong> for your delicious order to be prepared and delivered.
                    </p>
                </div>

                <div id="displayOrderId" style={{ background: '#2a2a2a', padding: 12, borderRadius: 10, margin: '20px 0', fontFamily: 'monospace', fontSize: '1.05rem', border: '1px dashed #c5a059', color: '#fff', wordBreak: 'break-all' }}>
                    {orderId ? `#${orderId}` : 'Order ID not available'}
                </div>

                <div className="success-buttons" style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                    <button id="trackBtn" onClick={handleTrack} style={{ background: '#c5a059', color: '#1a1a1a', border: 'none', padding: '12px 20px', borderRadius: 50, fontWeight: 'bold', cursor: 'pointer', flex: 1, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        Track Order →
                    </button>
                    <button id="downloadBillBtn" onClick={handleDownloadBill} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 20px', borderRadius: 50, fontWeight: 'bold', cursor: 'pointer', flex: 1, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        📄 Bill
                    </button>
                </div>

                <p id="closeSuccess" onClick={() => closeSuccess()} style={{ marginTop: 20, fontSize: '0.9rem', color: '#999', cursor: 'pointer', textDecoration: 'underline' }}>Close & Continue Shopping</p>
            </div>
        </div>
    );
};

export default SuccessModal;
