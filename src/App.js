import React from 'react'
import { HashRouter,Routes,Route, BrowserRouter } from 'react-router-dom'
import PatientLogin from './Login/PatientLogin'
import AllDoctors from './Pages/AllDoctors'
// import { UserProvider } from './context/UserContext'
import DocSignup from './Login/DocSignup'
import DoctorSignup from './Login/DoctorSignup'
import { UserProvider } from './context/UserContext'
import BookAppointment from './Pages/BookAppointment'
import ViewProfile from './Pages/ViewProfile'
import PatientSignup from './Login/PatientSignup'
import DoctorLogin from './Login/DoctorLogin'
import AdminProfile from './Pages/AdminProfile'
import DoctorReport from './Pages/DoctorReport'
// import {DoctorSignup} from "./Login/DoctorSignup"

function App() {
  return (
   <UserProvider>
   <BrowserRouter>
    <Routes>
      <Route path="/patientLogin" element={<PatientLogin/>}/>
      <Route path="/BookAppointment/:doctorId/:patientId" element={<BookAppointment/>}/>
      {/* <Route path="/Doctors" element={<AllDoctors/>}/> */}
      <Route path="/" element={<AllDoctors/>}/>
      <Route path="/Docsign" element={<DoctorSignup/>}/>
      <Route path="/patientProfile/:patientId" element={<ViewProfile/>}/>
      <Route path="/patientSignup" element={<PatientSignup/>}/>
      <Route path="/adminLogin" element={<DoctorLogin/>}/>
      <Route path="/adminProfile" element={<AdminProfile/>}/>
      <Route path="/Doctor-Report/:doctorId" element={<DoctorReport/>}/>

    </Routes>
   </BrowserRouter>
   </UserProvider>
  
  )
}

export default App