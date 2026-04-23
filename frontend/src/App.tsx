import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// Types
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  status: 'Available' | 'Borrowed';
  borrowedBy?: string;
}

// Login Component
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple authentication for demo
    setTimeout(() => {
      if (username && password) {
        const user = {
          username: username,
          role: username === 'admin' ? 'admin' : 'user'
        };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Login successful!');
        window.location.href = '/books';
      } else {
        toast.error('Please enter username and password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Library Management System</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Admin: admin / any password</p>
          <p className="text-xs text-gray-600">User: user / any password</p>
        </div>
      </div>
    </div>
  );
};

// Book Modal Component
const BookModal = ({ isOpen, onClose, onSave, book }: any) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    status: 'Available' as 'Available' | 'Borrowed'
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        year: book.year,
        status: book.status
      });
    } else {
      setFormData({
        title: '',
        author: '',
        year: new Date().getFullYear(),
        status: 'Available'
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Book Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'Available' | 'Borrowed'})}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Available">Available</option>
              <option value="Borrowed">Borrowed</option>
            </select>
          </div>
          <div className="mt-6 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Book Card Component
const BookCard = ({ book, isAdmin, onEdit, onDelete, onBorrow, onReturn }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{book.title}</h3>
        <span className={`px-2 py-1 text-sm rounded-full ${
          book.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {book.status}
        </span>
      </div>
      <p className="text-gray-600 mb-1">Author: {book.author}</p>
      <p className="text-gray-600 mb-3">Year: {book.year}</p>
      {book.borrowedBy && <p className="text-sm text-gray-500 mb-3">Borrowed by: {book.borrowedBy}</p>}
      
      <div className="flex gap-2 mt-4">
        {book.status === 'Available' ? (
          <button
            onClick={() => onBorrow(book.id)}
            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
          >
            Borrow
          </button>
        ) : (
          <button
            onClick={() => onReturn(book.id)}
            className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700"
          >
            Return
          </button>
        )}
        
        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(book)}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(book.id)}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Books Component
const Books = () => {
  const [books, setBooks] = useState<Book[]>([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, status: 'Available' },
    { id: 2, title: '1984', author: 'George Orwell', year: 1949, status: 'Borrowed', borrowedBy: 'John Doe' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, status: 'Available' },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, status: 'Available' },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951, status: 'Borrowed', borrowedBy: 'Jane Smith' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const handleAddBook = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleSaveBook = (bookData: any) => {
    if (editingBook) {
      // Update existing book
      setBooks(books.map(book => 
        book.id === editingBook.id 
          ? { ...book, ...bookData }
          : book
      ));
      toast.success('Book updated successfully!');
    } else {
      // Add new book
      const newBook = {
        id: Math.max(...books.map(b => b.id), 0) + 1,
        ...bookData
      };
      setBooks([...books, newBook]);
      toast.success('Book added successfully!');
    }
  };

  const handleDeleteBook = (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(book => book.id !== id));
      toast.success('Book deleted successfully!');
    }
  };

  const handleBorrowBook = (id: number) => {
    setBooks(books.map(book => 
      book.id === id && book.status === 'Available'
        ? { ...book, status: 'Borrowed', borrowedBy: user.username || 'Current User' }
        : book
    ));
    toast.success('Book borrowed successfully!');
  };

  const handleReturnBook = (id: number) => {
    setBooks(books.map(book => 
      book.id === id && book.status === 'Borrowed'
        ? { ...book, status: 'Available', borrowedBy: undefined }
        : book
    ));
    toast.success('Book returned successfully!');
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-blue-600">Library Management System</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user.username || 'User'} ({isAdmin ? 'Admin' : 'User'})</span>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('isAuthenticated');
                  window.location.href = '/login';
                }} 
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Books Collection</h1>
          {isAdmin && (
            <button
              onClick={handleAddBook}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              + Add New Book
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Books</option>
            <option value="Available">Available</option>
            <option value="Borrowed">Borrowed</option>
          </select>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isAdmin={isAdmin}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                onBorrow={handleBorrowBook}
                onReturn={handleReturnBook}
              />
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Statistics</h3>
          <div className="flex gap-6">
            <div>
              <p className="text-gray-600">Total Books</p>
              <p className="text-2xl font-bold">{books.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {books.filter(b => b.status === 'Available').length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Borrowed</p>
              <p className="text-2xl font-bold text-red-600">
                {books.filter(b => b.status === 'Borrowed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBook}
        book={editingBook}
      />
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main App Component
function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/books" replace />} />
      </Routes>
    </Router>
  );
}

export default App;