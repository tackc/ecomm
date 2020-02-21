const express = require('express');
//multer enables us to handle form submissions that include image uploads
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage()})

router.get('/admin/products', requireAuth, async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }))
});

router.get('/admin/products/new', requireAuth, (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new',
    requireAuth,
    // Read the docsfor multer...the string being fed into upload.single below needs to match the input name on the form. Also, the order that middleware is written is important!
    upload.single('image'), 
    [requireTitle, requirePrice],
    handleErrors(productsNewTemplate),
    async (req, res) => {
    
    // This is not the best way to handle images..."presigned url" is the ideal solution
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    // Send user to route after successfully creating new product
    res.redirect('/admin/products');
});

// :id is known as a wildcard. It is used here to pass an id of a product
router.get('/admin/products/:id/edit', requireAuth ,async (req, res) => {
    const product = await productsRepo.getOne(req.params.id);

    if (!product) {
        return res.send('Product not found');
    }

    res.send(productsEditTemplate({ product }));
});

module.exports = router;
