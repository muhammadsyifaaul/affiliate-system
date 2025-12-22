import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = btoa(`${username}:${password}`); // Basic Auth Base64

        try {
            // Validate credentials by fetching 'me' or similar. 
            // We'll use the affiliates list which is protected.
            // Validate credentials by fetching 'me' or similar. 
            // We'll use the affiliates list which is protected.
            const response = await api.get('affiliates/', {
                headers: { Authorization: `Basic ${auth}` }
            });

            // If successful, save creds
            localStorage.setItem('auth', auth);

            // Allow simplified admin check based on username or logic. 
            // Ideally backend returns "is_staff". For now, we assume if they can login, they are at least a user.
            // Let's quickly store a fake user object, or better, modify backend to return user info.
            // For now:
            const user = response.data[0]?.user || { username, is_staff: username === 'admin' };
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response) {
                alert(`Login Failed: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
            } else if (err.request) {
                alert('Login Failed: No response from server. Is Backend running?');
            } else {
                alert(`Login Failed: ${err.message}`);
            }
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center' }}>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
                        (Use admin/admin)
                    </p>
                    <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
