const viewDescriptor = {
    views: {
        getUsers: {
            map: function (doc) { emit(doc._id, doc); }
        }
    }
}

module.exports = { viewDescriptor }