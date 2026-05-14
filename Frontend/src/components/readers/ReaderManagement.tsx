import React, { useCallback, useEffect, useState } from 'react';
import { readerApi } from '../../api/readerApi';
import ReaderFormModal from './ReaderFormModal';

const ReaderManagement = () => {
    const [readers, setReaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingReader, setEditingReader] = useState<any>(null);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to deactivate this reader and lock their account?")) {
            try {
                await readerApi.delete(id);
                alert("Reader deactivated!");
                loadReaders();
            } catch (error: any) {
                alert(error.response?.data?.message || "Error deactivating");
            }
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await readerApi.restore(id);
            alert("Reader restored!");
            loadReaders();
        } catch (error: any) {
            alert("Error restoring reader");
        }
    };

    const loadReaders = useCallback(async () => {
        try {
            const res = await readerApi.getAll();
            setReaders(res.data);
        } catch (error) {
            console.error("Error loading readers:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSave = async (formData: any) => {
        try {
            if (editingReader) {
                await readerApi.update(editingReader.id, formData);
                alert("Update reader successfully!");
            }
            setShowModal(false);
            setEditingReader(null);
            loadReaders();
        } catch (error: any) {
            alert(error.response?.data?.error || "Error saving reader");
        }
    };

    useEffect(() => {
        loadReaders();
    }, [loadReaders]);

    return (
        <div className="management-container">
            <div className="header-actions">
                <div>
                    <h2>Reader Management</h2>
                </div>
                <button className="btn-add" onClick={() => { setEditingReader(null); setShowModal(true); }}>
                    Register New Reader
                </button>
            </div>

            <table className="management-table">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Card Number</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Expiry Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={8} className="empty-cell">Loading...</td></tr>
                    ) : (
                        readers.map(reader => (
                            <tr key={reader.id}>
                                <td><strong>{reader.fullName}</strong></td>
                                <td><code>{reader.libraryCardNumber}</code></td>
                                <td>{reader.phoneNumber}</td>
                                <td title={reader.address}>
                                    <div className="truncate-cell">{reader.address}</div>
                                </td>
                                <td>
                                    <span className="status-badge">{reader.readerTypeName}</span>
                                </td>
                                <td>
                                    <span className={`status-pill ${reader.isDeleted ? 'unavailable' : 'available'}`}>
                                        {reader.isDeleted ? 'Inactive' : 'Active'}
                                    </span>
                                </td>
                                <td>{new Date(reader.expiryDate).toLocaleDateString('en-GB')}</td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn-edit" onClick={() => { setEditingReader(reader); setShowModal(true); }}>
                                            Edit
                                        </button>
                                        {reader.isDeleted ? (
                                            <button className="btn-restore" onClick={() => handleRestore(reader.id)}>
                                                Restore
                                            </button>
                                        ) : (
                                            <button className="btn-delete" onClick={() => handleDelete(reader.id)}>
                                                Deactivate
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {showModal && (
                <ReaderFormModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    initialData={editingReader}
                />
            )}
        </div>
    );
};

export default ReaderManagement;
