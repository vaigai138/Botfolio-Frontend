import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
// Assuming this API utility is correctly configured
import API from "../utils/api";
//import LenisScrollWrapper from "../components/LenisScrollWrapper";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { Helmet } from "react-helmet-async";

// Access the Razorpay key from environment variables
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

// A custom message component to replace browser alerts
const MessageComponent = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const icon = type === 'error' ? <FaTimesCircle className="h-6 w-6" /> : <FaCheck className="h-6 w-6" />;
  return (
    <div className={`fixed inset-x-0 bottom-4 mx-auto w-11/12 md:w-1/3 p-4 rounded-lg shadow-lg text-white font-bold flex items-center gap-4 z-[9999] transition-all duration-300 ${bgColor}`}>
      {icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-white hover:text-gray-200">
        <FaTimesCircle className="h-5 w-5" />
      </button>
    </div>
  );
};


const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 bg-[#F4A100] cursor-pointer text-black transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const plans = [
  {
    name: "Basic",
    price: "Free",
    amount: 0,
    description: "Perfect for getting started",
    features: [
      "Up to 5 portfolio items",
      "Public profile access",
      "Community support"
    ],
    buttonText: "Get Started",
    featured: false,
    planId: "basic"
  },
  {
    name: "Standard",
    price: "₹25/mo",
    amount: 2500,
    description: "For growing creators",
    features: [
      "Up to 10 portfolio links",
      "Public profile access",
      "Community support"
    ],
    buttonText: "Choose Standard",
    featured: true,
    planId: "standard"
  },
  {
    name: "Premium",
    price: "₹50/mo",
    amount: 5000,
    description: "Maximize your visibility",
    features: [
      "Up to 25 portfolio links",
      "Public profile access",
      "Community support"
    ],
    buttonText: "Go Premium",
    featured: false,
    planId: "premium"
  },
];

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planExpired, setPlanExpired] = useState(false);
  const [activePlanName, setActivePlanName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [message, setMessage] = useState({ text: null, type: null });
  const navigate = useNavigate();

  // Function to show a message and clear it after a delay
  const showMessage = (text, type = 'success', duration = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: null, type: null }), duration);
  };

  const handlePayment = async (amount, planId) => {
    setLoadingPlanId(planId); // Start loading animation for the clicked button
    try {
      const { data } = await API.post('/payment/create-order', {
        amount,
        planName: planId,
      });

      const options = {
        key: RAZORPAY_KEY,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Botfolio',
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await API.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planName: planId,
            });

            showMessage("✅ Payment successful! Plan activated.");
            fetchUserPlan(); // Re-fetch user plan after successful payment
          } catch (error) {
            console.error("Payment verification failed:", error);
            showMessage("❌ Payment verification failed.", 'error');
          } finally {
            setLoadingPlanId(null);
          }
        },
        prefill: {
    name: loggedInUser?.name || "User Name",
    email: loggedInUser?.email || "user@example.com",
  },
        theme: {
          color: "#F4A100"
        },
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment initiation failed", error);
      showMessage("Payment failed to start. Please try again.", 'error');
    } finally {
      setLoadingPlanId(null); // Stop loading animation regardless of success/failure
    }
  };

  // Function to fetch user plan, now callable
  const fetchUserPlan = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users/me');
      const userData = res.data;
      setLoggedInUser(userData);

      const userPlan = userData.plan;
      let isExpired = false;

      if (userPlan && userPlan.purchasedAt) {
        const purchasedAt = new Date(userPlan.purchasedAt);
        const now = new Date();
        const planDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        isExpired = (now - purchasedAt) > planDuration;
      }

      setPlanExpired(isExpired);
      if (userPlan) {
        setCurrentPlan(userPlan.name);
        setActivePlanName(userPlan.name);
      } else {
        // If no plan is found, assume 'basic'
        setCurrentPlan('basic');
        setActivePlanName('basic');
        setPlanExpired(false);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
      // Fallback to basic plan if API call fails
      setCurrentPlan('basic');
      setActivePlanName('basic');
      setPlanExpired(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPlan();
  }, []);

  const getButtonText = (planId) => {
    const plan = plans.find(p => p.planId === planId);
    if (currentPlan === plan.planId && !planExpired) {
      return "Active Plan";
    }
    if (currentPlan === plan.planId && planExpired) {
      return "Renew Plan";
    }
    if (loadingPlanId === planId) {
      return "Loading...";
    }
    return plan.buttonText;
  }

  return (
   // <LenisScrollWrapper>
   <>

   <Helmet>
  <title>Botfolio | Pricing Plans</title>
  <meta
    name="description"
    content="Choose the right Botfolio plan for your freelance journey. Flexible pricing for individuals and teams."
  />
</Helmet>

   
      <div className="min-h-screen bg-white text-black p-6 md:p-12 relative overflow-hidden">
        {/* 🎨 Background illustration */}
        <img
          src="https://illustrations.popsy.co/gray/work-from-home.svg"
          alt="Background Illustration"
          className="absolute opacity-5 top-10 right-10 w-[600px] hidden md:block pointer-events-none select-none"
        />

        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 drop-shadow-sm">
          Choose Your Plan
        </h1>

        {planExpired && activePlanName && activePlanName !== 'basic' && (
          <div className="bg-red-100 text-yellow-800 bg-yellow-100 p-4 rounded mb-8 text-center border border-yellow-300 max-w-2xl mx-auto">
            🚨 Your <strong>{activePlanName.charAt(0).toUpperCase() + activePlanName.slice(1)}</strong> plan has expired. Please choose another plan or Renew plan to continue enjoying full features!
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 text-lg mt-10">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto z-10 relative">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`border p-6 rounded-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-md bg-white/80 ${plan.featured
                  ? "border-[#F4A100] shadow-lg"
                  : "border-gray-200"
                  }`}
              >
                <h2 className="text-2xl font-extrabold mb-1 text-gray-900">
                  {plan.name}
                </h2>
                <p className="text-xl font-semibold mb-2 text-gray-700">{plan.price}</p>
                <p className="text-gray-500 mb-4 text-sm">{plan.description}</p>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-800">
                      <FaCheck className="text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full font-semibold rounded-sm py-2 ${plan.featured
                    ? "bg-[#F4A100] text-white hover:bg-[#d68c00]"
                    : "text-black bg-white border border-gray-300 hover:bg-gray-50"
                    } ${loadingPlanId === plan.planId ? 'cursor-not-allowed opacity-70' : ''}`}
                  disabled={
                    (currentPlan === plan.planId && !planExpired) ||
                    loadingPlanId === plan.planId
                  }
                  onClick={() => {
                    // Check if user is logged in
                    if (!loggedInUser) {
                      showMessage("Please log in to choose a plan.", 'error');
                      // Optional: Redirect to login page
                      // navigate('/login');
                      return;
                    }
                    if (currentPlan === plan.planId && !planExpired) {
                      showMessage(`😎 You're already on the ${plan.name} plan!`);
                      return;
                    }
                    if (plan.amount > 0) {
                      handlePayment(plan.amount, plan.planId);
                    } else {
                      showMessage("🎉 Free plan selected! You're good to go.");
                      // Here you would typically call an API to switch the plan on the backend
                      setCurrentPlan(plan.planId);
                      setActivePlanName(plan.planId);
                      setPlanExpired(false);
                    }
                  }}
                >
                  {getButtonText(plan.planId)}
                </Button>
              </div>
            ))}
          </div>
        )}
        <MessageComponent message={message.text} type={message.type} onClose={() => setMessage({ text: null, type: null })} />
      </div>
      </>
   // </LenisScrollWrapper>
  );
}
