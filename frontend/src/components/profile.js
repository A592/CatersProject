// src/components/Profile.js

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { user, loading } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                // Assuming the profile route returns user data
                try {
                    const response = await fetch('/api/auth/profile', {
                        method: 'GET',
                        credentials: 'include',
                    });

                    const data = await response.json();

                    if (response.ok && data.user) {
                        setProfile(data.user);
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className="container">
            <h1>Your Profile</h1>
            {profile ? (
                <div>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    {/* Add more profile fields as needed */}
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
