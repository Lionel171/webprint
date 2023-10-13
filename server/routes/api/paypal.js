const paypal = require('paypal-rest-sdk');
const cors = require('cors');
const express = require('express');
const router = express.Router();

// Use cors middleware to allow cross-origin requests

// configure paypal with the credentials you got when you created paypal app
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AeWQNqUXXbXZfvMxHcvm_AWDzWZGN8_3GrlllucRBdsc3N0ekhAt64OBmU12Ajs-gQasyEAiUAKhvsw1',
    'client_secret': 'EDNIeVtDmvK3IvL2ybt_vCND_THwu-vMJK-nq28OARYmdEzUjVU1zm9Kv_qh6eyQlpTQCcv-o2S29AiU'
})
router.post('/buy', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://185.148.129.206:5174');
  
    // create payment object
    console.log(req.body,"ddddd")
    const payment = {
        "intent": "authorize",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://185.148.129.206:5174/dashboard/payments",
            "cancel_url": "http://185.148.129.206:5174/dashboard"
        },
        "transactions": [{
            "amount": {
                "total": req.body.price,
                "currency": "USD"
            },
            "description": req.body.name
        }]
    }

    // call the create Pay method

    createPay(payment)
        .then((transaction) => {
            let id = transaction.id;
            let links = transaction.links;
            let counter = links.length;
            while (counter--) {
                if (links[counter].method == "REDIRECT") {
                    // redirect to PayPal where user approves the transaction
                    // return res.redirect(links[counter].href);
                    res.status(200).json({
                        data: {
                          url: links[counter].href,
                        },
                      });
                }
            }
            
        })
        .catch((err) => {
            console.log(err);
            // Add this line to send an error response to the client
            return res.status(500).json({ error: 'An error occurred while processing the payment.' });
        });

});

//helper function

const createPay = (payment) => {
    return new Promise((resolve, reject) => {
      paypal.payment.create(payment, (err, payment) => {
        if (err) {
          console.log(err.details); // Add this line to log the validation error details
          reject(err);
        } else {
          resolve(payment);
        }
      });
    });
  };
  

module.exports = router;
