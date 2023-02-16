const m = 2;
const g = 9.82;
const k = 100;
const d = 2;

class Point{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.fx = 0;
    this.fy = 0;
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

  show(nodes, springs,s){
    if(springs){
      for(let pi in this.springs){
        let i = this.springs[pi].i;
        let j = this.springs[pi].j;
        strokeWeight(1);
        stroke('black')
        line(this.points[i].x,this.points[i].y,this.points[j].x,this.points[j].y);
      }
    }
    
    if(nodes){
      for(let i in this.points){
      strokeWeight(s);
      stroke('blue')
      point(this.points[i].x,this.points[i].y);
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
  }
  
  accumForces(){
    /* gravity + mouse */
    
    for(let i=0 ; i < this.points.length; ++i)
    {
      if(mouseIsPressed){
        this.points[i].fx = (50/(abs(-this.points[i].x+mouseX)))*(-this.points[i].x+mouseX);
        this.points[i].fy = m * g + (50/(abs(-this.points[i].y+mouseY)))*(-this.points[i].y+mouseY);
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
    let dry, drx; //used to check collision with ground and self
    let ts = step;
    
    for(i=0 ; i < this.points.length; ++i)
    {
      /* x */
      this.points[i].vx = this.points[i].vx + (this.points[i].fx / m)*ts;
      this.points[i].x += this.points[i].vx * ts;
      
      /* y */
      //m försvinner från mg när man delar med m
      this.points[i].vy = this.points[i].vy + this.points[i].fy * ts; 
      dry = this.points[i].vy * ts;
      /*
      //Check if self colliding
      if(sqrt(drx*drx + dry*dry) < r)
      {
        //Calculate new position to move to, should be r distance from
        dry = height - this.points[i].y;
        this.points[i].vy = -1.5*this.points[i].vy;
      }

      /*
      //self COLLISION test (not working):
      let r = 5;
      // check if the current node is colliding with any other node
      for(let i = 0; i < this.points.length; i++){

        //Get all the indecies for the other nodes that are connected
        for(let j = 0; j < this.springs.length; i++)

        //Check if too close to other nodes

        //Calculate new pos to push node to, should be r distance away from other node

        //USe push vector to flip velocity


        for (let j = 0; j < this.points.length; j++) {
          if (i === j) continue;

          let xDiff = this.points[j].x - this.points[i].x;
          let yDiff = this.points[j].y - this.points[i].y;
          let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

          // collision detected
          if (distance <= 2 * r) {
            let collisionAngle = Math.atan2(yDiff, xDiff);
            let normalX = Math.cos(collisionAngle);
            let normalY = Math.sin(collisionAngle);

            // collision response
            let relativeVelocity = this.points[j].vx - this.points[i].vx;
            let impulse = 2 * relativeVelocity / (2 * r);

            this.points[j].x -= normalX * impulse;
            this.points[j].y -= normalY * impulse;
            this.points[i].x += normalX * impulse;
            this.points[i].y += normalY * impulse;
          }
        }
      }
      */

      // Boundaries Y, check if dry is outside
      if(this.points[i].y + dry > height)
      {
        dry = height - this.points[i].y;
        this.points[i].vy = -1.5*this.points[i].vy;
      }

      this.points[i].y += dry;

    }

/*     this.points[0].x = mouseX;
    this.points[0].y = mouseY; */
  }
}

let body;

function setup() {
  createCanvas(windowWidth, windowHeight-50);
  
  //Create object: connect nodes with springs
  body = new SBody();

  //Create shape
  topLeft = createVector(100, 150);
  body.createBox(topLeft, 30, 10);
  console.log(body);
}

function draw() {
  background(220);

  //Calculate all forces
  body.accumForces();

  //Så jävla trash, instabil af
  body.euler(0.05);
  
  //Argument: nodes? springs? storlek på nodes.
  body.show(1, 1, 30);
  
}