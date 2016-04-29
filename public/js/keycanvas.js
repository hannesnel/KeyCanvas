var KeyCanvas = KeyCanvas || (function ($) {
	var handleBoxSize = 6,
			ghostContext,
			selectedShape;
		
	// a safe place for all the shapes
	var shapes = [];
	var selectionHandles = [];
	var ShapeType = {
		rectangle: 0,
		circle: 1
	};
	
	function Shape(left, top, width, height, fillColor, shapeType)
	{
		this.left = left || 0;
		this.top = top || 0;
		this.width = width || 50;
		this.height = height || 0;
		this.fillColor = fillColor || '#0000CC';
		this.shapeType = shapeType || ShapeType.rectangle; 
	}
	
	
	Shape.prototype.draw = function(context) {
		if(context === ghostContext){
			context.fillStyle = '#000000';
		}
		else {
			context.fillStyle = this.fillColor;
		}
		
		if (this.left > context.canvas.width || this.top > context.canvas.height) 
			return; 
		if (this.left + this.width < 0 || this.top + this.height < 0) 
			return;
		if(this.shapeType==ShapeType.rectangle) {
			context.fillRect(this.left,this.top,this.width,this.height);
		}
		else if(this.shapeType==ShapeType.circle) {
			context.beginPath();
			context.ellipse(this.left + (this.width/2),this.top + (this.height/2),this.width/2,this.height/2,0,0,2*Math.PI);
			context.fill();
		}
		
		if(selectedShape === this) {
			context.strokeStyle = '#CC0000';
			context.lineWidth = 2;

			context.strokeRect(this.left,this.top,this.width,this.height);

			var half = handleBoxSize / 2;
			
			selectionHandles[0].x = this.left-half;
      selectionHandles[0].y = this.top-half;
      
      selectionHandles[1].x = this.left+this.width/2-half;
      selectionHandles[1].y = this.top-half;
      
      selectionHandles[2].x = this.left+this.width-half;
      selectionHandles[2].y = this.top-half;
      
      //middle left
      selectionHandles[3].x = this.left-half;
      selectionHandles[3].y = this.top+this.height/2-half;
      
      //middle right
      selectionHandles[4].x = this.left+this.width-half;
      selectionHandles[4].y = this.top+this.height/2-half;
      
      //bottom left, middle, right
      selectionHandles[6].x = this.left+this.width/2-half;
      selectionHandles[6].y = this.top+this.height-half;
      
      selectionHandles[5].x = this.left-half;
      selectionHandles[5].y = this.top+this.height-half;
      
      selectionHandles[7].x = this.left+this.width-half;
      selectionHandles[7].y = this.top+this.height-half;
			
			context.fillStyle = '#0000CC';
			for(var i=0;i<8;i++) {
				var currentHandle = selectionHandles[i];
				context.fillRect(currentHandle.x,currentHandle.y,handleBoxSize, handleBoxSize);
			}
		}
	};
	
	function keyCanvas(selector,opts){
		var objCanvas,
				stylePaddingLeft,
				stylePaddingTop,
				styleBorderLeft,
				styleBorderTop,
				interval;
		
		interval = 30;
				
		objCanvas = $(selector);
		if(objCanvas.length===0)
			throw "No matching canvas found";
		// add code to check element type
		objCanvas.attr("tabindex","1");

		this.dragging = false;
		this.resizing = false;
		this.selectedShape = null;
		this.shouldDrawCanvas = true;
		this.canvas=objCanvas[0];
		this.canvas.width=opts.width || 500;
		this.canvas.height=opts.height || 400;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.context = this.canvas.getContext('2d');
		this.ghostCanvas = $('<canvas>')[0];
		this.ghostCanvas.height=this.height;
		this.ghostCanvas.width=this.width;
		this.ghostContext=this.ghostCanvas.getContext('2d');
		ghostContext=this.ghostContext;
		this.selectedOffsetX = 0;
		this.selectedOffsetY = 0;
		this.expectResize = -1;
		this.currentShapeType = 0;
		
		objCanvas.on('selectstart', function() {return false});
		
		if(document.defaultView && document.defaultView.getComputedStyle) {
			stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10)     || 0;
    	stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10)      || 0;
  	  styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10) || 0;
	    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10)  || 0;
		}
		
		setInterval($.proxy(this.drawCanvas,this),interval);
		
		keyCanvas.prototype.setShapeType = function(shapeType) {
			this.currentShapeType = shapeType;
		};
		
		keyCanvas.prototype.getMouse = function(e) {
      var offsetX = 0, 
					offsetY = 0,
					element=this.canvas;
			
      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      offsetX += stylePaddingLeft;
      offsetY += stylePaddingTop;

      offsetX += styleBorderLeft;
      offsetY += styleBorderTop;

      mx = e.pageX - offsetX;
      my = e.pageY - offsetY
			
			return {
				x: mx,
				y: my
			};
		};
		
		objCanvas.on('keydown',$.proxy(function(e){
			if(e.keyCode === 46) {
				if(this.selectedShape!==null) {
					var index = shapes.indexOf(this.selectedShape);
					if(index>-1) {
						shapes.splice(index,1);
					}
				}
			}
			this.invalidate();
		},this));
		
		objCanvas.on('mousedown', $.proxy(function (e) {
			var mouse = this.getMouse(e);
			
			if(this.expectResize!==-1) {
				this.resizing = true;
				return;
			}
			
			this.clear(this.ghostContext);
			for(var i=0;i<shapes.length;i++) {
				var shape = shapes[i];
				shape.draw(this.ghostContext,'#000000');
				
				var imageData = this.ghostContext.getImageData(mouse.x,mouse.y,1,1);
				var index = (mouse.x+mouse.y * imageData.width) * 4;
				
				if(imageData.data[3] > 0) {
					this.selectedShape = shape;
					selectedShape=this.selectedShape;
					this.selectedOffsetX = mouse.x - this.selectedShape.left;
					this.selectedOffsetY = mouse.y - this.selectedShape.top;
					this.selectedShape.left = mouse.x - this.selectedOffsetX;
					this.selectedShape.top = mouse.y - this.selectedOffsetY;
					this.dragging = true;
					
					this.invalidate();
					this.clear(this.ghostContext);
					return;
				}
			}
			
			this.selectedShape = null;
			selectedShape = null;
			this.clear(this.ghostContext);
			this.invalidate();
		},this));
		
		objCanvas.on('mouseup',$.proxy(function(e) {
			this.dragging = false;
			this.resizing = false;
			this.expectResize = -1;
		},this));
		
		objCanvas.on('dblclick',$.proxy(function(e) {
			var mouse = this.getMouse(e);			
			var width = 30;
			var height = 30;
			this.addShape(mouse.x - (width/2),mouse.y-(height/2),width,height); 
		},this));
		
		objCanvas.on('mousemove',$.proxy(function(e) {
			var mouse = this.getMouse(e);
			if(this.dragging) {
				this.selectedShape.left = mouse.x - this.selectedOffsetX;
				this.selectedShape.top = mouse.y - this.selectedOffsetY;
				this.invalidate();
			}
			else if(this.resizing) {
				var oldLeft,oldTop;
				oldLeft = this.selectedShape.left;
				oldTop = this.selectedShape.top;
				
				switch(this.expectResize) {
					case 0:
					this.selectedShape.left = mouse.x;
					this.selectedShape.top = mouse.y;
					this.selectedShape.width += oldLeft - mouse.x;
					this.selectedShape.height += oldTop - mouse.y;
					break;
				case 1:
					this.selectedShape.top = mouse.y;
					this.selectedShape.height += oldTop - mouse.y;
					break;
				case 2:
					this.selectedShape.top = mouse.y;
					this.selectedShape.width = mouse.x - oldLeft;
					this.selectedShape.height += oldTop - mouse.y;
					break;
				case 3:
					this.selectedShape.left = mouse.x;
					this.selectedShape.width += oldLeft - mouse.x;
					break;
				case 4:
					this.selectedShape.width = mouse.x - oldLeft;
					break;
				case 5:
					this.selectedShape.left = mouse.x;
					this.selectedShape.width += oldLeft - mouse.x;
					this.selectedShape.height = mouse.y - oldTop;
					break;
				case 6:
					this.selectedShape.height = mouse.y - oldTop;
					break;
				case 7:
					this.selectedShape.width = mouse.x - oldLeft;
					this.selectedShape.height = mouse.y - oldTop;
					break;
				}
				
				this.invalidate();
			}
			
			if(this.selectedShape !== null && !this.resizing) {
				for (var i = 0; i < 8; i++) {      
      		var cur = selectionHandles[i];
      
					if (mouse.x >= cur.x && mouse.x <= cur.x + handleBoxSize &&
          		mouse.y >= cur.y && mouse.y <= cur.y + handleBoxSize) {
        
						this.expectResize = i;
        		this.invalidate();
        
						switch (i) {
							case 0:
								this.canvas.style.cursor='nw-resize';
								break;
							case 1:
								this.canvas.style.cursor='n-resize';
								break;
							case 2:
								this.canvas.style.cursor='ne-resize';
								break;
							case 3:
								this.canvas.style.cursor='w-resize';
								break;
							case 4:
								this.canvas.style.cursor='e-resize';
								break;
							case 5:
								this.canvas.style.cursor='sw-resize';
								break;
							case 6:
								this.canvas.style.cursor='s-resize';
								break;
							case 7:
								this.canvas.style.cursor='se-resize';
								break;
						}
						return;
					}
    		}
				
				this.resizing = false;
				this.expectResize = -1;
				this.canvas.style.cursor='auto';
			}
		},this));
		
		for(var i=0;i<8;i++) {
			selectionHandles.push(new Shape());	
		}
	}
		
	keyCanvas.prototype.addShape = function(left,top,width,height,fillColor) {
		var shape = new Shape(left,top,width,height,fillColor,this.currentShapeType);
		shapes.push(shape);
		this.invalidate();
	};
		
	keyCanvas.prototype.drawCanvas = function() {
		if(this.shouldDrawCanvas === true) {
			this.clear(this.context);
			
			$.each(shapes,$.proxy(function(index,shape) {
				shape.draw(this.context);
			},this));
			
			this.shouldDrawCanvas = false;
		}
	};
	
	keyCanvas.prototype.invalidate = function() {
		this.shouldDrawCanvas = true;
	};
	
	keyCanvas.prototype.clear = function(ctx) {
		ctx.clearRect(0,0,this.width,this.height);
	};
	
	return keyCanvas;
}(jQuery));