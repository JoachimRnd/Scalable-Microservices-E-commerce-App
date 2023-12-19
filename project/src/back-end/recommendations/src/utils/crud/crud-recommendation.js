const recommendations = require('nano')(process.env.DB_URL);

function getRecommendations(userId) {
    return new Promise((resolve, reject) => {
      
      const mockRecommendations = [
        { productId: '123', name: 'Product 1' },
        { productId: '456', name: 'Product 2' }
      ];
  
      resolve(mockRecommendations);
    });
  }


module.exports = {
    getRecommendations,
};
