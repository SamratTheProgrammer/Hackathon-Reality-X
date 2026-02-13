import { useApp } from "../../context/AppContext";

export const AdminDashboard = () => {
    const { machines, transactions } = useApp();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm">Total Machines</h3>
                    <p className="text-3xl font-bold mt-2">{machines.length}</p>
                </div>
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm">Total Transactions</h3>
                    <p className="text-3xl font-bold mt-2">{transactions.length}</p>
                </div>
                <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-sm">System Status</h3>
                    <p className="text-3xl font-bold mt-2 text-green-500">Healthy</p>
                </div>
            </div>
        </div>
    );
};
