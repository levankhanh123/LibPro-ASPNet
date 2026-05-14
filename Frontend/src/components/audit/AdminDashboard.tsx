import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { reportApi } from '../../api/reportApi';
import { DashboardResponse } from '../../types/report';

const LOAN_COLORS: { [key: string]: string } = {
    Borrowed: '#2563eb',
    Overdue: '#dc2626',
    Returned: '#16a34a',
    Lost: '#64748b',
    FinePayment: '#d97706',
    Closed: '#334155'
};

const BOOK_COLORS: { [key: string]: string } = {
    Available: '#16a34a',
    Reserved: '#d97706',
    Loaned: '#2563eb',
    InRepair: '#0891b2',
    Lost: '#dc2626',
    Discarded: '#64748b'
};

const AdminDashboard = () => {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [topBooks, setTopBooks] = useState<any[]>([]);
    const [riskReaders, setRiskReaders] = useState<any[]>([]);
    const [circulationRate, setCirculationRate] = useState<number>(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [summary, books, readers, rate] = await Promise.all([
                    reportApi.getDashboardSummary(),
                    reportApi.getTopBooks(5),
                    reportApi.getHighRiskReaders(5),
                    reportApi.getCirculationRate()
                ]);
                setData(summary);
                setTopBooks(books);
                setRiskReaders(readers);
                setCirculationRate(rate);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            }
        };
        fetchDashboardData();
    }, []);

    if (!data) return <div className="empty-state">Loading dashboard data...</div>;

    return (
        <div className="admin-dashboard-container">
            <div className="page-header">
                <div>
                    <h2>Dashboard</h2>
                </div>
            </div>

            <div className="dashboard-stats">
                <StatCard title="Total Books" value={data.totalBooks.toLocaleString()} />
                <StatCard title="Readers" value={data.totalReaders} />
                <StatCard title="Circulation Rate" value={`${circulationRate}%`} />
                <StatCard title="Currently Borrowed" value={data.activeLoans} />
                <StatCard title="Overdue" value={data.overdueLoans} isAlert={data.overdueLoans > 0} />
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main">
                    <section className="dashboard-panel">
                        <h3>Top 5 Most Borrowed Books</h3>
                        <div className="chart-area">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topBooks} layout="vertical" margin={{ left: 40, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="title" type="category" width={140} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="borrowCount" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <div className="dashboard-charts">
                        <ChartBox title="Book Inventory">
                            <PieChart>
                                <Pie
                                    data={data.bookDistribution}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%" cy="45%"
                                    innerRadius={65}
                                    outerRadius={90}
                                    paddingAngle={5}
                                >
                                    {data.bookDistribution.map((entry, index) => (
                                        <Cell key={index} fill={BOOK_COLORS[entry.status] || '#cbd5e1'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ChartBox>

                        <ChartBox title="Loan Status">
                            <PieChart>
                                <Pie
                                    data={data.loanDistribution}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%" cy="45%"
                                    innerRadius={65}
                                    outerRadius={90}
                                    paddingAngle={5}
                                >
                                    {data.loanDistribution.map((entry, index) => (
                                        <Cell key={index} fill={LOAN_COLORS[entry.status] || '#cbd5e1'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ChartBox>
                    </div>
                </div>

                <aside className="dashboard-side">
                    <section className="revenue-panel">
                        <h3>Total Fine Revenue</h3>
                        <p>{data.totalRevenue.toLocaleString()} <span>VND</span></p>
                    </section>

                    <section className="dashboard-panel">
                        <h3>High-Risk Readers</h3>
                        <div className="table-wrap">
                            <table className="compact-table">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th className="text-center">Overdue</th>
                                        <th className="text-right">Fine</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riskReaders.map((reader, index) => (
                                        <tr key={index}>
                                            <td>{reader.fullName}</td>
                                            <td className="text-center danger-text">{reader.currentlyOverdueCount}</td>
                                            <td className="text-right">{reader.totalUnpaidFine.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {riskReaders.length === 0 && <p className="empty-state">No violation data available</p>}
                    </section>
                </aside>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, isAlert }: any) => (
    <div className={`stat-card ${isAlert ? 'stat-alert' : ''}`}>
        <h4>{title}</h4>
        <p>{value}</p>
    </div>
);

const ChartBox = ({ title, children }: any) => (
    <section className="dashboard-panel chart-panel">
        <h3>{title}</h3>
        <div className="chart-area chart-area-tall">
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
        </div>
    </section>
);

export default AdminDashboard;
