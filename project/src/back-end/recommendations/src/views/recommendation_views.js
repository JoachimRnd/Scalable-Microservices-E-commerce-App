const viewDescriptor = {
  views: {
    getRecommendationsById: {
      map: function (doc) { if (doc._id) { emit(doc._id, doc); }}
    },
  }
}

module.exports = { viewDescriptor }
