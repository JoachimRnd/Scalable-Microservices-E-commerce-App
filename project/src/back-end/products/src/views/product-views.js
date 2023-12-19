const viewDescriptor = {
    views: {
        getProducts: {
            map: function (doc) { emit(doc._id, doc); }
        },
        getProductsById: {
            map: function (doc) { if (doc._id) { emit(doc._id, doc); } }
        }
    }
}

module.exports = { viewDescriptor }