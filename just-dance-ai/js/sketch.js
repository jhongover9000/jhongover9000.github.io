// How You Like That
// https://teachablemachine.withgoogle.com/models/uehtSDJpy/
// Say So
// https://teachablemachine.withgoogle.com/models/SwOKCzLAF/
// const imageModelURL = "https://teachablemachine.withgoogle.com/models/uehtSDJpy/";

// // Game Variables
// let numPoses = 0;
// let currentPoseIndex = 0;
// let poseTimeStamps = [];
// let poseScreenshots = [];

// let danceVideo;

// let timeToPose = 3;       // scoring starts 3 seconds before image aligns with video

// let poseNet;
// let video, topPrediction, numClasses, poseData, context, poseProb
// let videoWidth = 1080
// let videoHeight = 720

// // Initialize Model
// function preload() {
//     // load model
//     poseNet = ml5.poseNet(imageModelURL + 'model.json');
    
// }

// function setup() {
//     const canvas = createCanvas(windowWidth, windowHeight);
//     // danceVideo = createVideo();
//     video = createCapture(VIDEO);
//     video.size(videoWidth, videoHeight)
//     video.hide()
    
//     textSize(20)
    
//     poseNet.on('pose', getPose);
//     // init()
// }

// function setupCamera() {
//     // Create the video
//     video = createCapture(VIDEO);
//     video.size(videoWidth, videoHeight)
//     video.hide()
//     flippedVideo = ml5.flipImage(video)
//     // Start classifying
//     // classifyVideo();
// }



// // Predict Pose
// function getPose(poses) {
//     console.log(poses[0]);
//     topPrediction = poses[0].label;
//     let highestProbability = 0
//     let highestIndex
//     highestProbability = topPrediction.probability;
//     // predictions.forEach((item, index) => {
//     //     if (item.probability > highestProbability) {
//     //         highestProbability = item.probability
//     //         highestIndex = index
//     //     }
//     // })
    
//     poseData = pose
//     topPrediction = predictions[highestIndex].className
//     poseProb = highestProbability
// }





// function draw() {
//     background(150);
    
//     imageMode(CORNER)
//     push()
//     translate(videoWidth, 0);
//     scale(-1, 1);
//     image(video, 0, 0, videoWidth, videoHeight)

//     if (poseData) {
//         console.log("Working.");
//         const minPartConfidence = 0.5;
//         poseNet.drawKeypoints(poseData.keypoints, minPartConfidence, context);
//         poseNet.drawSkeleton(poseData.keypoints, minPartConfidence, context); 
//     }
//     pop()
    
//     /************************
//     Add class logic here
//     ************************/
//     strokeWeight(4)
//     stroke(0)
//     fill(255)
//     text(topPrediction+" "+poseProb, 20, 30)
    
    
    
    

// }


    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/_DQlkdzHW/";
    let model, webcam, ctx, labelContainer, maxPredictions;

    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const size = 200;
        const flip = true; // whether to flip the webcam
        webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append/get elements to the DOM
        const canvas = document.getElementById("canvas");
        canvas.width = size; canvas.height = size;
        ctx = canvas.getContext("2d");
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
        const prediction = await model.predict(posenetOutput);

        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
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