import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {Toaster} from 'react-hot-toast';
import Dashboard from './pages/Home/Dashboard'
import LandingPage from './pages/InterviewPrep/LandingPage'
import InterviewPrep from './pages/InterviewPrep/InterviewPrep'
import UserProvider from './Context/userContext'


const App = () => {
  return (
    
    <div>
      <UserProvider>
        <Router>
        <Routes>
          {/* Default Route*/}
          <Route path='/' element={<LandingPage />}/>
          <Route path='/dashboard' element={<Dashboard/>}/> 
          <Route path='/interview-prep/:sessionId' element={<InterviewPrep/>}/>
        </Routes>
      </Router>
      </UserProvider>
    <Toaster
    toastOptions={{
      className: '',
      style: {
        fontSize: '13px',
      },
    }}  
    />
  </div>
  
)

}

export default App