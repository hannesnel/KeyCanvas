$(document).ready(function() {
  
  var kc = new KeyCanvas('#drawingSpace',{
    width: 400,
    height: 300
  });

  $('#drawRectancle').click(function() {
    kc.setShapeType(0);
  });

  $('#drawCircle').click(function() {
    kc.setShapeType(1);
  });

  $('#toolbarColor').colorpicker({
    'format':'rgba',
    'color':'#000000'
  }).on('changeColor',function(e) {
    kc.setColor(e.color.toRGB());
    $(e.target).find(".colorPreview").css('background-color',e.color);
  });

  $("#newCanvas").click(function() {
    var width, 
        height;
    width = $("#width").val();
    height = $("#height").val();
    kc.newCanvas({
      width: width,
      height: height
    });
  });
});
