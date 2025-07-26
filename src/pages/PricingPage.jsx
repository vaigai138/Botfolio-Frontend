import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import API from "../utils/api";
import LenisScrollWrapper from "../components/LenisScrollWrapper";

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
    price: "₹10/mo",
    amount: 1000,
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
    price: "₹25/mo",
    amount: 2500,
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
  const [activePlanName, setActivePlanName] = useState(null); // To store the name of the active/expired plan

  const handlePayment = async (amount, planId) => {
    try {
      const yourUserToken = localStorage.getItem("token");

      // Step 1: Create order
      const { data } = await API.post('/payment/create-order', {
        amount,
        planName: planId,
      });

      const options = {
        key: 'rzp_test_tSckRvvl1z0eug',
        amount: data.order.amount,
        currency: 'INR',
        name: 'Botfolio',
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`, // Dynamic description
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const token = localStorage.getItem('token');
            const verifyRes = await API.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planName: planId,
            });

            alert("✅ Payment successful! Plan activated.");
            // Re-fetch user plan after successful payment
            fetchUserPlan();
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: "KV",
          email: "kv@email.com",
          contact: "9999999999"
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
      alert("Payment failed to start. Please try again.");
    }
  };

  // Function to fetch user plan, now callable
  const fetchUserPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get('/users/me');

      const userPlan = res.data.plan;
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
        // If no plan is found, or it's implicitly 'basic', ensure it's treated as available for upgrade.
        setCurrentPlan('basic'); // Assume 'basic' if no plan is set in backend
        setActivePlanName('basic');
        setPlanExpired(false); // Basic plan never "expires" for selection purposes
      }

    } catch (error) {
      console.error("Failed to fetch user data", error);
      // If fetching fails, treat as basic plan available
      setCurrentPlan('basic');
      setActivePlanName('basic');
      setPlanExpired(false);
    }
  };

  useEffect(() => {
    fetchUserPlan();
  }, []);

  return (
    <LenisScrollWrapper>
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
                }`}
              disabled={
                // Disable if the current plan is active AND this is a different plan OR if it's a paid plan and the current active plan is 'basic' (free)
                (!planExpired && currentPlan === plan.planId) || // Already active on this plan
                (!planExpired && currentPlan !== plan.planId && currentPlan !== 'basic') // Active on a different, non-basic plan
              }
              onClick={() => {
                if (currentPlan === plan.planId && !planExpired) {
                  alert(`😎 You're already on the ${plan.name} plan!`);
                  return;
                }

                if (plan.amount > 0) {
                  handlePayment(plan.amount, plan.planId);
                } else {
                  // This is the 'Basic' (Free) plan
                  if (currentPlan === 'basic' && !planExpired) {
                    alert("🎉 You are already on the Free plan!");
                  } else {
                    alert("🎉 Free plan selected! You're good to go.");
                    // In a real application, you'd likely call an API to switch the user to the basic plan
                    setCurrentPlan(plan.planId);
                    setActivePlanName(plan.planId);
                    setPlanExpired(false);
                  }
                }
              }}
            >
              {currentPlan === plan.planId && !planExpired
                ? "Active Plan"
                : (currentPlan === plan.planId && planExpired)
                  ? "Renew Plan"
                  : plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
    </LenisScrollWrapper>
  );
}