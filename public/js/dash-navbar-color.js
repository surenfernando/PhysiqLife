var c = document.getElementById('canv-h');
var $ = c.getContext('2d');


var col = function(x, y, r, g, b) {
  $.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
  $.fillRect(x, y, 1,1);
}


var R = function(x, y, t) {
    var value = Math.floor(128 + 64 * Math.cos((x * x - y * y) / 300 + t));
    value = Math.max(0, value); // Ensure value is at least 0
    value = Math.min(200, value); // Ensure value is at most 255
    return value; // If value is too close to white, return 0 instead
  }
  
  var G = function(x, y, t) {
    var value = Math.floor(128 + 64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300));
    value = Math.max(0, value); // Ensure value is at least 0
    value = Math.min(200, value); // Ensure value is at most 255
    return value; // If value is too close to white, return 0 instead
  }
  
  var B = function(x, y, t) {
    var value = Math.floor(128 + 64 * Math.sin(5 * Math.sin(t / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100));
    value = Math.max(0, value); // Ensure value is at least 0
    value = Math.min(200, value); // Ensure value is at most 255
    return value; // If value is too close to white, return 0 instead
  }

var t = 0;

var run = function() {
  for(x=0;x<=35;x++) {
    for(y=0;y<=35;y++) {
      col(x, y, R(x,y,t), G(x,y,t), B(x,y,t));
    }
  }
  t = t + 0.007;
  window.requestAnimationFrame(run);
}

run();





