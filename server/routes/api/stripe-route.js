// const stripe = require('stripe')('sk_test_51NfXohCSXhEhZmnyiiuL7dQPH85cj7gdoLHETqlnFhjZRkH15XkzoYCx6xtDfKpmI7rBN7CVL9VmJkgFMvTUS35y00N6dtrvFz');
// const express = require('express');
// const router = express.Router();

// const MY_DOMAIN = "http://185.148.129.206:5174/dashboard/payments";

// router.post('/create-checkout-session', async (req, res) => {
//     console.log(">>>Sdfsdfsd");
//     const session = await stripe.checkout.sessions.create({
//         line_items: [
//             {
//                 price: 'price_1Nfvi1CSXhEhZmny3nWRgPVn',
//                 quantity: 1,
//             },
//         ],
//         mode: 'payment',
//         success_url: `${MY_DOMAIN}?success=true`,
//         cancel_url: `${MY_DOMAIN}?canceled=true`
//     });

//     // res.redirect(303, session.url);
//     console.log("session.url:", session.url);
//     res.status(200).json({
//         data: {
//             url: session.url
//         }
//     });

// });

// module.exports = router;

//-------------real 
// const stripe = require('stripe')('sk_test_51NfXohCSXhEhZmnyiiuL7dQPH85cj7gdoLHETqlnFhjZRkH15XkzoYCx6xtDfKpmI7rBN7CVL9VmJkgFMvTUS35y00N6dtrvFz');
// const express = require('express');
// const router = express.Router();

// const MY_DOMAIN = "http://185.148.129.206:5174/dashboard/payments";

// router.post('/create-checkout-session', async (req, res) => {
//   try {
//     const product = await stripe.products.create({
//       name: 'Product Name',
//       description: 'Product Description',
//     });

//     const price = await stripe.prices.create({
//       unit_amount: 1500, // Price in cents (e.g., $1500.00 = 150000 cents)
//       currency: 'usd',
//       product: product.id,
//     });

//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price: price.id,
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${MY_DOMAIN}?success=true`,
//       cancel_url: `${MY_DOMAIN}?canceled=true`,
//     });

//     res.status(200).json({
//       data: {
//         url: session.url,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       error: 'An error occurred while creating the checkout session.',
//     });
//   }
// });

// module.exports = router;

//---------add hook

const stripe = require('stripe')('sk_test_51NfXohCSXhEhZmnyiiuL7dQPH85cj7gdoLHETqlnFhjZRkH15XkzoYCx6xtDfKpmI7rBN7CVL9VmJkgFMvTUS35y00N6dtrvFz');
const express = require('express');
const router = express.Router();

const MY_DOMAIN = "http://185.148.129.206:5174/dashboard/payments";

// Create a webhook endpoint to handle events from Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'your_stripe_webhook_secret');
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event based on its type
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle the checkout session completed event
      console.log('Checkout session completed:', event.data.object);
      // Perform any necessary actions (e.g., update database, send confirmation email)
      break;
    // Add more cases to handle other event types if needed

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.sendStatus(200);
});

router.post('/create-checkout-session', async (req, res) => {
  try {
    console.log(">>>>>stripe", req.body)
    const product = await stripe.products.create({
      name: req.body.name,
      description: 'Product Description',
    });

    const price = await stripe.prices.create({
      unit_amount: req.body.price * 100, // Price in cents (e.g., $1500.00 = 150000 cents)
      currency: 'usd',
      product: product.id,
    });

    const session = await stripe.checkout.sessions.create({
      
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${MY_DOMAIN}?success=true`,
      cancel_url: `${MY_DOMAIN}?canceled=true`,
    });

    res.status(200).json({
      data: {
        url: session.url,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'An error occurred while creating the checkout session.',
    });
  }
});

module.exports = router;

