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

// Dashboard Pages (Manufacturer + Retailer)
import Dashboard from './pages/dashboard/Dashboard';
import DashboardHome from './pages/dashboard/DashboardHome';
import AddMedicine from './pages/dashboard/AddMedicine';
import CreateBatch from './pages/dashboard/CreateBatch';
import GenerateQR from './pages/dashboard/GenerateQR';
import Reports from './pages/dashboard/Reports';
import VerifyStock from './pages/dashboard/VerifyStock';
import ScanHistory from './pages/dashboard/ScanHistory';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerVerify from './pages/customer/CustomerVerify';
import CustomerHistory from './pages/customer/CustomerHistory';
import CustomerReports from './pages/customer/CustomerReports';
import CustomerProfile from './pages/customer/CustomerProfile';

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

              {/* Protected: Settings (any authenticated user) */}
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              {/* Protected: Dashboard (ADMIN + RETAILER only) */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'RETAILER']}><Dashboard /></ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="medicines" element={<ProtectedRoute allowedRoles={['ADMIN']}><AddMedicine /></ProtectedRoute>} />
                <Route path="batches" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateBatch /></ProtectedRoute>} />
                <Route path="generate-qr/:batchId" element={<ProtectedRoute allowedRoles={['ADMIN']}><GenerateQR /></ProtectedRoute>} />
                <Route path="reports" element={<Reports />} />
                <Route path="verify" element={<VerifyStock />} />
                <Route path="scan-history" element={<ScanHistory />} />
              </Route>

              {/* Protected: Customer Dashboard (CUSTOMER only) */}
              <Route path="/customer" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>}>
                <Route index element={<CustomerVerify />} />
                <Route path="history" element={<CustomerHistory />} />
                <Route path="reports" element={<CustomerReports />} />
                <Route path="profile" element={<CustomerProfile />} />
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
