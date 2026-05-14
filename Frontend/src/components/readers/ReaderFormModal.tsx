import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ReaderFormModal = ({ isOpen, onClose, onSave, initialData }: any) => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        accountId: user?.userId || '',
        libraryCardNumber: '',
        fullName: '',
        gender: 0,
        dateOfBirth: '',
        street: '',
        ward: '',
        district: '',
        city: '',
        phoneNumber: '',
        readerTypeName: 'Guest',
        isDeleted: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                fullName: initialData.fullName || '',
                phoneNumber: initialData.phoneNumber || '',
                readerTypeName: initialData.readerTypeName || 'Guest',
                gender: initialData.gender || 0,
                dateOfBirth: initialData.dateOfBirth?.split('T')[0] || '',
                isDeleted: initialData.isDeleted || false
            }));
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-wide">
                <div className="modal-header">
                    <h3>{initialData ? "Update Reader Profile" : "Register New Reader"}</h3>
                </div>

                <form onSubmit={handleSubmit} className="management-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={formData.fullName} required
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" value={formData.phoneNumber} required
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-row form-row-3">
                        <div className="form-group">
                            <label>Gender</label>
                            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: parseInt(e.target.value) })}>
                                <option value={0}>Female</option>
                                <option value={1}>Male</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" value={formData.dateOfBirth} required
                                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Reader Type</label>
                            <select value={formData.readerTypeName} onChange={e => setFormData({ ...formData, readerTypeName: e.target.value })}>
                                <option value="Guest">Guest</option>
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section-title">Address Information</div>
                    <div className="form-panel form-row">
                        <div className="form-group">
                            <input placeholder="Street Name" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <input placeholder="Ward" value={formData.ward} onChange={e => setFormData({ ...formData, ward: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <input placeholder="District" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <input placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-save">
                            {initialData ? "Save Changes" : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReaderFormModal;
