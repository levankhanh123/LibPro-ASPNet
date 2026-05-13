import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types/auth';
import { authApi } from '../api/authApi';

interface AuthContextType {
    user: User | null;
    profile: any;
    login: (data: AuthResponse) => Promise<User | null>;
    logout: () => void;
    isAuthenticated: boolean;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);

    const buildFallbackProfile = (userData: User) => ({
        id: userData.userId || userData.id,
        username: userData.username,
        role: userData.role,
        fullName: userData.role === 'Director' ? 'Admin' : userData.username
    });

    useEffect(() => {
        const loadInitialData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }

            try {
                const currentUser = await authApi.getMyInfo(token);
                const userId = currentUser.data?.userId;

                if (!userId || userId === EMPTY_GUID) {
                    console.warn('Invalid userId in token. Please login again.');
                    logout();
                    return;
                }

                const storedUser = localStorage.getItem('user');
                const parsedUser = storedUser ? JSON.parse(storedUser) : {};
                const userData = {
                    id: userId,
                    userId,
                    username: currentUser.data?.username || parsedUser.username || '',
                    role: currentUser.data?.role || parsedUser.role || '',
                    token
                };

                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                setProfile(buildFallbackProfile(userData));

                try {
                    const res = await authApi.getProfile(token);
                    setProfile(res.data);
                } catch (err) {
                    console.error('Error fetching profile on refresh:', err);
                }
            } catch (err) {
                console.error('Error restoring login session:', err);
                logout();
            }
        };

        loadInitialData();
    }, []);

    const login = async (response: any) => {
        const data = response.data || response;
        const token = data.token;

        if (!token) {
            console.error('Token is empty.');
            return null;
        }

        localStorage.setItem('token', token);

        let currentUser;
        try {
            currentUser = await authApi.getMyInfo(token);
        } catch (err) {
            console.error('Error loading user info from token:', err);
            localStorage.removeItem('token');
            return null;
        }

        const userId = currentUser.data?.userId || data.id || data.userId;
        const username = currentUser.data?.username || data.username || '';
        const role = currentUser.data?.role || data.role || '';

        if (!userId) {
            console.error('User id is empty.');
            localStorage.removeItem('token');
            return null;
        }

        const userData = {
            id: userId,
            userId,
            username,
            role,
            token
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setProfile(buildFallbackProfile(userData));

        if (userId === EMPTY_GUID) {
            return userData;
        }

        try {
            const res = await authApi.getProfile(token);
            setProfile(res.data);
        } catch (err) {
            console.error('Error fetching profile after login:', err);
        }

        return userData;
    };

    const logout = () => {
        setUser(null);
        setProfile(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, profile, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
