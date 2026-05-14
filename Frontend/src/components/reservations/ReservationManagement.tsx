import React, { useEffect, useState } from 'react';
import { reservationApi } from '../../api/reservationApi';
import ReservationStatusBadge from './ReservationStatusBadge';

interface Reservation {
    id: string;
    readerName: string;
    bookTitle: string;
    barcode: string;
    reservedDate: string;
    status: string;
}

const ReservationManagement: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await reservationApi.getPending();
            setReservations(response.data);
            setError(null);
        } catch (err: any) {
            setError("Can not load reservation list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleConfirm = async (id: string) => {
        if (!window.confirm("Borrow this book?")) return;
        try {
            await reservationApi.confirmToLoan(id);
            alert("Borrowed successfully!");
            fetchReservations();
        } catch (err: any) {
            alert(err.response?.data?.Error || "Error occurred while confirming loan.");
        }
    };

    const handleCancel = async (id: string) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;
        try {
            await reservationApi.cancel(id);
            alert("Request canceled successfully.");
            fetchReservations();
        } catch (err: any) {
            alert("Error occurred while canceling request.");
        }
    };

    const canConfirm = (status: string) => status.toString() === "2" || status === "Ready";

    return (
        <div className="loan-history-container">
            <div className="page-header">
                <div>
                    <h2>Reservation Management</h2>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <table className="management-table">
                <thead>
                    <tr>
                        <th>Reader</th>
                        <th>Book Title</th>
                        <th>Barcode</th>
                        <th>Reservation Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={6} className="empty-cell">Loading...</td></tr>
                    ) : reservations.length === 0 ? (
                        <tr><td colSpan={6} className="empty-cell">No reservation requests.</td></tr>
                    ) : (
                        reservations.map((item) => (
                            <tr key={item.id}>
                                <td>{item.readerName}</td>
                                <td>{item.bookTitle}</td>
                                <td><code>{item.barcode}</code></td>
                                <td>{new Date(item.reservedDate).toLocaleDateString('vi-VN')}</td>
                                <td><ReservationStatusBadge status={item.status} /></td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="btn-confirm"
                                            onClick={() => handleConfirm(item.id)}
                                            disabled={!canConfirm(item.status)}
                                        >
                                            Confirm Borrow
                                        </button>
                                        <button className="btn-delete" onClick={() => handleCancel(item.id)}>
                                            Cancel
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationManagement;
