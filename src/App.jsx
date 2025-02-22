import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Publishers from './pages/Publisher/Publisher'
import Book from './pages/Book/Book'
import Categories from './pages/Category/Category'
import Authors from './pages/Author/Author'
import Borrow from './pages/Borrow/Borrow'
function App () {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/publisher' element={<Publishers />} />
          <Route path='/category' element={<Categories />} />
          <Route path='/book' element={<Book />} />
          <Route path='/author' element={<Authors />} />
          <Route path='/borrow' element={<Borrow />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
