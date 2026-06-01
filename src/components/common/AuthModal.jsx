import React, { useState } from 'react';
import { auth } from '../../services/firebase';
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile 
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (isSignUpMode && !name.trim()) {
            setError("Please enter your name.");
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        try {
            if (isSignUpMode) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                localStorage.setItem('cachedUserName', name);
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (userCredential.user.displayName) {
                    localStorage.setItem('cachedUserName', userCredential.user.displayName);
                }
            }
            onClose();
        } catch (err) {
            console.error("Email auth error:", err);
            let errorMessage = "Authentication failed. Please try again.";
            if (err.code === 'auth/email-already-in-use') errorMessage = "Email is already in use.";
            if (err.code === 'auth/invalid-credential') errorMessage = "Invalid email or password.";
            if (err.code === 'auth/weak-password') errorMessage = "Password should be at least 6 characters.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');

        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log("User signed in:", user.displayName);

            if (user.displayName) {
                localStorage.setItem('cachedUserName', user.displayName);
            }

            onClose();
        } catch (error) {
            console.error("Sign-in error:", error);
            setError(error.message || "Failed to sign in. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={styles.overlay} onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={styles.modal}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative Background Element */}
                        <div style={styles.decorCircle}></div>

                        <button style={styles.closeBtn} onClick={onClose}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <div style={styles.imageContainer}>
                            <img
                                src="/assets/icons/logo192.png"
                                alt="NCM Logo"
                                style={styles.illustration}
                            />
                        </div>

                        <div style={styles.content}>
                            <h2 style={styles.title}>{isSignUpMode ? 'Create an Account' : 'Welcome to nuttychocomorsels'}</h2>
                            <p style={styles.subtitle}>{isSignUpMode ? 'Join us to enjoy exclusive treats & track orders.' : 'Log in to unlock exclusive treats & manage your orders.'}</p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={styles.error}
                                >
                                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleEmailAuth} style={styles.formContainer}>
                                {isSignUpMode && (
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        style={styles.input}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                )}
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    style={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div style={styles.passwordWrapper}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        style={styles.input}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                                    </button>
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={styles.emailBtn}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div style={styles.loader}>
                                            <i className="fa-solid fa-spinner fa-spin"></i> {isSignUpMode ? 'Signing up...' : 'Signing in...'}
                                        </div>
                                    ) : (
                                        isSignUpMode ? 'Sign Up' : 'Sign In'
                                    )}
                                </motion.button>
                            </form>

                            <div style={styles.divider}>
                                <span style={styles.dividerText}>OR</span>
                            </div>

                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={styles.googleBtn}
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google Logo"
                                    style={styles.googleIcon}
                                />
                                Continue with Google
                            </motion.button>

                            <p style={styles.toggleText} onClick={() => {
                                setIsSignUpMode(!isSignUpMode);
                                setError('');
                            }}>
                                {isSignUpMode ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(54, 4, 10, 0.4)', // Warm tinted overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(10px)',
    },
    modal: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(107, 15, 26, 0.35)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    decorCircle: {
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.2) 0%, rgba(197, 160, 89, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none',
    },
    closeBtn: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.05)',
        border: 'none',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#666',
        zIndex: 10,
        transition: '0.2s',
    },
    imageContainer: {
        width: '100%',
        height: '110px',
        background: 'linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px',
        position: 'relative',
        zIndex: 1,
    },
    illustration: {
        maxHeight: '80px',
        maxWidth: '80px',
        objectFit: 'contain',
        dropShadow: '0 10px 15px rgba(0,0,0,0.1)',
    },
    content: {
        padding: '30px',
        position: 'relative',
        zIndex: 1,
    },
    title: {
        color: '#6b0f1a',
        marginBottom: '8px',
        fontSize: '1.85rem',
        fontFamily: "'Playfair Display', serif",
        fontWeight: '800',
    },
    subtitle: {
        color: '#666',
        marginBottom: '30px',
        fontSize: '0.95rem',
        lineHeight: '1.5',
    },
    error: {
        color: '#6b0f1a',
        backgroundColor: '#fff1f1',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '20px',
        fontSize: '0.85rem',
        border: '1px solid #ffcccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s',
        boxSizing: 'border-box',
    },
    passwordWrapper: {
        position: 'relative',
        width: '100%',
    },
    eyeIcon: {
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '1.1rem',
        padding: 0,
    },
    emailBtn: {
        backgroundColor: '#6b0f1a',
        color: '#fff',
        border: 'none',
        borderRadius: '99px',
        padding: '14px 24px',
        width: '100%',
        fontSize: '1.05rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(107, 15, 26, 0.2)',
        marginTop: '5px',
    },
    divider: {
        position: 'relative',
        textAlign: 'center',
        margin: '20px 0',
        borderBottom: '1px solid #e0e0e0',
        lineHeight: '0.1em',
    },
    dividerText: {
        background: '#fff',
        padding: '0 10px',
        color: '#aaa',
        fontSize: '0.85rem',
    },
    googleBtn: {
        backgroundColor: '#fff',
        color: '#2c3e50',
        border: '1px solid #e0e0e0',
        borderRadius: '99px', // Pill shape
        padding: '14px 24px',
        width: '100%',
        fontSize: '1.05rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        marginBottom: '10px',
    },
    googleIcon: {
        width: '20px',
        height: '20px',
    },
    loader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        color: 'inherit',
    },
    toggleText: {
        marginTop: '15px',
        fontSize: '0.9rem',
        color: '#6b0f1a',
        cursor: 'pointer',
        fontWeight: '600',
        textDecoration: 'underline',
    }
};

export default AuthModal;
