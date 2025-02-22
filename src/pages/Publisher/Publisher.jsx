import { useState, useEffect } from 'react'
import Modal from '../../components/Modal'

const apiUrl = 'https://libraryappspringboot-main-fwxf.onrender.com'
// API URL'sini ayarla
const Publishers = () => {
  const [modalOpen, setModalOpen] = useState(false) //Modal penceresini ayarla
  const [formData, setFormData] = useState({
    name: '',
    establishmentYear: '',
    address: ''
  }) //Form verilerini ayarla
  const [editData, setEditData] = useState(null) //Düzenlenecek verileri ayarla
  const [publishers, setPublishers] = useState([]) //yayıncıları düzenle ve ayarla
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
    fetch(`${apiUrl}/api/v1/publishers`)
      .then(response => {
        if (!response.ok) {
          throw new Error('An error occurred while receiving the data.')
        }
        return response.json()
      })
      .then(data => setPublishers(data))
      .catch(error => {
        console.error('Error fetching publishers:', error)
        setErrorMessage('Error fetching publishers.')
      })
  }, [])
  // Yayıncı ekleme
  const handleSubmit = e => {
    e.preventDefault()

    const url = editData
      ? `${apiUrl}/api/v1/publishers/${editData.id}`
      : `${apiUrl}/api/v1/publishers`
    const method = editData ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('An error occurred during the saving process.')
        }
        return response.json()
      })
      .then(data => {
        if (editData) {
          setPublishers(publishers.map(p => (p.id === editData.id ? data : p)))
          setEditData(null)
          setActionType('update')
        } else {
          setPublishers([...publishers, data])
          setActionType('add')
        }
        setFormData({ name: '', establishmentYear: '', address: '' })
        handleOpenModal()
      })
      .catch(error => {
        console.error('Error:', error)
        setErrorMessage('An error occurred while registering a publisher.')
      })
  }
  // Yayıncı düzenleme
  const handleEdit = publisher => {
    setFormData({
      name: publisher.name,
      establishmentYear: publisher.establishmentYear,
      address: publisher.address
    })
    setEditData(publisher)
  }
  // Yayıncı silme
  const handleDelete = id => {
    fetch(`${apiUrl}/api/v1/publishers/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) {
          throw new Error('An error occurred during the deletion.')
        }
        setPublishers(publishers.filter(p => p.id !== id))
        setActionType('delete')
        handleOpenModal()
      })
      .catch(error => {
        console.error('Error deleting publisher:', error)
        setErrorMessage('An error occurred while deleting the publisher.')
      })
  }
  //html formatını ekrana çıktı ver
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
      <div className='max-w-[1200px] mx-auto'>
        <header className='mb-8'>
          <h2 className='text-4xl h-12 font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Publishers Management
          </h2>
          <p className='text-gray-600 mt-2'>Manage your publishing partners</p>
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
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Publisher Name
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Establishment Year
              </label>
              <input
                type='number'
                value={formData.establishmentYear}
                onChange={e =>
                  setFormData({
                    ...formData,
                    establishmentYear: e.target.value
                  })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Address
              </label>
              <input
                type='text'
                value={formData.address}
                onChange={e =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                required
              />
            </div>
          </div>
          <div className='mt-6 flex justify-end'>
            <button
              type='submit'
              className='px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              {editData ? 'Update Publisher' : 'Add Publisher'}
            </button>
          </div>
        </form>

        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b'>
            <div className='font-semibold text-gray-700'>Publisher Name</div>
            <div className='font-semibold text-gray-700'>
              Establishment Year
            </div>
            <div className='font-semibold text-gray-700'>Address</div>
          </div>

          <div className='divide-y divide-gray-200'>
            {publishers.map(publisher => (
              <div
                key={publisher.id}
                className='grid grid-cols-3 gap-4 p-6 items-center hover:bg-gray-50 transition-colors'
              >
                <div className='text-gray-800 font-medium'>
                  {publisher.name}
                </div>
                <div className='text-gray-600'>
                  {publisher.establishmentYear}
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>{publisher.address}</span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleEdit(publisher)}
                      className='px-4 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(publisher.id)}
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
            : 'Add Successful'
        }
        message={
          actionType === 'update'
            ? 'Publisher successfully updated!'
            : actionType === 'delete'
            ? 'Publisher successfully deleted!'
            : 'Publisher successfully added!'
        }
      />
    </div>
  )
}

export default Publishers
