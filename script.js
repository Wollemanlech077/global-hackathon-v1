// Firebase functionality
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase to be available
    const checkFirebase = () => {
        if (window.firebase) {
            console.log('🔥 Firebase is ready!');
            console.log('📊 Available services:', {
                auth: window.firebase.auth,
                db: window.firebase.db,
                storage: window.firebase.storage
            });
            
            // Initialize your app here
            initializeApp();
        } else {
            setTimeout(checkFirebase, 100);
        }
    };
    
    checkFirebase();
});

// Initialize your application
function initializeApp() {
    console.log('🚀 ACTA Hackathon Project Loaded!');
    console.log('💡 Ready to build something amazing?');
    console.log('⏰ 24 hours to make it happen!');
    
    // Your Firebase app logic goes here
    // Example: Authentication, Firestore operations, etc.
}

// Firebase helper functions
const firebaseHelpers = {
    // Authentication helpers
    async signIn(email, password) {
        const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        return signInWithEmailAndPassword(window.firebase.auth, email, password);
    },
    
    async signUp(email, password) {
        const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        return createUserWithEmailAndPassword(window.firebase.auth, email, password);
    },
    
    // Firestore helpers
    async addDocument(collection, data) {
        const { collection: firestoreCollection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        return addDoc(firestoreCollection(window.firebase.db, collection), data);
    },
    
    async getDocuments(collection) {
        const { collection: firestoreCollection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        return getDocs(firestoreCollection(window.firebase.db, collection));
    }
};

// Make helpers available globally
window.firebaseHelpers = firebaseHelpers;
