const m = 5;
const g = 9.82;
const k = 200;
const d = 2;
const r = 40; //radius for self collision

// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(1);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

class Point{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.fx = 0;
    this.fy = 0;
    this.connectedPoints = [];
  }
}


class Spring{
  constructor(){
    this.i = 0;
    this.j = 0;
    this.l = 0;
    //this.nx = nx;
    //this.ny = ny;
  }
}

class SBody{
  constructor(){
    this.points = []; //[new Point(50,0), new Point(0,50), new Point(70,50)];
    this.springs = [];//[new Spring(), new Spring(), new Spring()];
    //Connect springs
    //this.addSpring(0,0,1);
    //this.addSpring(1,1,2);
    //this.addSpring(2,2,0);
  }
  
  createBox(topLeft,density,n){
    //For n points there exists 4(n^2-n) springs (BUG, NOT WORKING CORRECTLY)
    let springAmount = 4*(pow(n,2)-n);

    //Generate points
    for(let i=0; i<n; i++){
      this.points.push(new Point(topLeft.x, topLeft.y+i*density));

      for(let j=1; j<n; j++){
        this.points.push(new Point(topLeft.x + j*density, topLeft.y+i*density));
      }
    }

    //Fill spring array with springs
    for(let i = 0; i < springAmount; i++){
      this.springs.push(new Spring());
    }

    //Generate Spring connections
    let springCount = 0;
    for(let i=0; i < this.points.length-1;i++){
        //console.log(this.springs)
        //if in the bottom
        // *---
        if(i > this.points.length-n-1){
          this.addSpring(springCount++, i, i+1)
          continue;
        }

        //If we are at the left side connect like this:
        //*---
        //| \
        if(i%n==0){
          this.addSpring(springCount++, i, i+n)
          this.addSpring(springCount++, i, i+n+1)
          this.addSpring(springCount++, i, i+1)
          continue;
        }

        //If we are at the right side:
        // ---*
        //  / |
        if((i-n+1)%n==0){
          this.addSpring(springCount++, i, i+n-1)
          this.addSpring(springCount++, i, i+n)
          continue;
        }

        //if in the middle
        //    *---
        //  / | \
        this.addSpring(springCount++, i, i+n-1)
        this.addSpring(springCount++, i, i+n)
        this.addSpring(springCount++, i, i+n+1)
        this.addSpring(springCount++, i, i+1)
        continue;
    }
    console.log(this.springs);
  }

  show(nodes, springs,arrow,collision,s){
    if(springs){
      for(let pi in this.springs){
        let i = this.springs[pi].i;
        let j = this.springs[pi].j;
        strokeWeight(10);
        let minColor = color(0, 255, 0);
        let maxColor = color(255, 0, 0);

        stroke(lerpColor(minColor, maxColor, 
          sqrt(abs(createVector(this.points[i].x-this.points[j].x, this.points[i].y-this.points[j].y).mag() - this.springs[pi].l)
        /this.springs[pi].l)))
        
        line(this.points[i].x,this.points[i].y,this.points[j].x,this.points[j].y);
      }
    }
    
    if(nodes){
      for(let i in this.points){
      strokeWeight(s);
      stroke('blue')
      point(this.points[i].x,this.points[i].y);
      

      if(collision){
        stroke('green')
        strokeWeight(1);
        noFill();
        circle(this.points[i].x, this.points[i].y, r);
      }
        
      
      if(arrow){
      drawArrow(createVector(this.points[i].x, this.points[i].y),
                createVector(this.points[i].vx, this.points[i].vy).normalize().mult(20), 'black');
      drawArrow(createVector(this.points[i].x, this.points[i].y),
                createVector(this.points[i].fx, this.points[i].fy).normalize().mult(30), 'red')
      }
    }
    }
  }

  //pi = spring index, i = start point index, j = end point index
  addSpring(pi, i, j){
    this.springs[pi].i = i;
    this.springs[pi].j = j;
    this.springs[pi].l =
    sqrt(
    pow((this.points[i].x - this.points[j].x),2) + pow((this.points[i].y -this.points[j].y),2)
    );

    //Add the other point to this point's "Connected points"
    this.points[j].connectedPoints.push(i);
    this.points[i].connectedPoints.push(j);
  }
  
