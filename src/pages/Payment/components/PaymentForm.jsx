import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation } from '../../../services/paymentsApi';
import { toast } from 'react-toastify';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const PaymentForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Step 1: Create payment intent
      const intentResult = await createPaymentIntent({
        booking_id: booking.id,
      }).unwrap();

      const { client_secret, payment_intent_id } = intentResult.data;

      // Step 2: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: booking.guest_name,
            email: booking.guest_email,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Step 3: Confirm payment on backend
        await confirmPayment({
          payment_intent_id: paymentIntent.id,
        }).unwrap();

        toast.success('Payment successful!');
        
        // Navigate to success page
        navigate(`/payment/success/${booking.id}`, {
          state: { booking },
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      const message = error.data?.messages?.[0] || 'Payment failed. Please try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            <span>Processing...</span>
          </>
        ) : (
          <span>Pay ${booking.total_amount}</span>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Your payment information is encrypted and secure
      </p>
    </form>
  );
};

export default PaymentForm;



