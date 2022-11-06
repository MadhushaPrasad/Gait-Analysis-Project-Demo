
let video;
let poseNet;
let pose;
let skeleton;
let kneeDist;
let stridelength;//added by PB
var n1,n2;
var cal;
var height = 0;
let rleg,lleg;
//var fs = require('fs-js');
//var timecount = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() 
{
  console.log('poseNet ready');
  //console.log(pose);
}

function draw() {
  image(video, 0, 0);
  
  if (pose) 
  {
    var a = document.getElementById("cal");
    cal = parseFloat(a.value);
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    let left_leg = pose.leftAnkle;
    let right_leg = pose.rightAnkle;
    let d1 = 0,d2 = 0,d3 = 0;
    var s = document.getElementById("id1");
    //var fs = require('fs-js');
    rleg = right_leg;
    lleg = left_leg;
    if(s.value != 3)
    {
      document.getElementById("inputTextToSave").value = document.getElementById("inputTextToSave").value +rleg.x+","+rleg.y+","+lleg.x+","+lleg.y+"\n"; 
      console.log("Right Leg: ("+rleg.x+","+rleg.y+")");
      console.log("Left Leg: ("+lleg.x+","+lleg.y+")\n");
    }
    /*fs.open('out.txt', 'wx', (err, fd) => {
    if (err) 
    {
      if (err.code === 'EEXIST') {
        console.error('myfile already exists');
        return;
      }
   
      throw err;
    }
   
    writeMyData(fd);
  }); */ 
    if (a.value != "")
    {
      if(left_leg.confidence >= 0.5 && eyeL.confidence >= 0.5)
      {
        d3 = dist(eyeL.x,eyeL.y,left_leg.x,left_leg.y);
        height = d3;
        document.getElementById("height").innerHTML = "Height = "+str(height/cal)+" cm";
      }
    }
    else
    {
      document.getElementById("height").innerHTML = "Please provide the calibration factor for mesuring height";
    }
    if(left_leg.confidence >= 0.5 && right_leg.confidence >= 0.5 && s.value == "1" )
    {
      d1 = dist(left_leg.x, left_leg.y, right_leg.x, right_leg.y);
      document.getElementById("rightstride").innerHTML = "Right step Length = "+str(d1/cal)+" cm";
      n1 = d1;
    }
    else if(left_leg.confidence >= 0.5 && right_leg.confidence >= 0.5 && s.value == "2")
    {
      d2 = dist(left_leg.x, left_leg.y, right_leg.x, right_leg.y);
      document.getElementById("leftstride").innerHTML = "Left step Length = "+str(d2/cal)+" cm";
      n2 = d2;
    }
    else if(s.value == "0")
    {
      stridelength = n1 + n2;
      if(stridelength > 0)
      {
        document.getElementById("stride").innerHTML = "<span style='color:green;'>Stride Length = "+str(stridelength/cal)+" cm</span>";
      }
      else
      {
        document.getElementById("stride").innerHTML = "<span style='color:red;'>Unable to detect feet</span>";
      }
    }
    knee = dist(pose.leftKnee.x, pose.leftKnee.y, pose.rightKnee.x, pose.rightKnee.y);
    if(left_leg.confidence >= 0.5 && right_leg.confidence >= 0.5)
    {
      document.getElementById("knee").innerHTML = "Distance Between Knees = "+str(knee/cal)+" cm";
    }
    else
    {
      document.getElementById("knee").innerHTML = "<span style='color:red;'>Model Unable to detect Knees</span>";
    }
    //fill(255, 0, 0);
    //ellipse(pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}

function w2f()
{
  


}

function put(){
  getElementById("try").value = "check this ass";
}