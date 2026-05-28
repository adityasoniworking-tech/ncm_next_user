import React, { Suspense } from 'react';
import MenuContent, { MenuSkeleton } from './MenuContent';

export const metadata = {
    title: "Our Menu | Premium Eggless Brownies, Chocolates & Cakes",
    description: "Explore our collection of 100% eggless premium treats. From signature brownies and artisanal chocolates to cheesecakes and viral Dubai-style chocolates. Order online in Gandhinagar.",
};

export default function MenuPage() {
    // Trigger HMR
    return (
        <Suspense fallback={<MenuSkeleton />}>
            <MenuContent />
        </Suspense>
    );
}
