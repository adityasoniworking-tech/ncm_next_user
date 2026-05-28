import React from 'react';
import VoucherContent from './VoucherContent';

export const metadata = {
    title: "My Voucher | NuttyChocoMorsels",
    description: "View your loyalty score and available vouchers.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function VoucherPage() {
    return <VoucherContent />;
}
