import React, { useEffect, useState } from 'react';
import { loanApi } from '../../api/loanApi';

const LibrarianLoanManagement = () => {
    const [loanDetails, setLoanDetails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDetail, setSelectedDetail] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [statusPair, setStatusPair] = useState({ loan: 2, book: 1 });

    useEffect(() => {
        loadActiveLoans();
    }, []);

    const loadActiveLoans = async () => {
        try {
            setLoading(true);
            const res = await loanApi.getAllActiveLoanDetails();
            setLoanDetails(res.data);
        } catch (error) {
            console.error("Error loading active loans:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleActionChange = (actionValue: number) => {
        switch (actionValue) {
            case 2:
                setStatusPair({ loan: 2, book: 1 });
                break;
            case 6:
                setStatusPair({ loan: 6, book: 5 });
                break;
            case 4:
                setStatusPair({ loan: 4, book: 4 });
                break;
            default:
                setStatusPair({ loan: 2, book: 1 });
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await loanApi.updateDetailStatus(selectedDetail.id, statusPair.loan, statusPair.book);
            setShowModal(false);
            setLoanDetails(prev => prev.filter(item => item.id !== selectedDetail.id));
            alert("Update system successfully!");
        } catch (err: any) {
            alert(err.response?.data?.Error || "Error occurred while updating");
        }
    };

    return (
        <div className="management-container">
            <div className="page-header">
                <div>
                    <h2>Loan Management</h2>
                </div>
            </div>

            {showModal && selectedDetail && (
                <div className="modal-overlay">
                    <div className="modal-content modal-narrow">
                        <div className="modal-header">
                            <h3>Reclaim Book Copy</h3>
                        </div>

                        <div className="modal-body">
                            <p className="modal-copy">
                                Process <strong>{selectedDetail.bookTitle}</strong>
                            </p>
                            <code>Barcode: {selectedDetail.barcode}</code>

                            <div className="form-group modal-field">
                                <label>Reclaim Method</label>
                                <select
                                    className="data-table-select"
                                    value={statusPair.loan}
                                    onChange={(e) => handleActionChange(Number(e.target.value))}
                                >
                                    <option value={2}>Return</option>
                                    <option value={6}>Report Lost</option>
                                    <option value={4}>Pending Fine</option>
                                </select>
                            </div>

                            <div className="status-preview-box">
                                <p>Result</p>
                                <div className="status-preview-row">
                                    <small>Loan Status</small>
                                    <span className={`status-pill ${statusPair.loan === 2 ? 'available' : 'maintenance'}`}>
                                        {statusPair.loan === 2 ? "Returned" : statusPair.loan === 6 ? "Lost" : "Pending Fine"}
                                    </span>
                                </div>
                                <div className="status-preview-row">
                                    <small>Book Copy Status</small>
                                    <span className={`status-pill ${statusPair.book === 1 ? 'available' : 'unavailable'}`}>
                                        {statusPair.book === 1 ? "Available" : statusPair.book === 5 ? "Lost" : "In Repair"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-add" onClick={handleUpdateStatus}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Reader</th>
                        <th>Book</th>
                        <th>Loan Date</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={5} className="empty-cell">Loading...</td></tr>
                    ) : loanDetails.length === 0 ? (
                        <tr><td colSpan={5} className="empty-cell">No active loan details.</td></tr>
                    ) : (
                        loanDetails.map((detail) => (
                            <tr key={detail.id}>
                                <td>{detail.readerName}</td>
                                <td>
                                    <strong>{detail.bookTitle}</strong><br />
                                    <small>Barcode: {detail.barcode}</small>
                                </td>
                                <td>{new Date(detail.loanDate).toLocaleDateString('vi-VN')}</td>
                                <td>{new Date(detail.dueDate).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <button className="btn-add" onClick={() => {
                                        setSelectedDetail(detail);
                                        setStatusPair({ loan: 2, book: 1 });
                                        setShowModal(true);
                                    }}>
                                        Reclaim
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

export default LibrarianLoanManagement;
