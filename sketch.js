 var touchDown = false;
 var touchX =0;
 var touchY=0;
var touchIsDown=false;
var Im_touched=false;

var in1_button;
var in2_button;


var Y1light;


//inputs
var X1=false;
var X2=false;

//outputs
var Y1=false;




var canv_w = 1000;
var canv_h = 650;

var inputCode;//this is the string that we will execute as code
var savedInputCode;

var testShaft;

var dt;
var tnow;
var oldt;


var dam;

var recorder;
var valve_slider;
var VALVEPERCENT=50;;
var REC=false;
var VALVE=false;

function setup(){

  var canvas = createCanvas(canv_w,425);
  canvas.parent('sketch-holder');
  frameRate(60);
  stroke(0);
  fill(0);
  background(220);
  textAlign(CENTER);

  oldt = millis();
  tnow = millis();
  dt = .1;
  
  // canvas.addEventListener("touchstart", touchDown, false);
  // canvas.addEventListener("touchmove", touchXY, true);
  // canvas.addEventListener("touchend", touchUp, false);
//function Shaft(il,id, ix, iy, ivel)
  // testShaft = new Shaft(200,75,canv_w/2,canv_h/2+100);
  // testShaft.nspokes = 4;
  dam = new Dam();
  recorder = new Recorder();
  var scalefactor = 0.55;

  valve_slider= new XSlider(canv_w/2, canv_h/2-200, 100, 0, 100, 0, "Valve Open Position (%)");; 
  
  var inox = scalefactor*50.0/1200.0*canv_w;
  var inoy = scalefactor*200.0/650.0*canv_h;
  var insepx = scalefactor*75*canv_w/1200.;
  var insepy = scalefactor*100*canv_h/650.0;
  var buttondscaled = scalefactor*50.0*canv_w/1200;
  //textFont('Arial',32);
  in1_button = new RadioButton(canv_w/2-100,canv_h/2-250,buttondscaled,'REC',12);
  in2_button = new RadioButton(canv_w/2+100,canv_h/2-250,buttondscaled,'VALVE',12);

  
  
}

function draw(){
  tnow = millis();
  dt = (tnow-oldt)/1000.0;
  oldt = tnow;
  print(dt)
  // translate(-width/2,-height/2,0); //moves our drawing origin to the top left corner
  background(220);
  fill(0);
  stroke(0);
  // line(0,canv_h/2+25,canv_w,canv_h/2+25);
  // rectMode(CENTER);
  // fill(220);
  // rect(90*canv_w/1200.0,canv_h/2-20,150*canv_w/1200.0,365*canv_h/650.0);
  // rect(canv_w-100*canv_w/1200.0,canv_h/2-20,175*canv_w/1200.0,365*canv_h/650.0);
  // fill(0);
  // //greet the user
  textSize(32);
  textAlign(CENTER);
  text("Hydroelectric Generator Simulator",canv_w/2,50);
  
  textSize(14);
  textAlign(CENTER);
  text("text file columns: [time    gauge height (ft)   turbine pressure (KPa)    turbine speed (RPM)    generator volts    house volts]",canv_w/2,canv_h/2-150);
  
  //process inputs
  in1_button.updateRadio();
  in2_button.updateRadio();
  
  
  //update boolean code from text area with callback
  //console.log(run_button.newtouch);
  
  //boolean algebra block 3
  REC = in1_button.state;
  VALVE = in2_button.state;
  
  



  valve_slider.slpos = VALVEPERCENT;
  valve_slider.drawSlider();
  VALVEPERCENT = valve_slider.slpos;
  dam.valvepercent = VALVEPERCENT;

  // testShaft.update(dt,1);
  dam.update(dt,VALVE&&(VALVEPERCENT>0));

  //update recording function
  recorder.update(REC,"damdata.txt",dt,[dam.hm/.3048,(dam.P1g-dam.alpha*dam.Rvalve*dam.O2g)/1000.0,dam.O2g*9.55,dam.V5g,dam.V5g-dam.Rline*dam.im])
  
}


