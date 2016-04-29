$.fn.keyCanvas = function(opts) {
  var width, 
      height;

  // set defaults
  width = opts.width || 400;
  height = opts.height || 300;

  this.width(width);
  this.height(height);
};
