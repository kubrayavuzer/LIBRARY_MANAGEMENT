import { useState, useEffect } from 'react'
import Modal from '../../components/Modal'

const apiUrl = 'https://libraryappspringboot-main-fwxf.onrender.com'
//API URL'sini ayarla

const Book = () => {
  const [modalOpen, setModalOpen] = useState(false) //Modal penceresini ayarla
  const [formData, setFormData] = useState({
    title: '',
    publicationYear: '',
    stock: '',
    authorId: '',
    publisherId: '',
    categoryIds: []
  }) //Form verilerini ayarla
  const [editData, setEditData] = useState(null) //Düzenlenecek verileri ayarla
  const [books, setBooks] = useState([]) //kitapları düzenle ve ayarla
  const [authors, setAuthors] = useState([]) //yazarları düzenle ve ayarla
  const [publishers, setPublishers] = useState([]) //yayıncıları düzenle ve ayarla
  const [categories, setCategories] = useState([]) //kategorileri düzenle ve ayarla
  const [actionType, setActionType] = useState(null) //crud işlem türünü ayarla
  const [errorMessage, setErrorMessage] = useState('') //Hata mesajını ayarla
  const handleOpenModal = () => setModalOpen(true) //Modal penceresini aç
  const handleCloseModal = () => {
    setModalOpen(false)
    setActionType(null)
    setErrorMessage('')
  }

  useEffect(() => {
    // Kitapları yükle
    fetch(`${apiUrl}/api/v1/books`)
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(() => setErrorMessage('An error occurred while loading books.'))

    // Yazarları yükle
    fetch(`${apiUrl}/api/v1/authors`)
      .then(response => response.json())
      .then(data => setAuthors(data))
      .catch(() =>
        setErrorMessage('An error occurred while loading the authors.')
      )

    // Yayıncıları yükle
    fetch(`${apiUrl}/api/v1/publishers`)
      .then(response => response.json())
      .then(data => setPublishers(data))
      .catch(() =>
        setErrorMessage('An error occurred while loading publishers.')
      )

    // Kategorileri yükle
    fetch(`${apiUrl}/api/v1/categories`)
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(() => setErrorMessage('There was an error loading categories.'))
  }, [])

  //Forma girilen verileri ayarla
  const handleSubmit = e => {
    e.preventDefault()
    //eğer yazar seçilmediyse hata göster
    if (!formData.authorId) {
      setErrorMessage('Please select an author.')
      return
    }

    const url = editData
      ? `${apiUrl}/api/v1/books/${editData.id}`
      : `${apiUrl}/api/v1/books`
    const method = editData ? 'PUT' : 'POST'

    // Stok değeri sıfırın altında ise hata göster.
    if (formData.stock <= 0) {
      setErrorMessage('The number of stocks cannot be zero or negative.')
      return
    }

    // Aynı veriyi tekrar güncellemeye çalışıyorsa, işlem yapılmaz
    if (editData) {
      const isSameData =
        formData.title.trim() === editData.name &&
        parseInt(formData.publicationYear) === editData.publicationYear &&
        parseInt(formData.stock) === editData.stock &&
        parseInt(formData.authorId) === editData.author?.id &&
        parseInt(formData.publisherId) === editData.publisher?.id &&
        JSON.stringify(formData.categoryIds.map(Number).sort()) ===
          JSON.stringify(editData.categories.map(cat => cat.id).sort())
      if (isSameData) {
        setErrorMessage(
          "The data is the same as before and doesn't require any update."
        )
        return
      }
    }
    // Veriyi backend'e gönderiyoruz.
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.title,
        publicationYear: formData.publicationYear,
        stock: parseInt(formData.stock),
        author: { id: formData.authorId },
        publisher: { id: formData.publisherId },
        categories: formData.categoryIds.map(id => ({ id }))
      })
    }) //veride bir sorun varsa hata göster
      .then(response => {
        if (!response.ok)
          throw new Error('An error occurred while saving the book.')
        return response.json()
      })
      .then(data => {
        if (editData) {
          setBooks(books.map(b => (b.id === editData.id ? data : b)))
          setActionType('update')
          setEditData(null)
        } else {
          // Yeni kitap eklerken yazar bilgisini de doğru şekilde güncelleyerek ekrana iletiyoruz.
          const updatedPublisher = publishers.find(
            publisher => publisher.id === parseInt(formData.publisherId)
          )
          const updatedCategories = categories.filter(category =>
            formData.categoryIds.includes(category.id.toString())
          )
          const updatedAuthor = authors.find(
            author => author.id === parseInt(formData.authorId)
          )

          const newBook = {
            ...data,
            publisher: updatedPublisher,
            categories: updatedCategories,
            author: updatedAuthor
          }
          setBooks(prevBooks => [...prevBooks, newBook])
          setActionType('add')
        }
        setFormData({
          title: '',
          publicationYear: '',
          stock: '',
          authorId: '',
          publisherId: '',
          categoryIds: []
        })
        handleOpenModal()
      })
      .catch(() => setErrorMessage('An error occurred while saving the book.'))
  }
  //kitap güncelleme bölümü
  const handleEdit = book => {
    setFormData({
      title: book.name,
      publicationYear: book.publicationYear,
      stock: book.stock,
      authorId: book.author?.id || '',
      publisherId: book.publisher?.id || '',
      categoryIds: book.categories.map(cat => cat.id.toString()) || []
    })
    setEditData(book)
  }
  //kitapları silme bölümü
  const handleDelete = id => {
    fetch(`${apiUrl}/api/v1/books/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok)
          throw new Error('An error occurred while deleting the book.')
        setBooks(books.filter(b => b.id !== id))
        setActionType('delete')
        handleOpenModal()
      })
      .catch(() => setErrorMessage('There was an error deleting the book.'))
  }
  //verileri ekrana yansıtacağımız bölüm
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
      <div className='max-w-[1200px] mx-auto'>
        <header className='mb-8'>
          <h2 className='text-4xl h-12 font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Books Management
          </h2>
          <p className='text-gray-600 mt-2'>Manage your book collection</p>
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
                Book Name
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Publication Year
              </label>
              <input
                type='number'
                value={formData.publicationYear}
                onChange={e =>
                  setFormData({ ...formData, publicationYear: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Stock
              </label>
              <input
                type='number'
                value={formData.stock}
                onChange={e =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Author
              </label>
              <select
                value={formData.authorId}
                onChange={e =>
                  setFormData({ ...formData, authorId: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              >
                <option value=''>Select Author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Publisher
              </label>
              <select
                value={formData.publisherId}
                onChange={e =>
                  setFormData({ ...formData, publisherId: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              >
                <option value=''>Select Publisher</option>
                {publishers.map(publisher => (
                  <option key={publisher.id} value={publisher.id}>
                    {publisher.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Categories
              </label>
              <select
                multiple
                value={formData.categoryIds}
                onChange={e =>
                  setFormData({
                    ...formData,
                    categoryIds: Array.from(
                      e.target.selectedOptions,
                      option => option.value
                    )
                  })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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
              {editData ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>

        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='grid grid-cols-6 gap-4 p-6 bg-gray-50 border-b'>
            <div className='font-semibold text-gray-700'>Book</div>
            <div className='font-semibold text-gray-700'>Author</div>
            <div className='font-semibold text-gray-700'>Publisher</div>
            <div className='font-semibold text-gray-700'>Categories</div>
            <div className='font-semibold text-gray-700'>Year</div>
            <div className='font-semibold text-gray-700'>Stock</div>
          </div>

          <div className='divide-y divide-gray-200'>
            {books.map(book => (
              <div
                key={book.id}
                className='grid grid-cols-6 gap-4 p-6 items-center hover:bg-gray-50 transition-colors'
              >
                <div className='text-gray-800 font-medium'>{book.name}</div>
                <div className='text-gray-600'>{book.author?.name}</div>
                <div className='text-gray-600'>{book.publisher?.name}</div>
                <div className='text-gray-600'>
                  {book.categories?.map(cat => cat.name).join(', ')}
                </div>
                <div className='text-gray-600'>{book.publicationYear}</div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>{book.stock}</span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleEdit(book)}
                      className='px-4 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className='px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
                    >
                      Delete
                    </button>
                  </div>
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
            ? 'Delete Successful'
            : 'Addition Successful'
        }
        message={
          actionType === 'update'
            ? 'The book has been successfully updated.'
            : actionType === 'delete'
            ? 'The book was successfully erased.'
            : 'The book was successfully added.'
        }
      />
    </div>
  )
}

export default Book
