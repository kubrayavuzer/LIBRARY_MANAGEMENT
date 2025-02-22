import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

const Modal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null

  return ReactDom.createPortal(
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-all z-50'>
      <div className='bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all'>
        <div className='p-6'>
          <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
            {title}
          </h2>
          <p className='text-gray-600 mb-8'>{message}</p>
          <div className='flex justify-end'>
            <button
              onClick={onClose}
              className='px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                                     hover:from-blue-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 
                                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
}

export default Modal