function XSlider(ixorg, iyorg, ilen, imin, imax, islpos, ilabel) {
    this.xorg = ixorg;
    this.yorg = iyorg;
    this.len = ilen;
    this.slpos = islpos;
    this.min = imin;
    this.max = imax;
    this.label = ilabel;
    this.sliderstroke = color(0, 0, 0);
    this.sliderfill = color(0, 0, 0);
    this.was_pressed=false;
    this.held=false;
  
  this.drawSlider=function() {
    //box_x = (slpos-min)*len/(max-min);
    this.updateSlider();
    stroke(this.sliderstroke);
    fill(this.sliderfill);
    line(this.xorg, this.yorg, this.xorg+this.len, this.yorg);
    rectMode(CENTER);
    this.box_x = (this.slpos-this.min)*this.len/(this.max-this.min);
    rect(this.xorg+this.box_x, this.yorg, this.len*.2, this.len*.1);
    textSize(12);
    text(this.label+": "+nf(this.slpos, 1, 2), this.xorg, this.yorg-this.len*.1);
  }

  this.updateSlider = function() {
    this.box_x = (this.slpos-this.min)*this.len/(this.max-this.min);
    //console.log(touches)
    if ((mouseIsPressed && !this.was_pressed && !this.held)||(mouseIsPressed && !this.was_pressed && !this.held)) {

      //println((xorg+box_x-mouseX));
      if (abs(this.xorg+this.box_x-mouseX)<0.2*this.len && abs(this.yorg-mouseY)<0.2*this.len) {
        this.held=true;
        //println("held");
      }
    } else if ((mouseIsPressed && this.held)||(mouseIsPressed && this.held)) {
      this.held = true;
    } else {
      this.held=false;
    }
    //println(mouseX-xorg);
    this.was_pressed=Im_touched||mouseIsPressed;
    if (this.held==true) {
      //update slider if the box is being dragged
      this.box_x = mouseX-this.xorg;
      if (mouseX>this.xorg+this.len) {
        this.box_x = this.len;
      }
      if (mouseX<this.xorg) {
        this.box_x=0;
      }
      this.slpos = this.min+(this.max-this.min)*this.box_x/this.len;
    }
  }
}

function Recorder(){

  this.data = "";
  this.type = "text/latex";
  this.t = 0;
  this.recording = false;
  this.wasrecording = false;



  this.update = function(active,name,dt,data){
    this.recording = active;

    if(this.recording){
      this.data+=String(this.t);
      this.data+="\t";
      for(i=0;i<data.length;i++){
        this.data+=String(data[i]);
        this.data+="\t";
      }
      this.data+="\r\n";
      this.t+=dt
    }
    else{
      if(this.wasrecording){
        this.doSave(name);
        this.t = 0
        this.data=[]

      }

    }
    this.wasrecording = this.recording;

  }

  this.doSave = function(name) {
  var blob;
  if (typeof window.Blob == "function") {
    blob = new Blob([this.data], {
      type: this.type
    });
  } else {
    var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
    var bb = new BlobBuilder();
    bb.append(this.data);
    blob = bb.getBlob(this.type);
  }
  var URL = window.URL || window.webkitURL;
  var bloburl = URL.createObjectURL(blob);
  var anchor = document.createElement("a");
  if ('download' in anchor) {
    anchor.style.visibility = "hidden";
    anchor.href = bloburl;
    anchor.download = name;
    document.body.appendChild(anchor);
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", true, true);
    anchor.dispatchEvent(evt);
    document.body.removeChild(anchor);
  } else if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, name);
  } else {
    location.href = bloburl;
  }
}

}



