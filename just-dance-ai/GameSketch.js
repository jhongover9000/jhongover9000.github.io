// A.r.t. Intel Final Project: Just Dance A.I. (Sketch Script)
// Joseph
// 
// Description: this is the script that plays out the game. Since I ended up writing this alone, I
//              thought it was only fair I put my name on it. I used some base code from an example,
//              which I lost but the code is here: https://editor.p5js.org/jhh508/sketches/pH8nvOCtN.
// ===================================================================================================
// ===================================================================================================
// Variables

// How You Like That
// https://teachablemachine.withgoogle.com/models/uehtSDJpy/
var URL = "https://teachablemachine.withgoogle.com/models/uehtSDJpy/";

// Say So
// https://teachablemachine.withgoogle.com/models/SwOKCzLAF/
// var URL = "https://teachablemachine.withgoogle.com/models/SwOKCzLAF/";

// Maria
// var URL = https://teachablemachine.withgoogle.com/models/9jWoOem-c/

// Main Variables
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

// Webcam Variables
var camWidth = 720;
var camHeight = 540;


// Video Variables (auto-adjust to height/width)
if(window.innerWidth*0.565 > window.innerHeight){
    // Video Variables (Height-Based)
    var videoHeight = window.innerHeight;
    var videoWidth = videoHeight*1.7702;
    var visualHeight = videoHeight*1.107;    // yes i did those calculations too
    var videoYOffset = videoHeight*0.053;     // yup even this

}
else{
    // Video Variables (Width-Based)
    var videoWidth = window.innerWidth;
    var videoHeight = videoWidth*0.565;
    var visualHeight = videoWidth*0.625;    // yes i did those calculations too
    var videoYOffset = videoWidth*0.03;     // yup even this
}

// Pose Variables
var numPoses = 0;
var totalPoses = 0;
var currentPoseIndex = 0;
var poseImages = [];            // contains objects with timestamps and posenum
var poseVisuals = [];           // contains visuals of poses
var posePreviews = [];          // contains GIF previews of poses

// Array of timestamps & poses, set of poses (for loading images in preload)
var timeStamps = [];
var poseNums = [];
var poseSet;
var numPoses;

// HYLT
// var timeStamps = [1.07, 3.16, 7.15, 8.10, 9.03, 14.02, 17.19, 19.05, 22.19, 23.13, 25.26, 28.12, 30.10, 33.02, 34.16, 32.01, 33.23, 36.00, 43.18, 37.02, 39.23, 41.26, 45.11];
// var poseNums = [1,2,3,4,4,5,6,7,8,9,10,11,12,12,12,13,13,14,14,15,16,17,18];

// SS
// var timeStamps = [2.23, 4.15,  6.20,11.15, 12.19, 19.20, 36.28, 20.21, 38.01, 22.24, 40.05, 25.14, 27.17, 44.25, 29.10, 46.18, 33.21, 50.26, 34.06, 51.16, 35.11, 52.24];
// var poseNums = [1,2,3,4,5,6,6,7,7,8,8,9,10,10,11,11,12,12,13,13,14,14]

// Maria
// var timeStamps = [3.29,10.00,11.13,14.27,26.14,29.13,35.12,42.03,43.09,46.29,50.25,55.20,58.25,63.19];
// var poseNums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];

// Header Variables
var fileDirHdr = "Songs/HowYouLikeThat/"; // header for loading files
// var imgDirHdr = "Songs/SaySo/";
// var imgDirHdr = "Songs/Maria/";
var danceVid;       // video of dance

// PoseNet Variables
var model;              // poseNet model
var modelLoaded = false;
var capture;            // webcam video
var topPrediction;      // top prediction
var numClasses;         // number of classes
var poseData;           // hold data of pose
var context;            // context canvas
var poseProb;           // confidence of model

// Game Variables
var gameState = 0;
var internalState = 0;
var isPaused = true;

var mouseClicked = false;
var buttonSelected = 3;  // track which button is selected, 3 is default
var songSelected = 3;    // track which song is selected, 3 is default

// for menu screens
var rectWidth = screenWidth/4;
var rectHeight = screenHeight/12;
var rectX = screenWidth/4 - rectWidth/2;
var rectY = 2*screenHeight/5;
var textX = screenWidth/2;
var textY = screenHeight/2;
var backgroundsNum = 10;        // backgrounds for menu
var backgrounds = [];

