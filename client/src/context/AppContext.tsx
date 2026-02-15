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

// --- Initial Data ---
// Removed dummy data in favor of backend fetching

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
    isLoading: boolean;
    backendUrl: string;
    setWasteTypes: React.Dispatch<React.SetStateAction<WasteType[]>>;
    setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
    setRewards: React.Dispatch<React.SetStateAction<Reward[]>>;
    addTransaction: (tx: Transaction) => void;
    redeemPoints: (cost: number, rewardName: string) => Promise<boolean>;
    updateMachineStatus: (id: string, status: Machine['status']) => void;
    login: (email: string, pass: string) => Promise<boolean>;
    signup: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const backendUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
    const [machines, setMachines] = useState<Machine[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [rewards, setRewards] = useState<Reward[]>([]);
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
    const [isLoading, setIsLoading] = useState(true);

    // Fetch User Data from Backend
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            if (adminUser) {
                setUser(adminUser);
                setIsLoading(false);
            } else if (clerkUser) {
                try {
                    const response = await fetch(`${backendUrl}/api/user/${clerkUser.id}`);
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
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUser(null);
                setUserPoints(0);
                if (isClerkLoaded) {
                    setIsLoading(false);
                }
            }
        };

        // Run whenever clerkUser or adminUser changes
        if (isClerkLoaded) {
            fetchUserData();
        }

        // Fetch Dynamic System Data (WasteTypes, Rewards, Machines)
        const fetchSystemData = async () => {
            try {
                // Fetch Waste Types
                const wtRes = await fetch(`${backendUrl}/api/admin/waste-types`);
                const wtData = await wtRes.json();
                if (wtData.success) setWasteTypes(wtData.data);

                // Fetch Rewards
                // If admin is logged in, fetch all (including inactive), else fetch only active
                const rewardEndpoint = adminUser ? '/api/admin/rewards' : '/api/user/rewards';
                const rwRes = await fetch(`${backendUrl}${rewardEndpoint}`);
                const rwData = await rwRes.json();
                if (rwData.success) {
                    // Start with empty rewards if none in DB, don't fallback to INITIAL unless fetch fails completely
                    if (rwData.data.length > 0) {
                        // Map _id to id if necessary, though Mongo uses _id
                        setRewards(rwData.data.map((r: any) => ({ ...r, id: r._id || r.id })));
                    }
                }

                // Fetch Machines
                const mcRes = await fetch(`${backendUrl}/api/machine/all`); // Public or Admin endpoint? machineRoutes has /all
                const mcData = await mcRes.json();
                if (mcData.success && mcData.data.length > 0) {
                    setMachines(mcData.data.map((m: any) => ({
                        id: m.machineId, // Map machineId to id
                        name: m.name,
                        location: m.location,
                        status: m.status,
                        capacity: m.capacity || 0,
                        isActive: m.isActive,
                        lastActivity: m.lastActivity || 'Recently',
                        installDate: m.createdAt || 'Unknown'
                    })));
                } else if (mcData.success && mcData.data.length === 0) {
                    setMachines([]); // Clear hardcoded if backend returns empty list (but success)
                }

            } catch (error) {
                console.error("Failed to fetch system data:", error);
                // Fallback to initial data is already set manually in useState, 
                // but we might want to clear it if we want to show *only* real data.
                // For now, keeping INITIAL as fallback is safer for demo unless explicitly cleared.
            }
        };
        fetchSystemData();

    }, [clerkUser, adminUser, isClerkLoaded, backendUrl]);

    const isAuthenticated = !!user;

    const addTransaction = async (tx: Transaction) => {
        setTransactions(prev => [tx, ...prev]);

        if (isAuthenticated && user?.id) {
            try {
                // Send to Backend
                const response = await fetch(`${backendUrl}/api/user/transaction`, {
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
                const response = await fetch(`${backendUrl}/api/user/redeem`, {
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

    const refreshUser = async () => {
        if (clerkUser) {
            try {
                const response = await fetch(`${backendUrl}/api/user/${clerkUser.id}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setUser({
                        id: data.data.clerkId || clerkUser.id,
                        name: data.data.name || clerkUser.fullName || 'User',
                        email: data.data.email || '',
                        role: data.data.role || 'user',
                        wasteStats: data.data.wasteStats,
                        redemptions: data.data.redemptions
                    });
                    setUserPoints(data.data.points || 0);
                }
            } catch (error) {
                console.error("Failed to refresh user data:", error);
            }
        }
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
            isLoading,
            backendUrl,
            setWasteTypes,
            setMachines,
            setRewards,
            addTransaction,
            redeemPoints,
            updateMachineStatus,
            login,
            signup,
            logout,
            refreshUser
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
