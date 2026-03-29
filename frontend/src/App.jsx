import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CursorGlow from './components/effects/CursorGlow';
import ScrollReveal from './components/effects/ScrollReveal';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Result from './pages/Result';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Settings from './pages/Settings';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import DashboardHome from './pages/dashboard/DashboardHome';
import AddMedicine from './pages/dashboard/AddMedicine';
import CreateBatch from './pages/dashboard/CreateBatch';
import GenerateQR from './pages/dashboard/GenerateQR';
import Reports from './pages/dashboard/Reports';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <CursorGlow />
        <ScrollReveal />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 main-content-wrapper">

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/result/:token" element={<Result />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes */}
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="medicines" element={<AddMedicine />} />
                <Route path="batches" element={<CreateBatch />} />
                <Route path="generate-qr/:batchId" element={<GenerateQR />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
