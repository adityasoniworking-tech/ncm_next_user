'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot, updateDoc, setDoc, increment } from 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // cartItems will be an array of objects: { id, name, price, qty, image? }
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const localData = localStorage.getItem('user_cart');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                if (Array.isArray(parsed)) {
                    setCartItems(parsed);
                }
            } catch (e) {
                console.error("Cart parsing error", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const [storeSettings, setStoreSettings] = useState({
        showHomeDelivery: true,
        showPickup: true
    });

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('user_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoaded]);

    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'storeConfig');
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setStoreSettings(docSnap.data());
            }
        });
        return () => unsubscribe();
    }, []);

    // Adds a full item object or updates its quantity
    const addToCart = (item, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, qty: i.qty + quantity } : i
                );
            }
            return [...prev, { ...item, qty: quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, change) => {
        setCartItems(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    const newQty = item.qty + change;
                    if (newQty <= 0) return null; // We filter out nulls below
                    return { ...item, qty: newQty };
                }
                return item;
            }).filter(Boolean); // removes null items
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Success modal state
    const [successData, setSuccessData] = useState(null);

    const openSuccess = (data) => setSuccessData(data);
    const closeSuccess = () => setSuccessData(null);

    // Place order: requires authenticated user
    // orderMeta: { name, phone, deliveryType, address, structuredAddress, mapLocation }
    const placeOrder = async (orderMeta = {}) => {
        const user = auth.currentUser;
        if (!user) {
            // Caller should handle presenting login UI
            const err = new Error('AUTH_REQUIRED');
            err.code = 'AUTH_REQUIRED';
            throw err;
        }

        if (cartItems.length === 0) {
            const err = new Error('CART_EMPTY');
            err.code = 'CART_EMPTY';
            throw err;
        }

        if (!orderMeta.name || !orderMeta.phone) {
            const err = new Error('DETAILS_MISSING');
            err.code = 'DETAILS_MISSING';
            throw err;
        }

        const items = cartItems.map(i => ({ name: i.name, price: i.price, qty: i.qty, id: i.id }));
        const subtotal = cartItems.reduce((s, it) => s + (it.price * it.qty), 0);
        
        const discountAmount = orderMeta.discountAmount || 0;
        const finalTotal = subtotal + (orderMeta.deliveryCharge || 0) - discountAmount;

        const orderDoc = {
            userId: user.uid,
            userEmail: user.email || null,
            userName: orderMeta.name || null,
            phone: orderMeta.phone || null,
            deliveryType: orderMeta.deliveryType || 'Home Delivery',
            address: orderMeta.address || null,
            structuredAddress: orderMeta.structuredAddress || {},
            mapLocation: orderMeta.mapLocation || null,
            items,
            subtotal,
            deliveryCharge: orderMeta.deliveryCharge || 0,
            discountAmount: discountAmount,
            totalAmount: finalTotal,
            status: 'Pending',
            paymentMethod: orderMeta.paymentMethod || 'COD',
            source: 'app',
            timestamp: serverTimestamp()
        };

        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, orderDoc);

        // Update user profile with order count so they appear in Admin
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                totalOrders: increment(1)
            }, { merge: true });
        } catch (err) {
            console.error("Error updating user details:", err);
        }

        if (orderMeta.rewardId) {
            try {
                await updateDoc(doc(db, 'rewards', orderMeta.rewardId), {
                    status: 'used',
                    usedAt: serverTimestamp(),
                    orderId: docRef.id
                });
                await updateDoc(doc(db, 'users', user.uid), {
                    rewardEligibility: false,
                    loyaltyStatus: 'Active',
                    currentCycleOrders: 0
                });
            } catch (err) {
                console.error("Error marking reward as used:", err);
            }
        }

        // clear cart on success
        clearCart();

        const result = { id: docRef.id };
        openSuccess(result);
        return result;
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.qty, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            placeOrder,
            successData,
            openSuccess,
            closeSuccess,
            storeSettings
        }}>
            {children}
        </CartContext.Provider>
    );
};
