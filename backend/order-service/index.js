const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const orders = {
    o_12345: {
        orderId: 'o_12345',
        userId: 'u_001',
        items: ['item1', 'item2'],
        totalAmount: 100
    },
    o_adv_001: {
        orderId: 'o_adv_001',
        userId: 'u_777',
        items: ['itemA'],
        totalAmount: 100
    },
    o_slow: {
        orderId: 'o_slow',
        userId: 'u_002',
        items: ['item3'],
        totalAmount: 100
    }
    // o_broken intentionally missing to simulate 404
};

app.get('/api/order/:orderId', async (req, res) => {
    const { orderId } = req.params;

    if (orderId === 'o_slow') {
        setTimeout(() => {
            return res.status(200).json({ order: orders[orderId] });
        }, 5000); // simulate 5s delay
        return;
    }

    const order = orders[orderId];
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({ order });
});

app.listen(3020, () => {
    console.log('Order service running on port 3020');
});