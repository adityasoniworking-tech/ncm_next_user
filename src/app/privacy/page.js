import React from 'react';

export const metadata = {
  title: 'Privacy Policy & Terms | NuttyChocoMorsels',
  description: 'Privacy Policy, COD Policy, and Terms for NuttyChocoMorsels',
};

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-primary, Arial, sans-serif)', color: '#333' }}>
      <h1 style={{ color: '#6b0f1a', marginBottom: '10px', fontSize: '2.5rem', fontFamily: "'Playfair Display', serif" }}>Privacy Policy & Terms</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <section style={{ marginBottom: '35px', background: '#fcfcfc', padding: '25px', borderRadius: '15px', border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h2 style={{ color: '#6b0f1a', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Privacy Policy</h2>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>We collect only the information necessary to process and deliver your orders.</li>
          <li>Your personal information is kept secure and confidential.</li>
          <li>We do not sell, rent, or share your personal information except for order fulfillment or when required by law.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '35px', background: '#fff9f9', padding: '25px', borderRadius: '15px', border: '1px solid #ffdcdc', boxShadow: '0 4px 6px rgba(107,15,26,0.03)' }}>
        <h2 style={{ color: '#6b0f1a', marginBottom: '15px', borderBottom: '2px solid #ffdcdc', paddingBottom: '10px' }}>Cash on Delivery (COD) Policy</h2>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Once a COD order is confirmed, it cannot be cancelled.</li>
          <li>Cancellation of a confirmed COD order will incur a 50% cancellation charge.</li>
          <li>Repeated cancellations may result in COD being unavailable for future orders.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '35px', background: '#fcfcfc', padding: '25px', borderRadius: '15px', border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h2 style={{ color: '#6b0f1a', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Corporate & Bulk Orders</h2>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>We accept corporate gifting and bulk orders.</li>
          <li>To confirm a bulk order, an advance payment of 60% of the total order value is required.</li>
          <li>The remaining 40% must be paid before or at the time of delivery.</li>
          <li>Advance payments for confirmed bulk orders are non-refundable once production has begun.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '35px', background: '#fcfcfc', padding: '25px', borderRadius: '15px', border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h2 style={{ color: '#6b0f1a', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Orders & Refunds</h2>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>All products are freshly prepared and made to order.</li>
          <li>Customized orders are non-cancellable and non-refundable.</li>
          <li>Due to the perishable nature of our products, returns are not accepted.</li>
          <li>Any issue with your order must be reported within 2 hours of delivery with photos.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '35px', background: '#fcfcfc', padding: '25px', borderRadius: '15px', border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h2 style={{ color: '#6b0f1a', marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Product Information</h2>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>All products are 100% Eggless.</li>
        </ul>
      </section>
    </div>
  );
}
