const stripe = require('stripe')('sk_test_51NfXohCSXhEhZmnyiiuL7dQPH85cj7gdoLHETqlnFhjZRkH15XkzoYCx6xtDfKpmI7rBN7CVL9VmJkgFMvTUS35y00N6dtrvFz');
const express = require('express');
const router = express.Router();

const MY_DOMAIN = "http://185.148.129.206:5173/dashboard/payments";

router.post('/create-checkout-session', async (req, res) => {
    console.log(">>>Sdfsdfsd");
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: 'price_1Nfvi1CSXhEhZmny3nWRgPVn',
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${MY_DOMAIN}?success=true`,
        cancel_url: `${MY_DOMAIN}?canceled=true`
    });

    // res.redirect(303, session.url);
    console.log("session.url:", session.url);
    res.status(200).json({
        data: {
            url: session.url
        }
    });

});

module.exports = router;