  accumForces(){
    /* gravity + mouse */
    
    for(let i=0 ; i < this.points.length; ++i)
    {
      if(mouseIsPressed){
        this.points[i].fx = (50*m/(abs(-this.points[i].x+mouseX)))*(-this.points[i].x+mouseX);
        this.points[i].fy = m * g + (50*m/(abs(-this.points[i].y+mouseY)))*(-this.points[i].y+mouseY);
      }
      else{
        this.points[i].fx = 0;
        this.points[i].fy = m * g;
      }
    }
    
    /* loop over all springs */
    for(let i=0 ; i < this.springs.length; ++i)
    {
      // get positions of spring start & end points
      let x1 = this.points[this.springs[i].i].x;
      let y1 = this.points[this.springs[i].i].y;
      let x2 = this.points[this.springs[i].j].x;
      let y2 = this.points[this.springs[i].j].y;
      
      // calculate norm (distance)
      let r12d = sqrt (
      (x1 - x2)*(x1 - x2) +
      (y1 - y2)*(y1 - y2) 
      );
      
      if(r12d !== 0) // start = end?
      {
        // get velocities of start (& end points)
        let vx12 = this.points[this.springs[i].i].vx - this.points[this.springs[i].j].vx;
        let vy12 = this.points[this.springs[i].i].vy - this.points[this.springs[i].j].vy;
        
        // calculate force value 
        let f = (r12d - this.springs[i].l) * k +
        (vx12 * (x1 - x2) + vy12 * (y1 - y2)) * d / r12d; //Direct scalar product
        
        // force vector, calculate normalized vector that is parallell with the spring
        // and set magnitude to force value
        let Fx = ((x1 - x2) / r12d ) * f;
        let Fy = ((y1 - y2) / r12d ) * f;
        
        // accumulate force for starting point
        this.points[this.springs[i].i].fx -= Fx;
        this.points[this.springs[i].i].fy -= Fy;
        
        // accumulate force for end point
        this.points[this.springs[i].j].fx += Fx;
        this.points[this.springs[i].j].fy += Fy;
      }
      
      // Calculate normal vectors to springs
      //this.springs[i].nx = (y1 - y2) / r12d;
      //this.springs[i].ny = -(x1 - x2) / r12d;

    }
  }
  
  //this is where position and velocity is updated
  euler(step){
    let i;
    let deltaY, deltaX; // amount to move, used to check collision with ground and self
    let ts = step;
    
    for(i=0 ; i < this.points.length; ++i)
    {
      /* x */
      this.points[i].vx = this.points[i].vx + (this.points[i].fx / m)*ts;
      deltaX = this.points[i].vx * ts;
      
      /* y */
      //m försvinner från mg när man delar med m
      this.points[i].vy = this.points[i].vy + this.points[i].fy * ts; 
      deltaY = this.points[i].vy * ts;
      /*
      //Check if self colliding
      if(sqrt(drx*drx + dry*dry) < r)
      {
        //Calculate new position to move to, should be r distance from
        dry = height - this.points[i].y;
        this.points[i].vy = -1.5*this.points[i].vy;
      }
*/
      
      //self COLLISION test (not working):
      // check if the current node is colliding with any other node

      //Loop through all connected points?
      for(let j = 1; j < this.points.length; j++){
        if(i===j)
          continue;

        //let otherIndex = this.points[i].connectedPoints[j];
        let other = this.points[j];

        let distance = createVector(
          this.points[i].x + deltaX - other.x,
          this.points[i].y + deltaY - other.y);
        
        //console.log(distance.mag())
        //Check if too close to other nodes
        if(distance.mag() < r)
        {
          //console.log(true)
          //Calculate direction to move back to
          let pushingVector = createVector(
            (this.points[i].x + deltaX) - other.x,
            (this.points[i].y + deltaY) - other.y);
          
          //normalize pushvector and move r distance from other node.
          //movingVec points from other to new pos 
          let movingVec = pushingVector.normalize().mult(r);
          
          //line(other.x, other.y, other.x + movingVec.x, other.y + movingVec.y)
          //move
          deltaX = other.x + movingVec.x - this.points[i].x;
          deltaY = other.y + movingVec.y - this.points[i].y;

          //Use push vector to reflect velocity
          let velocity = createVector(this.points[i].vx, this.points[i].vy)
          this.points[i].vx = 0.5*velocity.reflect(pushingVector.normalize()).x;
          this.points[i].vy = 0.5*velocity.reflect(pushingVector.normalize()).y;

          break;
        }
      }
    
      
      // Boundaries Y, check if deltaY is outside
      if(this.points[i].y + deltaY > height)
      {
        deltaY = height - this.points[i].y;
        this.points[i].vy = -0.8*this.points[i].vy;
      }
      
      this.points[i].y += deltaY;
      this.points[i].x += deltaX;
    }

/*     this.points[0].x = mouseX;
    this.points[0].y = mouseY; */
  }
}

let body;

let nodesInput, springsInput, sizeInput, updateButton;


function setup() {
  createCanvas(windowWidth, windowHeight-50);

  //Create object: connect nodes with springs
  body = new SBody();


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

  // Create a div container for the size input field with a label
  let sizeContainer = createDiv();
  sizeContainer.position(10, 70);
  let sizeLabel = createElement('label', 'Node Size: ');
  sizeLabel.parent(sizeContainer);
  sizeInput = createInput(20, "numbers")
  sizeInput.parent(sizeContainer);

  //Create shape
  topLeft = createVector(100, 100);
  body.createBox(topLeft, 50, 5);
  console.log(body);
}

function draw() {
  background(220);

  //Calculate all forces
  body.accumForces();

  //Så jävla trash för ts>0.5, instabil af
  body.euler(0.041);
  
  //Argument: nodes, springs, arrows, collision, storlek på nodes.
  body.show(1, 0, 0, 1, 10);
  
}