// for actual game
var currentPose;        // next pose (poseImage object)
var currentPoseVisual;  // next pose visual
var poseLocX;           // x coord of pose visual
var currentIndex = 0;   // current index of pose
var currentTimeStamp;   // time stamp of next pose
var etaPose;            // time to next pose
var totalScore = 0;     // total score



// ===================================================================================================
// ===================================================================================================
// Class Definition & Setup

// Class for poseImage
class poseImage {
    constructor(poseNum, timeStamp){
        this.confidenceScore = 0;                               // confidence of model prediction
        this.compString = "Pose " + String(poseNum);            // comparison string
        this.poseNum = poseNum;                                 // pose number
        this.timeStamp = timeStamp;                             // timestamp of image
    }
    setConfidence(confidence){
        this.confidenceScore = confidence;
    }
    setImage(img){
        this.img = img;
    }
}

// ===================================================================================================
// ===================================================================================================
// Preload, Setup, & Init

// preload images
function preload() {
    // dance pose preview GIFs
    for(var i = 0; i < 3; i++){
        var temp = createImg("Songs/Previews/animation"+String(i)+".gif");
        temp.hide();
        posePreviews.push(temp);
    }

    // backgrounds
    for(var i = 0; i < backgroundsNum; i++){
        var temp = createImg("Backgrounds/"+String(i)+".jpg");
        temp.hide();
        backgrounds.push(temp);
    }

    // dance video
    danceVid = createVideo(fileDirHdr + "/danceVideo.mp4");
    danceVid.hide();
}

// setup for camera
function setup() {
    frameRate(30);
    // canvas with webcam
    const canvas = createCanvas(videoWidth, videoHeight);
    context = canvas.elt.getContext('2d');
    capture = createCapture(VIDEO);
    capture.size(camWidth, camHeight);
    capture.hide();
    
    textSize(20);
    // init();
    
}

// initialize model (can be called separately)
async function init() {
    // hide previews
    for(var i = 0; i < 3; i++){
        if(true){
            posePreviews[i].hide();
        }
    }

    // load model
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmPose.load(modelURL, metadataURL);
    numClasses = model.getTotalClasses();
    modelLoaded = true;

    poseSet = new Set(poseNums);
    numPoses = poseSet.size;   
    console.log(numPoses);
    // Set totalPoses
    if(timeStamps.length == poseNums.length){
        totalPoses = poseNums.length;
        console.log(totalPoses);
    }
    else{
        console.log(String(timeStamps.length) + "|" + String(poseNums.length) +": Mismatch in arrays. totalPoses not set.");
    }
    // set pose images and link to timestamps
    for(var i = 0; i < totalPoses; i++){
        var temp = new poseImage(poseNums[i], timeStamps[i]);
        poseImages.push(temp);
    }
    // sort in ascending order of timestamp
    poseImages.sort(function(a, b){return a.timeStamp - b.timeStamp});
    // console.log(poseImages);
    
    danceVid = createVideo(fileDirHdr + "/danceVideo.mp4");
    danceVid.hide();
    
    for(var i = 0; i < numPoses; i++){
        var temp = loadImage(fileDirHdr + "Poses/Pose"+String(i+1)+".png");
        console.log(temp);
        poseVisuals.push(temp);
    }
    
    // set pose variables to first pose to appear
    setPoseVariables(poseImages[currentIndex]);
}


// ===================================================================================================
// ===================================================================================================
// PoseNet Functions

// predict pose
async function predict() {
    var matchingItem;

    // estimate pose
    const {pose, posenetOutput} = await model.estimatePose(capture.elt);
    
    const predictions = await model.predict(posenetOutput)
    var highestProbability = 0
    var highestIndex
    if(etaPose <= 0.2){
        predictions.forEach((item, index) => {
            if(item.className == currentPose.compString){
                totalScore += item.probability*1000;
            }
            if (item.probability > highestProbability) {
                highestProbability = item.probability;
                highestIndex = index;
            }
        })
    }
    else{
        predictions.forEach((item, index) => {
            if (item.probability > highestProbability) {
                highestProbability = item.probability;
                highestIndex = index;
            }
        })
    }

    poseData = pose
    topPrediction = predictions[highestIndex].className
    poseProb = highestProbability;
}

// quickset for pose variables
async function setPoseVariables(poseImage){
    currentPose = poseImage;                                // first pose object set
    currentPoseVisual = poseVisuals[currentPose.poseNum-1];     // pose index is the pose of object-1
    currentTimeStamp = currentPose.timeStamp;
    console.log(currentPose);
    console.log(currentPoseVisual);
    console.log(currentTimeStamp);
}

