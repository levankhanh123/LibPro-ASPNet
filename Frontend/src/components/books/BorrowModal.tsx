import React, { useState } from 'react';
import { BookResponse } from '../../types/book';
import { ReserveBookRequest } from '../../types/reservation';

interface Props {
    book: BookResponse;
    onClose: () => void;
    onConfirm: (request: ReserveBookRequest) => void;
}

const BorrowModal: React.FC<Props> = ({ book, onClose, onConfirm }) => {
    const activeItems = book.bookItems?.filter((i: any) => !i.isDeleted) || [];
    const [borrowDays, setBorrowDays] = useState(7);
    const [selectedBarcode, setSelectedBarcode] = useState<string | undefined>(
        book.isDigital ? undefined : activeItems.find(i => String(i.status) === "Available")?.barcode
    );

    const handleConfirm = () => {
        if (!book.isDigital && !selectedBarcode) {
            alert("Choose a book instead!");
            return;
        }

        const request: ReserveBookRequest = {
            bookId: book.id,
            barcode: selectedBarcode ?? ''
        };

        onConfirm(request);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-narrow">
                <h3>Borrow Book</h3>
                <p className="modal-copy"><strong>{book.title}</strong></p>

                <div className="form-group">
                    <label>Borrow Days</label>
                    <input
                        type="number"
                        min={1}
                        max={30}
                        value={borrowDays}
                        onChange={(e) => setBorrowDays(Number(e.target.value) || 1)}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Book Copy</label>
                    {book.isDigital ? (
                        <p className="status-pill available">E-Book available</p>
                    ) : (
                        <select
                            value={selectedBarcode}
                            onChange={(e) => setSelectedBarcode(e.target.value)}
                            className="form-control"
                        >
                            {!selectedBarcode && <option value="">Choose a copy</option>}
                            {activeItems.map((item: any) => (
                                <option
                                    key={item.id}
                                    value={item.barcode}
                                    disabled={String(item.status) !== "Available"}
                                >
                                    {item.barcode}
                                    {String(item.status) === "Available" ? ' (Available)' : ' (Unavailable)'}
                                    {item.location ? ` - Shelf: ${item.location}` : ''}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cancel">Cancel</button>
                    <button
                        onClick={handleConfirm}
                        className="btn-confirm"
                        disabled={!book.isDigital && !selectedBarcode}
                    >
                        Confirm Borrow
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BorrowModal;
