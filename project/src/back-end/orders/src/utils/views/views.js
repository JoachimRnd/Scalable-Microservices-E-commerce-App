/*
POUR LE MOMENT VIEW A INSERT MANUELLEMENT DANS COUCH DB

_design/orders 
Index name : byUserId

MAP FUNCTION

function (doc) {
  if (doc.userId) {
    emit(doc.userId, doc);
  }
}



*/