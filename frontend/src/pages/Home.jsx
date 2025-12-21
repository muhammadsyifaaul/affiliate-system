import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import Modal from '../components/Modal';

const Home = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            localStorage.setItem('referral_code', ref);
            setMessage(`Referral code ${ref} tracked!`);
        }
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            const res = await api.get('products/');
            setProducts(Array.isArray(res.data) ? res.data : res.data.results);
        } catch (err) {
            console.error("Failed to fetch products", err);
            // Fallback for demo if API fails
            setProducts([
                { id: 1, name: "Premium Widget", price: "100.00" },
                { id: 2, name: "Super Gadget", price: "200.00" }
            ]);
        }
    };

    const buyProduct = async (product) => {
        const ref = localStorage.getItem('referral_code');

        try {
            await api.post('transactions/', {
                referral_code: ref,
                product_id: product.id,
                order_id: `DEMO-${Date.now()}`
            });
            setSuccessModalOpen(true);
        } catch (err) {
            console.error(err);
            // Even if api fails (e.g. no ref code), we act like purchase worked for the buyer
            setSuccessModalOpen(true);
        }
    };

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1>The Best Widget Store</h1>
            <p className="lead" style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
                Buy our premium widgets and support your favorite creators.
            </p>

            {message && <div className="badge badge-success" style={{ marginBottom: '1rem', display: 'inline-block' }}>{message}</div>}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                {products.map(p => (
                    <div key={p.id} className="card" style={{ width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: '150px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '0.5rem', marginBottom: '1rem' }}></div>
                        <h3>{p.name}</h3>
                        <p>${p.price}</p>
                        <button className="btn btn-primary" onClick={() => buyProduct(p)}>Buy Now</button>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="Order Confirmed!"
            >
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Thank you for your purchase!</p>
                    <p style={{ color: 'var(--text-muted)' }}>Your order has been successfully processed.</p>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '1.5rem', width: '100%' }}
                        onClick={() => setSuccessModalOpen(false)}
                    >
                        Continue Shopping
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Home;
