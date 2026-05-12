const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, paymentController.createPayment);
router.get('/', protect, paymentController.getUserPayments);
router.get('/:id', protect, paymentController.getPaymentById);
router.put('/:id/refund', protect, paymentController.refundPayment);

module.exports = router;
