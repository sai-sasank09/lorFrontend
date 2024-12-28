// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import StudentDashboard from './components/StudentDashboard';
import StaffDashboard from './components/StaffDashboard';
import StaffLogin from './components/StaffLogin';
// import { AuthorizeUser } from './middleware/auth';
import FileUploadPage from './uploads/FileUploadPage';
import DocumentList from './components/DocumentList';
import ResetPasswordPage from './components/Reset';
import StudentDetailsCard from './components/StudentDetailsCard';
import About from './components/about';
import ApprovedListPage from './components/approvedList';
import UnauthorizedPage from './components/UnauthorizedPage ';
import YesNoPage from './uploads/YesNoPage';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stafflogin" element={<StaffLogin />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* about page */}
        <Route path='/student/about' element={<About />} />
        {/* Dash Board Route */}
        <Route path='/student/dashboard' element={<StudentDashboard />} />
        <Route path='/staff/dashboard' element={<StaffDashboard />} />
        {/* file upload route */}
        <Route path='/staff/upload' element={<FileUploadPage />} />
        {/* file upload route */}
        <Route path='/staff/studentRegno' element={<YesNoPage/>} />

        <Route path='/staff/documents' element={<DocumentList />} />
        {/* reset password */}
        <Route path='/ResetPassword' element={<ResetPasswordPage />} />
        {/* student details card in staff dashboard */}
        <Route path='/staff/studentCard' element={<StudentDetailsCard />} />
        {/* filter the approved students */}
        <Route path='/staff/filterStudents' element={<ApprovedListPage />} />
      </Routes>
    </Router>
  );
};

export default App;
