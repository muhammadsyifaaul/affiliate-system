import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';

const AffiliateDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [products, setProducts] = useState([]);

    // Modal State
    const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [withdrawForm, setWithdrawForm] = useState({
        amount: '',
        payment_method: 'BANK_TRANSFER',
        payment_details: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Re-fetch everything to ensure balance is up to date
            const profRes = await api.get('affiliates/');
            setProfile(Array.isArray(profRes.data) ? profRes.data[0] : profRes.data);

            const transRes = await api.get('transactions/');
            const transList = Array.isArray(transRes.data) ? transRes.data : (transRes.data.results || []);
            setTransactions(transList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

            const withRes = await api.get('withdrawals/');
            const withList = Array.isArray(withRes.data) ? withRes.data : (withRes.data.results || []);
            setWithdrawals(withList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

            const prodRes = await api.get('products/');
            setProducts(Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.results || []));
        } catch (err) {
            console.error(err);
        }
    };

    const handleWithdrawSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('withdrawals/', withdrawForm);

            // Show success modal instead of alert
            setSuccessMessage('Withdrawal requested successfully!');
            setSuccessModalOpen(true);

            setWithdrawModalOpen(false);
            setWithdrawForm({ amount: '', payment_method: 'BANK_TRANSFER', payment_details: '' });
            fetchData(); // Refresh balance
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const msg = typeof err.response.data === 'string'
                    ? err.response.data
                    : JSON.stringify(err.response.data);
                setError(msg);
            } else {
                setError('Failed to process withdrawal.');
            }
        }
    };

    if (!profile) return <div className="container">Loading...</div>;

    const baseUrl = window.location.origin;
    const fee = 1.50; // Visualize fee
    const estimatedReceive = withdrawForm.amount ? (parseFloat(withdrawForm.amount) - fee).toFixed(2) : '0.00';

    return (
        <div className="container">
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1>Dashboard</h1>
                <button onClick={() => setWithdrawModalOpen(true)} className="btn btn-primary">Request Payout</button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div style={{ color: 'var(--text-muted)' }}>Current Balance</div>
                    <div className="stat-value text-success">${profile.current_balance}</div>
                    <small style={{ color: 'var(--text-muted)' }}>Available for withdrawal</small>
                </div>
                <div className="stat-card">
                    <div style={{ color: 'var(--text-muted)' }}>Lifetime Earnings</div>
                    <div className="stat-value">${profile.total_earnings}</div>
                </div>
                <div className="stat-card">
                    <div style={{ color: 'var(--text-muted)' }}>Referral Code</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem' }}>{profile.referral_code}</div>
                </div>
            </div>

            <div className="card">
                <h3>Your Referral Links</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Share these links to earn commissions.</p>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Storewide Link (All Products)</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input type="text" className="input" style={{ flex: 1, marginBottom: 0 }} value={`${baseUrl}/?ref=${profile.referral_code}`} readOnly />
                        <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(`${baseUrl}/?ref=${profile.referral_code}`)}>Copy</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {products.map(p => (
                        <div key={p.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.name}</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="text" className="input" style={{ flex: 1, marginBottom: 0, fontSize: '0.8rem' }} value={`${baseUrl}/product/${p.id}?ref=${profile.referral_code}`} readOnly />
                                <button className="btn btn-sm btn-outline" onClick={() => navigator.clipboard.writeText(`${baseUrl}/product/${p.id}?ref=${profile.referral_code}`)}>Copy</button>
                            </div>
                            <small style={{ color: 'var(--text-muted)' }}>Price: ${p.price}</small>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3>Commission History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Commission</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id}>
                                <td>{new Date(t.created_at).toLocaleDateString()}</td>
                                <td>{t.product_name || 'Storewide'}</td>
                                <td>${t.amount}</td>
                                <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>+${t.commission_amount}</td>
                                <td>{t.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h3>Payout Requests</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Method</th>
                            <th>Amount</th>
                            <th>Fee</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.map(w => (
                            <tr key={w.id}>
                                <td>{new Date(w.created_at).toLocaleDateString()}</td>
                                <td>{w.payment_method}</td>
                                <td>${w.amount}</td>
                                <td style={{ color: 'var(--danger)' }}>-${w.fee}</td>
                                <td>
                                    <span className={`badge ${w.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>
                                        {w.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isWithdrawModalOpen}
                onClose={() => setWithdrawModalOpen(false)}
                title="Request Withdrawal"
            >
                <form onSubmit={handleWithdrawSubmit}>
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Amount ($)</label>
                    <input
                        type="number"
                        className="input"
                        min="10"
                        step="0.01"
                        required
                        value={withdrawForm.amount}
                        onChange={e => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    />

                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Payment Method</label>
                    <select
                        className="input"
                        value={withdrawForm.payment_method}
                        onChange={e => setWithdrawForm({ ...withdrawForm, payment_method: e.target.value })}
                    >
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="PAYPAL">PayPal</option>
                        <option value="DANA">Dana</option>
                        <option value="CRYPTO">Crypto (USDT)</option>
                    </select>

                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Payment Details</label>
                    <textarea
                        className="input"
                        placeholder="E.g. Bank Name & Account Number, or Email"
                        rows="3"
                        required
                        value={withdrawForm.payment_details}
                        onChange={e => setWithdrawForm({ ...withdrawForm, payment_details: e.target.value })}
                    ></textarea>

                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                        <div className="flex-between">
                            <span>Withdrawal Fee:</span>
                            <span style={{ color: 'var(--danger)' }}>${fee.toFixed(2)}</span>
                        </div>
                        <div className="flex-between" style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                            <span>You will receive:</span>
                            <span>${estimatedReceive > 0 ? estimatedReceive : '0.00'}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setWithdrawModalOpen(false)} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit Request</button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="Success"
            >
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                        {successMessage}
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setSuccessModalOpen(false)}
                        style={{ width: '100%' }}
                    >
                        Okay, Got it
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AffiliateDashboard;
