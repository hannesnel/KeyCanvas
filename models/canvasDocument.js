

module.exports = function(db) {
  var canvasDocuments = db.getCollection('canvasDocument');
  
  function canvasDocument(userId, name, width, height, design) {
    this.userId = userId;
    this.name = name;
    this.width = width;
    this.height = height;
    this.design = design;
  }
  
  function upsertCanvasDocument(canvasDoc) {
        var rec = canvasDocuments.findOne({
      '$and':[{
        'userId': canvasDoc.userId
        }, {
          'name': canvasDoc.name
      }]
    });
    if(!rec) {
      canvasDocuments.insert(canvasDoc);
    }
    else {
      rec.design = canvasDoc.design;
      canvasDocuments.update(rec);
    }
    db.saveDatabase();
    return rec;
  }
  
  function getCanvasDocumentsByUserId(userId) {
    return canvasDocuments.find({userId:userId});
  }
  
  function getCanvasByName(userId, name) {
    var rec = canvasDocuments.findOne({
      '$and':[{
        'userId': userId
        }, {
          'name': name
      }]
    });
    
    return rec;
  }
  
  return {
    canvasDocument: canvasDocument,
    upsertCanvasDocument:upsertCanvasDocument,
    getCanvasDocumentsByUserId: getCanvasDocumentsByUserId,
    getCanvasByName: getCanvasByName
  };
};