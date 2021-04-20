var dog, sadDog, happyDog, database;
var foodS, foodStock;
var addFood, feedTheDog;
var foodObj;
var feedTime;

// Create feed and lastFed variables here
var feed, lastFed;

function preload() {
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("HappyDog.png");
}

function setup() {
  createCanvas(1000,400);
  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  // Create "Feed the Dog" button here
  feedTheDog = createButton("Feed the Dog");
  feedTheDog.position(700, 95);
  feedTheDog.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  // Write code to read the lastFed time value from the database
  lastFed = database.ref('FeedTime');
  lastFed.on("value", readTime);
 
  // Write code to display text "Last Feed" time here
  fill("white");
  if (feedTime >= 12)  {
    // Show time in PM format when lastFed is greater than 12
    text("Last Feed: " + feedTime%12 + " PM", 350, 30);
  } else if (feedTime == 0) {
    text("Last Feed: 12 AM", 350, 30);
  } else {
    // Show time in AM format when lastFed is less than 12
    text("Last Feed: " + feedTime + " AM", 350, 30);
  }
 
  drawSprites();
}

// Function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function readTime(data) {
  feedTime = data.val();
}

function feedDog() {
  dog.addImage(happyDog);

  // Write code here to update food stock and last fed time
  feed = foodObj.getFoodStock();
  if (feed <= 0) {
    foodObj.updateFoodStock(feed * 0);
  } else {
    foodObj.updateFoodStock(feed - 1);
  }
  database.ref('/').update({
    Food: feed,
    FeedTime: hour()
  })
}

// Function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  });
}
