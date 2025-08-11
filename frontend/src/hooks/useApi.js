import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Custom hook for course information
export const useCourseInfo = () => {
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API}/course/info`);
        setCourseData(response.data);
      } catch (err) {
        console.error('Error fetching course info:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseInfo();
  }, []);

  return { courseData, isLoading, error };
};

// Custom hook for lead capture
export const useLeadCapture = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLead = async (leadData) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`${API}/leads`, leadData);
      return response.data;
    } catch (err) {
      console.error('Error submitting lead:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitLead, isSubmitting };
};

// Custom hook for checkout
export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const createCheckoutSession = async (customerData = {}) => {
    try {
      setIsProcessing(true);
      
      const requestBody = {
        package_id: "vaga_blindada",
        origin_url: window.location.origin,
        ...customerData
      };

      const response = await axios.post(`${API}/checkout/session`, requestBody);
      
      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
      
      return response.data;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return { createCheckoutSession, isProcessing };
};

// Custom hook for payment status
export const usePaymentStatus = () => {
  const [status, setStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkPaymentStatus = async (sessionId) => {
    try {
      setIsChecking(true);
      const response = await axios.get(`${API}/checkout/status/${sessionId}`);
      setStatus(response.data);
      return response.data;
    } catch (err) {
      console.error('Error checking payment status:', err);
      throw err;
    } finally {
      setIsChecking(false);
    }
  };

  const pollPaymentStatus = async (sessionId, maxAttempts = 5) => {
    const pollInterval = 2000; // 2 seconds
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        throw new Error('Payment status check timed out');
      }

      try {
        const data = await checkPaymentStatus(sessionId);
        
        if (data.payment_status === 'paid') {
          return data;
        } else if (data.status === 'expired') {
          throw new Error('Payment session expired');
        }

        // If payment is still pending, continue polling
        attempts++;
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        return poll();
      } catch (error) {
        throw error;
      }
    };

    return poll();
  };

  return { checkPaymentStatus, pollPaymentStatus, status, isChecking };
};

// Custom hook for analytics
export const useAnalytics = () => {
  const trackEvent = async (event, source, metadata = {}) => {
    try {
      await axios.post(`${API}/analytics/event`, {
        event,
        source,
        metadata
      });
    } catch (err) {
      console.error('Error tracking event:', err);
    }
  };

  return { trackEvent };
};

// Utility functions
export const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};