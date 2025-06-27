const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = 800, H = 500;
canvas.width = W; canvas.height = H;

let scoreP = 0, scoreAI = 0;
let ball, player, ai, powerups = [], particles = [];

const effects = {
  glow(x,y,color) {
    for(let i=0;i<5;i++){
      particles.push({x,y,dx:Math.random()*4-2,dy:Math.random()*4-2,r:Math.random()*2+1,color});
    }
  }
};

class Paddle {
  constructor(x){ this.x=x; this.y=H/2-50; this.w=10; this.h=100; this.speed=6; }
  draw(){ ctx.fillStyle='#0f0'; ctx.fillRect(this.x,this.y,this.w,this.h); }
  move(to){ this.y += to*this.speed; this.y = Math.max(0,Math.min(H-this.h,this.y)); }
}

class Ball {
  constructor(){ this.reset(); }
  reset(){
    this.x=W/2; this.y=H/2;
    const angle = (Math.random()*Math.PI/4)-Math.PI/8;
    const dir = Math.random()<0.5?-1:1;
    this.dx = 6 * dir * Math.cos(angle);
    this.dy = 6 * Math.sin(angle);
    this.r = 8;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.fillStyle='#0f0';
    ctx.shadowBlur=10; ctx.shadowColor='#0f0';
    ctx.fill();
    ctx.shadowBlur=0;
  }
  update(){
    this.x += this.dx; this.y += this.dy;
    if(this.y<0||this.y>H){ this.dy*=-1; effects.glow(this.x,this.y,'#0f0'); }
    if(this.collide(player)||this.collide(ai)){
      this.dx *= -1.1; this.dy *= 1.1;
      effects.glow(this.x,this.y,'#0f0');
    }
    powerups.forEach((p,i)=> {
      if(Math.hypot(this.x-p.x,this.y-p.y)<this.r+12){
        p.apply(); powerups.splice(i,1);
      }
    });
    if(this.x<0){ scoreAI++; this.reset(); }
    if(this.x>W){ scoreP++; this.reset(); }
  }
  collide(p){
    return this.x - this.r < p.x + p.w && this.x + this.r > p.x &&
           this.y > p.y && this.y < p.y + p.h;
  }
}

class AI extends Paddle {
  update(){
    const mid = this.y + this.h/2;
    if(ball.y < mid -20) this.move(-1);
    else if(ball.y>mid+20) this.move(1);
  }
}

class Powerup {
  constructor(){
    this.x = Math.random()*(W-200)+100;
    this.y = Math.random()*(H-60)+30;
    this.type = ['grow','shrink','slow'][Math.floor(Math.random()*3)];
    this.ttl = 10000; this.created = Date.now();
  }
  draw(){
    ctx.fillStyle = this.type==='grow'?'#ff0':this.type==='shrink'?'#f00':'#0ff';
    ctx.beginPath(); ctx.arc(this.x,this.y,12,0,2*Math.PI);
    ctx.fill();
  }
  apply(){
    if(this.type==='grow'){ player.h +=20; setTimeout(()=>player.h-=20,5000);}
    if(this.type==='shrink'){ ai.h -=20; setTimeout(()=>ai.h+=20,5000);}
    if(this.type==='slow'){ ball.dx*=0.7; ball.dy*=0.7; setTimeout(()=>{
        ball.dx*=1.43; ball.dy*=1.43; },5000);
    }
  }
}

function spawnPowerup(){
  if(powerups.length<2 && Math.random()<0.01) powerups.push(new Powerup());
}

// Particle system
function drawParticles(){
  particles = particles.filter(p=>p.r>0);
  particles.forEach(p=>{
    ctx.fillStyle=p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
    ctx.fill(); p.x+=p.dx; p.y+=p.dy; p.r*=0.96;
  });
}

// Game objects
player=new Paddle(30), ai=new AI(W-40), ball=new Ball();

function render(){
  ctx.clearRect(0,0,W,H);
  player.draw(); ai.draw(); ball.draw();
  powerups.forEach(p=>p.draw());
  drawParticles();
}

function loop(){
  spawnPowerup();
  player.move((keys['ArrowUp']?-1:keys['ArrowDown']?1:0));
  ai.update();
  ball.update();
  document.getElementById('scorePlayer').textContent=scoreP;
  document.getElementById('scoreAI').textContent=scoreAI;
  render();
  if(!isGameOver) requestAnimationFrame(loop);
}

function reset(){
  scoreP = scoreAI = 0;
  player.h=100; ai.h=100;
  ball.reset();
  powerups=[];
  isGameOver=false;
  loop();
}

document.getElementById('reset').onclick=reset;
const keys={};
window.onkeydown=e=>keys[e.key]=true;
window.onkeyup=e=>keys[e.key]=false;

// Start
let isGameOver=false;
loop();
