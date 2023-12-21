const recommendations = require('nano')(process.env.DB_URL);
const products = require('nano')(process.env.DB_URL_PRODUCTS);
const shoppingCarts = require('nano')(process.env.DB_URL_SHOPPING_CARTS);
const orders = require('nano')(process.env.DB_URL_ORDERS);
const users = require('nano')(process.env.DB_URL_USERS);

async function generateDailyRecommendations() {
  try {
    const allProducts = await getProducts();
    const allUsers = await getUsers();


    const globalTrends = await analyze();
    console.log('globalTrends', globalTrends);
    for (let user of allUsers) {
      const userOrders = await getOrdersByUserId(user._id);
      const userTrends = await analyze(user._id);
      console.log('userTrends', userTrends);

      let userRecommendations = {};
      userRecommendations.recommendations = {};

      allProducts.forEach(product => {
        let recommendationsSet = new Set();
        // Global trend recommendations
        addTrendRecommendations(recommendationsSet, globalTrends, product, allProducts, threshold = 10); //threshold to change in production

        // User specific trend recommendations
        addTrendRecommendations(recommendationsSet, userTrends, product, allProducts, threshold = 5); //threshold to change in production
        console.log('recommendationsSet', recommendationsSet)
        userRecommendations.recommendations[product._id] = Array.from(recommendationsSet);
      });
      const existingRecommendation = await getRecommendationById(user._id);
      if (existingRecommendation.length > 0) {
        userRecommendations._rev = existingRecommendation[0]._rev;
      }
      userRecommendations._id = user._id,
        await recommendations.insert(
          userRecommendations
        );
    }

  } catch (error) {
    console.error('Error when generating recommendations:', error);
  }
}

const analyze = async (userId = null) => {
  const productsFrequency = await getProductsFrequency(userId);
  const frequentlyBoughtTogether = await getFrequentlyBoughtTogether(userId);
  const categoryPreferences = await getCategoryPreferences(productsFrequency);
  console.log('productsFrequency', productsFrequency);
  console.log('frequentlyBoughtTogether', frequentlyBoughtTogether);
  console.log('categoryPreferences', categoryPreferences);

  return { productsFrequency, categoryPreferences, frequentlyBoughtTogether };
}


const getProductsFrequency = (userId) => {
  return new Promise((resolve, reject) => {
    let viewOptions = userId ? { startkey: [userId], endkey: [userId, {}], group: true } : { group: true };
    orders.view('orders', 'productsFrequency', viewOptions, (err, body) => {
      if (!err) {
        let productsFrequency = {};
        body.rows.forEach(row => {
          let productId = row.key[1];
          productsFrequency[productId] = row.value;
        });
        resolve(productsFrequency);
      } else {
        reject(new Error(`Error getting product frequency. Reason: ${err.reason}.`));
      }
    });
  });
}

const getFrequentlyBoughtTogether = (userId) => {
  return new Promise((resolve, reject) => {
    let viewOptions = userId ? { startkey: [userId], endkey: [userId, {}], group: true } : { group: true };
    orders.view('orders', 'frequentlyBoughtTogether', viewOptions, (err, body) => {
      if (!err) {
        let frequentlyBoughtTogether = {};
        body.rows.forEach(row => {
          console.log("======================================================================================================")
          console.log('row get frequently bought together', row)
          let productId1 = row.key[1];
          let productId2 = row.key[2];

          if (!frequentlyBoughtTogether[productId1]) {
            frequentlyBoughtTogether[productId1] = {};
          }
          if (!frequentlyBoughtTogether[productId2]) {
            frequentlyBoughtTogether[productId2] = {};
          }
          console.log("======================================================================================================")
          frequentlyBoughtTogether[productId1][productId2] = row.value;
          frequentlyBoughtTogether[productId2][productId1] = row.value;
          console.log("FREQUENTLY BOUGHT TOGETHER", frequentlyBoughtTogether)
        });
        resolve(frequentlyBoughtTogether);
      } else {
        reject(new Error(`Error getting frequently bought together. Reason: ${err.reason}.`));
      }
    });
  });
}

const getCategoryPreferences = async (productsFrequency) => {
  try {
    const productIds = Object.keys(productsFrequency);
    const productsInfo = await getProductsById(productIds);

    let categoryPreferences = {};

    productsInfo.forEach(product => {
      const quantity = productsFrequency[product._id];
      const category = product.category;
      categoryPreferences[category] = (categoryPreferences[category] || 0) + quantity;
    });

    return categoryPreferences;
  } catch (err) {
    reject(new Error(`Error calculating category preferences: Reason: ${err.reason}.`));
  }
};


const addTrendRecommendations = (recommendationsSet, trends, product, allProducts, threshold) => {
  if (trends.frequentlyBoughtTogether[product._id]) {
    Object.entries(trends.frequentlyBoughtTogether[product._id]).forEach(([relatedProductId, frequency]) => {
      if (frequency > threshold && product._id !== relatedProductId) {
        recommendationsSet.add(relatedProductId);
      }
    });
  }

  if (product.category in trends.categoryPreferences && trends.categoryPreferences[product.category] > threshold) {
    allProducts.filter(p => p.category === product.category && p._id !== product._id && trends.productsFrequency[product._id] > threshold)
      .forEach(p => recommendationsSet.add(p._id));
  }
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