function Dam(){
  this.voffset = -150;
  // this.turb = new ShaftVertical(100,30,canv_w/2-100,canv_h/2+200);
  this.turb = new ShaftVertical(100,30,canv_w/2-100,canv_h/2+200+this.voffset);

  this.turb.nspokes = 4
  // this.shaft = new ShaftVertical(25,50,canv_w/2-100,canv_h/2+175);
  this.shaft = new ShaftVertical(25,50,canv_w/2-100,canv_h/2+175+this.voffset);
  this.shaft.nspokes = 4
  this.turbine_active = true;
  this.overflow = false;
  this.h = 155;
  this.h_base = 40;//this is the height of the turbine
  this.valvepercent = 50;
  this.overflowval = 0;
  this.g = 9.81;
  this.rho = 1000;
  this.res_diam = 10;//meteres, diameter of circular reservoir (tank)
  this.res_area = (this.res_diam/2)*(this.res_diam/2)*PI;
  this.Cf = this.res_area/(this.rho*this.g);
  this.b = 8500/4;//kgs/m
  this.alpha = 1.0;
  this.kt = 41.25;
  this.J = 17000/4;
  this.IL = 1;//henrys.... the generator inductance (make insig)
  this.hm = 9;//this is the "world units" h used in the equations.

  this.P1g = this.rho*this.g*this.hm;//initial value of pressure at source
  this.P1g_dam = this.rho*this.g*this.hm
  this.O2g = 0;//initial value of turbine speed
  this.im = 0;//initial value of current in motor
  this.V5g = 0;//initial value of voltage at output
  this.Rline = .10;//ohms

  //input
  this.Qin = 12;
  this.Ra = 0.9;//Ohms, armature resistance
  this.Rl = 10.00;//ohms, load resistance total
  this.Rvalve = 0;


  this.statederivs = function(valve){
    //determine whether the turbine has a pressure source or not
    this.turbine_active = valve&&(this.valvepercent>0);
    if(this.turbine_active){
       this.P1g = this.P1g_dam;//this.hm*this.rho*this.g
      // print("P1g is: " +str(this.P1g))
    }
    else{
      this.P1g = this.P1g_dam
    }

    //first state equation: P1g
    if(this.turbine_active){
      P1gd = -this.alpha/this.Cf*this.O2g+1.0/this.Cf*this.Qin
    }
    else{
      P1gd = 0
      print("not active: dot is: "+str(P1gd))
    }
    if(this.hm>16){
      P1gd = 0;//assume that the dam is overflowing here
      print("overflow")
    }
    //second state equation: Omega 2
    if(this.turbine_active){
    O2gd = this.alpha/this.J*(this.P1g) - (this.alpha*this.alpha*this.Rvalve+this.b)/this.J*this.O2g - this.kt/this.J*this.im;
  }
  else{
    O2gd = this.alpha/this.J*0 - this.b/this.J*this.O2g;// - this.kt/this.J*this.im;
  }
  //third state equation: G current
  if(this.turbine_active){
  imd = this.kt/this.IL*this.O2g -(this.Ra+this.Rl)/this.IL*this.im;
}
else{
  imd = this.kt/this.IL*this.O2g -(this.Ra+this.Rl)/this.IL*this.im;
}

  return [P1gd,O2gd,imd];
  }

  this.euler = function(dt,valve){
    derivs= this.statederivs(valve);
    print("adding: " +str(derivs[0]*dt+" to P1g"))
    this.P1g += derivs[0]*dt;
    if(this.P1g<0){this.P1g=0;}
    if(!valve){

      if(this.hm<=16){
    this.P1g_dam += 1.0/this.Cf*this.Qin*dt;
  }

  }
  else{
    this.P1g_dam += derivs[0]*dt;
    if(this.P1g_dam>(this.rho*this.g*16)){
      this.P1g_dam = (this.rho*this.g*16)
    }
  }
    this.O2g += derivs[1]*dt;
    this.im += derivs[2]*dt;
    this.V5g = this.im*this.Rl;
    if(1){
    this.hm = this.P1g_dam/(this.rho*this.g);//calculate height of water in res in meters
  }

  }

  this.update = function(dt,valve){
    this.Rvalve = (110-this.valvepercent)/100.0*(this.rho*this.g*20/this.Qin);//make the resistance such that it halves the flow when cracked
    this.euler(dt,valve);//update all variables


    this.h = this.h_base+this.hm*110/15.0;//convert to a pixel height for controlling the displace
    this.overflow= this.h>150;
    if(this.overflow){
      this.overflowval = this.h-150;
      if(this.overflowval>10){
        this.overflowval=10;
      }
    }
    else{
      this.overflowval=0;
    }

    this.drawStatic();
    this.drawPipes();
    this.shaft.update(dt,-this.O2g);
    this.turb.update(dt,-this.O2g);
    this.drawlabels();

  }

  this.drawlabels = function(){
    fill(0);
    stroke(0);
    textSize(10);
    text("River Gauge Flow: "+nf(this.Qin*35.31,2,2)+" CFS",70,canv_h/2+50+this.voffset)
    text("Dam Gauge Height (rel to turbine): "+nf(this.hm/.3013,2,2)+" ft",250,canv_h/2+50+this.voffset)
    textSize(8);
    text("RPM: "+nf(this.O2g/.10472,3,2),canv_w/2-100,canv_h/2+140+this.voffset)
    text("Volts: "+nf(this.V5g-this.Rline*this.im,3,2),canv_w/2+200,canv_h/2+65+this.voffset)
  }

  this.drawStatic = function(){

    rectMode(CORNER);
    //draw dirt
    var dirt=color(200,150,100);
    var water = color(0,0,255);
    var concrete = color(75,75,75);
    fill(dirt);
    stroke(dirt);
    //draw high level
    rect(0,canv_h/2+75+this.voffset,100,175);
    //draw low level
    rect(100,canv_h/2+225+this.voffset,canv_w,25)
    //draw house platform
    rect(canv_w-250,canv_h/2+125+this.voffset,250,125);
    //draw incoming stream
    fill(water);
    stroke(water);
    rect(0,canv_h/2+65+this.voffset,100,10);
    rect(100,canv_h/2+65+this.voffset,10,160);
    rect(100,canv_h/2+200+this.voffset,canv_w,25);
    //now draw reservoir at height
    if(this.h>160){this.h=160;}
    rect(100,canv_h/2+225+this.voffset,150,-this.h);

    //now draw overflow if applicable
    if(this.overflow){
      rect(250,canv_h/2+75-this.overflowval+this.voffset,50,this.overflowval);
      quad(300,canv_h/2+75-this.overflowval+this.voffset,300,canv_h/2+75+this.voffset,600,canv_h/2+225+this.voffset,600,canv_h/2+225-this.overflowval+this.voffset)
    }

    fill(concrete);
    stroke(concrete);
    quad(250,canv_h/2+75+this.voffset,300,canv_h/2+75+this.voffset,600,canv_h/2+225+this.voffset,250,canv_h/2+225+this.voffset);
  

    fill(0);
    rect(canv_w/2-125,canv_h/2+200+this.voffset,50,25);
    fill(0);
    rect(canv_w/2-125,canv_h/2+150+this.voffset,50,50);
    fill(255);
    rect(canv_w/2-125,canv_h/2+100+this.voffset,50,50);
    fill(0)
    rect(750,canv_h/2+75+this.voffset,50,50);
    quad(740,canv_h/2+75+this.voffset,775,canv_h/2+50+this.voffset,775,canv_h/2+50+this.voffset,810,canv_h/2+75+this.voffset);
    stroke(0)
    strokeWeight(5);
    line(canv_w/2-100,canv_h/2+100+this.voffset,740,canv_h/2+75+this.voffset)
    strokeWeight(1);
    stroke(80);
    rectMode(CENTER);
    fill(color(255*this.V5g/450,255*this.V5g/450,0))
    rect(775,canv_h/2+100+this.voffset,25,25);
    stroke(0);
    line(775,canv_h/2+88+this.voffset,775,canv_h/2+113+this.voffset)
    line(775-12.5,canv_h/2+100+this.voffset,775+12.5,canv_h/2+100+this.voffset)
  }

  this.drawPipes = function(){
    var dirt=color(200,150,100);
    var water = color(0,0,255);
    var concrete = color(75,75,75);
    //first draw the pipe to the turbine
    if(this.turbine_active&&(this.h>40)){
      fill(water);
      print("turbine is active");
    }
    else{
      fill(50);
    }
    stroke(0);
    quad(250,canv_h/2+175+this.voffset,250,canv_h/2+185+this.voffset,canv_w/2-100,canv_h/2+215+this.voffset,canv_w/2-100,canv_h/2+205+this.voffset);
    quad(canv_w/2-100,canv_h/2+205+this.voffset,canv_w/2+60,canv_h/2+205+this.voffset,canv_w/2+80,canv_h/2+215+this.voffset,canv_w/2-100,canv_h/2+215+this.voffset)

    if(this.turbine_active){
      fill(0);
      stroke(0);
      rectMode(CENTER);
      rect(250,canv_h/2+180-this.valvepercent/100.0*10+this.voffset,5,10);
      rectMode(CORNER);
    }
    else{
      fill(0);
      stroke(0);
      rectMode(CENTER);
      rect(250,canv_h/2+180+this.voffset,5,10);

      rectMode(CORNER);
    }
  }


}

