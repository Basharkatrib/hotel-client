import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/common/Navbar/index'
import AuthOverlay from './components/auth/AuthOverlay'
import Footer from './components/common/Footer'
// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home/index'))
const Explore = lazy(() => import('./pages/Explore/Explore.jsx'))
const HotelDetails = lazy(() => import('./pages/HotelDetails'))
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'))
const Payment = lazy(() => import('./pages/Payment'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const MyBookings = lazy(() => import('./pages/MyBookings'))

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="light"
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <div className="relative">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/hotel/:slug" element={<HotelDetails />} />
            
            {/* Booking routes */}
            <Route path="/booking/confirm" element={<BookingConfirmation />} />
            <Route path="/payment/:bookingId" element={<Payment />} />
            <Route path="/payment/success/:bookingId" element={<PaymentSuccess />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            
            {/* Auth routes are handled as overlay */}
            <Route path="/auth/login" element={<Home />} />
            <Route path="/auth/login/verify" element={<Home />} />
            <Route path="/auth/register" element={<Home />} />
            <Route path="/auth/forgot-password" element={<Home />} />
            <Route path="/auth/reset-password" element={<Home />} />
            <Route path="/auth/verify-email" element={<Home />} />
          </Routes>
          <AuthOverlay />
          <Footer />
        </div>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
