import { useState } from 'react'

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route exact path='/register' element={<Register/>}></Route>
        
      </Routes>
    </Router>
    
  )
}

export default App
