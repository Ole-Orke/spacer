//Boolean determining whether placing desks or choosing them
let admin = false;

//Scale in pixels/metre in image (floorplan)
let scale = 200;

let desks = standardLayout;
let deskId = 0;
let deskRadius = 40;
let deskRadiusSquared = deskRadius * deskRadius;

let maxDistance = scale;
let maxDistanceSquared = maxDistance * maxDistance;
let canvas;

let img;
function preload() {
  img = loadImage('floorplan.jpeg');
}

function setup() {
  canvas = createCanvas(img.width-200, img.height-100);
  canvas.parent("canvasContainer");
}

function draw() {
  clear();
  background(0);

  image(img, -200, -100);

  //Draw desks
  drawDesks();

  //Draw cursor
  drawCursor();
}

function mousePressed() {
  let x = mouseX;
  let y = mouseY;
  //If admin add desk
  if (admin) {
    createDesk(x, y);
  } else {
    chooseDesk(x, y);
  }
  //else choose desk
  return;
}

function controlButtonPressed() {
  if (admin) {
    admin = false;
    document.getElementById("currentControl").innerHTML = "Choosing desks";
  } else {
    admin = true;
    document.getElementById("currentControl").innerHTML = "Placing desks";
  }
}

function clearButtonPressed() {
  desks = [];
}

function chooseDesk(x, y) {
  desks.forEach(function (desk) {
    let distanceSquared = squareDiff(desk.x, desk.y, x, y);
    if (distanceSquared <= deskRadiusSquared) {
      desk.occupied = !desk.occupied;
      if (!desk.occupied) {
        desk.safe = true;
      }
    }
  });

  //Update desks
  updateDesks();
}

function createDesk(x, y) {
  if (x > 0 && y > 0) {
    //Check if desk is in space
    let exists = false;
    let deleteDesk = {};
    desks.forEach(function (desk) {
      let distanceSquared = squareDiff(desk.x, desk.y, x, y);
      if (distanceSquared <= deskRadiusSquared) {
        //Desk already exists in the space
        exists = true;
        deleteDesk = desk;
      }
    });
    if (!exists) {
      desks.push({
        x: x,
        y: y,
        deskId: deskId,
        safe: true,
        occupied: false,
        hover: false
      });
      deskId++;
    }
    else {
      desks = desks.filter(function(desk){
        return desk.deskId !== deleteDesk.deskId;
      });
    }
  }
}

function checkDistance() {
  desks.forEach(function (primaryDesk) {
    let found = false;
    desks.forEach(function (secondaryDesk) {
      //If not the same desk and primary desk is safe
      //Also only need to check if both are occupied
      if (
        (primaryDesk.deskId !== secondaryDesk.deskId) &&
        primaryDesk.occupied &&
        secondaryDesk.occupied
      ) {
        //Check distance between them
        let distanceSquared = squareDiff(
          primaryDesk.x,
          primaryDesk.y,
          secondaryDesk.x,
          secondaryDesk.y
        );
        if (distanceSquared < maxDistanceSquared) {
          //Safe is set to false because distance too short
          primaryDesk.safe = false;
          found =  true;
        }
      }
    });
    if (!found) {
      primaryDesk.safe = true;
    }
  });
}

function updateDesks() {
  checkDistance();
  desks.forEach(function(desk) {
    if (!desk.occupied) {
      desk.safe = true;
    }
  });
}

function drawDesks() {
  desks.forEach(function (desk) {
    if (!desk.safe) {
      noStroke();
      fill(200, 100, 100);
      ellipse(desk.x, desk.y, deskRadius, deskRadius);
      noFill();
      stroke(200, 100, 100);
      ellipse(desk.x, desk.y, maxDistance, maxDistance);
    } else {
      if (desk.hover) {
        fill('rgba(230, 230, 100, 0.7)');
        noStroke();
        ellipse(desk.x, desk.y, deskRadius, deskRadius);
      }
      else {
        if (desk.occupied) {
          fill('rgba(70, 70, 230, 0.7)');
          noStroke();
          ellipse(desk.x, desk.y, deskRadius, deskRadius);
          noFill();
          stroke('rgba(70, 70, 230, 0.7)');
          ellipse(desk.x, desk.y, maxDistance, maxDistance);
        } else {
          fill('rgba(124, 255, 124, 0.7)');
          noStroke();
          ellipse(desk.x, desk.y, deskRadius, deskRadius);
        }
      }
    }
  });
}

function drawCursor() {
  //Constrain mouse coordinates
  if (mouseX > 0 && mouseY > 0) {
    desks.forEach(function (desk) {
      let distanceSquared = squareDiff(desk.x, desk.y, mouseX, mouseY);
      if (distanceSquared <= deskRadiusSquared) {
        desk.hover = true;
      }
      else {
        desk.hover = false;
      }
    });
    //Yellow cursor if admin
    if (admin) {
      //noCursor();
      noStroke();
      fill(230, 230, 100);
      ellipse(mouseX, mouseY, deskRadius, deskRadius);
    } else {
      noFill();
      stroke(230, 230, 100);
      ellipse(mouseX, mouseY, maxDistance, maxDistance);
    }
  }
}

//Square of the difference between two vectors
function squareDiff(x1, y1, x2, y2) {
  let diffx = (x1 - x2) * (x1 - x2);
  let diffy = (y1 - y2) * (y1 - y2);
  return diffx + diffy;
}

function updateScale() {
  let value = document.getElementById("scaleField").value;
  if ((value > 0) && (value < 1000)) {
    scale = value;
    maxDistance = scale;
    maxDistanceSquared = maxDistance * maxDistance;
    console.log("New scale: ", scale);
  }
}
