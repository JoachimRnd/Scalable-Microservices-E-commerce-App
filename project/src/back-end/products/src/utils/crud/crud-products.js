const products = require('nano')(process.env.DB_URL);
const { v4: uuidv4 } = require('uuid');

const { BlobServiceClient } = require('@azure/storage-blob');

const blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const createProduct = (product, req) => {
  const imageUrl = product.image;
  const imagePath = path.resolve(__dirname, 'images', `${product._id}.png`);
  return downloadImage(imageUrl, imagePath)
    .then(() => uploadImageToBlobStorage(imagePath, product, req))
    .then((updatedProduct) => {
      return new Promise((resolve, reject) => {
        products.insert(
          updatedProduct,
          (error, success) => {
            if (success) {
              resolve({product : {...updatedProduct, _id: success.id, _rev: success.rev}});
            } else {
              reject(new Error(`Error creating a product. Reason: ${error.reason}.`));
            }
          }
        );
      });
    });
}

const updateProduct = (product, req) => {
  const imageUrl = product.image;
  const imagePath = path.resolve(__dirname, 'images', `${product._id}.png`);
  return downloadImage(imageUrl, imagePath)
    .then(() => uploadImageToBlobStorage(imagePath, product, req))
    .then((updatedProduct) => {
      return new Promise((resolve, reject) => {
        products.insert(
          updatedProduct,
          (error, success) => {
            if (success) {
              resolve({product : updatedProduct});
            } else {
              reject(new Error(`Error updating a product. Reason: ${error.reason}.`));
            }
          }
        );
      });
    });
}
const downloadImage = (url, path) => {
  return axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
}

const uploadImageToBlobStorage = (imagePath, product, req) => {
  return new Promise((resolve, reject) => {
    const blobName = uuidv4() + '.png';
    const containerClient = blobService.getContainerClient('scapp-product');
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    blockBlobClient.uploadFile(imagePath)
      .then(() => {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${imagePath}.`, err);
          }
        });
        product.image = blockBlobClient.url;
        resolve(product);
      })
      .catch(reject);
  });
}

const deleteProduct = (product) => {
  return new Promise((resolve, reject) => {
    products.destroy(
      product._id,
      product._rev,
      (error, success) => {
        if (success) {
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

const getProductsById = (productIds) => {
  return new Promise((resolve, reject) => {
    products.view('products', 'getProductsById', { keys: productIds, include_docs: true }, (err, body) => {
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
  getProductsById,
  updateProduct,
  deleteProduct,
};
