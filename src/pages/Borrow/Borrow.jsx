import { useState, useEffect } from 'react'
import Modal from '../../components/Modal'

const apiUrl = 'https://libraryappspringboot-main-fwxf.onrender.com'
//API URL'sini ayarla
const Borrow = () => {
  const [modalOpen, setModalOpen] = useState(false) //Modal penceresini ayarla
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerMail: '',
    borrowingDate: '',
    returnDate: '',
    bookId: ''
  }) //Form verilerini ayarla
  const [editData, setEditData] = useState(null) //Düzenlenecek verileri ayarla
  const [borrowings, setBorrowings] = useState([]) //kitapları düzenle ve ayarla
  const [books, setBooks] = useState([]) //kitapları düzenle ve ayarla
  const [actionType, setActionType] = useState(null) //crud işlem türünü ayarla
  const [errorMessage, setErrorMessage] = useState('') //Hata mesajını ayarla

  const handleOpenModal = () => setModalOpen(true) //Modal penceresini aç
  const handleCloseModal = () => {
    setModalOpen(false)
    setActionType(null)
    setErrorMessage('')
  }
  //API'den verileri al
  useEffect(() => {
    fetch(`${apiUrl}/api/v1/books`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json()
      })
      .then(data => {
        setBooks(data)
      })
      .catch(error => {
        console.error('Error fetching books:', error)
        setErrorMessage('There was an error loading the books.')
      })

    fetch(`${apiUrl}/api/v1/borrows`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json()
      })
      .then(data => {
        setBorrowings(data)
      })
      .catch(error => {
        console.error('Error fetching borrowings:', error)
        setErrorMessage('An error occurred while loading borrowing records.')
      })
  }, [])
  //Formdaki tarihleri ayarla
  useEffect(() => {
    if (formData.borrowingDate) {
      const borrowingDate = new Date(formData.borrowingDate)
      borrowingDate.setDate(borrowingDate.getDate() + 7)
      setFormData(prev => ({
        ...prev,
        returnDate: borrowingDate.toISOString().split('T')[0]
      }))
    }
  }, [formData.borrowingDate])
  //Ekleme, güncelleme işlemlerini yap
  const handleSubmit = e => {
    e.preventDefault()

    if (!formData.returnDate) {
      setErrorMessage('Return date is missing!')
    }
    const url = editData
      ? `${apiUrl}/api/v1/borrows/${editData.id}`
      : `${apiUrl}/api/v1/borrows`
    const method = editData ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        borrowerName: formData.borrowerName,
        borrowerMail: formData.borrowerMail,
        borrowingDate: formData.borrowingDate,
        returnDate: formData.returnDate,
        bookForBorrowingRequest: {
          id: formData.bookId,
          name: '',
          publicationYear: '',
          stock: ''
        }
      })
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json()
      })
      .then(data => {
        if (editData) {
          setBorrowings(borrowings.map(b => (b.id === editData.id ? data : b)))
          setEditData(null)
          setActionType('update')
        } else {
          setBorrowings([...borrowings, data])
          setActionType('add')
        }
        handleOpenModal()

        setFormData({
          borrowerName: '',
          borrowerMail: '',
          borrowingDate: '',
          returnDate: '',
          bookId: ''
        })
      })
      .catch(error => {
        console.error('Error:', error)
        setErrorMessage('An error occurred during the borrowing process.')
      })
    console.log('Form data to be submitted:', formData)
  }
  //Düzenleme işlemini yap
  const handleEdit = borrowing => {
    setFormData({
      borrowerName: borrowing.borrowerName || '',
      borrowerMail: borrowing.borrowerMail || '',
      borrowingDate: borrowing.borrowingDate || '',
      returnDate: borrowing.returnDate || '',
      bookId: borrowing.book.id || ''
    })
    setEditData(borrowing)
  }
  //Silme işlemini yap
  const handleDelete = id => {
    fetch(`${apiUrl}/api/v1/borrows/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok')
        setBorrowings(borrowings.filter(b => b.id !== id))
        setActionType('delete')
        handleOpenModal()
      })
      .catch(error => {
        console.error('Error deleting borrowing:', error)
        setErrorMessage(
          'An error occurred while deleting the borrowing record.'
        )
      })
  }
  //html formatını ekrana çıktı ver
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
      <div className='max-w-[1200px] mx-auto'>
        <header className='mb-8'>
          <h2 className='text-4xl h-12 font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Borrowing Management
          </h2>
          <p className='text-gray-600 mt-2'>Manage book borrowing records</p>
        </header>

        {errorMessage && (
          <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6'>
            <div className='flex items-center'>
              <svg
                className='w-6 h-6 text-red-500 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='text-red-700'>
                <strong>Error: </strong>
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className='bg-white p-8 rounded-xl shadow-lg mb-8 transition-all hover:shadow-xl'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Your Name
              </label>
              <input
                type='text'
                value={formData.borrowerName}
                onChange={e =>
                  setFormData({ ...formData, borrowerName: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                E-mail
              </label>
              <input
                type='email'
                value={formData.borrowerMail}
                onChange={e =>
                  setFormData({ ...formData, borrowerMail: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Borrow Date
              </label>
              <input
                type='date'
                value={formData.borrowingDate}
                onChange={e =>
                  setFormData({ ...formData, borrowingDate: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Return Date
              </label>
              <input
                type='date'
                value={formData.returnDate}
                onChange={e =>
                  setFormData({ ...formData, returnDate: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Choose Book
              </label>
              <select
                value={formData.bookId}
                onChange={e =>
                  setFormData({ ...formData, bookId: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              >
                <option value=''>Select Book</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='mt-6 flex justify-end'>
            <button
              type='submit'
              className='px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              {editData ? 'Update Borrowing' : 'Add Borrowing'}
            </button>
          </div>
        </form>

        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='grid grid-cols-5 gap-4 p-6 bg-gray-50 border-b'>
            <div className='font-semibold text-gray-700'>Borrower</div>
            <div className='font-semibold text-gray-700'>Book</div>
            <div className='font-semibold text-gray-700'>Borrow Date</div>
            <div className='font-semibold text-gray-700'>Return Date</div>
            <div className='font-semibold text-gray-700'>Actions</div>
          </div>

          <div className='divide-y divide-gray-200'>
            {borrowings.map(borrowing => (
              <div
                key={borrowing.id}
                className='grid grid-cols-5 gap-4 p-6 items-center hover:bg-gray-50 transition-colors'
              >
                <div>
                  <div className='text-gray-800 font-medium'>
                    {borrowing.borrowerName}
                  </div>
                  <div className='text-gray-500 text-sm'>
                    {borrowing.borrowerMail}
                  </div>
                </div>
                <div className='text-gray-600'>
                  {borrowing.book ? borrowing.book.name : 'No book'}
                </div>
                <div className='text-gray-600'>{borrowing.borrowingDate}</div>
                <div className='text-gray-600'>{borrowing.returnDate}</div>
                <div className='flex gap-2 justify-end'>
                  <button
                    onClick={() => handleEdit(borrowing)}
                    className='px-4 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(borrowing.id)}
                    className='px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
          actionType === 'update'
            ? 'Update Successful'
            : actionType === 'delete'
            ? 'Deletion Successful'
            : 'Add Successful'
        }
        message={
          actionType === 'update'
            ? 'Borrowing has been successfully updated!'
            : actionType === 'delete'
            ? 'Borrowing successfully deleted!'
            : 'Borrowing successfully added!'
        }
      />
    </div>
  )
}

export default Borrow
