const recommendations = require('nano')(process.env.DB_URL);
const products = require('nano')(process.env.DB_URL_PRODUCTS);
const shoppingCarts = require('nano')(process.env.DB_URL_SHOPPING_CARTS);
const orders = require('nano')(process.env.DB_URL_ORDERS);
const users = require('nano')(process.env.DB_URL_USERS);

function getRecommendations(userId) {
  return new Promise((resolve, reject) => {
    products.view('products', 'getProducts', { include_docs: true }, (err, body) => {
      if (err) {
        reject(new Error(`Error getting all products. Reason: ${err.reason}.`));
      } else {
        const allProducts = body.rows.map(row => row.doc);
        resolve(allProducts);
      }
    });
  });
   /* return new Promise((resolve, reject) => {
      
      const mockRecommendations = [
        { productId: '123', name: 'Product 1' },
        { productId: '456', name: 'Product 2' }
      ];
  
      resolve(mockRecommendations);
    });*/
  }


module.exports = {
    getRecommendations,
};
