// Rate Limiter Utility for Firebase Authentication
class RateLimiter {
    constructor() {
        this.attempts = new Map();
        this.maxAttempts = 5; // Maximum attempts per hour
        this.timeWindow = 60 * 60 * 1000; // 1 hour in milliseconds
    }

    // Check if user can make a request
    canMakeRequest(identifier) {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier) || [];
        
        // Remove old attempts outside the time window
        const recentAttempts = userAttempts.filter(timestamp => 
            now - timestamp < this.timeWindow
        );
        
        // Update the attempts
        this.attempts.set(identifier, recentAttempts);
        
        // Check if under the limit
        return recentAttempts.length < this.maxAttempts;
    }

    // Record an attempt
    recordAttempt(identifier) {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier) || [];
        userAttempts.push(now);
        this.attempts.set(identifier, userAttempts);
    }

    // Get time until next attempt is allowed
    getTimeUntilNextAttempt(identifier) {
        const userAttempts = this.attempts.get(identifier) || [];
        if (userAttempts.length === 0) return 0;
        
        const oldestAttempt = Math.min(...userAttempts);
        const timeUntilReset = this.timeWindow - (Date.now() - oldestAttempt);
        return Math.max(0, timeUntilReset);
    }

    // Format time remaining
    formatTimeRemaining(milliseconds) {
        const minutes = Math.ceil(milliseconds / (60 * 1000));
        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            const hours = Math.ceil(minutes / 60);
            return `${hours} hour${hours !== 1 ? 's' : ''}`;
        }
    }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Enhanced Firebase Auth wrapper with rate limiting
class FirebaseAuthWrapper {
    constructor(auth) {
        this.auth = auth;
    }

    async signInWithEmailAndPassword(email, password) {
        const identifier = `login:${email}`;
        
        if (!rateLimiter.canMakeRequest(identifier)) {
            const timeRemaining = rateLimiter.getTimeUntilNextAttempt(identifier);
            throw new Error(`Too many login attempts. Please wait ${rateLimiter.formatTimeRemaining(timeRemaining)} before trying again.`);
        }

        try {
            rateLimiter.recordAttempt(identifier);
            return await this.auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            if (error.code === 'auth/too-many-requests') {
                // Reset rate limiter on Firebase rate limit
                rateLimiter.attempts.delete(identifier);
                throw new Error('Firebase has temporarily blocked requests. Please wait 1-2 hours before trying again.');
            }
            throw error;
        }
    }

    async createUserWithEmailAndPassword(email, password) {
        const identifier = `signup:${email}`;
        
        if (!rateLimiter.canMakeRequest(identifier)) {
            const timeRemaining = rateLimiter.getTimeUntilNextAttempt(identifier);
            throw new Error(`Too many signup attempts. Please wait ${rateLimiter.formatTimeRemaining(timeRemaining)} before trying again.`);
        }

        try {
            rateLimiter.recordAttempt(identifier);
            return await this.auth.createUserWithEmailAndPassword(email, password);
        } catch (error) {
            if (error.code === 'auth/too-many-requests') {
                rateLimiter.attempts.delete(identifier);
                throw new Error('Firebase has temporarily blocked requests. Please wait 1-2 hours before trying again.');
            }
            throw error;
        }
    }

    async sendEmailVerification(user) {
        const identifier = `verify:${user.email}`;
        
        if (!rateLimiter.canMakeRequest(identifier)) {
            const timeRemaining = rateLimiter.getTimeUntilNextAttempt(identifier);
            throw new Error(`Too many verification email requests. Please wait ${rateLimiter.formatTimeRemaining(timeRemaining)} before trying again.`);
        }

        try {
            rateLimiter.recordAttempt(identifier);
            return await user.sendEmailVerification();
        } catch (error) {
            if (error.code === 'auth/too-many-requests') {
                rateLimiter.attempts.delete(identifier);
                throw new Error('Firebase has temporarily blocked requests. Please wait 1-2 hours before trying again.');
            }
            throw error;
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RateLimiter, FirebaseAuthWrapper };
}

