import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandWave } from '@fortawesome/pro-solid-svg-icons';

const Home = () => {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'profiles', user.uid));
                    if (userDoc.exists()) {
                        setDisplayName(userDoc.data().displayName);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    return (
        <div className="max-w-md mx-auto mt-6 p-8 bg-white rounded-lg shadow-sm">
            {user ? (
                <>
                    <div className="py-12">
                        <p className="text-gray-900 text-3xl font-bold">Hey {displayName ? displayName : user.email}!</p>
                        <h2 className="text-2xl text-blue-600 flex items-center mt-4">
                            Ready to dive in? <FontAwesomeIcon icon={faHandWave} className="ml-2 text-yellow-500" />
                        </h2>
                        <div className="mt-6">
                            <ul className="list-none text-gray-900 space-y-4">
                                <li className="text-lg">
                                    <span className="font-semibold text-green-600">Step 1 - Create Your First Bucket:</span> 
                                    &nbsp;Smash that <span className="text-blue-500">"Add"</span> button and create a bucket to hold all your cool stuff.
                                </li>
                                <li className="text-lg">
                                    <span className="font-semibold text-green-600">Step 2 - Upload Your Files:</span> 
                                    &nbsp;Drag, drop, click—whatever works. Just get your files in there and make that bucket shine.
                                </li>
                                <li className="text-lg">
                                    <span className="font-semibold text-green-600">Step 3 - Share the Love:</span> 
                                    &nbsp;Got something awesome? Copy the link or share a QR code and let others bask in your brilliance.
                                </li>
                                <li className="text-lg">
                                    <span className="font-semibold text-green-600">Step 4 - Access Anywhere:</span> 
                                    &nbsp;Whether you're on your phone, laptop, or tablet—you’ve got your files with you. Always.
                                </li>
                            </ul>
                        </div>
                        <div className="mt-16 text-center">
                            <Link to="/buckets" className="text-white bg-indigo-500 hover:bg-indigo-600 px-10 py-4 rounded-lg text-lg">
                                Start Now, add a bucket!
                            </Link>
                        </div>
                    </div>
                </>
            ) : (
                <div className="py-12">
                    <p>
                        Welcome, guest! <Link to="/register" className="text-blue-500">Sign up</Link> or <Link to="/login" className="text-blue-500">log in</Link> to get started.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
