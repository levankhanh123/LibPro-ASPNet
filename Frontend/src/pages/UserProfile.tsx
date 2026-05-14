import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
    const { profile } = useAuth();

    if (!profile) {
        return <div className="empty-state">Loading profile information...</div>;
    }

    const avatarText = profile.fullName?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase();

    return (
        <div className="profile-page-container">
            <div className="page-header">
                <div>
                    <h2>Your Profile</h2>
                </div>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">{avatarText}</div>
                <div className="profile-info">
                    <ProfileField label="Full Name" value={profile.fullName || 'Not updated'} />
                    <ProfileField label="Username" value={`@${profile.username}`} />
                    <ProfileField label="Email" value={profile.email || 'Not updated'} />
                    <div className="profile-field">
                        <span>Role</span>
                        <strong className="status-pill available">{profile.role}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ label, value }: { label: string; value: string }) => (
    <div className="profile-field">
        <span>{label}</span>
        <strong>{value}</strong>
    </div>
);

export default UserProfile;
