import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await api.post('register/', {
                username,
                email,
                password
            });
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response) {
                alert(`Registration Failed: ${JSON.stringify(err.response.data)}`);
            } else {
                alert('Registration Failed: ' + err.message);
            }
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center' }}>Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email (Optional)"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
