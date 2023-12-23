const recommendations = require('nano')(process.env.DB_URL);
const products = require('nano')(process.env.DB_URL_PRODUCTS);
const shoppingCarts = require('nano')(process.env.DB_URL_SHOPPING_CARTS);
const orders = require('nano')(process.env.DB_URL_ORDERS);
const users = require('nano')(process.env.DB_URL_USERS);

const global_recommendation_id = '7bd9dae1-3d94-4c46-9297-f8f965661ec3';

const getRecommendations = async (userId, productId) => {
  try {
    const userRecommendations = await getRecommendationsById(userId);

    let recommendations;
    if (userRecommendations.length === 0) { // if no recommendations for the user, take the global recommendations
      const globalRecommendations = await getRecommendationsById(global_recommendation_id);
      if (globalRecommendations.length > 0) {
        recommendations = globalRecommendations[0].recommendations;
      } else {
        return [];
      }
    } else {
      recommendations = userRecommendations[0].recommendations;
    }

    const userCart = await getShoppingCartByUserId(userId);
    let cartProductIds = new Set();
    if (userCart.length > 0 && userCart[0].items) {
      userCart[0].items.forEach(item => cartProductIds.add(item._id));
    }

    let finalRecommendationsId = new Set();

    if (recommendations[productId] && recommendations[productId].length > 0) {
      recommendations[productId].forEach(id => {
        if (id !== productId && !cartProductIds.has(id)) {
          finalRecommendationsId.add(id);
        }
      });
    }

    cartProductIds.forEach(cartProductId => {
      if (recommendations[cartProductId] && recommendations[cartProductId].length > 0) {
        recommendations[cartProductId].forEach(id => {
          if (id !== productId && !cartProductIds.has(id)) {
            finalRecommendationsId.add(id);
          }
        });
      }
    });

    finalRecommendationsId = Array.from(finalRecommendationsId);

    finalRecommendationsId = shuffleArray(finalRecommendationsId); // shuffle the recommendations
    finalRecommendationsId = finalRecommendationsId.slice(0, 20); // take the 20 first recommendations

    const productRecommendations = await getProductsById(finalRecommendationsId);
    return productRecommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};


const getShoppingCartByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    shoppingCarts.view('carts', 'getShoppingCartById', { key: userId, include_docs: true }, (err, body) => {
      if (!err) {
        const carts = body.rows.map(row => row.doc);
        resolve(carts);
      } else {
        reject(new Error(`Error getting shopping cart by ID. Reason: ${err.reason}.`));
      }
    });
  });
};

const generateDailyRecommendations = async () => {
  try {
    const allProducts = await getProducts();
    const allUsers = await getUsers();

    const globalTrends = await analyze(); // Analyze global trends once

    let globalRecommendations = {};

    allProducts.forEach(product => {
      let recommendationsSet = new Set();
      addTrendRecommendations(recommendationsSet, globalTrends, product, allProducts, thresholdFrequency = 30, thresholdBoughtTogether = 10, thresholdCategoryPreferences = 40); //threshold very very low to test => to change in production
      globalRecommendations[product._id] = Array.from(recommendationsSet);
    });

    const existingGlobalRecommendation = await getRecommendationsById(global_recommendation_id);
    if (existingGlobalRecommendation.length > 0) {
      await recommendations.insert({ _id: global_recommendation_id, _rev: existingGlobalRecommendation[0]._rev, recommendations: globalRecommendations });
    } else {
      await recommendations.insert({ _id: global_recommendation_id, recommendations: globalRecommendations });
    }

    for (let user of allUsers) {
      const userTrends = await analyze(user._id);

      let userGlobalRecommendations = {};
      userGlobalRecommendations.recommendations = {};

      allProducts.forEach(product => {
        let recommendationsSet = new Set(globalRecommendations[product._id]);
        addTrendRecommendations(recommendationsSet, userTrends, product, allProducts, thresholdFrequency = 5/*15*/, thresholdBoughtTogether = 2, thresholdCategoryPreferences = 5/*20*/); //threshold very very low to test => to change in production
        userGlobalRecommendations.recommendations[product._id] = Array.from(recommendationsSet);
      });

      const existingRecommendation = await getRecommendationsById(user._id);
      if (existingRecommendation.length > 0) {
        userGlobalRecommendations._rev = existingRecommendation[0]._rev;
      }
      userGlobalRecommendations._id = user._id,

        await recommendations.insert(userGlobalRecommendations);
    }

  } catch (error) {
    console.error('Error when generating recommendations:', error);
  }
}


const analyze = async (userId = null) => {
  const productsFrequency = await getProductsFrequency(userId);
  const frequentlyBoughtTogether = await getFrequentlyBoughtTogether(userId);
  const categoryPreferences = await getCategoryPreferences(productsFrequency);

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
          let productId1 = row.key[1];
          let productId2 = row.key[2];

          if (!frequentlyBoughtTogether[productId1]) {
            frequentlyBoughtTogether[productId1] = {};
          }
          frequentlyBoughtTogether[productId1][productId2] = row.value;
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


// Frequently bought together :
// If a product 2 is frequently bought together with the product 1 (product param) and have a frequency of > thresholdBoughtTogether
// Then add the product 2 as recommendation

// Category preferences :
// If a product 2 is frequently bought > thresholdFrequency and is in the same category than product 1 (product) and have a category frequency of > thresholdCategoryPreferences
// Then add the product 2 as recommendation
const addTrendRecommendations = (recommendationsSet, trends, product, allProducts, thresholdFrequency, thresholdBoughtTogether, thresholdCategoryPreferences) => {
  if (trends.frequentlyBoughtTogether[product._id]) {
    Object.entries(trends.frequentlyBoughtTogether[product._id]).forEach(([relatedProductId, frequency]) => {
      if (frequency > thresholdBoughtTogether && product._id !== relatedProductId) {
        recommendationsSet.add(relatedProductId);
      }
    });
  }
  if (product.category in trends.categoryPreferences && trends.categoryPreferences[product.category] > thresholdCategoryPreferences) {

    allProducts.filter(p => p.category === product.category && p._id !== product._id && trends.productsFrequency[p._id] > thresholdFrequency)
      .forEach(p => {
        recommendationsSet.add(p._id)
      });
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

const getRecommendationsById = (userId) => {
  return new Promise((resolve, reject) => {
    recommendations.view('recommendations', 'getRecommendationsById', { key: userId, include_docs: true }, (err, body) => {
      if (!err) {
        const recommendations = body.rows.map(row => row.doc);
        resolve(recommendations);
      } else {
        reject(new Error(`Error getting recommendations by ID. Reason: ${err.reason}.`));
      }
    });
  });
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = {
  generateDailyRecommendations,
  getRecommendations
};
