import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminDashboard = () => {
    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('withdrawals/');
            setWithdrawals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await api.post(`withdrawals/${id}/${action}/`);
            fetchData();
        } catch (err) {
            alert('Action failed');
        }
    };

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>

            <div className="card">
                <h3>Pending Withdrawals</h3>
                <table>
                    <thead>
                        <tr>
                            <th>User (Affiliate)</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.filter(w => w.status === 'REQUESTED').map(w => (
                            <tr key={w.id}>
                                <td>{w.affiliate} (ID: {w.affiliate})</td> {/* Ideally backend expands this */}
                                <td>${w.amount}</td>
                                <td><span className="badge badge-warning">{w.status}</span></td>
                                <td>
                                    <button onClick={() => handleAction(w.id, 'approve')} className="btn btn-primary" style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}>Approve</button>
                                    <button onClick={() => handleAction(w.id, 'reject')} className="btn btn-outline" style={{ fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Reject</button>
                                </td>
                            </tr>
                        ))}
                        {withdrawals.filter(w => w.status === 'REQUESTED').length === 0 && (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No pending requests</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h3>History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Reviewed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.filter(w => w.status !== 'REQUESTED').map(w => (
                            <tr key={w.id}>
                                <td>{w.affiliate}</td>
                                <td>${w.amount}</td>
                                <td>
                                    <span className={`badge ${w.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>
                                        {w.status}
                                    </span>
                                </td>
                                <td>{new Date(w.reviewed_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
