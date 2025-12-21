import React from 'react';

const FAQ = () => {
    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h1>

            <div className="card">
                <h3>How do I join?</h3>
                <p style={{ color: 'var(--text-muted)' }}>Simply create an account and you are automatically an affiliate!</p>
            </div>

            <div className="card">
                <h3>What is the commission rate?</h3>
                <p style={{ color: 'var(--text-muted)' }}>We offer a flat 10% commission on all referred sales.</p>
            </div>

            <div className="card">
                <h3>When do I get paid?</h3>
                <p style={{ color: 'var(--text-muted)' }}>You can request a withdrawal at any time. We process payments within 48 hours.</p>
            </div>

            <div className="card">
                <h3>How is tracking done?</h3>
                <p style={{ color: 'var(--text-muted)' }}>We use a simple browser cookie/local storage tracking method that lasts for 30 days.</p>
            </div>
        </div>
    );
};

export default FAQ;
