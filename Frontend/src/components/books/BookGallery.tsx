import React, { useEffect, useState } from 'react';
import { bookApi } from '../../api/bookApi';
import { BookResponse } from '../../types/book';
import { ReserveBookRequest } from '../../types/reservation';
import BookCard from '././BookCard';
import BorrowModal from '././BorrowModal';
import { reservationApi } from '../../api/reservationApi';

const getErrorMessage = (error: any) => {
    const data = error?.response?.data;

    if (typeof data === 'string' && data.trim()) {
        return data;
    }

    return data?.message || data?.error || data?.title || error?.message || 'Error while reserving book!';
};

const BookGallery = () => {
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookResponse | null>(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        const res = await bookApi.getAll();
        const visibleBooks = res.data.filter((b: BookResponse) => !b.isDeleted);
        setBooks(visibleBooks);
    };

    const handleBorrowSubmit = async (request: ReserveBookRequest) => {
        try {
            await reservationApi.reserveBook(request);
            alert("Book request submitted successfully.");
            setSelectedBook(null);
            loadBooks();
        } catch (error: any) {
            alert(getErrorMessage(error));
        }
    };

    return (
        <div className="book-gallery-container">
            <div className="grid-layout">
                {books.map(book => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onBorrow={(b) => setSelectedBook(b)}
                    />
                ))}
            </div>

            {selectedBook && (
                <BorrowModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                    onConfirm={handleBorrowSubmit}
                />
            )}
        </div>
    );
};

export default BookGallery;