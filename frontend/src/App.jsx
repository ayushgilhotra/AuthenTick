import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CursorGlow from './components/effects/CursorGlow';
import ScrollReveal from './components/effects/ScrollReveal';
import FloatingActionButton from './components/FloatingActionButton';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Result from './pages/Result';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Settings from './pages/Settings';

// Dashboard Pages (Manufacturer + Retailer)
import Dashboard from './pages/dashboard/Dashboard';
import DashboardHome from './pages/dashboard/DashboardHome';
import AddMedicine from './pages/dashboard/AddMedicine';
import CreateBatch from './pages/dashboard/CreateBatch';
import GenerateQR from './pages/dashboard/GenerateQR';
import Reports from './pages/dashboard/Reports';
import VerifyStock from './pages/dashboard/VerifyStock';
import ScanHistory from './pages/dashboard/ScanHistory';
import Analytics from './pages/dashboard/Analytics';
import ActivityLog from './pages/dashboard/ActivityLog';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerVerify from './pages/customer/CustomerVerify';
import CustomerHistory from './pages/customer/CustomerHistory';
import CustomerReports from './pages/customer/CustomerReports';
import CustomerProfile from './pages/customer/CustomerProfile';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            <CursorGlow />
            <ScrollReveal />
            <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'background 0.2s ease, color 0.2s ease' }}>
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

                  {/* Protected: Settings */}
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                  {/* Protected: Dashboard (ADMIN + RETAILER) */}
                  <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'RETAILER']}><Dashboard /></ProtectedRoute>}>
                    <Route index element={<DashboardHome />} />
                    <Route path="medicines" element={<ProtectedRoute allowedRoles={['ADMIN']}><AddMedicine /></ProtectedRoute>} />
                    <Route path="batches" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateBatch /></ProtectedRoute>} />
                    <Route path="generate-qr/:batchId" element={<ProtectedRoute allowedRoles={['ADMIN']}><GenerateQR /></ProtectedRoute>} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="verify" element={<VerifyStock />} />
                    <Route path="scan-history" element={<ScanHistory />} />
                    <Route path="analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><Analytics /></ProtectedRoute>} />
                    <Route path="activity-log" element={<ProtectedRoute allowedRoles={['ADMIN']}><ActivityLog /></ProtectedRoute>} />
                  </Route>

                  {/* Protected: Customer Dashboard */}
                  <Route path="/customer" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>}>
                    <Route index element={<CustomerVerify />} />
                    <Route path="history" element={<CustomerHistory />} />
                    <Route path="reports" element={<CustomerReports />} />
                    <Route path="profile" element={<CustomerProfile />} />
                  </Route>
                </Routes>
              </div>
              <Footer />
              <FloatingActionButton />
            </div>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
