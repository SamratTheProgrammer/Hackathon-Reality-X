import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { Users, Search, Loader2 } from "lucide-react";

interface User {
    _id: string;
    clerkId: string;
    email: string;
    name: string;
    role: string;
    points: number;
    createdAt: string;
    wasteStats: {
        totalWeight: number;
        transactionsCount: number;
    };
}

export const AdminUsers = () => {
    const { backendUrl } = useApp();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/admin/users`);
                const data = await res.json();
                if (data.success) {
                    setUsers(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [backendUrl]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="w-8 h-8 text-primary" /> User Management
                </h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 focus:border-primary outline-none w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Users</p>
                    <p className="text-3xl font-black text-white">{users.length}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Points Issued</p>
                    <p className="text-3xl font-black text-yellow-500">
                        {users.reduce((acc, user) => acc + (user.points || 0), 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Active Recyclers</p>
                    <p className="text-3xl font-black text-green-500">
                        {users.filter(u => u.wasteStats?.transactionsCount > 0).length}
                    </p>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Points</th>
                            <th className="p-4">Recycling Stats</th>
                            <th className="p-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="p-4">
                                    <div>
                                        <p className="font-bold text-white">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-800 text-gray-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-yellow-500 font-bold">
                                    {user.points?.toLocaleString() || 0}
                                </td>
                                <td className="p-4 text-sm text-gray-400">
                                    {user.wasteStats?.transactionsCount || 0} txns • {(user.wasteStats?.totalWeight || 0) / 1000}kg
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
