let body;

let nodesInput, springsInput, sizeInput, updateButton;

let isPicked = null;
function mouseReleased(){
  isPicked = null;
}

const m = 1;
const g = 100;
const k = 200; //300
const d = 5; //5
const dens = 150; 
const r = Math.floor(0.80*dens); //radius for self collision (80% of dens)

function setup() {
  createCanvas(windowWidth, windowHeight-50);

  //Create object: connect nodes with springs
  body = new SBody();

  //Create shape
  topLeft = createVector(windowWidth/3, 1);
  body.createBox(topLeft, dens, 4);
  console.log(body);
  gui();
}

function draw() {
  background(220);

  //Calculate all forces
  body.update();
  
  //Argument: nodes, springs, arrows, collision, storlek på nodes.
  body.show(parseInt(nodesInput.value()), parseInt(springsInput.value()), parseInt(arrowInput.value()), parseInt(colInput.value()), parseInt(sizeInput.value()));

}

function gui(){
  let nodesContainer = createDiv();
  nodesContainer.position(10, 10);
  let nodesLabel = createElement('label', 'Nodes: ');
  nodesLabel.parent(nodesContainer);
  nodesInput = createSlider(0,1,1);
  nodesInput.parent(nodesContainer);

  // Create a div container for the springs input field with a label
  let springsContainer = createDiv();
  springsContainer.position(10, 40);
  let springsLabel = createElement('label', 'Springs: ');
  springsLabel.parent(springsContainer);
  springsInput = createSlider(0,1,1)
  springsInput.parent(springsContainer);

  let arrowContanier = createDiv();
  arrowContanier.position(10, 70);
  let arrowLabel = createElement('label', 'Arrows: ');
  arrowLabel.parent(arrowContanier);
  arrowInput = createSlider(0,1,0)
  arrowInput.parent(arrowContanier);


  let colContanier = createDiv();
  colContanier.position(10, 100);
  let colLabel = createElement('label', 'Collision size: ');
  colLabel.parent(colContanier);
  colInput = createSlider(0,1,0)
  colInput.parent(colContanier);

  // Create a div container for the size input field with a label
  let sizeContainer = createDiv();
  sizeContainer.position(10, 130);
  let sizeLabel = createElement('label', 'Node Size: ');
  sizeLabel.parent(sizeContainer);
  sizeInput = createInput(20, "numbers")
  sizeInput.parent(sizeContainer);
}

