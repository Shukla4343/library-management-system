import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  status: 'available' | 'borrowed';
  borrowedBy?: string;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, status: 'available' },
    { id: 2, title: '1984', author: 'George Orwell', year: 1949, status: 'borrowed', borrowedBy: 'John Doe' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, status: 'available' },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, status: 'available' },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951, status: 'borrowed', borrowedBy: 'Jane Smith' },
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
        ...bookData,
        status: 'available'
      };
      setBooks([...books, newBook]);
      toast.success('Book added successfully!');
    }
    setIsModalOpen(false);
  };

  const handleDeleteBook = (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(book => book.id !== id));
      toast.success('Book deleted successfully!');
    }
  };

  const handleBorrowBook = (id: number) => {
    setBooks(books.map(book => 
      book.id === id && book.status === 'available'
        ? { ...book, status: 'borrowed', borrowedBy: user.username || 'Current User' }
        : book
    ));
    toast.success('Book borrowed successfully!');
  };

  const handleReturnBook = (id: number) => {
    setBooks(books.map(book => 
      book.id === id && book.status === 'borrowed'
        ? { ...book, status: 'available', borrowedBy: undefined }
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

  // Book Modal Component
  const BookModal = () => {
    const [formData, setFormData] = useState({
      title: editingBook?.title || '',
      author: editingBook?.author || '',
      year: editingBook?.year || new Date().getFullYear(),
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title || !formData.author || !formData.year) {
        toast.error('Please fill all fields');
        return;
      }
      handleSaveBook(formData);
    };

    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year *</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1450"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Books Collection</h1>
          {isAdmin && (
            <button
              onClick={handleAddBook}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add New Book
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Books</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
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
              <div key={book.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{book.title}</h3>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    book.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.status === 'available' ? 'Available' : 'Borrowed'}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">Author: {book.author}</p>
                <p className="text-gray-600 mb-3">Year: {book.year}</p>
                {book.borrowedBy && (
                  <p className="text-sm text-gray-500 mb-3">Borrowed by: {book.borrowedBy}</p>
                )}
                
                <div className="flex gap-2 mt-4">
                  {book.status === 'available' ? (
                    <button
                      onClick={() => handleBorrowBook(book.id)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Borrow
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReturnBook(book.id)}
                      className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Return
                    </button>
                  )}
                  
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEditBook(book)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
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
                {books.filter(b => b.status === 'available').length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Borrowed</p>
              <p className="text-2xl font-bold text-red-600">
                {books.filter(b => b.status === 'borrowed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <BookModal />
    </div>
  );
};

export default Books;