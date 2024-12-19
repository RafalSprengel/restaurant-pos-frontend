const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const authentMiddleware = require('../middleware/authentMiddleware');
const ApiController = require('../controllers/apiController');
const upload = require('../middleware/upload');
const authorize = require('../middleware/authorize');
const User = require('../db/models/User');
const { Customer } = require('../db/models/Customer');

// ** Registration and Login Routes **
router.post('/register-new-system-user', authController.registerNewSystemUser);
router.post('/registerNewCustomer', authController.registerNewCustomer);
router.post('/login', authController.login);
router.post('/refreshToken', authController.refreshToken);
router.post('/logout', authentMiddleware, authController.logout);

// ** Google Login Routes **
router.get('/google', authController.googleAuth);
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

// ** Facebook Login Routes **
router.get('/facebook', authController.facebookAuth);
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    authController.facebookCallback
);

// ** Public Routes **
router.get('/getProducts', ApiController.getProducts);
router.get('/getSingleProduct/:id', ApiController.getSingleProduct);
router.get('/getAllCategories', ApiController.getAllCategories);
router.get('/getSingleCategory/:id', ApiController.getSingleCategory);

// ** Authorized Customers Routes **
router.all('/customer', authentMiddleware, async (req, res) => {
    const customer = await Customer.findOne({ _id: req.user._id });
    if (!customer) {
        return res.status(401).json({ error: 'Customer not found' });
    }
    res.json({
        _id: req.user.id,
        name: customer.name,
        surname: customer.surname,
        email: customer.email,
        role: customer.role,
    });
});

// ** Member Routes **
router.get('/getCustomers', authentMiddleware, authorize(['member', 'moderator', 'admin']), ApiController.getCustomers);
router.get('/getOrders', authentMiddleware, authorize(['member', 'moderator', 'admin']), ApiController.getOrders);
router.get(
    '/getSingleOrder/:id',
    authentMiddleware,
    authorize(['member', 'moderator', 'admin']),
    ApiController.getSingleOrder
);
router.all('/user', authentMiddleware, authorize(['member', 'moderator', 'admin']), async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }
    res.json({
        _id: req.user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
    });
});

// ** Moderator Routes **
router.delete(
    '/deleteCategory/:id',
    authentMiddleware,
    authorize(['moderator', 'admin']),
    ApiController.deleteCategory
);
router.post(
    '/addCategory',
    authentMiddleware,
    authorize(['moderator', 'admin']),
    upload.single('image'),
    ApiController.addCategory
);
router.put(
    '/updateCategory/:id',
    authentMiddleware,
    authorize(['moderator', 'admin']),
    upload.single('image'),
    ApiController.updateCategory
);
router.post('/addProduct', authentMiddleware, authorize(['moderator', 'admin']), ApiController.addProduct);
router.delete('/deleteProduct/:id', authentMiddleware, authorize(['moderator', 'admin']), ApiController.deleteProduct);
router.put('/updateProduct/:id', authentMiddleware, authorize(['moderator', 'admin']), ApiController.updateProduct);
router.delete('/deleteCustomer/:id', authentMiddleware, authorize(['admin']), ApiController.deleteCustomer);
router.delete('/deleteOrder/:id', authentMiddleware, authorize(['admin']), ApiController.deleteOrder);

// ** Admin Routes **
router.get('/getRoles', authentMiddleware, authorize(['admin']), async (req, res) => {
    try {
        const roles = User.schema.path('role').enumValues;

        roles.sort((a, b) => {
            if (a.toLowerCase().startsWith('member')) return -1;
            if (b.toLowerCase().startsWith('member')) return 1;
            return b.toLowerCase().localeCompare(a.toLowerCase());
        });

        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving roles' });
    }
});

router.get('/getUsers', authentMiddleware, authorize(['admin']), ApiController.getUsers);

// ** Catch-All Route for Invalid API Calls **
router.all('*', (req, res) => {
    res.status(404).json({ error: 'Not a valid API address' });
});

module.exports = router;
