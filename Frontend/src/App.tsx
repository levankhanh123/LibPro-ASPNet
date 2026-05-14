import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterReaderForm from './components/auth/RegisterReaderForm';
import AdminLayout from './components/Layout/AdminLayout';
import LibrarianLayout from './components/Layout/LibrarianLayout';
import ReaderLayout from './components/Layout/ReaderLayout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const AdminDashboard = lazy(() => import('./components/audit/AdminDashboard'));
const SystemAuditLog = lazy(() => import('./components/audit/SystemAuditLog'));
const StaffManagement = lazy(() => import('./components/staffs/StaffManagment'));
const CategoryManagement = lazy(() => import('./components/categories/CategoryManagement'));
const BookManagement = lazy(() => import('./components/books/BookManagement'));
const ReaderManagement = lazy(() => import('./components/readers/ReaderManagement'));
const ReservationManagement = lazy(() => import('./components/reservations/ReservationManagement'));
const LibrarianLoanManagement = lazy(() => import('./components/loans/LibrarianLoanManagement'));
const SupplierManagement = lazy(() => import('./components/suppliers/SupplierManagement'));
const PublisherManagement = lazy(() => import('./components/publishers/PublisherManagement'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const BookGallery = lazy(() => import('./components/books/BookGallery'));
const ReaderLoanHistory = lazy(() => import('./components/loans/ReaderLoanHistory'));
const ReaderReservationHistory = lazy(() => import('./components/reservations/ReaderReservationHistory'));

function App() {
    return (
        <AuthProvider>
            <div id="app">
                <div id="center">
                    <BrowserRouter>
                        <Suspense fallback={<div className="empty-state">Loading...</div>}>
                            <Routes>
                                <Route path="/login" element={<LoginForm />} />
                                <Route path="/register" element={<RegisterReaderForm />} />
                                <Route path="/unauthorized" element={<div className="empty-state">You do not have permission to access this page.</div>} />

                                <Route element={<ProtectedRoute allowedRoles={['Director']} />}>
                                    <Route path="/admin" element={<AdminLayout />}>
                                        <Route index element={<Navigate to="dashboard" />} />
                                        <Route path="dashboard" element={<AdminDashboard />} />
                                        <Route path="librarians" element={<StaffManagement />} />
                                        <Route path="system-logs" element={<SystemAuditLog />} />
                                        <Route path="profile" element={<UserProfile />} />
                                    </Route>
                                </Route>

                                <Route element={<ProtectedRoute allowedRoles={['Librarian']} />}>
                                    <Route path="/librarian" element={<LibrarianLayout />}>
                                        <Route index element={<Navigate to="categories" />} />
                                        <Route path="categories" element={<CategoryManagement />} />
                                        <Route path="books" element={<BookManagement />} />
                                        <Route path="readers" element={<ReaderManagement />} />
                                        <Route path="reservations" element={<ReservationManagement />} />
                                        <Route path="loans" element={<LibrarianLoanManagement />} />
                                        <Route path="suppliers" element={<SupplierManagement />} />
                                        <Route path="publishers" element={<PublisherManagement />} />
                                        <Route path="profile" element={<UserProfile />} />
                                    </Route>
                                </Route>

                                <Route element={<ProtectedRoute allowedRoles={['Reader']} />}>
                                    <Route path="/reader" element={<ReaderLayout />}>
                                        <Route index element={<Navigate to="books" />} />
                                        <Route path="books" element={<BookGallery />} />
                                        <Route path="reservations" element={<ReaderReservationHistory />} />
                                        <Route path="my-loans" element={<ReaderLoanHistory />} />
                                        <Route path="profile" element={<UserProfile />} />
                                    </Route>
                                </Route>

                                <Route path="/" element={<Navigate to="/login" />} />
                                <Route path="*" element={<Navigate to="/login" />} />
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </div>
            </div>
        </AuthProvider>
    );
}

export default App;
