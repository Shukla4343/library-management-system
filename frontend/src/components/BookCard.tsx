import React from 'react';
import { Edit, Trash2, BookOpen, User, Calendar } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onBorrow: () => void;
  onReturn: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  isAdmin,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
}) => {
  const isAvailable = book.status === 'available';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
            <div className="space-y-2">
              <p className="text-gray-600 flex items-center">
                <User className="h-4 w-4 mr-2" />
                {book.author}
              </p>
              <p className="text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {book.publishedYear}
              </p>
            </div>
          </div>
          <div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {book.status}
            </span>
          </div>
        </div>

        {!isAvailable && book.borrowedBy && (
          <div className="mt-3 text-sm text-gray-500">
            Borrowed by: {book.borrowedBy.username}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {isAvailable ? (
            <button
              onClick={onBorrow}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <BookOpen className="h-4 w-4 inline mr-1" />
              Borrow
            </button>
          ) : (
            <button
              onClick={onReturn}
              className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              Return
            </button>
          )}

          {isAdmin && (
            <>
              <button
                onClick={onEdit}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;