function outputLight(ix,iy,id,icolorFalse,icolorTrue,ilabel,itextSize){
  this.x =ix;
  this.y = iy;
  this.d = id;
  this.label = ilabel;
  this.colorFalse = icolorFalse;
  this.colorTrue = icolorTrue;
  this.state = false;
  this.textSize = itextSize;
  this.update = function(val){
    this.state = val;
  }
  this.drawLight=function(){
  if(this.state==false){
      fill(this.colorFalse);
      stroke(0);
    }
    else{
      fill(this.colorTrue);
      stroke(0);
    }
    
    //draw the radio button
    ellipse(this.x,this.y,this.d,this.d,2);
    fill(0);
    stroke(0);
    textSize(this.textSize);
    text(this.label, this.x, this.y+this.d);
    }
}

function Counter(ix,iy,iw,ih,ilabel,ifalseColor,itrueColor){
  this.thresh = 3;//global variable
  this.up = false;
  this.oldup = false;
  this.down = false;
  this.olddown = false;
  this.state = false;
  this.RST = false;
  this.count = 0;
  this.x = ix;
  this.y = iy;
  this.w = iw;
  this.h = ih;
  this.label = ilabel;
  this.falseColor = ifalseColor;
  this.trueColor = itrueColor;
  
  //variables for duration up/down control
  this.upbtnx = this.x+0.75*this.w/2;
  this.upbtny = this.y-0.5*this.h/2;
  this.dnbtny = this.y+0.5*this.h/2;
  this.upbtn_d = this.w*0.1;//diameter of the button circle
  
  this.uplightx = this.x-0.75*this.w/2;
  this.uplighty = this.y-0.5*this.h/2;
  this.downlightx = this.uplightx;
  this.downlighty = this.y;
  this.rstlightx = this.uplightx;
  this.rstlighty = this.y+this.h/4;
  this.lightd = 0.1*this.w;
  
  //lights for showing when inputs go high
  this.uplight = new outputLight(this.uplightx,this.uplighty,this.lightd,color(0,128,128),color(0,255,255),"UP",8);
  
  this.downlight = new outputLight(this.downlightx,this.downlighty,this.lightd,color(0,128,128),color(0,255,255),"DOWN",8);
  
  this.rstlight = new outputLight(this.rstlightx,this.rstlighty,this.lightd,color(0,128,128),color(0,255,255),"RST",8);
  
  //now create a momentary button for the up and down buttons
  this.upbtn = new MomentaryButton(this.upbtnx,this.upbtny,this.upbtn_d,"CNT+",8);
  this.dnbtn = new MomentaryButton(this.upbtnx,this.dnbtny,this.upbtn_d,"CNT-",8);
  
  this.update = function (){
    //draw timer box
    this.drawCounter();
    //update class-owned variables based on buttons on timer
    if (this.upbtn.newtouch==true){
      this.thresh=this.thresh+1;//increase the timer duration by 10.
    }
    if ((this.dnbtn.newtouch==true)&&(this.thresh>0)){
      this.thresh=this.thresh-1;//decrease
    }
    this.uplight.state = this.up;
    this.downlight.state = this.down;
    this.rstlight.state = this.RST;
    //actually update timer variables
    if (this.up&&!this.oldup){
      this.count = this.count+1;
    }
    if(this.down&&!this.olddown&&this.count>=0){
      this.count = this.count-1;
    }
    if(this.RST){
      this.count=0;
    }
    //reset old enable to detect rising edge
    this.oldup=this.up;
    this.olddown = this.down;
    this.state = this.count>=this.thresh;
  }
  
  this.drawCounter = function(){
    rectMode(CENTER);
    if(this.state==false){
      fill(this.falseColor);
    }
    else{
      fill(this.trueColor);
    }
    stroke(0);
    //draw box for timer
    rect(this.x,this.y,this.w,this.h);
    this.uplight.drawLight();
    this.downlight.drawLight();
    this.rstlight.drawLight();
    //draw buttons
    this.dnbtn.updateButton();
    this.upbtn.updateButton();
    //draw some text
    textSize(8);
    fill(0);
    text(this.label+" (out)",this.x,this.y-0.25*this.h);
    text("CNT: "+str(int(this.thresh)),this.x,this.y);
    text(this.label[0]+this.label[1]+"A"+this.label[2]+": "+str(int(this.count))+" (out)",this.x,this.y+this.h*.25);
    text(this.label[0]+this.label[1]+"A"+this.label[2]+" counts up on "+str(this.label)+"_UP rising edge",this.x,this.y+1.3*this.h/2);
    text(this.label[0]+this.label[2]+"A"+this.label[2]+" counts down on "+str(this.label)+"_DOWN rising edge",this.x,this.y+1.6*this.h/2);
    text(str(this.label)+" is true when "+str(this.label[0]+this.label[1])+"A"+str(this.label[2])+">CNT",this.x,this.y+1.9*this.h/2);
    text(str(this.label[0]+this.label[1])+"A"+str(this.label[2])+" resets when "+str(this.label)+"_RST is true",this.x,this.y+2.2*this.h/2);
  }
}

