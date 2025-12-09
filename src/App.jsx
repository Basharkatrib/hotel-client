import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/common/Navbar/index'
import Footer from './components/common/Footer/index'
import AuthOverlay from './components/auth/AuthOverlay'
// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home/index'))
const Explore = lazy(() => import('./pages/Explore/Explore.jsx'))
const Rooms = lazy(() => import('./pages/Rooms/index'))
const RoomDetails = lazy(() => import('./pages/RoomDetails/index'))
const HotelDetails = lazy(() => import('./pages/HotelDetails'))
const Favorites = lazy(() => import('./pages/Favorites/Favorites'))
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
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/hotel/:slug" element={<HotelDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            
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
        </div>
        <Footer />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
