import React, { useEffect, useState } from 'react';
import { reservationApi } from '../../api/reservationApi';

interface Reservation {
    id: string;
    bookTitle: string;
    barcode: string;
    reservedDate: string;
    expiryDate?: string;
    status: string;
}

const ReaderReservationHistory: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMyReservations = async () => {
        setLoading(true);
        try {
            const response = await reservationApi.getMyActive();
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching my reservations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyReservations();
    }, []);

    const handleCancel = async (id: string) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
        try {
            await reservationApi.cancel(id);
            alert("Reservation canceled successfully.");
            fetchMyReservations();
        } catch (error) {
            alert("Failed to cancel reservation at this time.");
        }
    };

    const isReady = (status: string) => status === 'Ready' || status === '2';

    return (
        <div className="loan-history-container">
            <div className="page-header">
                <div>
                    <h2>My Reservations</h2>
                </div>
            </div>

            <table className="management-table">
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Barcode</th>
                        <th>Reservation Date</th>
                        <th>Expiration Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={6} className="empty-cell">Loading...</td></tr>
                    ) : reservations.length === 0 ? (
                        <tr><td colSpan={6} className="empty-cell">You have no reservation requests.</td></tr>
                    ) : (
                        reservations.map((item) => (
                            <tr key={item.id}>
                                <td><strong>{item.bookTitle}</strong></td>
                                <td><code>{item.barcode}</code></td>
                                <td>{new Date(item.reservedDate).toLocaleDateString('vi-VN')}</td>
                                <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('vi-VN') : '---'}</td>
                                <td>
                                    <span className={`status-pill ${isReady(item.status) ? 'available' : 'unavailable'}`}>
                                        {isReady(item.status) ? 'Ready to pick up' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-delete" onClick={() => handleCancel(item.id)}>
                                        Cancel Reservation
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReaderReservationHistory;
