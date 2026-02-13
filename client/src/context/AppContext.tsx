import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useUser, useClerk } from "@clerk/clerk-react";

// --- Types ---

export interface WasteType {
    id: string;
    name: string;
    pointsPerUnit: number;
    unit: 'item' | 'kg' | 'g';
    icon: string; // Lucide icon name or emoji for simplicity
    color: string;
}

export interface Machine {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    status: 'Available' | 'Full' | 'Maintenance';
    capacity: number; // 0-100 percentage
    isActive?: boolean;
    lastActivity: string;
    installDate: string;
}

export interface Transaction {
    id: string;
    machineId: string;
    userId: string; // 'guest' or user ID
    items: { wasteId: string; count: number; points: number }[];
    totalPoints: number;
    timestamp: string;
    status: 'Pending' | 'Completed';
}

export interface Reward {
    id: string;
    name: string;
    cost: number;
    description: string;
    image: string;
}



// --- Initial Data ---

const INITIAL_WASTE_TYPES: WasteType[] = [
    { id: '1', name: 'Plastic Bottle (PET)', pointsPerUnit: 10, unit: 'item', icon: 'Bottle', color: 'bg-blue-500' },
    { id: '2', name: 'Glass Bottle', pointsPerUnit: 8, unit: 'item', icon: 'Glass', color: 'bg-green-500' },
    { id: '3', name: 'Aluminum Can', pointsPerUnit: 12, unit: 'item', icon: 'Can', color: 'bg-gray-400' },
    { id: '4', name: 'Paper/Cardboard', pointsPerUnit: 2, unit: 'g', icon: 'FileText', color: 'bg-yellow-600' }, // per 100g logic handled in UI
    { id: '5', name: 'E-Waste (Small)', pointsPerUnit: 30, unit: 'item', icon: 'Cpu', color: 'bg-purple-600' },
];

const INITIAL_MACHINES: Machine[] = [
    {
        id: 'M001', name: 'Central Mall Kiosk',
        location: { lat: 19.0760, lng: 72.8777, address: 'Phoenix Market City, Mumbai' },
        status: 'Available', capacity: 45, lastActivity: '10 mins ago', installDate: '2025-01-15'
    },
    {
        id: 'M002', name: 'Metro Station Gate 4',
        location: { lat: 28.6139, lng: 77.2090, address: 'Rajiv Chowk, Delhi' },
        status: 'Full', capacity: 98, lastActivity: '2 mins ago', installDate: '2025-02-01'
    },
    {
        id: 'M003', name: 'Tech Park Zone A',
        location: { lat: 12.9716, lng: 77.5946, address: 'Bangalore Tech Park' },
        status: 'Maintenance', capacity: 12, lastActivity: '2 days ago', installDate: '2024-12-10'
    },
];

const INITIAL_REWARDS: Reward[] = [
    { id: 'R1', name: '₹50 Metro Card Recharge', cost: 500, description: 'Get ₹50 travel credit.', image: 'metro.png' },
    { id: 'R2', name: 'Free Coffee Voucher', cost: 300, description: 'Valid at Starbucks & CCD.', image: 'coffee.png' },
    { id: 'R3', name: '1GB Data Pack', cost: 200, description: 'Valid for Jio/Airtel/Vi.', image: 'data.png' },
];

// --- Context ---

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    wasteStats?: {
        plasticBottles: number;
        glassBottles: number;
        aluminumCans: number;
        paperWeight: number;
        eWaste: number;
        totalWeight: number;
        transactionsCount: number;
    };
    redemptions?: {
        code: string;
        rewardName: string;
        cost: number;
        expiresAt: string;
        createdAt: string;
    }[];
}

interface AppContextType {
    wasteTypes: WasteType[];
    machines: Machine[];
    transactions: Transaction[];
    rewards: Reward[];
    userPoints: number;
    user: User | null;
    isAuthenticated: boolean;
    setWasteTypes: React.Dispatch<React.SetStateAction<WasteType[]>>;
    setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
    addTransaction: (tx: Transaction) => void;
    redeemPoints: (cost: number, rewardName: string) => Promise<boolean>;
    updateMachineStatus: (id: string, status: Machine['status']) => void;
    login: (email: string, pass: string) => Promise<boolean>;
    signup: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [wasteTypes, setWasteTypes] = useState<WasteType[]>(INITIAL_WASTE_TYPES);
    const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [rewards] = useState<Reward[]>(INITIAL_REWARDS);
    const [userPoints, setUserPoints] = useState<number>(0);

