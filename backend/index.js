const cors = require('cors');
const express = require('express');
// TODO add a stripe key
const stripe = require('stripe')(
  'sk_test_51HEqt8BykVv1F0mftsJNZxkqsA12cgVW68LeI4O0dYH9juS9Qe1wbse2NNcpd9nFT5Pm1vdmZfDX5yBgW73HrsW500ZUhp9dHN'
);
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.get('/', (req, res) => {
  res.send('It works at stripe payment');
});

app.post('/payment', (req, res) => {
  const { product, token } = req.body;
  console.log('product', product);
  console.log('pricing', product.price);
  console.log('token', token);
  const idempontencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: 'user',
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// listen
app.listen(8282, () => {
  console.log('running at 8282');
});
