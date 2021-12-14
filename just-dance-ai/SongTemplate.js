// the link to your model provided by Teachable Machine export panel

// Say So
// https://teachablemachine.withgoogle.com/models/uehtSDJpy/

// How You Like That
// https://teachablemachine.withgoogle.com/models/SwOKCzLAF/

// const imageModelURL = "https://teachablemachine.withgoogle.com/models/uehtSDJpy/";
const URL = "https://teachablemachine.withgoogle.com/models/uehtSDJpy/";


let numPoses = 0;
let currentPoseIndex = 0;
let poseTimeStamps = [];
let poseScreenshots = [];

let danceVid;

let timeToPose = 3;       // scoring starts 3 seconds before image aligns with video

let poseNet;
let topPrediction, numClasses, poseData, context, poseProb;
let model, webcam, ctx, labelContainer, maxPredictions, video;

let videoHeight = window.innerHeight;
let videoWidth = window.innerHeight*0.625;


// function preload(){
//     danceVid = loadVideo("Songs/SaySo/danceVideo.mp4");
// }

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    var viewWidth = window.innerWidth;
    var viewHeight = window.innerHeight;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(viewWidth, viewHeight, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = viewWidth; canvas.height = viewHeight;
    ctx = canvas.getContext("2d");

    // label container (debugging)
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const predictions = await model.predict(posenetOutput);

    let highestProbability = 0;
    let highestIndex;

    predictions.forEach((item, index) => {
        if (item.probability > highestProbability) {
          highestProbability = item.probability;
          highestIndex = index;
        }
      })
      
    poseData = pose
    topPrediction = predictions[highestIndex].className
    poseProb = highestProbability

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
        predictions[i].className + ": " + predictions[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // finally draw the poses
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

async function draw() {
    background(220)
  
    imageMode(CORNER)
    push()
    translate(videoWidth, 0);
    scale(-1, 1);
    image(video, 0, 0, videoWidth, videoHeight)
    if (poseData) {
     const minPartConfidence = 0.5;
        tmPose.drawKeypoints(poseData.keypoints, minPartConfidence, context);
        tmPose.drawSkeleton(poseData.keypoints, minPartConfidence, context); 
    }
    pop()
    
    /************************
      Add class logic here
    ************************/
    strokeWeight(4)
    stroke(0)
    fill(255)
    text(topPrediction+" "+poseProb, 20, 30)
    
    
    
    
    
    await predict()
  }

// function setup(){
//     createCanvas(300,200);

// }

// function draw(){
//     // background(200);
// }