// update pose location
async function updatePose(){
    // between 10 to 0.5 seconds, the outline will just move towards the dancer
    if(0.5 < etaPose && etaPose < 10.0 ){
        poseLocX = map(etaPose, 0, 3, 0, 2*windowWidth/3);
        displayPose();
    }
    // scoring window technically starts from the 0.5 second mark
    else if(0.0 < etaPose && etaPose <= 0.5){
        if(currentPose.compString == topPrediction){
            console.log("Nice!");
            totalScore += int(poseProb*1000);
            displayPose();
            currentIndex++;
            if(currentIndex < totalPoses){
                setPoseVariables(poseImages[currentIndex]);
            }
        }
        else{
            poseLocX = map(etaPose, 0, 3, 0, 2*windowWidth/3);
            displayPose();
        }
        
    }
    // at 0, you either get it or you don't
    else if( etaPose <= 0.0){
        currentIndex++;
        if(currentIndex >= totalPoses){
            
        }
        else{
            if(currentPose.compString == topPrediction){
                console.log("Nice!");
                totalScore += int(poseProb*1000);
                displayPose();
            }
            else{
                console.log(currentPose.compString);
                console.log(topPrediction);
            }
            setPoseVariables(poseImages[currentIndex]);
        }
    }
}

// display pose visual
async function displayPose(){
    image(currentPoseVisual, poseLocX, -videoYOffset, videoWidth, visualHeight);
}

// ===================================================================================================
// ===================================================================================================
// GameUI Functions

// Main Menu
function startMenu(){
    background(0);
    noFill();
    stroke(1);
    textAlign(CENTER, CENTER);
    
    // Display Main Menu
    fill(0);
    // rect(screenWidth/2 - rectWidth, screenHeight/9, rectWidth*2, screenHeight/6, 5);
    textAlign(CENTER, CENTER);
    textSize(45);
    fill(255);
    text("DANCE DANCE AI", screenWidth/2, screenHeight/9 + screenHeight/12);
    
    //Set location of first button
    var firstButtonX1 = rectX + screenWidth/4;
    var firstButtonX2 = rectX + screenWidth/4 + rectWidth;
    var firstButtonY1 = rectY;
    var firstButtonY2 = rectY + rectHeight;
    
    //Start Game - leads to song select
    nthMenuButton(0, 2, firstButtonX1, firstButtonX2, firstButtonY1, firstButtonY2, "Start");
    
    //Instructions
    nthMenuButton(1, 1, firstButtonX1, firstButtonX2, firstButtonY1, firstButtonY2, "How to Play");
    
    //Change Background
    // nthMenuButton(3, 9, firstButtonX1, firstButtonX2, firstButtonY1, firstButtonY2, "Change Background");
    
}

// Instructions
function instructions() {
    background(0);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("Welcome to Just Dance AI!", videoWidth/4, videoHeight/4, 2*videoWidth/4, 3*videoHeight/4);
    textSize(20);
    textAlign(LEFT, LEFT);
    text("\nWe're bringing back everyone's favorite dancing game with a new flavor: artificial intelligence! Using Google's Teachable Machine PoseNet, we've curated a sample of choreographies that will bring back the nostalgia in one song!\nPlaying is simple: just follow along with the dancer in front of you as usual, but pay attention especially when the silhouette borders appear: those will rack up your points!", screenWidth/4, screenHeight/4+50, 2*screenWidth/4, 3*screenHeight/4);
    textAlign(CENTER);
    text("\n\n\n\nPress SPACE to Return to Menu", videoWidth/4, 3*videoHeight/4, 2*videoWidth/4, 2*videoHeight/4);
    
}

