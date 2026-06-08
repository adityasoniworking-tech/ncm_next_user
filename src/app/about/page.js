import React from 'react';
import Link from 'next/link';
import FoundersSection from './FoundersSection';
import { SparklesIcon, CheckBadgeIcon, LightBulbIcon, HeartIcon } from '@heroicons/react/24/solid';

export const metadata = {
    title: "Our Story & Mission | NuttyChocoMorsels",
    description: "Learn about nuttychocomorsels - our mission to bring luxury bakery delights to Gandhinagar. Meet our founders Shrikant and Mihir.",
};

export default function About() {
    return (
        <div className="page-container" style={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>Our Story</h1>
                    <p>Crafting luxury delights in the heart of Gandhinagar since inception.</p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about-section about-text">
                <h2>Our Mission</h2>
                <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
                    Founded with a passion for excellence, <strong>nuttychocomorsels</strong> was born from a simple dream: to make premium, luxury bakery delights accessible to all. We believe every bite should be a celebration—a harmonious blend of the finest ingredients, meticulous craftsmanship, and pure passion.
                </p>
                <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    We are on a journey to redefine indulgence, offering everything from our signature melt-in-the-mouth brownies to the latest viral sensations like Dubai-style chocolates. Our commitment is to quality, innovation, and spreading happiness through sweetness.
                </p>
            </section>

            {/* Core Values */}
            <section className="about-section">
                <h2 className="section-title">Why Choose Us?</h2>
                <div className="values-grid">
                    <div className="value-item">
                        <SparklesIcon style={{ width: '40px', height: '40px', color: '#c5a059', marginBottom: '15px' }} />
                        <h3>Luxury Quality</h3>
                        <p>We use only premium ingredients to ensure a world-class taste in every bite.</p>
                    </div>
                    <div className="value-item">
                        <CheckBadgeIcon style={{ width: '40px', height: '40px', color: '#c5a059', marginBottom: '15px' }} />
                        <h3>Always Fresh</h3>
                        <p>Our products are baked fresh daily, ensuring the highest standards of freshness.</p>
                    </div>
                    <div className="value-item">
                        <LightBulbIcon style={{ width: '40px', height: '40px', color: '#c5a059', marginBottom: '15px' }} />
                        <h3>Innovation</h3>
                        <p>From classic recipes to viral trends, we constantly innovate our menu.</p>
                    </div>
                    <div className="value-item">
                        <HeartIcon style={{ width: '40px', height: '40px', color: '#c5a059', marginBottom: '15px' }} />
                        <h3>Handcrafted</h3>
                        <p>Every delight is handcrafted with love and attention to detail.</p>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <FoundersSection />

            {/* CTA Section */}
            <section className="cta-section">
                <h2>Ready to Indulge?</h2>
                <p>Explore our menu and find your next favorite delight.</p>
                <Link href="/menu" className="cta-btn">View Full Menu</Link>
            </section>
        </div>
    );
}
