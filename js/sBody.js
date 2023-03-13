class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.fx = 0;
        this.fy = 0;
        this.connectedPoints = []; //Not needed?
    }
}
  
class Spring{
    constructor(){
        this.i = 0;
        this.j = 0;
        this.l = 0;
    }
}

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

class SBody{
    constructor(){
      this.points = [];
      this.springs = [];
    }
    
    //Create the node-spring structure of the body, here a filled square with X-connected springs.
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
    
    accumSpringForces(){
        /* loop over all springs */
        for(let i = 0; i < this.springs.length; ++i)
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
        }
    }

    accumOtherForces(){
      for(let i = 0; i < this.points.length; ++i)
      {
        /* gravity + mouse */
        if(mouseIsPressed){
          //this.points[i].fx = 0;//(50*m/(abs(-this.points[i].x+mouseX)))*(-this.points[i].x+mouseX);
          this.points[i].fy += m * g;//+ (50*m/(abs(-this.points[i].y+mouseY)))*(-this.points[i].y+mouseY);
        }
        else{
          //this.points[i].fx += 0;
          this.points[i].fy += m * g;
        }
      }
    }
    
    //old
    accumForces(){
      // gravity + mouse 
      
      for(let i=0 ; i < this.points.length; ++i)
      {
        if(mouseIsPressed){
          this.points[i].fx = 0;//(50*m/(abs(-this.points[i].x+mouseX)))*(-this.points[i].x+mouseX);
          this.points[i].fy = m * g;//+ (50*m/(abs(-this.points[i].y+mouseY)))*(-this.points[i].y+mouseY);
        }
        else{
          this.points[i].fx = 0;
          this.points[i].fy = m * g;
        }
      }
      
      // loop over all springs, spring force
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
      }
    }

    collision(i, deltaX, deltaY){
        //SELF COLLISION (kinda working, sticky):
        //Check if the current node is colliding with any other node
        //Loop through all other points
        for(let j = 1; j < this.points.length; j++)
        {
            if(i===j)
              continue;
      
            //let otherIndex = this.points[i].connectedPoints[j];
            let other = this.points[j];
            let distance = createVector(
              this.points[i].x + deltaX - other.x,
              this.points[i].y + deltaY - other.y);
            
            //Check if too close to other nodes
            if(distance.mag() < r && distance.mag()>0)
            {
              //console.log(true)
              //Calculate direction to move back to (same as "distance" var?)
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
              
              //drawArrow(createVector(other.x + movingVec.x, other.y + movingVec.y), velocity.reflect(pushingVector.normalize()).normalize().mult(20),'blue')
              this.points[i].vx = velocity.reflect(pushingVector.normalize()).x;
              this.points[i].vy = velocity.reflect(pushingVector.normalize()).y;

              //break;
            }
        }
        
        // Environment boundaries, check if deltaY is outside
        if(this.points[i].y + deltaY > height)
        {
          deltaY = height - this.points[i].y;
          this.points[i].vy = -this.points[i].vy;
        }

        if(this.points[i].y + deltaY < 0)
        {
          deltaY = -this.points[i].y;
          this.points[i].vy = -this.points[i].vy;
        }

        if(this.points[i].x + deltaX > windowWidth)
        {
          deltaX = windowWidth - this.points[i].x;
          this.points[i].vx = -this.points[i].vx;
        }

        if(this.points[i].x + deltaX < 0)
        {
          deltaX = -this.points[i].x;
          this.points[i].vx = -this.points[i].vx;
        }
        
        return createVector(deltaX, deltaY);
    }


    interaction(i, deltaX, deltaY){
        let x = this.points[i].x;
        let y = this.points[i].y;
        if(isPicked === null && mouseIsPressed && mouseX < x+r && mouseX>x-r&&mouseY < y+r && mouseY>y-r)
        {
          isPicked = i;
        }else if(isPicked === i && mouseIsPressed && mouseX < x+r && mouseX>x-r&&mouseY < y+r && mouseY>y-r){
          deltaX = mouseX - x;
          deltaY = mouseY - y;
          return createVector(deltaX, deltaY);
        }

        return createVector(deltaX, deltaY);
    }

    //this is where position and velocity is updated (shouldnt though, each num method should be in own method)
    euler(step){
        let deltaY, deltaX; // amount to move, used to check collision with ground and self
      
        for(let i = 0; i < this.points.length; ++i)
        {
          //Get amount to move X
          this.points[i].vx += (this.points[i].fx / m) * step;
          deltaX = this.points[i].vx * step;
          
          //Get amount to move Y
          //m försvinner från mg när man delar med m
          this.points[i].vy += (this.points[i].fy / m) * step; 
          deltaY = this.points[i].vy * step;

          //Modify delta if point is colliding or interacting
          let delta = this.interaction(i, deltaX, deltaY);
          delta = this.collision(i, delta.x, delta.y);
          

          //update position
          this.points[i].x += delta.x;
          this.points[i].y += delta.y;
        }
    }
  
    improvedEuler(i, step){
        
        

        return createVector(deltaX, deltaY);
    }
  
    RK4(i, step){
        //Accum Force
        this.accX = (this.points[i].fx / m);
        this.velX = this.points[i].vx;
        this.posX = this.points[i].x; 
        
        //Calculate velocity and position for each point
        this.k1velX = this.accelerationX * step;
        this.k1posX = this.posX + this.k1velX * step;

        //Use values to recalculate force 4 times, save each calculated force
        this.accumSpringForces()
        this.accumOtherForces()

        //Take average of the forces and use the avregae to calc next true velocity and position


        return createVector(deltaX, deltaY);
    }

    //Methods have their own loops through all points
    update(){
        this.reset();

        //Start with looping through springs
        this.accumSpringForces();

        //Accum forces like gravity and mouse: loop through points
        //this.accumOtherForces();

        //numerical method: loop through points
        this.euler(0.03);

        //Maybe collision before accumForces for no sticky effect??
        //collision: loop points twice, returns deltaXY
    }

    reset(){
      //Resets forces for new accumilation
      for(let i = 0; i < this.points.length; ++i){
        this.points[i].fx = 0;
        this.points[i].fy = 0;
      }
    }

    //draws the shape depending on parameters
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
}