// Song Selection
function songSelect(){
    background(0);
    noFill();
    stroke(1);
    textAlign(CENTER, CENTER);
    
    // Display Song Select
    fill(200);
    // rect(rectWidth/2, screenHeight/9, rectWidth*2, screenHeight/6, 5);
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(255);
    text("Select A Song.", screenWidth/4, screenHeight/9 + screenHeight/12);
    
    // Set location of first button
    var firstButtonX1 = rectX - (rectWidth*1.2 / 6);
    var firstButtonX2 = rectX + rectWidth*1.2;
    var firstButtonY1 = rectY;
    var firstButtonY2 = rectY + rectHeight;
    
    // How You Like That? - Black Pink
    nthMenuButton(0, 3, firstButtonX1, firstButtonX2, firstButtonY1, firstButtonY2, "How You Like That? - Black Pink");
    if(buttonSelected != 3){
        songSelected = 0;
        URL = "https://teachablemachine.withgoogle.com/models/uehtSDJpy/";
        fileDirHdr = "Songs/HowYouLikeThat/";
        poseNums = [1,2,3,4,4,5,6,7,8,9,10,11,12,12,12,13,13,14,14,15,16,17,18];
        timeStamps = [1.07, 3.16, 7.15, 8.10, 9.03, 14.02, 17.19, 19.05, 22.19, 23.13, 25.26, 28.12, 30.10, 33.02, 34.16, 32.01, 33.23, 36.00, 43.18, 37.02, 39.23, 41.26, 45.11];
        init();
    }
    
    // Say So - Doja Cat
    nthMenuButton(1, 3, firstButtonX1, firstButtonX2, firstButtonY1, firstButtonY2, "Say So - Doja Cat");
    if(buttonSelected != 3){
        songSelected = 1;
        URL = "https://teachablemachine.withgoogle.com/models/SwOKCzLAF/";
        fileDirHdr = "Songs/SaySo/";
        // timeStamps = [2.23, 4.15,  6.20,11.15, 12.19, 19.20, 36.28, 20.21, 38.01, 22.24, 40.05, 25.14, 27.17, 44.25, 29.10, 46.18, 33.21, 50.26, 34.06, 51.16, 35.11, 52.24];
        timeStamps = [2.7, 4.5, 7.00, 11.13, 12.6, 19.17, 36.26, 20.19, 37.29, 22.6, 40.44, 25.52, 27.6, 44.25, 29.7, 46.17, 33.17, 50.26, 34.06, 51.16, 35.08, 52.21];
        poseNums = [1,2,3,4,5,6,6,7,7,8,8,9,10,10,11,11,12,12,13,13,14,14];
        init();
    }
    // Maria - Hwasa
    nthMenuButton(2, 3, firstButtonX1, firstButtonX2, firstButtonY1, firstButtonY2, "Maria - Hwasa");
    if(buttonSelected != 3){
        songSelected = 2;
        URL = "https://teachablemachine.withgoogle.com/models/9jWoOem-c/";
        fileDirHdr = "Songs/Maria/";
        // timeStamps = [3.29,10.00,11.13,14.27,26.14,29.13,35.12,42.03,43.09,46.29,50.25,55.20,58.25,63.19];
        timeStamps = [3.7, 9.27, 11.13, 14.7, 26.08, 29.03, 35.11, 41.25, 43.07, 46.06, 50.22, 55.80, 57.26, 63.14];
        poseNums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        init();
    }
}

// creating menu buttons
function nthMenuButton(n, nextState, firstButtonX1, firstButtonX2, firstButtonY1, firstButtonY2, word) {
    
    // Reset Variables
    buttonSelected = 3;
    
    //Increment n times
    for (var i = 0; i < n; i++) {
        firstButtonY1 = firstButtonY2 + screenHeight/36;
        firstButtonY2 = firstButtonY1 + screenHeight/12;
    }
    
    if ( ( firstButtonX1 < mouseX && mouseX < firstButtonX2) && (firstButtonY1 < mouseY && mouseY < firstButtonY2) ) {
        fill(230);

        // if song select
        if(gameState == 2){
            fill(0);
            rect(screenWidth/2, 3*screenHeight/9, 3*screenWidth/8, (3*screenWidth/8)*0.625);
            posePreviews[n].show();
            posePreviews[n].position(screenWidth/2, 3*screenHeight/9);
            posePreviews[n].size(3*screenWidth/8, (3*screenWidth/8)*0.625);
        }
        fill(230);
        //If mouse is pressed while hovering over option, return gameState
        if (mouseClicked) {
            if(gameState == 2){console.log("Clicked");}
            mouseClicked = false;
            mouseReleased = false;
            gameState = nextState;
            buttonSelected = n;
        }
    }
    else {
        fill(200);
            // hide previews
        for(var i = 0; i < 3; i++){
            if(true){
                posePreviews[n].hide();
            }
        }
    }
    rect(firstButtonX1, firstButtonY1, (firstButtonX2 - firstButtonX1), (firstButtonY2 - firstButtonY1), 5 );
    textAlign(CENTER, CENTER);
    // textFont(font);
    textSize(20);
    fill(100);
    text(word, firstButtonX1 + (firstButtonX2 - firstButtonX1)/2, firstButtonY1 + (firstButtonY2 - firstButtonY1)/2);
    //Stay in Main Menu if no option is selected
}

