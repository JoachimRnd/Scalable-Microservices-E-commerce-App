const viewDescriptor = {
    views: {
        getOrders: {
            map: function (doc) { emit(doc._id, doc); }
        },
        byUserId: {
            map: function (doc) { if (doc.userId) { emit(doc.userId, doc); } }
        },
        productsFrequency: {
            map: function (doc) {
                doc.items.forEach(function (item) {
                    emit([doc.userId, item._id], item.quantity);
                });
            },
            reduce: '_sum'
        },
        frequentlyBoughtTogether: {
            map: function (doc) {
                var sortedItems = doc.items.map(item => item._id).sort();
                for (var i = 0; i < sortedItems.length; i++) {
                    for (var j = i + 1; j < sortedItems.length; j++) {
                        emit([doc.userId, sortedItems[i], sortedItems[j]], 1);
                    }
                }
            },
            reduce: '_sum'
        },
    }
}

module.exports = { viewDescriptor }