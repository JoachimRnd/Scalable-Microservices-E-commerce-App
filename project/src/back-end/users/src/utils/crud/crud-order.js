const orders = require('nano')(process.env.DB_URL_ORDERS);

function createOrder(order) {
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

module.exports = {
  createOrder,
};
