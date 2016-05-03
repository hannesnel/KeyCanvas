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
    $(e.target).find('.colorPreview').css('background-color',e.color);
  });

  $("#btnOpenCanvas").click(function() {
    $.ajax({
      type:'GET',
      url: '/getCanvasDocuments',
      success: function(data,status,xhr) {
        var canvasList = $("#openCanvasList");
        canvasList.html(null);
        $.each(data,function(index,canvasDoc) {
          canvasList.append(
            $('<a>')
              .data('name',canvasDoc.name)
              .attr('href','javascript:;')
              .addClass('list-group-item')
              .html(canvasDoc.name)
              .click(function() {
                var cName = $(this).data('name');
                $.ajax({
                  type:'GET',
                  url: '/getCanvasByName/' + cName,
                  success:function(data,status,xhr) {
                    kc.loadCanvas(data);
                    $('#openModal').modal('hide');
                  }
                });
              })
          );
        });
      }
    });
  });
  
  $('#canvasSave').click(function() {
    var canvas;
    canvas = kc.getCanvas();
    $.ajax({
      type:'POST',
      url: '/savecanvas',
      data: canvas,
      success: function(data,status,xhr) {
        kc.setSaved();
      }
    });
  });
  
  $('#newCanvas').click(function() {
    var width, 
        height,
        designName;
    
    designName = $('#designName').val();
    width = $('#width').val();
    height = $('#height').val();
    if(designName == '' || width == '' || height == '') {
      alert('Please enter all required fields');
      return;
    }
    if(!kc.isDirty) {
      kc.newCanvas({
        name: designName,
        width: width,
        height: height
      });
      $('#newModal').modal('hide');
    }
    else {
      if(window.confirm('You have unsaved changes.\nClick OK if you are fine with loosing your changes, or click cancel to go back and save.')) {
        kc.newCanvas({
          name: designName,
          width: width,
          height: height
        });
        $('#newModal').modal('hide');
      }
    }
  });
});
