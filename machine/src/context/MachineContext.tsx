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
    machineData: any | null;
    login: (id: string, secret: string) => Promise<boolean>;
    register: (data: any) => Promise<boolean>;
    logout: () => void;
}

const INITIAL_WASTE_TYPES: WasteType[] = [
    { id: '1', name: 'Plastic Bottle (PET)', pointsPerUnit: 10, unit: 'item', icon: 'Bottle', color: 'bg-blue-500' },
    { id: '2', name: 'Glass Bottle', pointsPerUnit: 8, unit: 'item', icon: 'Glass', color: 'bg-green-500' },
    { id: '3', name: 'Aluminum Can', pointsPerUnit: 12, unit: 'item', icon: 'Can', color: 'bg-gray-400' },
    { id: '4', name: 'Paper/Cardboard', pointsPerUnit: 2, unit: 'g', icon: 'FileText', color: 'bg-yellow-600' },
    { id: '5', name: 'E-Waste (Small)', pointsPerUnit: 30, unit: 'item', icon: 'Cpu', color: 'bg-purple-600' },
];



const MachineContext = createContext<MachineContextType | undefined>(undefined);

export const MachineProvider = ({ children }: { children: ReactNode }) => {
    const [wasteTypes] = useState<WasteType[]>(INITIAL_WASTE_TYPES);
    const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
    const [capacity, setCapacity] = useState(45); // Start at 45%
    const [machineStatus, setMachineStatus] = useState<'Available' | 'Full' | 'Maintenance'>('Available');

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [machineData, setMachineData] = useState<any>(null);

    // Load from local storage on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('machine_auth');
        if (storedAuth) {
            try {
                const parsed = JSON.parse(storedAuth);
                setIsAuthenticated(true);
                setMachineData(parsed);
            } catch (error) {
                console.error("Failed to parse machine_auth from localStorage", error);
                localStorage.removeItem('machine_auth'); // Clear invalid data
            }
        }
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
                await fetch('http://localhost:5000/api/machine/update-status', {
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
    };

    const resetTransaction = () => {
        setCurrentTransaction(null);
    };

    const login = async (id: string, secret: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/machine/login', {
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
            const response = await fetch('http://localhost:5000/api/machine/register', {
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
                return true;
            }
        } catch (error) {
            console.error("Register Error:", error);
        }
        return false;
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
