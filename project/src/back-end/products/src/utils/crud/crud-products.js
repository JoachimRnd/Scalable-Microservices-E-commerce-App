const products = require('nano')(process.env.DB_URL);

const createProduct = (product) => {
  return new Promise((resolve, reject) => {
    products.insert(
      product,
      (error, success) => {
        if (success) {
          console.log("Product successfully created");
          const productWIthId = { ...product, _id: success.id, _rev: success.rev };
          resolve({product : productWIthId});
        } else {
          reject(new Error(`Error creating an product. Reason: ${error.reason}.`));
        }
      }
    );
  });
}

const updateProduct = (product) => {
  return new Promise((resolve, reject) => {
    products.insert(
      product,
      (error, success) => {
        if (success) {
          console.log("Product successfully updated");
          resolve({product : product});
        } else {
          reject(new Error(`Error updating an product. Reason: ${error.reason}.`));
        }
      }
    );
  });
}

const deleteProduct = (product) => {
  return new Promise((resolve, reject) => {
    products.destroy(
      product._id,
      product._rev,
      (error, success) => {
        if (success) {
          console.log("Product successfully deleted");
          resolve({product : product});
        } else {
          reject(new Error(`Error deleting an product. Reason: ${error.reason}.`));
        }
      }
    );
  });
}

const getProductsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    products.view('products', 'byCategory', { key: category, include_docs: true }, (err, body) => {
      if (!err) {
        const products = body.rows.map(row => row.doc);
        resolve(products);
      } else {
        reject(new Error(`Error getting products by category. Reason: ${err.reason}.`));
      }
    });
  });
}


const getProducts = () => {
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
}

const getProductsByIds = (productIds) => {
  return new Promise((resolve, reject) => {
    products.view('products', 'getProductsByIds', { keys: productIds, include_docs: true }, (err, body) => {
      if (err) {
        reject(new Error(`Error getting products by IDs. Reason: ${err.reason}.`));
      } else {
        const productsByIds = body.rows.map(row => row.doc);
        resolve(productsByIds);
      }
    });
  });
}




module.exports = {
  createProduct,
  getProductsByCategory,
  getProducts,
  getProductsByIds,
  updateProduct,
  deleteProduct,
};
