const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const payments = new Set();

app.post('/api/payment', async (req, res) => {
    const { orderId, amount } = req.body;


    if (orderId === null || orderId === undefined) {
        return res.status(400).json({ status: 'FAILED', error: 'Missing orderId' });
    }

    if (
        typeof orderId !== 'string' ||
        orderId.trim() === '' ||
        orderId.includes('<') ||
        orderId.includes('>') ||
        orderId.length > 100
    ) {
        return res.status(400).json({ status: 'FAILED', error: 'Invalid orderId' });
    }

    if (
        typeof amount !== 'number' ||
        isNaN(amount) ||
        amount <= 0 ||
        amount > 1e9
    ) {
        return res.status(400).json({ status: 'FAILED', error: 'Invalid amount' });
    }

    const paymentKey = `${orderId}:${amount}`;
    if (payments.has(paymentKey)) {
        return res.status(409).json({ status: 'FAILED', error: 'Duplicate payment' });
    }

    try {
        const response = await axios.get(`http://localhost:3020/api/order/${orderId}`);
        const order = response.data.order;

        if (order.totalAmount !== amount) {
            return res.status(400).json({ status: 'FAILED', error: 'Amount mismatch' });
        }

        payments.add(paymentKey);
        return res.status(200).json({ status: 'SUCCESS', message: 'Payment processed' });
    } catch (err) {
        return res.status(404).json({ status: 'FAILED', error: 'Order not found' });
    }
});

app.post('/api/reset-payments', (req, res) => {
    payments.clear();
    res.status(200).json({ message: 'Payments reset' });
});

app.listen(3010, () => {
    console.log('Payment service running on port 3010');
});