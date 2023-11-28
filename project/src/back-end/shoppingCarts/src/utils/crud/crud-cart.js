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


const deleteItemFromCart = (userId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingCart = await getCartById(userId);
      if (existingCart.length === 0) {
        reject(new Error('Cart not found'));
        return;
      }
      const cart = existingCart[0];

      if (cart._id !== userId) {
        reject(new Error('Not authorized'));
        return;
      }

      const updatedItems = cart.items.filter(item => item._id !== itemId);
      cart.items = updatedItems;
      await saveCart(cart);
      resolve('Item successfully deleted from the cart');
    } catch (error) {
      reject(new Error(`Error deleting item from the cart. Reason: ${error.message}.`));
    }
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
  deleteItemFromCart,
  deleteCart,
};