function Timer(ix,iy,iw,ih,ilabel,ifalseColor,itrueColor){
  this.duration = 1000;//global variable
  this.en = false;
  this.olden = false;
  this.state = false;
  this.RST = false;
  this.tstart = millis();
  this.elapsed = 0;
  this.x = ix;
  this.y = iy;
  this.w = iw;
  this.h = ih;
  this.label = ilabel;
  this.falseColor = ifalseColor;
  this.trueColor = itrueColor;
  
  //variables for duration up/down control
  this.upbtnx = this.x+0.75*this.w/2;
  this.upbtny = this.y-0.5*this.h/2;
  this.dnbtny = this.y+0.5*this.h/2;
  this.upbtn_d = this.w*0.1;//diameter of the button circle
  
  this.enlightx = this.x-0.75*this.w/2;
  this.enlighty = this.y;
  this.enlightd = this.w*0.1;
  
  this.enlight = new outputLight(this.enlightx,this.enlighty,this.enlightd,color(0,128,128),color(0,255,255),"EN",8);
  
  //now create a momentary button for the up and down buttons
  this.upbtn = new MomentaryButton(this.upbtnx,this.upbtny,this.upbtn_d,"dur+",8);
  this.dnbtn = new MomentaryButton(this.upbtnx,this.dnbtny,this.upbtn_d,"dur-",8);
  
  this.update = function (){
    this.enlight.state = this.en;
    //draw timer box
    this.drawTimer();
    //update class-owned variables based on buttons on timer
    if (this.upbtn.newtouch==true){
      this.duration=this.duration+100;//increase the timer duration by 10.
    }
    if (this.dnbtn.newtouch==true){
      this.duration=this.duration-100;//decrease
    }
    
    //actually update timer variables
    if (this.en){
      this.elapsed = millis()-this.tstart;
    }
    else{
      this.elapsed=0;
      this.tstart = millis();
    }
    //reset old enable to detect rising edge
    this.olden=this.en;
    this.state = this.elapsed>=this.duration;
    
    
  }
  
  this.drawTimer = function(){
    rectMode(CENTER);
    if(this.state==false){
      fill(this.falseColor);
    }
    else{
      fill(this.trueColor);
    }
    stroke(0);
    //draw box for timer
    rect(this.x,this.y,this.w,this.h);
    //draw light
    this.enlight.drawLight();
    //draw buttons
    this.dnbtn.updateButton();
    this.upbtn.updateButton();
    //draw some text
    textSize(8);
    fill(0);
    text(this.label+" (out)",this.x,this.y-0.25*this.h);
    text("Duration: "+str(int(this.duration)),this.x,this.y);
    text(this.label[0]+"A"+this.label[1]+": "+str(int(this.elapsed))+" (out)",this.x,this.y+this.h*.25);
    text(this.label+" counts when "+str(this.label)+"_EN is true",this.x,this.y+1.3*this.h/2);
    text(str(this.label)+" is true when "+str(this.label[0])+"A"+str(this.label[1])+">Duration",this.x,this.y+1.6*this.h/2);
  }
  
}

