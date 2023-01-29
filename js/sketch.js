const m = 1;
const g = 9.82;
const k = 2;
const d = 1;

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
    this.points = [new Point(50,0), new Point(0,50), new Point(70,50)];
    this.springs = [new Spring(), new Spring(), new Spring()];
    
    //Connect springs
    this.addSpring(0,0,1);
    this.addSpring(1,1,2);
    this.addSpring(2,2,0);
  }
  
  addSpring(pi, i, j){
    this.springs[pi].i = i;
    this.springs[pi].j = j;
    this.springs[pi].l =
    sqrt(
    pow((this.points[i].x - this.points[j].x),2) + pow((this.points[i].y -this.points[j].y),2)
    );
  }
  
  accumForces(){
    /* gravity */
    for(let i=0 ; i < this.points.length; ++i)
    {
      this.points[i].fx = 0;
      this.points[i].fy = m * g;
    }
    
    /* loop over all springs */
    for(let i=0 ; i < this.springs.length; ++i)
    {
      // get positions of spring start & end points
      let x1 = this.points[this.springs[i].i].x;
      let y1 = this.points[this.springs[i].i].y;
      let x2 = this.points[this.springs[i].j].x;
      let y2 = this.points[this.springs[i].j].y;
      
      // calculate norm sqr(distance)
      let r12d = sqrt (
      (x1 - x2)*(x1 - x2) +
      (y1 - y2)*(y1 - y2) 
      );
      
      if(r12d !== 0) // start = end?
      {
        // get velocities of start & end points
        let vx12 = this.points[this.springs[i].i].vx - this.points[this.springs[i].j].vx;
        let vy12 = this.points[this.springs[i].i].vy - this.points[this.springs[i].j].vy;
        
        // calculate force value
        let f = (r12d - this.springs[i].l) * k +
        (vx12 * (x1 - x2) +
        vy12 * (y1 - y2)) * d / r12d;
        
        // force vector
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
      this.springs[i].nx = (y1 - y2) / r12d;
      this.springs[i].ny = -(x1 - x2) / r12d;

    }
  }
  
  euler(){
    let i;
    let dry;
    let ts = 0.1;
    
    for(i=0 ; i < this.points.length; ++i)
    {
      /* x */
      this.points[i].vx = this.points[i].vx + (this.points[i].fx / m)*ts;
      this.points[i].x = this.points[i].x + this.points[i].vx * ts;
      
      /* y */
      //m försvinner från mg när man delar med m
      this.points[i].vy = this.points[i].vy + this.points[i].fy * ts; 
      dry = this.points[i].vy * ts;

      /* Boundaries Y */
      if(this.points[i].y + dry > height)
      {
        dry = height - this.points[i].y;
        this.points[i].vy = -0.9*this.points[i].vy;
      }

      this.points[i].y += dry;

    }
  }
}

let body;

function setup() {
  createCanvas(400, 400);
  
  //Create object: connect nodes with springs
  body = new SBody();
  console.log(body);
  
  
  //Initialize
}

function Euler(func,tStep){
  
}

function draw() {
  background(220);
  
  //Euler integrate for each frame
  body.accumForces();
  body.euler();
  
  console.log(body);
  
  //Display
  triangle(body.points[0].x,
          body.points[0].y,
          body.points[1].x,
          body.points[1].y,
          body.points[2].x,
          body.points[2].y);
  
}