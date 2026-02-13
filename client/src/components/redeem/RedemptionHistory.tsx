import { Clock, CheckCircle } from "lucide-react";

export const RedemptionHistory = () => {
    const history = [
        { id: "TX1029", date: "2023-10-25", item: "Free Coffee Voucher", points: -200, status: "Completed" },
        { id: "TX1028", date: "2023-10-20", item: "Recycling Bonus", points: +50, status: "Completed" },
        { id: "TX1027", date: "2023-10-18", item: "$5 Amazon Gift Card", points: -500, status: "Completed" },
    ];

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-gray-400" />
                History
            </h2>
            <div className="overflow-x-auto border border-gray-800 rounded-xl bg-gray-900/30">
                <table className="w-full text-left">
                    <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Item / Activity</th>
                            <th className="p-4 text-right">Points</th>
                            <th className="p-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {history.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-800/30">
                                <td className="p-4 text-sm text-gray-400">{tx.date}</td>
                                <td className="p-4 font-medium">{tx.item}</td>
                                <td className={`p-4 text-right font-bold ${tx.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {tx.points > 0 ? '+' : ''}{tx.points}
                                </td>
                                <td className="p-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                                        <CheckCircle className="size-3" />
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