function MomentaryButton(ix,iy,id,ilabel,itextSize){
this.x = ix;
this.y = iy;
this.d = id;
this.state = false;
this.touched = false;
this.wastouched = false;
this.newtouch = false;
this.label = ilabel;
this.textSize = itextSize;

this.updateButton=function(){
  //detect whether the radio button is 
if (mouseIsPressed==true||touchIsDown==true){
  if ((sqrt(pow(mouseX-this.x,2)+pow(mouseY-this.y,2))<=this.d/2)||(sqrt(pow(touchX-this.x,2)+pow(touchY-this.y,2))<=this.d/2)){
    this.touched=true;
  }
}
  else{
    this.touched=false;
  }
  this.newtouch = this.touched&!this.wastouched;
  this.state = this.touched;
  //update value of touched
  this.wastouched = this.touched;

  //draw the button
  this.drawButton();
}


this.drawButton=function(){
if(this.state==false){
  fill(255);
}
else{
  fill(0);
}
stroke(0);
//draw the radio button
ellipse(this.x,this.y,this.d,this.d,2);
fill(0);
stroke(0);
textSize(this.textSize);
text(this.label, this.x, this.y+this.d);
}
}

function RadioButton(ix,iy,id,ilabel){
this.x = ix;
this.y = iy;
this.d = id;
this.state = false;
this.touched = false;
this.wastouched = false;
this.newtouch = false;
this.label = ilabel;

this.updateRadio=function(){
  //detect whether the radio button is 
if (mouseIsPressed==true||touchIsDown==true){
  if ((sqrt(pow(mouseX-this.x,2)+pow(mouseY-this.y,2))<=this.d/2)||(sqrt(pow(touchX-this.x,2)+pow(touchY-this.y,2))<=this.d/2)){
    this.touched=true;
  }
}
  else{
    this.touched=false;
  }



  if(this.touched==true & this.wastouched==false){
    this.state = !this.state;
  }
  //update value of touched
  this.wastouched = this.touched;

//draw the button
  this.drawRadio();
}


this.drawRadio=function(){
if(this.state==false){
  fill(255);
}
else{
  fill(0);
}
stroke(0);
//draw the radio button
ellipse(this.x,this.y,this.d,this.d,2);
fill(0);
stroke(0);
textSize(12);
text(this.label, this.x, this.y+this.d);
}
}



