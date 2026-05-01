import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGetBookingDetailsQuery } from '../../services/bookingsApi';
import { useSelector } from 'react-redux';
import { selectToken } from '../../store/slices/authSlice';
import { FaCheckCircle, FaRegCalendarAlt, FaMapMarkerAlt, FaUserFriends, FaEnvelope, FaPhoneAlt, FaDownload, FaHome, FaBed } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { QRCodeCanvas } from 'qrcode.react';

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { booking: locationBooking } = location.state || {};

  const { data: bookingData, isLoading } = useGetBookingDetailsQuery(bookingId, {
    skip: !!locationBooking,
  });

  const booking = locationBooking || bookingData?.data?.booking;

  const token = useSelector(selectToken);
  
  const handleDownloadReceipt = () => {
    if (!token) {
      alert('Please login to download the receipt.');
      return;
    }

    // Create a temporary hidden link to trigger download without opening a new window
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_API_URL}/api/bookings/${booking.id}/receipt/download?token=${token}`;
    link.setAttribute('download', `receipt-booking-${booking.id}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-emerald-200 dark:border-emerald-900/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium tracking-wide animate-pulse">Confirming details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl shadow-blue-900/5 max-w-md w-full mx-4">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">We couldn't locate the details for this reservation.</p>
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all duration-300 font-bold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/20 dark:via-gray-950 dark:to-blue-950/20 pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Ticket Card */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl shadow-emerald-900/5 dark:shadow-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/30 overflow-hidden relative">
          
          {/* Decorative Top Accent */}
          <div className="h-3 w-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

          <div className="p-8 sm:p-12 pb-8">
            {/* Header / Success Indicator */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <FaCheckCircle className="text-emerald-500 dark:text-emerald-400 text-6xl" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">Booking Confirmed!</h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                Thank you for your payment. Your adventure awaits.
              </p>
              
              <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Booking Reference</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">#{booking.id}</span>
              </div>
            </div>

            {/* Email Notice */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-5 mb-10 flex items-start gap-4">
               <div className="mt-1 flex-shrink-0 text-blue-500">
                  <FaEnvelope className="text-xl" />
               </div>
               <div>
                 <h4 className="font-semibold text-blue-900 dark:text-blue-100">Confirmation Sent</h4>
                 <p className="text-sm text-blue-700/80 dark:text-blue-300/80 mt-1">
                   We've sent a detailed confirmation email to <strong className="text-blue-800 dark:text-blue-200">{booking.guest_email}</strong>.
                 </p>
               </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Hotel Details</h3>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">{booking.hotel?.name || 'Vayka Hotel'}</p>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1.5 text-sm font-medium">
                    <FaMapMarkerAlt className="text-gray-400" />
                    {booking.hotel?.city}, {booking.hotel?.country}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1.5 text-sm font-medium">
                    <FaBed className="text-gray-400" />
                    {booking.room?.name || 'Room'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Guest Info</h3>
                  <p className="font-bold text-gray-900 dark:text-white">{booking.guest_name}</p>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1.5 text-sm font-medium">
                    <FaPhoneAlt className="text-gray-400" />
                    {booking.guest_phone}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Stay Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      <FaRegCalendarAlt /> Check-in
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                       {new Date(booking.check_in_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      <FaRegCalendarAlt /> Check-out
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                       {new Date(booking.check_out_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      <FaUserFriends /> Guests & Nights
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {booking.guests_count} Guests • {booking.total_nights} Nights
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 dark:to-transparent rounded-2xl p-6 border border-emerald-100/50 dark:border-emerald-800/30">
               <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-500 mb-4 flex items-center gap-2">
                 <HiOutlineDocumentText className="text-lg" /> Payment Summary
               </h3>
               
               <div className="space-y-3 mb-4">
                 <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
                   <span>${booking.price_per_night} × {booking.total_nights} nights</span>
                   <span className="text-gray-900 dark:text-white">${booking.subtotal}</span>
                 </div>
                 <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
                   <span>Taxes & Fees</span>
                   <span className="text-gray-900 dark:text-white">${(Number(booking.service_fee) + Number(booking.taxes)).toFixed(2)}</span>
                 </div>
               </div>
               
               <div className="pt-4 border-t border-dashed border-emerald-200 dark:border-emerald-800/50 flex justify-between items-end">
                 <span className="font-bold text-gray-900 dark:text-white">Total Paid</span>
                 <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${booking.total_amount}</span>
               </div>
            </div>

            {/* Biometric QR Key Section */}
            {booking.qr_token && (
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-3xl shadow-xl shadow-blue-500/10 mb-6 border-4 border-white flex flex-col items-center">
                  <div id="qr-code-to-download">
                    <QRCodeCanvas 
                      value={booking.qr_token} 
                      size={220} 
                      level="M" 
                      includeMargin={true} 
                    />
                  </div>
                  
                  {/* Download & Print Controls */}
                  <div className="flex gap-4 mt-4 w-full justify-center">
                    <button 
                      onClick={() => {
                        const canvas = document.querySelector('#qr-code-to-download canvas');
                        if (canvas) {
                          canvas.toBlob(async (blob) => {
                            if (!blob) return;
                            const file = new File([blob], `Vayka-Key-${booking.id}.png`, { type: 'image/png' });
                            
                            // 1. Try Web Share API (Best for Mobile)
                            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                              try {
                                await navigator.share({
                                  files: [file],
                                  title: 'Vayka Biometric Key',
                                  text: 'My Vayka Hotel Check-in Key',
                                });
                                return;
                              } catch (err) {
                                console.log('Share failed, falling back to download');
                              }
                            }
                            
                            // 2. Fallback to standard download (Better for Laptop)
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `Vayka-Key-${booking.id}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            setTimeout(() => URL.revokeObjectURL(url), 100);
                          }, 'image/png');
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      Save Key
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-800 hover:text-white transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                      Print Key
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-blue-900 dark:text-blue-100 mb-2">Your Biometric Key</h3>
                <p className="text-sm text-blue-700/70 dark:text-blue-400/70 max-w-xs mx-auto mb-4">
                  Show this QR code to the Vayka Kiosk at the hotel for instant face registration and fast check-in.
                </p>
                <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-widest text-blue-500/60">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  Ready for Kiosk
                </div>
              </div>
            )}

          </div>
          
          {/* Action Buttons - Footer of the card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadReceipt}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transition-all active:scale-95"
            >
              <FaDownload /> Download Receipt
            </button>
            <button
              onClick={() => navigate('/my-bookings')}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all active:scale-95"
            >
               View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold transition-all"
            >
              <FaHome /> Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;


