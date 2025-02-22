import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

const Layout = ({ children }) => {
  const location = useLocation()

  const isActiveLink = path => {
    return location.pathname === path
  }

  return (
    <div className='container mx-auto'>
      <header className='bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg'>
        <div className='nav-links justify-between flex mx-56 py-4'>
          <Link
            to='/'
            className={`nav-link ${
              isActiveLink('/') ? 'text-amber-400' : 'text-white'
            }`}
          >
            📚 Home
          </Link>
          <Link
            to='/author'
            className={`nav-link ${
              isActiveLink('/author') ? 'text-yellow-400' : 'text-white'
            }`}
          >
            Authors
          </Link>
          <Link
            to='/publisher'
            className={`nav-link ${
              isActiveLink('/publisher') ? 'text-pink-400' : 'text-white'
            }`}
          >
            Publishers
          </Link>
          <Link
            to='/category'
            className={`nav-link ${
              isActiveLink('/category') ? 'text-green-400' : 'text-white'
            }`}
          >
            Categories
          </Link>
          <Link
            to='/book'
            className={`nav-link ${
              isActiveLink('/book') ? 'text-red-400' : 'text-white'
            }`}
          >
            Books
          </Link>
          <Link
            to='/borrow'
            className={`nav-link ${
              isActiveLink('/borrow') ? 'text-orange-400' : 'text-white'
            }`}
          >
            Borrows
          </Link>
        </div>
      </header>

      <main className=''>{children}</main>

      <footer className='bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4'>
        <div className='flex justify-between items-center mx-56'>
          <div>
            <h3 className='text-lg font-semibold'>Library Management System</h3>
            <p className='text-slate-400 text-sm'>
              Organizing knowledge, empowering minds
            </p>
          </div>
          <div className='text-slate-400 text-sm'>
            &copy; {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        .nav-link {
          font-weight: 600;
          font-size: 1.1rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
