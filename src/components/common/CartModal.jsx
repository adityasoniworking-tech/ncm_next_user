'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '../../context/CartContext';
import { auth } from '../../services/firebase';
import { SHOP_LOCATION, DELIVERY_CONFIG, calculateDistance } from '../../utils/delivery';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), { 
    ssr: false,
    loading: () => <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>Loading Map...</div>
});

const CartModal = ({ isOpen, onClose }) => {
    const { cartItems, updateQuantity, cartTotal, clearCart, placeOrder, storeSettings } = useCart();
    const [step, setStep] = useState(1);
    const [deliveryType, setDeliveryType] = useState('Home Delivery');

    useEffect(() => {
        if (storeSettings) {
            if (!storeSettings.showHomeDelivery && storeSettings.showPickup) {
                setDeliveryType('Self Pickup');
            } else if (storeSettings.showHomeDelivery && !storeSettings.showPickup) {
                setDeliveryType('Home Delivery');
            }
        }
    }, [storeSettings]);

    const [custName, setCustName] = useState('');
    const [custPhone, setCustPhone] = useState('');

    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [taluka, setTaluka] = useState('');
    const [district, setDistrict] = useState('');
    const [stateName, setStateName] = useState('');
    const [pincode, setPincode] = useState('');
    const [landmark, setLandmark] = useState('');
    const nameRef = useRef(null);

    const [geolocationLoading, setGeolocationLoading] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [showMap, setShowMap] = useState(false);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [deliveryDistance, setDeliveryDistance] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(null); // [lat, lng]
    const [mapLocationText, setMapLocationText] = useState('Select Delivery Location on Map');

    const [addressMode, setAddressMode] = useState('manual');
    const [savedProfile, setSavedProfile] = useState(null);

    const [availableReward, setAvailableReward] = useState(null);
    const [applyReward, setApplyReward] = useState(false);

    // Fetch saved profile details when moving to checkout
    useEffect(() => {
        if (step === 2 && auth.currentUser) {
            const fetchProfile = async () => {
                try {
                    const { doc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('../../services/firebase');
                    
                    const docRef = doc(db, 'users', auth.currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setSavedProfile(data);
                        if (data.shippingName || data.name) setCustName(data.shippingName || data.name);
                        if (data.phone) setCustPhone(data.phone);
                        if (data.street) setStreet(data.street);
                        if (data.city) setCity(data.city);
                        if (data.taluka) setTaluka(data.taluka);
                        if (data.district) setDistrict(data.district);
                        if (data.state) setStateName(data.state);
                        if (data.pincode) setPincode(data.pincode);
                        if (data.landmark) setLandmark(data.landmark);
                        
                        if (data.street || data.city) {
                            setAddressMode('saved');
                        } else {
                            setAddressMode('manual');
                        }
                    }

                    // Fetch pending reward
                    const { collection, query, where, getDocs } = await import('firebase/firestore');
                    const rewardsRef = collection(db, 'rewards');
                    const q = query(rewardsRef, where('userId', '==', auth.currentUser.uid), where('status', '==', 'pending'));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const rewardDoc = querySnapshot.docs[0];
                        setAvailableReward({ id: rewardDoc.id, ...rewardDoc.data() });
                    }
                } catch (error) {
                    console.error("Error fetching saved profile for cart:", error);
                }
            };
            fetchProfile();
        }
    }, [step]);

    // Reset delivery charge when switching to Pickup
    useEffect(() => {
        if (deliveryType === 'Self Pickup') {
            setDeliveryCharge(0);
        } else if (deliveryType === 'Home Delivery' && selectedLocation === null) {
            setDeliveryCharge(0);
        }
    }, [deliveryType, selectedLocation]);

    const rewardDiscount = applyReward && availableReward 
        ? (availableReward.discountType === 'percentage' 
            ? (cartTotal * availableReward.discountAmount / 100) 
            : availableReward.discountAmount) 
        : 0;

    const finalTotal = Math.max(0, cartTotal + deliveryCharge - rewardDiscount);

    const handleLocationConfirm = (data) => {
        setSelectedLocation([data.lat, data.lng]);
        setDeliveryDistance(data.distance);
        setDeliveryCharge(data.deliveryCharge);
        if (data.formattedAddress && data.formattedAddress !== 'Address not found' && data.formattedAddress !== 'Location not available') {
            setMapLocationText(data.formattedAddress);
        } else {
            setMapLocationText('Location Selected');
        }
        setShowMap(false);
    };

    const handleLocateMe = (e) => {
        e.preventDefault();
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setGeolocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const dist = calculateDistance(SHOP_LOCATION[0], SHOP_LOCATION[1], lat, lng);
                let charge = 0;
                if (dist > DELIVERY_CONFIG.minChargeDistance) {
                    const chargeableDistance = dist - DELIVERY_CONFIG.minChargeDistance;
                    const increments = Math.ceil(chargeableDistance / DELIVERY_CONFIG.incrementDistance);
                    charge = increments * DELIVERY_CONFIG.chargePer500m;
                }

                try {
                    const response = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
                    if (!response.ok) throw new Error('Geocoding request failed');
                    const data = await response.json();
                    let formatted = 'Location Selected';
                    if (data.features && data.features.length > 0) {
                        const props = data.features[0].properties;
                        const parts = [
                            props.name,
                            props.street ? (props.street + (props.housenumber ? ' ' + props.housenumber : '')) : null,
                            props.city || props.town || props.village,
                            props.state,
                            props.postcode
                        ].filter(Boolean);
                        formatted = [...new Set(parts)].join(', ');
                    }
                    handleLocationConfirm({ lat, lng, distance: dist, deliveryCharge: charge, formattedAddress: formatted });
                } catch (error) {
                    console.error('Direct locate error:', error);
                    handleLocationConfirm({ lat, lng, distance: dist, deliveryCharge: charge, formattedAddress: 'Address not found' });
                } finally {
                    setGeolocationLoading(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please ensure location services are enabled.');
                setGeolocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    if (!isOpen) return null;

    const EmptyCartState = () => (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px', color: '#eee' }}>🛒</div>
            <h3 style={{ color: '#6b0f1a', marginBottom: '10px' }}>Your Basket is Empty</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>Looks like you haven't added any sweet treats yet.</p>
            <button onClick={onClose} style={{ background: 'white', border: '1px solid #6b0f1a', color: '#6b0f1a', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                Start Shopping
            </button>
        </div>
    );

    const CartItemsList = () => (
        <>
            <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '5px' }}>
                {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '12px', background: '#f9f9f9', borderRadius: '10px', border: '1px solid #eee' }}>
                        <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{item.name}</strong>
                            <small style={{ color: '#666' }}>₹{item.price} x {item.qty}</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 10px' }}>
                            <button onClick={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>-</button>
                            <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>+</button>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#6b0f1a', minWidth: '70px', textAlign: 'right' }}>
                            ₹{(item.price * item.qty).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px', borderTop: '2px solid #f8f9fa', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '1.1rem', color: '#666' }}>Total Amount</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#6b0f1a' }}>₹{cartTotal.toFixed(2)}</span>
                </div>
                <button
                    onClick={() => {
                        if (!auth.currentUser) {
                            alert('Please login first to place an order!');
                            window.dispatchEvent(new Event('openAuthModal'));
                            return;
                        }
                        setStep(2);
                    }}
                    style={{ width: '100%', background: '#6b0f1a', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                >
                    Proceed to Checkout <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </>
    );

    const CheckoutForm = () => (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', padding: 0 }}>
                    <i className="fa-solid fa-arrow-left"></i> Back to Cart
                </button>
            </div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#6b0f1a', margin: '0 0 15px 0' }}>Checkout Details</h3>

            {(storeSettings?.showHomeDelivery ?? true) || (storeSettings?.showPickup ?? true) ? (
                <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #eee', display: 'flex', gap: '10px' }}>
                    {(storeSettings?.showPickup ?? true) && (
                        <label style={{ ...styles.deliveryRadio, background: deliveryType === 'Self Pickup' ? '#fff0f0' : '#fff', borderColor: deliveryType === 'Self Pickup' ? '#6b0f1a' : '#ddd' }}>
                            <input type="radio" value="Self Pickup" checked={deliveryType === 'Self Pickup'} onChange={(e) => setDeliveryType(e.target.value)} style={{ accentColor: '#6b0f1a' }} />
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>🏬 Pickup</span>
                        </label>
                    )}
                    {(storeSettings?.showHomeDelivery ?? true) && (
                        <label style={{ ...styles.deliveryRadio, background: deliveryType === 'Home Delivery' ? '#f0f8ff' : '#fff', borderColor: deliveryType === 'Home Delivery' ? '#007bff' : '#ddd' }}>
                            <input type="radio" value="Home Delivery" checked={deliveryType === 'Home Delivery'} onChange={(e) => setDeliveryType(e.target.value)} style={{ accentColor: '#007bff' }} />
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>🏠 Delivery</span>
                        </label>
                    )}
                </div>
            ) : (
                <div style={{ background: '#fff9f9', color: '#6b0f1a', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ffdcdc', textAlign: 'center', fontWeight: 'bold' }}>
                    Ordering is currently unavailable.
                </div>
            )}

            <input
                ref={nameRef}
                value={custName}
                onChange={e => setCustName(e.target.value)}
                type="text"
                placeholder="Full Name"
                style={styles.input}
            />
            <input
                value={custPhone}
                onChange={e => setCustPhone(e.target.value)}
                type="text"
                placeholder="Phone Number"
                style={styles.input}
            />

            {deliveryType === 'Home Delivery' && (
                <div style={{ background: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
                    
                    {addressMode === 'saved' && savedProfile && (savedProfile.street || savedProfile.city) ? (
                        <div style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>📍 Saved Address</h4>
                                <button onClick={() => setAddressMode('manual')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    + Add New
                                </button>
                            </div>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                {savedProfile.street}, {savedProfile.city}, {savedProfile.taluka}, {savedProfile.district}, {savedProfile.state} - {savedProfile.pincode}
                                {savedProfile.landmark ? `, ${savedProfile.landmark}` : ''}
                            </p>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4 style={{ margin: '0', color: '#495057', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>📍 Delivery Address</h4>
                                {savedProfile && (savedProfile.street || savedProfile.city) && (
                                    <button onClick={() => setAddressMode('saved')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        Use Saved Address
                                    </button>
                                )}
                            </div>
                            <input value={street} onChange={e => setStreet(e.target.value)} type="text" placeholder="House No. / Building / Street Name" style={styles.input} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="City / Area" style={styles.inputGrid} />
                                <input value={taluka} onChange={e => setTaluka(e.target.value)} type="text" placeholder="Taluka" style={styles.inputGrid} />
                                <input value={district} onChange={e => setDistrict(e.target.value)} type="text" placeholder="District" style={styles.inputGrid} />
                                <input value={stateName} onChange={e => setStateName(e.target.value)} type="text" placeholder="State" style={styles.inputGrid} />
                                <input value={pincode} onChange={e => setPincode(e.target.value)} type="text" placeholder="Pincode" maxLength="6" style={styles.inputGrid} />
                                <input value={landmark} onChange={e => setLandmark(e.target.value)} type="text" placeholder="Landmark (Optional)" style={styles.inputGrid} />
                            </div>
                        </div>
                    )}

                    <div style={{ borderTop: '1px dashed #eee', paddingTop: '15px' }}>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            <div style={{ background: '#fff9f9', border: '1px dashed #6b0f1a', padding: '12px', borderRadius: '8px', color: '#6b0f1a', fontSize: '0.9rem', textAlign: 'center' }}>
                                {selectedLocation ? (
                                    <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                        ✓ {mapLocationText} ({deliveryDistance.toFixed(1)} km)
                                    </div>
                                ) : (
                                    mapLocationText
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <button
                                    onClick={handleLocateMe}
                                    disabled={geolocationLoading}
                                    style={{ background: 'white', color: geolocationLoading ? '#666' : '#28a745', border: `1px solid ${geolocationLoading ? '#ccc' : '#28a745'}`, padding: '10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', cursor: geolocationLoading ? 'not-allowed' : 'pointer' }}
                                >
                                    {geolocationLoading ? 'Locating...' : 'Locate Me'}
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); setShowMap(true); }}
                                    style={{ background: 'white', color: '#007bff', border: '1px solid #007bff', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Open Map
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {availableReward && (
                <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#2e7d32', fontSize: '0.9rem' }}><i className="fa-solid fa-gift"></i> Loyalty Reward Available!</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#388e3c' }}>
                            You have a {availableReward.discountType === 'percentage' ? `${availableReward.discountAmount}%` : `₹${availableReward.discountAmount}`} discount reward!
                        </p>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: '#fff', padding: '8px 12px', borderRadius: '20px', border: '1px solid #a5d6a7' }}>
                        <input 
                            type="checkbox" 
                            checked={applyReward} 
                            onChange={(e) => setApplyReward(e.target.checked)}
                            style={{ marginRight: '8px', accentColor: '#2e7d32' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2e7d32' }}>Apply</span>
                    </label>
                </div>
            )}

            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #6b0f1a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: '#666' }}>Subtotal</span>
                    <span style={{ color: '#333', fontWeight: '600' }}>₹{cartTotal.toFixed(2)}</span>
                </div>
                {deliveryType === 'Home Delivery' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ color: '#666' }}>Delivery Charge</span>
                        <span style={{ color: '#6b0f1a', fontWeight: 'bold' }}>₹{deliveryCharge.toFixed(2)}</span>
                    </div>
                )}
                {applyReward && rewardDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ color: '#2e7d32' }}><i className="fa-solid fa-gift"></i> Loyalty Discount</span>
                        <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>-₹{rewardDiscount.toFixed(2)}</span>
                    </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #ddd', marginTop: '10px', paddingTop: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>Final Total</span>
                    <span style={{ color: '#6b0f1a', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', background: '#ffecec', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ffdcdc', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{ marginTop: '4px', marginRight: '10px', accentColor: '#6b0f1a' }}
                />
                <span style={{ fontSize: '0.85rem', color: '#6b0f1a', fontWeight: '600', lineHeight: '1.4' }}>
                    By placing this order, I acknowledge that the order cannot be cancelled after confirmation
                </span>
            </label>

            <button
                onClick={async () => {
                    if (isPlacingOrder) return;
                    
                    if (!custName || !custPhone) {
                        alert('Please enter your name and phone number');
                        return;
                    }

                    const phoneRegex = /^[0-9]{10}$/;
                    if (!phoneRegex.test(custPhone.replace(/\s/g, ''))) {
                        alert('Please enter a valid 10-digit phone number');
                        return;
                    }
                    if (deliveryType === 'Home Delivery') {
                        if (addressMode === 'manual' && (!street || !city || !pincode)) {
                            alert('Please enter your complete delivery address');
                            return;
                        }
                        if (addressMode === 'saved' && (!savedProfile || !savedProfile.street || !savedProfile.city)) {
                            alert('Saved address is incomplete. Please enter manually.');
                            return;
                        }
                        if (!selectedLocation) {
                            alert('Please select your location on the map');
                            return;
                        }
                    }
                    if (!agreedToTerms) {
                        alert('Please acknowledge terms');
                        return;
                    }

                    setIsPlacingOrder(true);
                    try {
                        const orderMeta = {
                            name: custName,
                            phone: custPhone,
                            userEmail: auth.currentUser.email,
                            deliveryType,
                            address: deliveryType === 'Home Delivery' 
                                ? (addressMode === 'saved' 
                                    ? `${savedProfile.street}, ${savedProfile.city}, ${savedProfile.taluka || ''} ${savedProfile.district || ''} ${savedProfile.state || ''} ${savedProfile.pincode || ''}`.trim()
                                    : `${street}, ${city}, ${taluka} ${district} ${stateName} ${pincode}`.trim())
                                : null,
                            structuredAddress: deliveryType === 'Home Delivery'
                                ? (addressMode === 'saved' 
                                    ? { streetName: savedProfile.street, city: savedProfile.city, taluka: savedProfile.taluka, district: savedProfile.district, stateName: savedProfile.state, pincode: savedProfile.pincode, landmark: savedProfile.landmark }
                                    : { streetName: street, city, taluka, district, stateName, pincode, landmark })
                                : null,
                            coordinates: selectedLocation ? { lat: selectedLocation[0], lng: selectedLocation[1] } : null,
                            deliveryCharge: deliveryCharge,
                            distance: deliveryDistance,
                            paymentMethod: 'COD',
                            discountAmount: rewardDiscount,
                            rewardId: applyReward && availableReward ? availableReward.id : null
                        };

                        await placeOrder(orderMeta);
                        
                        // Telegram Notification
                        try {
                            const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
                            const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
                            if (botToken && chatId) {
                                let itemsText = cartItems.map(i => `• ${i.qty}x ${i.name} (₹${(i.price * i.qty).toFixed(2)})`).join('\n');
                                let message = `🚨 *NEW ORDER RECEIVED!* 🚨\n\n`;
                                message += `*Customer:* ${custName}\n`;
                                message += `*Phone:* ${custPhone}\n`;
                                message += `*Type:* ${deliveryType}\n`;
                                if (deliveryType === 'Home Delivery') message += `*Address:* ${orderMeta.address}\n`;
                                message += `\n*Items:*\n${itemsText}\n\n`;
                                message += `*Total Amount:* ₹${finalTotal.toFixed(2)} (COD)`;

                                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ chat_id: chatId.trim(), text: message, parse_mode: 'Markdown' })
                                });
                            }
                        } catch (e) { console.error(e); }

                        setStep(1);
                        onClose();
                    } catch (err) {
                        console.error(err);
                        alert('Failed to place order.');
                    } finally {
                        setIsPlacingOrder(false);
                    }
                }}
                disabled={isPlacingOrder || !agreedToTerms || !custName || !custPhone || (deliveryType === 'Home Delivery' && ((addressMode === 'manual' && !street) || (addressMode === 'saved' && !savedProfile?.street) || !selectedLocation))}
                style={{
                    width: '100%', 
                    background: (isPlacingOrder || !agreedToTerms || !custName || !custPhone || (deliveryType === 'Home Delivery' && ((addressMode === 'manual' && !street) || (addressMode === 'saved' && !savedProfile?.street) || !selectedLocation))) ? '#ccc' : '#6b0f1a',
                    color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem',
                    cursor: (isPlacingOrder || !agreedToTerms || !custName || !custPhone || (deliveryType === 'Home Delivery' && ((addressMode === 'manual' && !street) || (addressMode === 'saved' && !savedProfile?.street) || !selectedLocation))) ? 'not-allowed' : 'pointer'
                }}
            >
                {isPlacingOrder ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</>
                ) : (
                    <>Confirm Order (COD) <i className="fa-solid fa-check-circle"></i></>
                )}
            </button>
        </div>
    );

    return (
        <div style={styles.overlay} onClick={() => { setStep(1); onClose(); }}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 100, padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", margin: 0, fontSize: '1.5rem', color: '#6b0f1a' }}>Your Basket</h2>
                    <button onClick={() => { setStep(1); onClose(); }} style={{ background: 'transparent', border: 'none', fontSize: '24px', color: '#666', cursor: 'pointer', padding: 0 }}>&times;</button>
                </div>
                <div style={{ padding: '20px' }}>
                    {cartItems.length === 0 ? EmptyCartState() : (step === 1 ? CartItemsList() : CheckoutForm())}
                </div>
                {showMap && (
                    <DeliveryMap
                        onConfirm={handleLocationConfirm}
                        onClose={() => setShowMap(false)}
                        initialLocation={selectedLocation}
                    />
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0, 0, 0, 0.7)', zIndex: 2000, justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(3px)'
    },
    modalContent: {
        background: '#fff', borderRadius: '15px', width: '90%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    },
    qtyBtn: { width: '28px', height: '28px', borderRadius: '5px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' },
    deliveryRadio: { flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '10px', borderRadius: '8px', transition: '0.3s' },
    input: { width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', outline: 'none' },
    inputGrid: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }
};

export default CartModal;
