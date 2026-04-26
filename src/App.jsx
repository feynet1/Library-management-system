import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ui/ProtectedRoute';

// Admin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageLibrarians from './pages/admin/ManageLibrarians';
import ManageStudents from './pages/admin/ManageStudents';
import ViewBooks from './pages/admin/ViewBooks';
import AdminTransactions from './pages/admin/Transactions';
import AdminSettings from './pages/admin/Settings';

// Librarian
import LibrarianLayout from './layouts/LibrarianLayout';
import LibrarianDashboard from './pages/librarian/Dashboard';
import ManageBooks from './pages/librarian/ManageBooks';
import IssueBook from './pages/librarian/IssueBook';
import ReturnBook from './pages/librarian/ReturnBook';
import LibrarianTransactions from './pages/librarian/Transactions';

// Student
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import StudentViewBooks from './pages/student/ViewBooks';
import StudentIssuedBooks from './pages/student/MyIssuedBooks';
import StudentSearchBooks from './pages/student/SearchBooks';

function App() {
  return (
    <Router>
      <div className="antialiased text-text dark:text-slate-100 bg-background dark:bg-gray-950 min-h-screen font-sans transition-colors duration-300">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes — protected, role: admin */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="librarians" element={<ManageLibrarians />} />
              <Route path="students" element={<ManageStudents />} />
              <Route path="books" element={<ViewBooks />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Librarian Routes — protected, role: librarian */}
          <Route element={<ProtectedRoute requiredRole="librarian" />}>
            <Route path="/librarian" element={<LibrarianLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<LibrarianDashboard />} />
              <Route path="books" element={<ManageBooks />} />
              <Route path="issue" element={<IssueBook />} />
              <Route path="return" element={<ReturnBook />} />
              <Route path="transactions" element={<LibrarianTransactions />} />
            </Route>
          </Route>

          {/* Student Routes — protected, role: student */}
          <Route element={<ProtectedRoute requiredRole="student" />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="books" element={<StudentViewBooks />} />
              <Route path="issued" element={<StudentIssuedBooks />} />
              <Route path="search" element={<StudentSearchBooks />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
