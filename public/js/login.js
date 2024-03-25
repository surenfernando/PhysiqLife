const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

var ch = document.getElementById("canv-h");
var chContext = ch.getContext("2d");

var cf = document.getElementById("canv-f");
var cfContext = cf.getContext("2d");

function submitToRoute(route) {
    document.getElementById("loginForm").action = route;
    document.getElementById("loginForm").submit();
}

var colHeader = function (x, y, r, g, b) {
    //Header-Canvas
    chContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    chContext.fillRect(x, y, 1, 1);
};

var colFooter = function (x, y, r, g, b) {
    //Footer-Canvas
    cfContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    cfContext.fillRect(x, y, 1, 1);
};

var R = function (x, y, t) {
    var value = Math.floor(128 + 64 * Math.cos((x * x - y * y) / 300 + t));
    value = Math.max(0, value); // Ensure value is at least 0
    value = Math.min(200, value); // Ensure value is at most 255
    return value; // If value is too close to white, return 0 instead
};

var G = function (x, y, t) {
    var value = Math.floor(
        128 +
            64 *
                Math.sin(
                    (x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300,
                ),
    );
    value = Math.max(0, value); // Ensure value is at least 0
    value = Math.min(200, value); // Ensure value is at most 255
    return value; // If value is too close to white, return 0 instead
};

var B = function (x, y, t) {
    var value = Math.floor(
        128 +
            64 *
                Math.sin(
                    5 * Math.sin(t / 9) +
                        ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100,
                ),
    );
    value = Math.max(0, value); // Ensure value is at least 0
    value = Math.min(200, value); // Ensure value is at most 255
    return value; // If value is too close to white, return 0 instead
};

var t = 0;

var run = function () {
    for (x = 0; x <= 35; x++) {
        for (y = 0; y <= 35; y++) {
            var r = R(x, y, t);
            var g = G(x, y, t);
            var b = B(x, y, t);

            // Drawing the color
            colHeader(x, y, r, g, b);
            colFooter(x, y, b, r, g);
        }
    }

    t = t + 0.01;
    window.requestAnimationFrame(run);
};

run();
