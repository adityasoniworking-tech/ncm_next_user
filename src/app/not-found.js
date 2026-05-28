import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | NuttyChocoMorsels',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-icon">
        <i className="fa-solid fa-cookie-bite"></i>
      </div>
      
      <h1 className="not-found-title">
        404 - Crumb Not Found
      </h1>
      
      <p className="not-found-text">
        Oops! Looks like someone took the last bite. The page you are looking for might have been moved, deleted, or never existed in our bakery.
      </p>
      
      <Link href="/" className="not-found-btn">
        <i className="fa-solid fa-arrow-left"></i> Back to Home
      </Link>
      
      <style>{`
        .not-found-container {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          background-color: #fafafa;
        }
        
        .not-found-icon {
          font-size: 8rem;
          color: var(--primary, #6b0f1a);
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }
        
        .not-found-title {
          font-size: 3.5rem;
          font-family: var(--font-playfair, serif);
          color: #1c1c1c;
          margin-bottom: 20px;
        }
        
        .not-found-text {
          font-size: 1.2rem;
          color: #666;
          max-width: 500px;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        
        .not-found-btn {
          padding: 15px 35px;
          background-color: var(--primary, #6b0f1a);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: bold;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(107, 15, 26, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        
        .not-found-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(107, 15, 26, 0.3);
          background-color: #5a0d16;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .not-found-container {
            padding: 40px 15px;
            min-height: 60vh;
          }
          .not-found-icon {
            font-size: 5rem;
            margin-bottom: 15px;
          }
          .not-found-title {
            font-size: 2.2rem;
            margin-bottom: 15px;
          }
          .not-found-text {
            font-size: 1rem;
            margin-bottom: 30px;
          }
          .not-found-btn {
            padding: 12px 25px;
            font-size: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .not-found-icon {
            font-size: 4rem;
          }
          .not-found-title {
            font-size: 1.8rem;
          }
          .not-found-text {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
