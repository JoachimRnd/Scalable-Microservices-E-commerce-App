const recommendations = require('nano')(process.env.DB_URL);
const products = require('nano')(process.env.DB_URL_PRODUCTS);
const shoppingCarts = require('nano')(process.env.DB_URL_SHOPPING_CARTS);
const orders = require('nano')(process.env.DB_URL_ORDERS);
const users = require('nano')(process.env.DB_URL_USERS);

async function generateDailyRecommendations() {
  try {
    const allProducts = await getProducts();
    const allOrders = await getOrders();
    const allUsers = await getUsers();

    console.log('allOrders', allOrders);
    console.log('allProducts', allProducts);
    console.log('allUsers', allUsers);

    const globalTrends = allOrders.length > 0 ? await analyzeOrders(allOrders) : {};
    console.log('globalTrends', globalTrends);
    for (let user of allUsers) {
      const userOrders = await getOrdersByUserId(user._id);
      console.log('userOrders', userOrders)
      const userTrends = userOrders.length > 0 ? await analyzeOrders(userOrders) : {};
      console.log('userTrends', userTrends);

      let userRecommendations = {};

      allProducts.forEach(product => {
        let recommendationsSet = new Set();
        // Global trend recommendations
        addTrendRecommendations(recommendationsSet, globalTrends, product, allProducts, threshold = 10); //threshold to change in production

        // User specific trend recommendations
        addTrendRecommendations(recommendationsSet, userTrends, product, allProducts, threshold = 5); //threshold to change in production
        console.log('productid', product._id)
        console.log('recommendationsSet', recommendationsSet)
        userRecommendations[product._id] = Array.from(recommendationsSet);
      });
      const existingRecommendation = await getRecommendationById(user._id);
      if (existingRecommendation.length > 0) {
        userRecommendations._rev = existingRecommendation[0]._rev;
      }
      userRecommendations._id = user._id;
      //TO CHANGE ID to base of the recommendations
      await recommendations.insert({
        recommendations: userRecommendations
      });
    }

  } catch (error) {
    console.error('Error when generating recommendations:', error);
  }
}

const analyzeOrders = async (orders) => {
  let productFrequency = {};
  let frequentlyBoughtTogether = {};
  let categoryPreferences = {};
  let uniqueProducts = new Map();

  orders.forEach(order => {
    order.items.forEach(item => {
      uniqueProducts.set(item._id, (uniqueProducts.get(item._id) || 0) + item.quantity);
      productFrequency[item._id] = (productFrequency[item._id] || 0) + item.quantity;
    });
  });

  try {
    const productsInfo = await getProductInfo(Array.from(uniqueProducts.keys()));

    productsInfo.forEach(product => {
      let category = product.category;
      let quantity = uniqueProducts.get(product._id) || 0;
      categoryPreferences[category] = (categoryPreferences[category] || 0) + quantity;
    });
  } catch (error) {
    console.error('Error retrieving product information :', error);
  }

  orders.forEach(order => {
    const itemsInOrder = order.items.map(item => item._id);

    itemsInOrder.forEach(itemId => {
      itemsInOrder.forEach(otherItemId => {
        if (itemId !== otherItemId) {
          if (!frequentlyBoughtTogether[itemId]) {
            frequentlyBoughtTogether[itemId] = {};
          }
          frequentlyBoughtTogether[itemId][otherItemId] = (frequentlyBoughtTogether[itemId][otherItemId] || 0) + 1;
        }
      });
    });
  });

  return { productFrequency, categoryPreferences, frequentlyBoughtTogether };
}

function addTrendRecommendations(recommendationsSet, trends, product, allProducts, threshold) {
  if (Object.keys(trends).length > 0) {
    if (trends.frequentlyBoughtTogether[product._id]) {
      Object.entries(trends.frequentlyBoughtTogether[product._id]).forEach(([relatedProductId, frequency]) => {
        if (frequency > threshold && product._id !== relatedProductId) {
          recommendationsSet.add(relatedProductId);
        }
      });
    }


    // product concombre
    console.log("trends.categoryPreferences", trends.categoryPreferences[product.category])
    if (product.category in trends.categoryPreferences && trends.categoryPreferences[product.category] > threshold) {
      allProducts.filter(p => p.category === product.category && p._id !== product._id && trends.productFrequency[product._id] > threshold)
        .forEach(p => recommendationsSet.add(p._id));
    }
  }
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
        console.log(err);
        reject(new Error(`Error getting all products. Reason: ${err.reason}.`));
      } else {
        const allProducts = body.rows.map(row => row.doc);
        resolve(allProducts);
      }
    });
  });
};

const getUsers = () => {
  return new Promise((resolve, reject) => {
    users.view('users', 'getUsers', { include_docs: true }, (err, body) => {
      if (err) {
        reject(new Error(`Error getting all users. Reason: ${err.reason}.`));
      } else {
        const allUsers = body.rows.map(row => row.doc);
        resolve(allUsers);
      }
    });
  });
};

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

const getOrders = () => {
  return new Promise((resolve, reject) => {
    orders.view('orders', 'getOrders', { include_docs: true }, (err, body) => {
      if (err) {
        reject(new Error(`Error getting all orders. Reason: ${err.reason}.`));
      } else {
        const allOrders = body.rows.map(row => row.doc);
        resolve(allOrders);
      }
    });
  });
};

const getRecommendationById = (id) => {
  return new Promise((resolve, reject) => {
    recommendations.view('recommendations', 'getRecommendationById', { key: id, include_docs: true }, (err, body) => {
      if (!err) {
        const recommendations = body.rows.map(row => row.doc);
        resolve(recommendations);
      } else {
        reject(new Error(`Error getting recommendations by ID. Reason: ${err.reason}.`));
      }
    });
  });
};

module.exports = {
  generateDailyRecommendations
};
