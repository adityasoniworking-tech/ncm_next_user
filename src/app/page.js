'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckBadgeIcon, SparklesIcon, TruckIcon, HeartIcon } from "@heroicons/react/24/solid";
import { db } from "../services/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

// Note: metadata cannot be exported from a Client Component in Next.js directly like this. 
// However, since this is a simple port to use client, we will move metadata to a layout if needed, 
// or simply keep it simple and omit it for the client component (Next.js 13+ requires it in layout or a server component).
// To avoid breaking the build, we remove the metadata export here and assume layout.js handles generic metadata.

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'homeCategories'), orderBy('pos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      setCategories(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="home-page-wrapper">
      {/* HERO SECTION */}
      <div className="hero-section-premium">
        <div className="hero-content-left">
          <h1 className="main-title">
            Premium{" "}
            <span style={{ color: "var(--primary)" }}>Bakery Delights</span>
          </h1>
          <p className="sub-text">
            Experience the taste of luxury in Gandhinagar with our 100% eggless
            artisanal treats. Freshly baked with premium ingredients.
          </p>
          <div className="hero-actions">
            <Link href="/menu" className="hero-btn-primary">
              Order Now
            </Link>
            <Link href="/about" className="hero-btn-secondary">
              Our Story
            </Link>
          </div>
        </div>
        <div className="hero-visual-right">
          <div className="hero-image-wrapper">
            <img
              src="https://plus.unsplash.com/premium_photo-1681826507324-0b3c43928753?q=80&w=1169&auto=format&fit=crop"
              alt="Premium bakery products - fresh cookies, brownies, cheesecakes from nuttychocomorsels"
              className="hero-featured-image"
            />
          </div>
        </div>
      </div>

      {/* FEATURES SECTION (Why nuttychocomorsels?) */}
      <section
        className="features-section"
        style={{ padding: "15px 5% 40px", background: "#fff" }}
      >
        <h2 className="responsive-title">Why nuttychocomorsels?</h2>
        <div className="features-grid">
          <div
            className="feature-box"
            style={{
              border: "2px solid #5D2E17",
              boxShadow: "0 4px 10px rgba(139, 69, 19, 0.15)",
              borderRadius: "10px",
              background: "white",
            }}
          >
            <CheckBadgeIcon style={{ width: '40px', height: '40px', color: '#5D2E17', marginBottom: '15px', display: 'inline-block' }} />
            <h3>100% Eggless</h3>
            <p>Pure vegetarian treats baked to perfection.</p>
          </div>
          <div
            className="feature-box"
            style={{
              border: "2px solid #5D2E17",
              boxShadow: "0 4px 10px rgba(139, 69, 19, 0.2)",
              borderRadius: "10px",
              background: "white",
            }}
          >
            <SparklesIcon style={{ width: '40px', height: '40px', color: '#5D2E17', marginBottom: '15px', display: 'inline-block' }} />
            <h3>Premium Quality</h3>
            <p>Made from Premium quality chocolate & handpicked nuts.</p>
          </div>
          <div
            className="feature-box"
            style={{
              border: "2px solid #5D2E17",
              boxShadow: "0 4px 10px rgba(139, 69, 19, 0.2)",
              borderRadius: "10px",
              background: "white",
            }}
          >
            <TruckIcon style={{ width: '40px', height: '40px', color: '#5D2E17', marginBottom: '15px', display: 'inline-block' }} />
            <h3>Freshly Baked</h3>
            <p>Oven-fresh goodness , delivered to your doorstep.</p>
          </div>
          <div
            className="feature-box"
            style={{
              border: "2px solid #5D2E17",
              boxShadow: "0 4px 10px rgba(139, 69, 19, 0.2)",
              borderRadius: "10px",
              background: "white",
            }}
          >
            <HeartIcon style={{ width: '40px', height: '40px', color: '#5D2E17', marginBottom: '15px', display: 'inline-block' }} />
            <h3>Made with Love</h3>
            <p>Crafted by passion, served with sweetness.</p>
          </div>
        </div>
      </section>

      {/* EXPLORE MENU SECTION */}
      <h2 className="section-title" style={{ marginBottom: "10px" }}>
        Explore Our Menu
      </h2>
      <div className="grid" style={{ paddingTop: "10px" }}>
        {loading ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#5D2E17' }}>
             Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#5D2E17' }}>
             No categories available at the moment.
          </div>
        ) : (
          categories.map((cat) => (
            <div className="cat-card" key={cat.docId}>
              <Link href={`/menu?cat=${cat.slug}`} style={{ textDecoration: "none" }}>
                <img
                  src={cat.image}
                  className="cat-img"
                  alt={cat.name}
                />
                <div className="cat-title">{cat.name}</div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* FOOTER PUSH - To ensure spacing before footer layout */}
      <div style={{ paddingBottom: "30px" }}></div>
    </div>
  );
}
