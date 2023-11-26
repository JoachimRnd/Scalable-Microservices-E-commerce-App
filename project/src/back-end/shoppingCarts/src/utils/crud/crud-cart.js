const shoppingCarts = require('nano')(process.env.DB_URL);

const saveCart = (cart) => {
  return new Promise((resolve, reject) => {
    shoppingCarts.insert(
      cart,
      (error, success) => {
        if (success) {
          resolve("Cart successfully saved");
        } else {
          reject(new Error(`Error saving the cart. Reason: ${error.reason}.`));
        }
      }
    );
  });
}

const getCartById = (id) => {
  return new Promise((resolve, reject) => {
    shoppingCarts.view('carts', 'byId', { key: id, include_docs: true }, (err, body) => {
      if (!err) {
        const carts = body.rows.map(row => row.doc);
        resolve(carts);
      } else {
        reject(new Error(`Error getting carts by ID. Reason: ${err.reason}.`));
      }
    });
  });
};

const deleteCart = (id, revision) => {
  return new Promise((resolve, reject) => {
    shoppingCarts.destroy(id, revision, (err, success) => {
      if (success) {
        resolve("Cart successfully deleted");
      } else {
        reject(new Error(`Error deleting the cart. Reason: ${err.reason}.`));
      }
    });
  });
};



module.exports = {
  saveCart,
  getCartById,
  deleteCart
};