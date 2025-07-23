// frontend/src/components/Pricing.jsx
import axios from 'axios';

const Pricing = () => {
  const handleBuyNow = async () => {
    try {
      const amount = 49900; // ₹499 in paise
      const { data } = await axios.post('http://localhost:5000/api/payment/create-order', { amount });

      const options = {
        key: 'rzp_test_pTjuwIPtsBigfh',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Botfolio',
        description: 'Premium Plan',
        order_id: data.order.id,
        handler: function (response) {
          alert('Payment Success ✅');
          console.log(response);
        },
        prefill: {
          name: 'KV',
          email: 'kv@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F4A100',
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error in payment:', error);
      alert('Payment failed ❌');
    }
  };

  return (
    <div>
      <h2>Premium Plan - ₹499</h2>
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default Pricing;
