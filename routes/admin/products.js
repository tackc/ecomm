const express = require('express');
const { validationResult } = require('express-validator');
//multer enables us to handle form submissions that include image uploads
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage()})

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new', 
    // Read the docsfor multer...the string being fed into upload.single below needs to match the input name on the form. Also, the order that middleware is written is important!
    upload.single('image'), 
    [requireTitle, requirePrice], 
    async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.send(productsNewTemplate({ errors }));
    }
    
    // This is not the best way to handle images..."presigned url" is the ideal solution
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.send('submitted');
});

module.exports = router;