    // Clerk Hooks
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
    const { signOut } = useClerk();

    // Admin State (Local)
    const [adminUser, setAdminUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('client_admin');
        return stored ? JSON.parse(stored) : null;
    });

    // Derived User State
    const [user, setUser] = useState<User | null>(null);

    // Fetch User Data from Backend
    useEffect(() => {
        const fetchUserData = async () => {
            if (clerkUser) {
                try {
                    const response = await fetch(`http://localhost:5000/api/user/${clerkUser.id}`);
                    const data = await response.json();

                    if (data.success && data.data) {
                        setUser({
                            id: data.data.clerkId || clerkUser.id,
                            name: data.data.name || clerkUser.fullName || 'User',
                            email: data.data.email || '',
                            role: data.data.role || 'user',
                            wasteStats: data.data.wasteStats, // Add wasteStats
                            redemptions: data.data.redemptions
                        });
                        setUserPoints(data.data.points || 0);
                    } else {
                        // Fallback if backend user doesn't exist yet (webhook lag?)
                        console.warn("User not found in backend yet");
                        setUser({
                            id: clerkUser.id,
                            name: clerkUser.fullName || 'User',
                            email: clerkUser.primaryEmailAddress?.emailAddress || '',
                            role: 'user'
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            } else if (adminUser) {
                setUser(adminUser);
            } else {
                setUser(null);
                setUserPoints(0);
            }
        };

        if (isClerkLoaded) {
            fetchUserData();
        }
    }, [clerkUser, adminUser, isClerkLoaded]);

    const isAuthenticated = !!user;

    const addTransaction = async (tx: Transaction) => {
        setTransactions(prev => [tx, ...prev]);

        if (isAuthenticated && user?.id) {
            try {
                // Send to Backend
                const response = await fetch('http://localhost:5000/api/user/transaction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        totalPoints: tx.totalPoints,
                        items: tx.items
                    })
                });
                const data = await response.json();
                if (data.success) {
                    setUserPoints(data.newBalance);
                    // Refresh user stats ideally
                }
            } catch (error) {
                console.error("Transaction sync error:", error);
            }
        }
    };

    const redeemPoints = async (cost: number, rewardName: string) => {
        if (userPoints >= cost && isAuthenticated && user?.id) {
            try {
                const response = await fetch('http://localhost:5000/api/user/redeem', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        rewardName,
                        cost
                    })
                });
                const data = await response.json();

                if (data.success) {
                    setUserPoints(data.newBalance);
                    // Update user redemptions locally
                    setUser(prev => prev ? {
                        ...prev,
                        redemptions: [...(prev.redemptions || []), data.data]
                    } : null);
                    return true;
                }
                return false;

            } catch (error) {
                console.error("Redemption error:", error);
                return false;
            }
        }
        return false;
    };

    const updateMachineStatus = (id: string, status: Machine['status']) => {
        setMachines(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    };

    // --- Auth Methods ---

    const login = async (email: string, pass: string): Promise<boolean> => {
        // ADMIN LOGIN ONLY
        if (email === 'admin@gmail.com' && pass === 'admin@123') {
            const admin: User = {
                id: 'ADMIN_001',
                name: 'System Admin',
                email,
                role: 'admin'
            };
            setAdminUser(admin);
            localStorage.setItem('client_admin', JSON.stringify(admin));
            return true;
        }
        return false;
    };

    // Deprecated for Users (Handled by Clerk), kept for interface compatibility or legacy
    const signup = async (_name: string, _email: string, _pass: string): Promise<boolean> => {
        return false;
    };

    const logout = () => {
        if (adminUser) {
            setAdminUser(null);
            localStorage.removeItem('client_admin');
        } else {
            signOut();
        }
        setUserPoints(0);
        setUser(null);
    };

    return (
        <AppContext.Provider value={{
            wasteTypes,
            machines,
            transactions,
            rewards,
            userPoints,
            user,
            isAuthenticated,
            setWasteTypes,
            setMachines,
            addTransaction,
            redeemPoints,
            updateMachineStatus,
            login,
            signup,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
