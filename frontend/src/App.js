import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

function App() {
  const [product, setProduct] = useState({
    name: 'React from FB',
    price: 10,
    productBy: 'facebook',
  });

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    return fetch('http://localhost:8282/payment', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log(res);
        const { status } = res;
        console.log(status);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="App">
      <StripeCheckout
        stripeKey=""
        token={makePayment}
        name="Buy React"
        amount={product.price * 100}
        shippingAddress
        billingAddress
      >
        <button className="btn-large pink">
          Buy react is just in {product.price} $
        </button>
      </StripeCheckout>
    </div>
  );
}

export default App;
