import React from 'react';
import ProfileContent from './ProfileContent';

export const metadata = {
    title: "My Profile | NuttyChocoMorsels",
    description: "Manage your account, shipping details, and order history.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProfilePage() {
    return <ProfileContent />;
}
