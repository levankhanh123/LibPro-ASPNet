import React, { useEffect, useState } from 'react';
import { bookApi } from '../../api/bookApi';
import BookFormModal from '../books/BookFormModal';

const BookManagement = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState<any>(null);
    const [selectedBookItems, setSelectedBookItems] = useState<any[] | null>(null);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

    useEffect(() => { loadBooks(); }, []);

    const loadBooks = async () => {
        try {
            const res = await bookApi.getAll();
            setBooks(res.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData: FormData) => {
        try {
            if (editingBook) {
                await bookApi.update(editingBook.id, formData);
                alert("Update book successfully!");
            } else {
                await bookApi.create(formData);
                alert("Add book successfully!");
            }
            setShowForm(false);
            loadBooks();
        } catch (error: any) {
            alert("Error while saving!");
        }
    };

    const handleViewCopies = async (bookId: string) => {
        try {
            const res = await bookApi.getAdminDetails(bookId);
            if (res.data && res.data.bookItems) {
                setSelectedBookItems(res.data.bookItems);
                setSelectedBookId(bookId);
            } else {
                console.error("", res.data);
            }
        } catch (error) {
            alert("Cant load book item list.");
        }
    };

    const handleUpdateStatus = async (itemId: string, newStatus: number) => {
        if (!itemId || itemId === "undefined") {
            console.error("Error: BookItemID not exists!", itemId);
            alert("No book item found.");
            return;
        }

        try {
            await bookApi.updateItemStatus({
                bookItemId: itemId,
                status: newStatus
            });
            alert("Update successful!");
            handleViewCopies(selectedBookId!);
        } catch (error) {
            console.error("Update Status Error:", error);
            alert("Error while updating book item status.");
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (window.confirm("Delete this copy?")) {
            try {
                await bookApi.deleteBookItem(itemId);
                if (selectedBookItems) {
                    const updatedItems = selectedBookItems.map(item =>
                        item.id === itemId ? { ...item, isDeleted: true, status: 'Discarded' } : item
                    );
                    setSelectedBookItems(updatedItems);
                }
                loadBooks();
                alert("Delete book success!");
            } catch (error) {
                alert("Error while deleting book item");
            }
        }
    };

    const handleRestoreItem = async (itemId: string) => {
        try {
            await bookApi.restoreBookItem(itemId);
            if (selectedBookItems) {
                const updatedItems = selectedBookItems.map(item =>
                    item.id === itemId ? { ...item, isDeleted: false } : item
                );
                setSelectedBookItems(updatedItems);
            }
            loadBooks();
            alert("Restore successful!");
        } catch (error) {
            console.error("Restore error:", error);
            alert("Error while restore!");
        }
    };

    const convertStatusNameToNumber = (statusName: string) => {
        switch (statusName) {
            case 'Available': return 1;
            case 'Reserved': return 2;
            case 'Loaned': return 3;
            case 'InRepair': return 4;
            case 'Lost': return 5;
            case 'Discarded': return 6;
            default: return 1;
        }
    };

    const getStatusClass = (status: any) => {
        const s = typeof status === 'string' ? status : String(status);
        if (s === '1' || s === 'Available') return 'available';
        if (s === '2' || s === 'Reserved' || s === '3' || s === 'Loaned') return 'unavailable';
        return 'maintenance';
    };

    const getImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/40x60?text=No+Cover';
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
        return url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="main-content">
            <header className="header-actions">
                <div>
                    <h2>Book Management</h2>
                </div>
                <button className="btn-add" onClick={() => { setEditingBook(null); setShowForm(true); }}>
                    Add New Book
                </button>
            </header>

            {loading ? <p>Loading data...</p> : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Book Information</th>
                            <th>ISBN</th>
                            <th>Quantity</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>
                                    <div className="book-table-info">
                                        <img src={getImageUrl(book.coverImageUrl)} className="book-cover-small" alt="" />
                                        <div>
                                            <div className="table-title">{book.title}</div>
                                            <small>{book.author}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>{book.isbn}</td>
                                <td className="text-center">
                                    <span className={book.availableCopies > 0 ? 'success-text' : 'danger-text'}>
                                        {book.availableCopies}
                                    </span> / {book.totalCopies}
                                </td>
                                <td>{book.isDigital ? <span className="badge-digital">E-Book</span> : "Physical book"}</td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn-restore" onClick={() => { setEditingBook(book); setShowForm(true); }}>Edit</button>
                                        <button className="btn-add" onClick={() => handleViewCopies(book.id)}>Copies</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedBookItems && (
                <div className="modal-overlay">
                    <div className="modal-content modal-wide">
                        <h3>Detailed Copy List</h3>
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Barcode</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Update Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBookItems.map((item: any) => (
                                        <tr key={item.id} className={item.isDeleted ? "row-deleted" : ""}>
                                            <td><code>{item.barcode}</code></td>
                                            <td>{item.location || 'Undefined'}</td>
                                            <td>
                                                <span className={`status-pill ${item.isDeleted ? 'deleted' : getStatusClass(item.status)}`}>
                                                    {item.isDeleted ? 'Deleted' : (item.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={typeof item.status === 'string' ? convertStatusNameToNumber(item.status) : item.status}
                                                    onChange={(e) => handleUpdateStatus(item.id, parseInt(e.target.value))}
                                                    disabled={
                                                        item.isDeleted ||
                                                        item.status === 2 || item.status === 'Reserved' ||
                                                        item.status === 3 || item.status === 'Loaned' ||
                                                        item.status === 6 || item.status === 'Discarded'
                                                    }
                                                >
                                                    <option value={1}>Available</option>
                                                    <option value={4}>In Repair</option>
                                                    <option value={5}>Lost</option>
                                                    <option value={6}>Discarded</option>
                                                </select>
                                            </td>
                                            <td>
                                                {!item.isDeleted ? (
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        disabled={
                                                            item.status === 2 || item.status === 'Reserved' ||
                                                            item.status === 3 || item.status === 'Loaned'
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                ) : (
                                                    <button className="btn-restore" onClick={() => handleRestoreItem(item.id)}>
                                                        Restore
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setSelectedBookItems(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <BookFormModal
                isOpen={showForm}
                onClose={() => { setShowForm(false); setEditingBook(null); }}
                onSave={handleSave}
                initialData={editingBook}
            />
        </div>
    );
};

export default BookManagement;
