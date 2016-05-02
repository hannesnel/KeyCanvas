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
    if(!kc.isDirty) {
      kc.newCanvas({
        width: width,
        height: height
      });
      $('#newModal').modal('hide')
    }
    else {
      if(window.confirm("You have unsaved changes.\nClick OK if you are fine with loosing your changes, or click cancel to go back and save.")) {
        kc.newCanvas({
          width: width,
          height: height
        });
        $('#newModal').modal('hide')
      }
    }
  });
});
