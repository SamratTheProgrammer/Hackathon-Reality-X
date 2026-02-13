import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Simplified Context for Machine App
// Focused on local session state

export interface WasteType {
    id: string;
    name: string;
    pointsPerUnit: number;
    unit: 'item' | 'kg' | 'g';
    icon: string;
    color: string;
}

export interface Transaction {
    id: string;
    machineId: string;
    items: { wasteId: string; count: number; points: number }[];
    totalPoints: number;
    timestamp: string;
    status: 'Pending' | 'Completed';
}

interface MachineContextType {
    wasteTypes: WasteType[];
    currentTransaction: Transaction | null;
    machineStatus: 'Available' | 'Full' | 'Maintenance';
    capacity: number; // 0-100
    startTransaction: () => void;
    completeTransaction: (items: any[], totalPoints: number) => void;
    resetTransaction: () => void;
    updateCapacity: (newCapacity: number) => void;

    // Auth
    isAuthenticated: boolean;
    isLoading: boolean;
    machineData: any | null;
    login: (id: string, secret: string) => Promise<boolean>;
    register: (data: any) => Promise<any>;
    logout: () => void;
}





const MachineContext = createContext<MachineContextType | undefined>(undefined);

export const MachineProvider = ({ children }: { children: ReactNode }) => {
    const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
    const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
    const [capacity, setCapacity] = useState(45); // Start at 45%
    const [machineStatus, setMachineStatus] = useState<'Available' | 'Full' | 'Maintenance'>('Available');

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [machineData, setMachineData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

    // Load from local storage on mount & Fetch Waste Types
    useEffect(() => {
        const init = async () => {
            // Restore Auth
            const storedAuth = localStorage.getItem('machine_auth');
            if (storedAuth) {
                try {
                    const parsed = JSON.parse(storedAuth);
                    setIsAuthenticated(true);
                    setMachineData(parsed);
                    if (parsed.capacity) setCapacity(parsed.capacity);
                    if (parsed.status) setMachineStatus(parsed.status);
                } catch (error) {
                    console.error("Failed to parse machine_auth", error);
                    localStorage.removeItem('machine_auth');
                }
            }

            // Fetch Waste Types (Dynamic)
            try {
                const res = await fetch(`${backendUrl}/api/admin/waste-types`);
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    const mapped = data.data.map((t: any) => ({
                        id: t._id,
                        name: t.name,
                        pointsPerUnit: t.pointsPerUnit,
                        unit: t.unit,
                        icon: t.icon,
                        color: t.color
                    }));
                    setWasteTypes(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch waste types:", error);
            }

            setIsLoading(false);
        };

        init();
    }, []);

    const updateCapacity = async (newCapacity: number) => {
        setCapacity(newCapacity);
        let status: 'Available' | 'Full' | 'Maintenance' = 'Available';
        if (newCapacity >= 95) {
            status = 'Full';
        }
        setMachineStatus(status);

        if (isAuthenticated && machineData?.machineId) {
            try {
                await fetch(`${backendUrl}/api/machine/update-status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        machineId: machineData.machineId,
                        capacity: newCapacity,
                        status
                    })
                });
            } catch (error) {
                console.error("Failed to sync capacity:", error);
            }
        }
    };

    const startTransaction = () => {
        setCurrentTransaction(null);
    };

    const completeTransaction = (items: any[], totalPoints: number) => {
        // Calculate total weight for debugging/display
        // The QR code needs to send the items breakdown so the server can calculate and update specific stats

        // Ensure items have wasteId
        const formattedItems = items.map(item => ({
            wasteId: item.wasteId || item.id, // Fallback if id is used
            count: item.count || item.quantity,
            points: item.points
        }));

        const tx: Transaction = {
            id: `TX-${Date.now().toString().slice(-6)}`,
            machineId: machineData?.machineId || 'M-DEMO',
            items: formattedItems,
            totalPoints,
            timestamp: new Date().toISOString(),
            status: 'Pending'
        };
        setCurrentTransaction(tx);

        // Simulating capacity increase
        updateCapacity(Math.min(100, capacity + 5));

        // Sync with Backend (Fire and Forget)
        if (machineData?.machineId) {
            fetch(`${backendUrl}/api/machine/transaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    machineId: machineData.machineId,
                    transaction: tx
                })
            }).catch(err => console.error("Failed to sync transaction:", err));
        }
    };

    const resetTransaction = () => {
        setCurrentTransaction(null);
    };

    const login = async (id: string, secret: string) => {
        try {
            const response = await fetch(`${backendUrl}/api/machine/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ machineId: id, password: secret })
            });
            const data = await response.json();

            if (data.success) {
                const machine = data.data;
                setMachineData(machine);
                setCapacity(machine.capacity || 0);
                setMachineStatus(machine.status || 'Available');
                setIsAuthenticated(true);
                localStorage.setItem('machine_auth', JSON.stringify(machine));
                return true;
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
        return false;
    };

    const register = async (data: any) => {
        try {
            const response = await fetch(`${backendUrl}/api/machine/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const resData = await response.json();

            if (resData.success) {
                const machine = resData.data;
                setMachineData(machine);
                setIsAuthenticated(true);
                localStorage.setItem('machine_auth', JSON.stringify(machine));
                return machine; // Return the full machine object
            }
        } catch (error) {
            console.error("Register Error:", error);
        }
        return null;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setMachineData(null);
        localStorage.removeItem('machine_auth');
    };

    return (
        <MachineContext.Provider value={{
            wasteTypes,
            currentTransaction,
            machineStatus,
            capacity,
            startTransaction,
            completeTransaction,
            resetTransaction,
            updateCapacity,
            isAuthenticated,
            isLoading,
            machineData,
            login,
            register,
            logout
        }}>
            {children}
        </MachineContext.Provider>
    );
};

export const useMachine = () => {
    const context = useContext(MachineContext);
    if (!context) {
        throw new Error('useMachine must be used within a MachineProvider');
    }
    return context;
};
