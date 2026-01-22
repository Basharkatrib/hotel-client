import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthOverlay from "./components/auth/AuthOverlay";
import AuthChecker from "./components/auth/AuthChecker";
import { AccountLayout, MainLayout } from "./components/layout";
import { ThemeProvider } from "./context/ThemeContext";
import SmartSearchWizard from "./components/common/SmartSearch/SmartSearchWizard";
import ContactUs from "./pages/Home/sections/ContactUs/ContactUs";
import ScrollToTop from "./components/common/ScrollToTop";
// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home/index"));
const Explore = lazy(() => import("./pages/Explore/Explore.jsx"));
const Rooms = lazy(() => import("./pages/Rooms/index"));
const RoomDetails = lazy(() => import("./pages/RoomDetails/index"));
const HotelDetails = lazy(() => import("./pages/HotelDetails"));
const Favorites = lazy(() => import("./pages/Favorites/Favorites"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const PersonalDataForm = lazy(() =>
  import("./pages/personalDataForm/PersonalDataForm")
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
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
          <Routes>
            {/* Routes with Navbar and Footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/room/:id" element={<RoomDetails />} />
              <Route path="/hotel/:slug" element={<HotelDetails />} />

              <Route path="/contact-us" element={<ContactUs />} />

              {/* Booking routes */}
              <Route
                path="/booking/confirm"
                element={<BookingConfirmation />}
              />
              <Route path="/payment/:bookingId" element={<Payment />} />
              <Route
                path="/payment/success/:bookingId"
                element={<PaymentSuccess />}
              />

              {/* Auth routes are handled as overlay */}
              <Route path="/auth/login" element={<Home />} />
              <Route path="/auth/login/verify" element={<Home />} />
              <Route path="/auth/register" element={<Home />} />
              <Route path="/auth/forgot-password" element={<Home />} />
              <Route path="/auth/reset-password" element={<Home />} />
              <Route path="/auth/verify-email" element={<Home />} />
            </Route>

            {/* Account Layout with Sidebar - No Navbar/Footer */}
            <Route element={<AccountLayout />}>
              <Route path="/my-profile" element={<PersonalDataForm />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              {/* Add more account routes here as needed */}
            </Route>
          </Routes>
          <AuthOverlay />
          <AuthChecker />
          <SmartSearchWizard />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
