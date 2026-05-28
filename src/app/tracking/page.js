import React, { Suspense } from 'react';
import TrackingContent from './TrackingContent';

export const metadata = {
    title: "Track Your Order | NuttyChocoMorsels",
    description: "Check the real-time status of your NuttyChocoMorsels order. From baking to delivery, stay updated on your sweet treats.",
};

export default function TrackingPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>}>
            <TrackingContent />
        </Suspense>
    );
}
