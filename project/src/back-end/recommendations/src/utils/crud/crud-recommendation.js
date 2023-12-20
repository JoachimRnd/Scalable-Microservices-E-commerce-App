const recommendations = require('nano')(process.env.DB_URL);
const products = require('nano')(process.env.DB_URL_PRODUCTS);
const shoppingCarts = require('nano')(process.env.DB_URL_SHOPPING_CARTS);
const orders = require('nano')(process.env.DB_URL_ORDERS);
const users = require('nano')(process.env.DB_URL_USERS);

async function generateDailyRecommendations() {
  try {
    const allProducts = await getProducts();
    const allUsers = await users.list({ include_docs: true });
    console.log('allUsers', allUsers);
    console.log('allProducts', allProducts);
    const threshold = 1;

    for (let user of allUsers.rows) {
      const userOrders = await orders.view('orders', 'byUserId', { key: user.id });
      const trends = analyzeOrders(userOrders.rows);

      let userRecommendations = {};

      allProducts.forEach(product => {
        let recommendationsSet = new Set();

        if (trends.productFrequency[product._id] > threshold) {
          recommendationsSet.add(product._id);
        }

        if (trends.frequentlyBoughtTogether[product._id]) {
          trends.frequentlyBoughtTogether[product._id].forEach(relatedProductId => {
            recommendationsSet.add(relatedProductId);
          });
        }

        if (product.category in trends.categoryPreferences) {
          allProducts.filter(p => p.category === product.category && p._id !== product._id)
                     .forEach(p => recommendationsSet.add(p._id));
        }
        userRecommendations[product._id] = Array.from(recommendationsSet);
      });

      await recommendations.insert({
        userId: user.id,
        recommendations: userRecommendations
      });
    }

  } catch (error) {
    console.error('Error when generating recommendations :', error);
  }
}


const analyzeOrders = async (orders) => {
  let productFrequency = {};
  let frequentlyBoughtTogether = {};
  let categoryPreferences = {};
  let uniqueProductIds = new Set();

  orders.forEach(order => {
    order.items.forEach(item => {
      uniqueProductIds.add(item._id);
      productFrequency[item._id] = (productFrequency[item._id] || 0) + 1;
    });
  });

  try {
    const productsInfo = await getProductInfo(Array.from(uniqueProductIds));

    productsInfo.forEach(product => {
      let category = product.category;
      categoryPreferences[category] = (categoryPreferences[category] || 0) + 1;
    });
  } catch (error) {
    console.error('Error retrieving product information :', error);
  }

  orders.forEach(itemId => {
    orders.forEach(otherItemId => {
      if (itemId !== otherItemId) {
        if (!frequentlyBoughtTogether[itemId]) {
          frequentlyBoughtTogether[itemId] = {};
        }
        frequentlyBoughtTogether[itemId][otherItemId] = (frequentlyBoughtTogether[itemId][otherItemId] || 0) + 1;
      }
    });
  });
  return { productFrequency, categoryPreferences, frequentlyBoughtTogether };
}


const getProductInfo = (productIds) => {
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
};

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
};


module.exports = {
  generateDailyRecommendations
};
