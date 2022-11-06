window.onload = function () {
    loadAllTest();
    $('#button-reset').on('click', function () {
        alert("hello")
        highestDetails = [];
        document.getElementById('knee').innerHTML = "<span style='color:red;'>Model Unable to detect Knees</span>";
        document.getElementById('height').innerHTML = 'Distance Between height = ' + (knee / cal) + ' cm';
    })

};
let video;
let poseNet;
let pose;
let skeleton;
let kneeDist;
let stridelength; //added by PB
var n1, n2;
var cal = 1.85;
var height = 0;
let rleg, lleg;
let highestDetails = [];
let highestDetailsPre = [];
//var fs = require('fs-js');
//var timecount = 0;

function startCamera(){

}
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

function modelLoaded() {
    console.log('poseNet ready');
    //console.log(pose);
}

function draw() {
    image(video, 0, 0);

    if (pose) {
        var a = document.getElementById('cal');
        cal = parseFloat(a.value);
        let eyeR = pose.rightEye;
        let eyeL = pose.leftEye;
        let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
        let left_leg = pose.leftAnkle;
        let right_leg = pose.rightAnkle;
        let leftKnee = pose.leftKnee;
        let rightKnee = pose.rightKnee;
        let d1 = 0, d2 = 0, d3 = 0;
        var s = document.getElementById('id1');
        //var fs = require('fs-js');
        rleg = right_leg;
        lleg = left_leg;
        if (s.value != 3) {
            document.getElementById('inputTextToSave').value = document.getElementById('inputTextToSave').value + rleg.x + ',' + rleg.y + ',' + lleg.x + ',' + lleg.y + '\n';
            console.log('Right Leg: (' + rleg.x + ',' + rleg.y + ')');
            console.log('Left Leg: (' + lleg.x + ',' + lleg.y + ')\n');
        }
        // fs.open('out.txt', 'wx', (err, fd) => {
        //   if (err) {
        //     if (err.code === 'EEXIST') {
        //       console.error('myfile already exists');
        //       return;
        //     }

        //     throw err;
        //   }

        //   writeMyData(fd);
        // });
        if (a.value != '') {
            if (leftKnee.confidence >= 0.5 && rightKnee.confidence >= 0.5) {
                d3 = dist(leftKnee.x, leftKnee.y, rightKnee.x, rightKnee.y);
                height = d3;
                document.getElementById('height').innerHTML = 'Height = ' + (height / cal) + ' cm';
                highestDetails.push((height / cal))
            }
        } else {
            document.getElementById('height').innerHTML = 'Please provide the calibration factor for mesuring height';
        }
        if (left_leg.confidence >= 0.5 && right_leg.confidence >= 0.5 && s.value == '1') {
            d1 = dist(left_leg.x, left_leg.y, right_leg.x, right_leg.y);
            document.getElementById('rightstride').innerHTML = 'Right step Length = ' + (d1 / cal) + ' cm';
            n1 = d1;
        } else if (left_leg.confidence >= 0.5 && right_leg.confidence >= 0.5 && s.value == '2') {
            d2 = dist(left_leg.x, left_leg.y, right_leg.x, right_leg.y);
            document.getElementById('leftstride').innerHTML = 'Left step Length = ' + (d2 / cal) + ' cm';
            n2 = d2;
        } else if (s.value == '0') {
            stridelength = n1 + n2;
            if (stridelength > 0) {
                document.getElementById('stride').innerHTML = "<span style='color:green;'>Stride Length = " + (stridelength / cal) + ' cm</span>';
            } else {
                document.getElementById('stride').innerHTML = "<span style='color:red;'>Unable to detect feet</span>";
            }
        }
        knee = dist(pose.leftKnee.x, pose.leftKnee.y, pose.rightKnee.x, pose.rightKnee.y);

        if (left_leg.confidence >= 0.5 && right_leg.confidence >= 0.5) {
            document.getElementById('knee').innerHTML = 'Distance Between Knees = ' + (knee / cal) + ' cm';
        } else {
            document.getElementById('knee').innerHTML = "<span style='color:red;'>Model Unable to detect Knees</span>";
        }
        fill(255, 0, 0);
        ellipse(pose.nose.x, pose.nose.y, d);
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

function saveDetails() {

    console.log("" + highestDetails + "");
    console.log(typeof ("" + highestDetails + ""))
    axios({
        method: 'post', url: 'http://localhost:8000/api/gait/', data: {
            Gait_Details: "" + highestDetails + ""
        }
    })
        .then(function (response) {
            if (response.status === 200) {
                loadAllTest();
            }
        });
}

function loadAllTest() {
    axios({
        method: 'get', url: 'http://localhost:8000/api/gait/all', responseType: 'stream'
    })
        .then(function (response) {
            const details = JSON.parse(response.data).data;
            $('#tableBody').empty();
            for (let i of details) {
                $('#tableBody').append(`
                 <tr>
                    <td>${i._id}</td>
                    <td>
                        <button type="button" onclick="checkGait()">check</button>
                    </td>
                </tr>
                `);
            }
        });
}

function checkGait() {
    $('table tbody tr').on('click', function () {
        const id = $($(this).children()[0]).text();
        console.log(typeof (id))
        axios({
            method: 'get', url: `http://localhost:8000/api/gait/${id}`,
        })
            .then(function (response) {
                let eqCount = 0;
                const details = response.data.Gait_Details;
                const detailsArray = details.split(',');

                for (let i = 0; i < detailsArray.length; i++) {
                    if (highestDetails[i] === parseFloat(detailsArray[i])) {
                        eqCount++;
                    }
                    console.log(eqCount)
                }

                if (eqCount >= (detailsArray.length / 2)) {
                    alert("equal");
                } else {
                    if (eqCount === 0) {
                        alert("equality is 0");
                    }
                }
            });
    });
}

