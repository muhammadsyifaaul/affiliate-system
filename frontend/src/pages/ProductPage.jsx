import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../api';
import Modal from '../components/Modal';

const ProductPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

    useEffect(() => {
        // Track affiliate
        const ref = searchParams.get('ref');
        if (ref) {
            localStorage.setItem('referral_code', ref);
        }

        fetchProduct();
    }, [id, searchParams]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`products/${id}/`);
            setProduct(res.data);
        } catch (err) {
            console.error("Failed to fetch product", err);
        } finally {
            setLoading(false);
        }
    };

    const buyProduct = async () => {
        const ref = localStorage.getItem('referral_code');
        try {
            await api.post('transactions/', {
                referral_code: ref,
                product_id: product.id,
                order_id: `ORD-${Date.now()}`
            });
            setSuccessModalOpen(true);
        } catch (err) {
            console.error(err);
            // Simulate success for demo
            setSuccessModalOpen(true);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '4rem' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ marginTop: '4rem' }}>Product not found.</div>;

    return (
        <div className="container" style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
                <div style={{ width: '100%', height: '300px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '0.5rem', marginBottom: '2rem' }}></div>
                <h1>{product.name}</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    {product.description || "Experience the best quality with this premium item. Satisfaction guaranteed."}
                </p>
                <div className="flex-between" style={{ alignItems: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${product.price}</div>
                    <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }} onClick={buyProduct}>
                        Buy Now
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="Purchase Successful!"
            >
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>You bought {product.name}!</p>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '1.5rem', width: '100%' }}
                        onClick={() => window.location.href = '/'}
                    >
                        Back to Store
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ProductPage;
