const products = require('nano')(process.env.DB_URL);

const createProduct = (product) => {
  return new Promise((resolve, reject) => {
    products.insert(
      product,
      (error, success) => {
        if (success) {
          resolve("Order successfully created");
        } else {
          reject(new Error(`Error creating an product. Reason: ${error.reason}.`));
        }
      }
    );
  });
}

const getProducts = () => {
  return new Promise((resolve, reject) => {
    orders.view('products', 'byCategory', { key: userId, include_docs: true }, (err, body) => {
      if (!err) {
        const orders = body.rows.map(row => row.doc);
        resolve(orders);
      } else {
        reject(new Error(`Error getting orders by category. Reason: ${err.reason}.`));
      }
    });
  });
}

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    products.list({ include_docs: true }, (err, body) => {
      if (err) {
        reject(new Error(`Error getting all products. Reason: ${err.reason}.`));
      } else {
        const allProducts = body.rows.map(row => row.doc);
        resolve(allProducts);
      }
    });
  });
}

module.exports = {
  createProduct,
  getProducts,
  getAllProducts,
};
