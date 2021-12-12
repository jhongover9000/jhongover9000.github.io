// How You Like That
// https://teachablemachine.withgoogle.com/models/uehtSDJpy/
// Say So
// https://teachablemachine.withgoogle.com/models/SwOKCzLAF/
const imageModelURL = "https://teachablemachine.withgoogle.com/models/uehtSDJpy/";

// Game Variables
let numPoses = 0;
let currentPoseIndex = 0;
let poseTimeStamps = [];
let poseScreenshots = [];

let danceVideo;

let timeToPose = 3;       // scoring starts 3 seconds before image aligns with video

let model;
let video, topPrediction, numClasses, poseData, context, poseProb
let videoWidth = 1080
let videoHeight = 720

// Initialize Model
function preload() {
    // load model
    model = ml5.poseNet(imageModelURL + 'model.json');
    
}

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    // danceVideo = createVideo();
    video = createCapture(VIDEO);
    video.size(videoWidth, videoHeight)
    video.hide()
    
    textSize(20)
    
    model.on('pose', getPose);
    // init()
}

function setupCamera() {
    // Create the video
    video = createCapture(VIDEO);
    video.size(videoWidth, videoHeight)
    video.hide()
    flippedVideo = ml5.flipImage(video)
    // Start classifying
    // classifyVideo();
}



// Predict Pose
function getPose(poses) {
    topPrediction = poses[0].label;
    let highestProbability = 0
    let highestIndex
    predictions.forEach((item, index) => {
        if (item.probability > highestProbability) {
            highestProbability = item.probability
            highestIndex = index
        }
    })
    
    poseData = pose
    topPrediction = predictions[highestIndex].className
    poseProb = highestProbability
}





function draw() {
    background(150);
    
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
    
    
    
    
    
    predict()
}