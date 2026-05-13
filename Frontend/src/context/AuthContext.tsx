import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types/auth';
import { authApi } from '../api/authApi';

interface AuthContextType {
    user: User | null;
    profile: any;
    login: (data: AuthResponse) => void;
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
                    console.warn("UserId trong token không hợp lệ, yêu cầu đăng nhập lại.");
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

                const res = await authApi.getProfile(userId, token);
                setProfile(res.data);
            } catch (err) {
                console.error("Lỗi fetch profile khi refresh:", err);
                logout();
            }
        };
        loadInitialData();
    }, []);

    const login = async (response: any) => {
        const data = response.data || response;

        console.log("Cấu trúc thực tế nhận được:", data);

        const token = data.token;

        if (!token) {
            console.error("Token bị trống!");
            return;
        }

        let currentUser;

        try {
            currentUser = await authApi.getMyInfo(token);
        } catch (err) {
            console.error("Lỗi lấy thông tin user từ token:", err);
            return;
        }

        const userId = currentUser.data?.userId || data.id || data.userId;
        const username = currentUser.data?.username || data.username;
        const role = currentUser.data?.role || data.role;

        if (!userId) {
            console.error("ID bị trống!");
            return;
        }

        if (userId !== EMPTY_GUID) {
            try {
                const res = await authApi.getProfile(userId, token);
                setProfile(res.data);
            } catch (err) {
                console.error("Lỗi lấy profile:", err);
            }
        } else {
            setProfile({ fullName: "Quản trị viên", role: "Director" });
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
        localStorage.setItem('token', token);

        if (userId === EMPTY_GUID) {
            return;
        }

        try {
            const res = await authApi.getProfile(userId, token);
            setProfile(res.data);
            console.log("Profile đã tải thành công:", res.data);
        } catch (err) {
            console.error("Lỗi lấy profile sau login:", err);
        }
    };

    const logout = () => {
        setUser(null);
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
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};