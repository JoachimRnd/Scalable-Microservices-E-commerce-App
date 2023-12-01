const viewDescriptor = {
  views: {
    movies_per_category: {
      map: function (doc) {
        if (doc.category && doc.movieId) {
          emit(doc.category, 1)
        }
      },
      reduce: function (key, values) {
        return sum(values)
      }
    },

    rating_per_category: {
      map: function (doc) {
        if (doc.category && doc.rating && doc.movieId) {
          emit(doc.category, doc.rating)
        }
      },
      reduce: function (key, values) {
        return Math.round((sum(values)/values.length)*100)/100;
      }
    }
  }
}

module.exports = { viewDescriptor }