function showResults(){
    background(0);
    textAlign(CENTER,CENTER);
    textSize(50);
    text("Total Score: " + int(totalScore), screenWidth/2, screenHeight/3);
    if(numPoses*1000*0.8 < totalScore && totalScore <= numPoses*1000){
        textSize(35);
        text("Amazing! You're a natural at this!", screenWidth/2, screenHeight/3 + 50);
    }
    else if(numPoses*1000*0.4 < totalScore && totalScore <= numPoses*1000*0.8){
        textSize(35);
        text("Nice. You're pretty decent, I gotta say!", screenWidth/2, screenHeight/3 + 50);
    }
    else if(numPoses*1000*0.2 < totalScore && totalScore <= numPoses*1000*0.4){
        textSize(35);
        text("Hmm. Not bad.", screenWidth/2, screenHeight/3 + 50);
    }
    else{
        textSize(35);
        text("Do you... dance?", screenWidth/2, screenHeight/3 + 50);
    }

    text("\n\nPress SPACE to Return to Menu", screenWidth/4, 3*screenHeight/4, 2*screenWidth/4, 3*screenHeight/4);
}

// function displayBackground(){
//     var backNum = int(random(backgroundsNum));
//     imageMode(CENTER);
//     image(backgrounds[backNum], screenWidth/2, screenHeight/2);
// }

// ===================================================================================================
// ===================================================================================================
// Draw

function draw() {
    if(gameState == 0){
        startMenu();
    }
    else if (gameState == 1){
        instructions();
    }
    else if(gameState == 2){
        songSelect();
    }
    else if (gameState == 3){
        background(0);
        image(danceVid, 0, 0, videoWidth, videoHeight, 0, 0, danceVid.width, danceVid.height);
        if(isPaused){
            push();
            translate(camWidth, 0);
            scale(-1, 1);
            image(capture, 0, 0, camWidth, camHeight);
            if (poseData) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(poseData.keypoints, minPartConfidence, context);
                tmPose.drawSkeleton(poseData.keypoints, minPartConfidence, context); 
            }
            pop();
            textAlign(CENTER,CENTER);
            textSize(30);
            strokeWeight(4);
            stroke(0);
            fill(255);
            text("Press SPACE to Continue", screenWidth/2, screenHeight/2);
        }
        else{
            push();
            translate(camWidth, 0);
            scale(-1, 1);
            // image(capture, 0, 0, camWidth, camHeight);
            if (poseData) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(poseData.keypoints, minPartConfidence, context);
                tmPose.drawSkeleton(poseData.keypoints, minPartConfidence, context); 
            }
            pop();
            updatePose();
            etaPose = currentTimeStamp - danceVid.time();
            totalScore += 0.01;
        }        
        predict(); 
        strokeWeight(4);
        stroke(0);
        fill(255);
        textAlign(LEFT);
        textSize(20);
        text(topPrediction+": "+ poseProb + " | Score : "+ int(totalScore), 20, 30);
        // text("Score : "+ int(totalScore), 20, 30);

        danceVid.onended(function(){
            gameState = 4;
        });
    }
    if(gameState == 4){
        showResults();
    }
}

// ===================================================================================================
// ===================================================================================================
// Events

function mousePressed(event) {
    if (mouseButton == LEFT) {
        if ((gameState == 2) || gameState == 0) {
            mouseClicked = true;
        }
        else if (gameState == 3 && modelLoaded){
            if(isPaused){
                isPaused = !isPaused;
                danceVid.play();
            }
            else{
                isPaused = !isPaused;
                danceVid.pause();
            }
        }
    }
}

function mouseReleased() {
    //This is for the character selection screen
    if (mouseButton == LEFT) {
        if (gameState >= 2) {
            mouseReleased = true;
        }
        
    }
}

function keyReleased() {
    //SPACE -- RESET GAME
    if (keyCode == 32) {
        //Reset Game
        if (gameState == 1 || gameState == 2 || gameState == 4) {
            location.reload();
        }
        else if (gameState == 3 && modelLoaded){
            if(isPaused){
                isPaused = !isPaused;
                danceVid.play();
            }
            else{
                isPaused = !isPaused;
                danceVid.pause();
            }
            
        }
    }
}