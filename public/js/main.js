$(document).ready(function() {
  var kc = new KeyCanvas("#drawingSpace",{
    width:600,
    height:400
  });
  
  $("#shapeRectangle").change(function() {
    kc.setShapeType(0);
  });
  
  $("#shapeCircle").change(function() {
    kc.setShapeType(1);
  });
  
  $("#colorGreen").change(function() {
    kc.setColor("#00AA00");
  });
  
  $("#colorBlue").change(function() {
    kc.setColor("#0000AA");
  });
});
