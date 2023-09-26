const express = require('express');
const QuickBooks = require('node-quickbooks');

const router = express.Router();

const qbo = new QuickBooks({
    clientId: 'ABVeA8VDjJviDZtKtRN7LaXjKjjSpbg58E0kXgv3i7gdkCB5d5',
    clientSecret: 'TvXLeGoiBp7rc5LMlOVvYqRE22UYIR1DdwY3rE3Q',
    environment: 'sandbox',
    redirectUri: 'http://developer.intuit.com/v2/OAuth2Playground/RedirectUrl',
});

router.get('/authorize', (req, res) => {
    // Redirect the user to the QuickBooks authorization URL
    const authUri = qbo.authorizeUri({ scope: [QuickBooks.scopes.Accounting] });
    res.redirect(authUri);
});

router.get('/callback', (req, res) => {
    const authCode = req.query.code;

    // Exchange the authorization code for tokens
    qbo.createToken(authCode, (err, token) => {
        if (err) {
            console.error('Error obtaining access token:', err);
            res.status(500).send('Error obtaining access token');
            return;
        }

        // Store the token object securely (e.g., in a database)
        const { tokenSecret } = token;
        // ... store the token object ...

        res.send('Authorization successful');
    });
});

router.get('/export-orders', (req, res) => {
    // Retrieve the token object from your secure storage
    // ... retrieve the token object ...

    // Set the tokens on the QuickBooks instance
    qbo.setToken(token.token, token.tokenSecret);

    // Make API calls using the QuickBooks instance
    qbo.findPurchaseOrders({}, (err, orders) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).send('Error fetching orders');
            return;
        }
        // Save the orders to your database or perform any other required operations
        console.log('Orders:', orders);
        res.send('Orders exported successfully!');
    });
});

module.exports = router;
