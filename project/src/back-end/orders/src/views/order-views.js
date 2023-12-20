const viewDescriptor = {
    views: {
        getOrders: {
            map: function (doc) { emit(doc._id, doc); }
        },
        byUserId: {
            map: function (doc) { if (doc.userId) { emit(doc.userId, doc); }}
        }
    }
}

module.exports = { viewDescriptor }