function ShaftVertical(il,id, ix, iy)
{
    this.xpos = ix;
    this.ypos = iy;

    this.L = il;
    this.d =id;

    //shaft angular displacement
    this.theta=0;
    
    this.stroke = color(0, 0, 0);
    this.wheelfill = color(255, 255, 255);
    this.nspokes = 10;

    this.update= function(dt,omega) {
    this.theta+=omega*dt;
    this.draw();
  }

  this.draw=function() {
    stroke(this.stroke);
    fill(this.wheelfill);
    translate(this.xpos,this.ypos);
    rectMode(CENTER);
    rect(0, 0, this.L, this.d);
    for ( k=0; k<this.nspokes; k++) {
      var this_angle = this.theta+2*PI/this.nspokes*k;
      if ((this.d/2)*sin(2*PI/this.nspokes*k+this.theta)<0) {
        stroke(color(125,125,125,0));
      } 
      else {
        stroke(this.stroke);
      }
      //console.log("drew spokes")
      // var x1=-this.L/2
      // var y1=this.d/2*cos(this_angle+PI)
      // var x2= this.L/2
      // var y2=this.d/2*cos(this_angle+PI)
      var x1=this.L/2*cos(this_angle+PI)
      var y1=-this.d/2
      var x2= this.L/2*cos(this_angle+PI)
      var y2=this.d/2
      line(x1, y1,x2, y2);
    }
    
    stroke(this.stroke);
    fill(this.wheelfill);
    //

  translate(-this.xpos,-this.ypos);
  }


}

