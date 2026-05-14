import React, { useEffect, useState } from 'react';
import { loanApi } from '../../api/loanApi';
import LoanStatusBadge from './LoanStatusBadge';

const ReaderLoanHistory = () => {
    const [loans, setLoans] = useState<any[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await loanApi.getMyHistory();
                setLoans(res.data);
            } catch (err) {
                console.error("Error while loading history:", err);
            }
        };
        fetchHistory();
    }, []);

    const handleExtend = async (loanDetailId: string) => {
        if (!window.confirm("Are you sure you want to extend the loan by 7 days?")) return;

        try {
            await loanApi.extendLoan(loanDetailId, 7);
            alert("Extend successful!");
            const res = await loanApi.getMyHistory();
            setLoans(res.data);
        } catch (err: any) {
            const errorMsg = err.response?.data?.Error || "Cannot extend loan.";
            alert(errorMsg);
        }
    };

    return (
        <div className="loan-history-container">
            <div className="page-header">
                <div>
                    <h2>Your Loan History</h2>
                </div>
            </div>

            <table className="management-table">
                <thead>
                    <tr>
                        <th>Title / Ticket Number</th>
                        <th>Loan Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loans && loans.length > 0 ? (
                        loans.map((loan) => (
                            <React.Fragment key={loan.id}>
                                {loan.details && loan.details.length > 0 ? (
                                    loan.details.map((detail: any) => {
                                        const isLoanActive = detail.status === 'Active' || detail.status === 1;
                                        const isNotOverdue = new Date(detail.dueDate) > new Date();
                                        const hasNotRenewed = (detail.renewalCount || 0) < 1;
                                        const canExtend = isLoanActive && isNotOverdue && hasNotRenewed;

                                        return (
                                            <tr key={detail.id || detail.Id}>
                                                <td>
                                                    <strong>{detail.bookTitle || detail.BookTitle || "N/A"}</strong>
                                                    <div className="muted-small">Barcode: {detail.barcode || "N/A"}</div>
                                                </td>
                                                <td>{new Date(loan.loanDate).toLocaleDateString('vi-VN')}</td>
                                                <td>{detail.dueDate ? new Date(detail.dueDate).toLocaleDateString('vi-VN') : '---'}</td>
                                                <td>
                                                    <LoanStatusBadge
                                                        status={detail.status || detail.Status}
                                                        description={detail.status || detail.Status}
                                                    />
                                                </td>
                                                <td>
                                                    {detail.accessToken ? (
                                                        <a href={`/read/${detail.accessToken}`} className="btn-read">Read E-Book</a>
                                                    ) : (
                                                        <div className="stack-actions">
                                                            <span className="status-physical">At Counter</span>
                                                            {canExtend && (
                                                                <button
                                                                    onClick={() => handleExtend(detail.id)}
                                                                    className="btn-extend-action"
                                                                >
                                                                    Extend 7 days
                                                                </button>
                                                            )}
                                                            {detail.renewalCount > 0 && (
                                                                <small className="success-text">Extended</small>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="empty-cell">No details for this loan.</td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="empty-cell">No loan history found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReaderLoanHistory;
