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

    const updateCapacity = (newCapacity: number) => {
        setCapacity(newCapacity);
        if (newCapacity >= 95) {
            setMachineStatus('Full');
        } else {
            setMachineStatus('Available');
        }
    };

    const startTransaction = () => {
        setCurrentTransaction(null);
    };

    const completeTransaction = (items: any[], totalPoints: number) => {
        const tx: Transaction = {
            id: `TX-${Date.now().toString().slice(-6)}`,
            machineId: machineData?.id || 'M-DEMO',
            items,
            totalPoints,
            timestamp: new Date().toISOString(),
            status: 'Pending'
        };
        setCurrentTransaction(tx);

        // Simulating capacity increase with each transaction
        updateCapacity(Math.min(100, capacity + 5));
    };

    const resetTransaction = () => {
        setCurrentTransaction(null);
    };

    const login = async (id: string, secret: string) => {
        // Mock Login
        // In real app, verify against backend
        if (id && secret) {
            const mockData = {
                id,
                name: `Machine ${id}`,
                location: 'Demo Location',
                type: 'Smart Waste Vending Machine',
                secret // Storing secret for verification
            };
            setMachineData(mockData);
            setIsAuthenticated(true);
            localStorage.setItem('machine_auth', JSON.stringify(mockData));
            return true;
        }
        return false;
    };

    const register = async (data: any) => {
        // Mock Register
        console.log("Registering machine:", data);
        setMachineData(data);
        setIsAuthenticated(true);
        localStorage.setItem('machine_auth', JSON.stringify(data));
        return true;
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
