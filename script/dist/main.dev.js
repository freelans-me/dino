"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var cloudsElement = document.querySelector(".clouds");
var roadElement = document.querySelector(".road");
var scoreElement = document.querySelector(".score-value");

function getRandomNumber(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

var world = {
  gameOver: false,
  updateMs: 40,
  score: 0,
  objects: {
    clouds: [],
    roadLines: [],
    foods: [],
    dino: {
      isJumping: false,
      jumpTicks: 0,
      location: {
        y: -40
      },
      element: document.querySelector(".dino")
    }
  }
};

function init() {
  var currentCloud = 1;
  var maxClouds = 4;

  for (var i = 0; i < 20; i += 1) {
    var cloudImage = document.createElement("img");
    cloudImage.src = "cloud-".concat(currentCloud, ".png");
    cloudImage.classList.add("cloud");
    var cloud = {
      element: cloudImage,
      velocity: getRandomNumber(1, 3),
      scale: getRandomNumber(0.7, 1.4),
      location: {
        x: getRandomNumber(-20, 100),
        y: getRandomNumber(-20, 60)
      }
    };
    console.log(cloudImage);
    cloudImage.style.transform = "scale(".concat(cloud.scale, ")");
    world.objects.clouds.push(cloud);
    cloudImage.style.opacity = cloud.location.y + '%';
    cloudImage.style.top = cloud.location.y + '%';
    cloudImage.style.left = cloud.location.x + '%';
    cloudsElement.append(cloudImage);
    currentCloud += 1;

    if (currentCloud > maxClouds) {
      currentCloud = 1;
    }
  }

  for (var _i = 0; _i < 4; _i += 1) {
    var roadLineElement = document.createElement("div");
    roadLineElement.classList.add("road-line");
    var roadLine = {
      element: roadLineElement,
      velocity: 1.5,
      location: {
        y: 40,
        x: _i * 20 + 20 * _i
      }
    };
    world.objects.roadLines.push(roadLine);
    roadLine.element.style.top = roadLine.location.y + "%";
    roadLine.element.style.left = roadLine.location.x + "%";
    roadElement.append(roadLineElement);
  }

  for (var _i2 = 0; _i2 < 5; _i2++) {
    var foodImage = document.createElement("img");
    foodImage.classList.add("food");
    foodImage.src = Math.random() > 0.5 ? "waffle.png" : "cheesecake.png";
    foodImage.style.position = "absolute";
    var food = {
      element: foodImage,
      velocity: 1.5,
      location: {
        y: 5,
        x: 100 + _i2 * 100 + getRandomNumber(0, 50)
      }
    };
    food.element.style.top = food.location.y + "%";
    food.element.style.left = food.location.x + "%";
    roadElement.append(foodImage);
    world.objects.foods.push(food);
  }

  draw();
}

function draw() {
  world.objects.clouds.forEach(function (cloud) {
    cloud.element.style.opacity = cloud.location.y + "%";
    cloud.element.style.left = cloud.location.x + "%";
    cloud.element.style.transform = "scale(".concat(cloud.scale, ")");
  });
  world.objects.roadLines.forEach(function (roadLine) {
    roadLine.element.style.left = roadLine.location.x + "%";
  });
  world.objects.foods.forEach(function (food) {
    food.element.style.left = food.location.x + "%";
  });

  if (world.objects.dino.isJumping && !world.objects.dino.element.src.endsWith("./dino/jump.gif")) {
    world.objects.dino.src = "dino/jump.gif";
  } else if (!world.objects.dino.isJumping && !world.objects.dino.element.src.endsWith("./dino/walk.gif")) {
    world.objects.dino.src = "dino/walk.gif";
  }

  world.objects.dino.element.style.top = world.objects.dino.location.y + "%";

  if (!world.gameOver) {
    setTimeout(update, world.updateMs);
  } else {
    world.objects.dino.element.src = "./dino/die.gif";
    setTimeout(function () {
      return location.reload();
    }, 2000);
  }

  scoreElement.textContent = world.score;
}

function update() {
  var dinoRect = world.objects.dino.element.getBoundingClientRect();
  var cloudsRect = cloudsElement.getBoundingClientRect();
  var roadRect = roadElement.getBoundingClientRect();
  world.objects.clouds.forEach(function (cloud) {
    var cloudRect = cloud.element.getBoundingClientRect();

    if (cloudRect.left + cloudRect.width - 20 <= cloudsRect) {
      cloud.location.x = getRandomNumber(100, 120);
      cloud.location.y = getRandomNumber(-20, 60);
      cloud.scale = getRandomNumber(0.7, 1.4);
    } else {
      cloud.location.x -= cloud.velocity;
    }
  });
  world.objects.roadLines.forEach(function (roadLine) {
    var roadLineRect = roadLine.element.getBoundingClientRect();

    if (roadLineRect.left + roadLineRect.width - 10 <= roadRect.left) {
      roadLine.location.x = 100;
    } else {
      roadLine.location.x -= roadLine.velocity;
    }
  });
  world.objects.foods.forEach(function (food, i) {
    var foodRect = food.element.getBoundingClientRect();

    if (foodRect.left <= dinoRect.right - 80 && dinoRect.bottom - 80 > foodRect.top && foodRect.left >= dinoRect.left + 20) {
      world.gameOver = true;
    }

    if (foodRect.left + foodRect.width <= roadRect.left) {
      var farthestFoodX = Math.max.apply(Math, _toConsumableArray(world.objects.foods.map(function (food) {
        return food.location.x;
      })));
      food.location.x = farthestFoodX + 100 + getRandomNumber(0, 50);
      world.score += 1;
    } else {
      food.location.x -= food.velocity;
    }
  });

  if (world.objects.dino.isJumping) {
    if (world.objects.dino.jumpTicks <= 12) {
      world.objects.dino.location.y -= 9;
    } else if (world.objects.dino.jumpTicks >= 16) {
      world.objects.dino.location.y += 9;
    }

    world.objects.dino.jumpTicks += 1;

    if (world.objects.dino.jumpTicks === 28) {
      world.objects.dino.isJumping = false;
      world.objects.dino.location.y = -40;
      world.objects.dino.jumpTicks = 0;
      world.updateMs *= 0.95;
    }
  }

  draw();
}

init();
document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowUp") {
    world.objects.dino.isJumping = true;
  }
});
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    world.objects.dino.isJumping = true;
  }
});
document.addEventListener("click", function (event) {
  world.objects.dino.isJumping = true;
});