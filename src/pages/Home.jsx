import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Home = () => {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'profiles', user.uid)); // Fetch the user document from Firestore
                    if (userDoc.exists()) {
                        setDisplayName(userDoc.data().displayName); // Set the display name
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
        };

        fetchUserProfile(); // Call the function to fetch the profile
    }, [user]); // Only refetch if user changes

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-white text-2xl font-bold mb-6">Home</h1>
            {user ? (
                <p className="text-white">Welcome, {displayName ? displayName : user.email}</p>
                // Display the displayName if it exists, otherwise fall back to email
            ) : (
                <p>Welcome, guest</p>
            )}
        </div>
    );
};


export default Home;