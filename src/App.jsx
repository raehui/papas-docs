import { useState } from 'react'

import './App.css'
import IndexNavBar from './components/IndexNavBar'
import { Container } from 'react-bootstrap'
import Footer from './components/footer'
import { Navigate, useNavigate, useOutlet } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  const currentoutlet = useOutlet()
  return (
    <div className='d-flex flex-column min-vh-100'>
      <IndexNavBar />
      {/* 본문 */}
      <main className="flex-grow-1 container" style={{ paddingTop: 72 }}>
        <div>{currentoutlet}</div>        
      </main>

      <Footer />
    </div>
  )
}

export default App