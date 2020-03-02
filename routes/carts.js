const express = require('express');
const cartsRepo = require('../repositories/carts');

const router = express.Router();

// Receive a POST request to add an item to a cart
router.post('/cart/products', async (req, res) => {
    // Figure out the cart
    let cart;
    if (!req.session.cartId) {
        // We don't have a cart and need to create one. Store the cart id on the req.session.cartId property
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        // We have a cart! Let's get it from the repository
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    console.log(cart);

    // Either increment quantity for existing product or add new product into items array



    res.send('Product added to cart')
})

// Receive a GET request to show all items in cart

// Receive a POST request to delete an item from a cart

module.exports = router;