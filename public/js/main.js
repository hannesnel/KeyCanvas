$(document).ready(function() {
  var kc = new KeyCanvas("#drawingSpace",{
    width:400,
    height:400
  });
  
  $("#shapeRectangle").change(function() {
    kc.setShapeType(0);
  });
  
  $("#shapeCircle").change(function() {
    kc.setShapeType(1);
  });
});
