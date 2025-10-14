import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import AuthCallback from './components/AuthCallback';
import ConnectionStatus from './components/ConnectionStatus';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AnalyzePage from './pages/AnalyzePage';
import SkinCarePage from './pages/SkinCarePage';
import ProductsPage from './pages/ProductsPage';
import ProfilePage from './pages/ProfilePage';
import UploadScreen from './pages/UploadScreen';
import AnalysisScreen from './pages/AnalysisScreen';
import SocialMediaScreen from './pages/SocialMediaScreen';
import PhotoHistoryScreen from './pages/PhotoHistoryScreen';
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import AIStudioPage from './pages/AIStudioPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
        <CustomCursor />
        <ConnectionStatus />
        <Navbar />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <AnalyzePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/skin-care"
              element={
                <ProtectedRoute>
                  <SkinCarePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <AnalysisScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/social-media"
              element={
                <ProtectedRoute>
                  <SocialMediaScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/photo-history"
              element={
                <ProtectedRoute>
                  <PhotoHistoryScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <ShoppingCartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-studio"
              element={
                <ProtectedRoute>
                  <AIStudioPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
