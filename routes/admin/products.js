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

router.post('/admin/products/new', [requireTitle, requirePrice], upload.single('image'), (req, res) => {
    const errors = validationResult(req);
    
    // This is not the best way to handle images...presigned url is the ideal solution
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.send('submitted');
});

module.exports = router;
