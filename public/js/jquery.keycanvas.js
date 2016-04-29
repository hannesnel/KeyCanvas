$.fn.keyCanvas = function (opts) {
	var canvas,
	context,
	shouldRedraw,
	shapes,
	dragging,
	selection,
	dragOffsetX,
	dragOffsetY,
	width,
	height,
	state,
	html,
	selectedColor,
	selectedWidth,
	interval,
  stylePaddingLeft, 
  stylePaddingTop, 
  styleBorderLeft, 
  styleBorderTop,
  html,
  htmlTop,
  htmlLeft;

	function Shape(x, y, w, h, fill) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 10;
		this.h = h || 10;
		this.fill = fill || '#aaaaaa';
	}

	Shape.prototype.draw = function (ctx) {
		ctx.fillStyle = this.fill;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	};

	Shape.prototype.contains = function (mx, my) {
		return (this.x <= mx) && (this.x + this.w >= mx) &&
		(this.y <= my) && (this.y + this.h >= my);
	};

	// set defaults
	width = opts.width || 400;
	height = opts.height || 300;

	this.width(width);
	this.height(height);

	canvas = this[0];
	context = canvas.getContext('2d');

  if (document.defaultView && document.defaultView.getComputedStyle) {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  
  html = document.body.parentNode;
  htmlTop = html.offsetTop;
  htmlLeft = html.offsetLeft;
  
	shouldRedraw = true;
	shapes = [];
	dragging = false;
	selection = null;
	dragOffsetX = 0;
	dragOffsetY = 0;

	function getMouse(e) {
		var element = canvas,
		offsetX = 0,
		offsetY = 0,
		mx,
		my;

		if (element.offsetParent !== undefined) {
			do {
				offsetX += element.offsetLeft;
				offsetY += element.offsetTop;
			} while ((element = element.offsetParent));
		}
    
    offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
    offsetY += stylePaddingTop + styleBorderTop + htmlTop;
    
		mx = e.pageX - offsetX;
		my = e.pageY - offsetY;
		return {
			x : mx,
			y : my
		};
	}

	$(canvas).on('selectstart', function (e) {
		e.preventDefault();
		return false;
	}, false);

	$(canvas).on('mousedown', function (e) {
		var mouse,
		mx,
		my,
		l,
		i;

		mouse = getMouse(e);
		mx = mouse.x;
		my = mouse.y;

		l = shapes.length;
		for (i = l - 1; i >= 0; i--) {
			if (shapes[i].contains(mx, my)) {
				var cSelection = shapes[i];

				dragOffsetX = mx - cSelection.x;
				dragOffsetY = my - cSelection.y;
				dragging = true;
				selection = cSelection;
				shouldRedraw = true;
				return;
			}
		}

		if (selection) {
			selection = null;
			shouldRedraw = false;
		}
	});

	$(canvas).on('mousemove', function (e) {
		if (dragging) {
			var mouse;
			mouse = getMouse(e);

			selection.x = mouse.x - dragOffsetX;
			selection.y = mouse.y - dragOffsetY;
			shouldRedraw = true;
		}
	});

	$(canvas).on('mouseup', function (e) {
		dragging = false;
	});

	$(canvas).on('dblclick', function (e) {
		var mouse;
		mouse = getMouse(e);
		addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,1)'));
	});

	function addShape(shape) {
		shapes.push(shape);
		shouldRedraw = true;
	}

	function clear() {
		context.clearRect(0, 0, width, height);
	}

	function draw() {
		if (shouldRedraw) {
			var l,
			i;
			l = shapes.length;
			clear();
			for (i = 0; i < l; i++) {
				var shape = shapes[i];
				if (shape.x > width || shape.y > height || shape.x + shape.w < 0 || shape.y + shape.h < 0)
					continue;
				shape.draw(context);
			}

			if (selection != null) {
				context.strokeStyle = selectedColor;
				context.lineWidth = selectedWidth;
				context.strokeRect(selection.x, selection.y, selection.w, selection.h);
			}

			shouldRedraw = false;
		}
	}

	setInterval(draw, interval);
};
