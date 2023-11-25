const orders = require('nano')(process.env.DB_URL);

const createOrder = (order) => {
  return new Promise((resolve, reject) => {
    orders.insert(
      order,
      (error, success) => {
        if (success) {
          resolve("Order successfully created");
        } else {
          reject(new Error(`Error creating an order. Reason: ${error.reason}.`));
        }
      }
    );
  });
}

const getOrdersByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    orders.view('orders', 'byUserId', { key: userId, include_docs: true }, (err, body) => {
      if (!err) {
        const orders = body.rows.map(row => row.doc);
        resolve(orders);
      } else {
        reject(new Error(`Error getting orders by user ID. Reason: ${err.reason}.`));
      }
    });
  });
}

module.exports = {
  createOrder,
  getOrdersByUserId
};
