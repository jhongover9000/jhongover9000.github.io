
// ===================================================================================================
// ===================================================================================================
// Initialization

// Page Height & Width
var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
$('body').css("height","100vh");

// Video and Source
var vid = document.getElementById("vid");
var source = document.getElementById("videoSrc");

// Intro Scene
var sceneArray = []; 
var sceneCounter = 3;

// Location Selection
var choiceLayout
var locationArrayWrong = [];
var locationArrayRight = [];
var wrongCounter = 0;
var rightCounter = 0;
var locationType = 0;               // 0 is wrong, 1 is right
var jumpCount = 0;

// Ending
var endingSceneArray = [];

// Current Trackers
var currentSequence;
var nextSequence;
var currentSource = "intro0.mp4";
var nextSource = "intro1.mp4";
var isChoosing = false;
var isChoosingLoc = false;
var hiddenEnd = false;
var numChoices = 2;                                             // typically 2, but can be 1 (for endings)
var dialogueChoiceOne = "I'm your new Navigator.";              // dialogue choices
var dialogueChoiceTwo = "Your mom.";
var resultSourceOne = "intro2.mp4";
var resultSourceTwo = "intro3.mp4";

// ===================================================================================================
// ===================================================================================================
// Class Declarations

// Intro Scenes. Beginning is split up as sets of scene, choice select, then response.
class IntroScene {
    constructor(scene,choiceWait,resultSourceOne,resultSourceTwo){
        this.seqType = 0;
        this.internalCounter = 0;                   // keeps track of which video is being played
        this.maxCount = 2;
        
        this.scene = scene;                         // video of scene leading to choice

        this.choiceWait = choiceWait;               // waiting for dialogue select
        this.choiceOne = "";                        // dialog choices (strings)
        this.choiceTwo = "";
        this.resultSourceOne = resultSourceOne;     // resulting response 1
        this.resultSourceTwo = resultSourceTwo;     // resulting response 2

        this.allScenes = [scene,choiceWait,resultSourceOne,resultSourceTwo];

    }
    // set dialogue choices
    setChoices(choiceOne, choiceTwo){
        this.choiceOne = choiceOne;             
        this.choiceTwo = choiceTwo;
    }
}

// Wrong Location Video Sequence. Scene in, choice select, response, location select, scene out.
// ex) "wrong10, wrong11, wrong12, wrong13, wrong14" are a set.
class WrongLocation {
    constructor(jumpIn, choiceWait, resultSource, locationWait, jumpOut){
        this.seqType = 1;
        this.name = "";                         // name of location (for location select)
        this.internalCounter = 0;               // keeps track of which video is being played
        this.maxCount = 5;

        this.jumpIn = jumpIn;                   // animation of jump in + comment

        this.choiceWait = choiceWait;           // waiting for dialogue select
        this.choiceOne = "";                    // dialog choices (strings)
        this.choiceTwo = "";
        this.resultSource = resultSource;       // resulting response

        this.locationWait = locationWait;       // waiting for location select
        
        this.jumpOut = jumpOut;                 // animation of jump out

        this.allScenes = [jumpIn,choiceWait,resultSource,locationWait,jumpOut];
    }
    // set location name (appears in location selection)
    setName(name){
        this.name = name;
    }
    // set dialogue choices
    setChoices(choiceOne, choiceTwo){
        this.choiceOne = choiceOne;             
        this.choiceTwo = choiceTwo;
    }
}

// Right Location Video Sequence. Scene in, location select, scene out.
// ex) "right10, right11, right12" are a set
class RightLocation {
    constructor(jumpIn, locationWait, jumpOut){
        this.seqType = 2;
        this.name = "";                         // name of location (for location select)
        this.internalCounter = 0;               // keeps track of which video is being played
        this.maxCount = 2;

        this.jumpIn = jumpIn;                   // animation of jump in + comment
        this.locationWait = locationWait;       // waiting for location select
        this.jumpOut = jumpOut;                 // animation of jump out

        this.allScenes = [jumpIn,locationWait,jumpOut];
    }
    // set location name (appears in location selection)
    setName(name){
        this.name = name;
    }
}

class Ending {
    constructor(scene){
        this.seqType = 3;
        this.internalCounter = 0;
        this.maxCount = 0;
        this.scene = scene;
    }
}


// ===================================================================================================
// ===================================================================================================
// Video Class Creation

// Load Wrong Location Choices. Saves video URLs in sets of 5.
for(var i = 0; i < 4; i++){
    var temp = new WrongLocation("wrong"+String(i*10+0)+".mp4","wrong"+String(i*10+1)+".mp4",
    "wrong"+String(i*10+2)+".mp4","wrong"+String(i*10+3)+".mp4","wrong"+String(i*10+4)+".mp4");
    if(i == 0){
        temp.setName("Sushi Counter");
        temp.setChoices("There’s a bug.", "It’s an error.");
    }
    else if(i == 1){
        temp.setName("C2 Roof");
        temp.setChoices("There’s a bug.", "And what were you called?");
    }
    else if(i == 2){
        temp.setName("Marketplace");
        temp.setChoices("There’s a bug.", "How old are you?");
    }
    else if(i == 3){
        temp.setName("Under a Bridge");
        temp.setChoices("There’s a bug.", "It’s not my fault!");
    }
    locationArrayWrong.push(temp);
}

// Load Right Location Choices. Saves video URLs in sets of 3.
for(var i = 0; i < 4; i++){
    var temp = new RightLocation("right"+String(i*10+0)+".mp4","right"+String(i*10+1)+".mp4",
    "right"+String(i*10+2)+".mp4");
    if(i == 0){temp.setName("A3");}
    else if(i == 1){temp.setName("Highline (A5)");}
    else if(i == 2){temp.setName("Ampitheater");}
    else if(i == 3){temp.setName("Highline (A6)");}
    locationArrayRight.push(temp);
}

// Load Intro. Save video URLs in sets of 4.
for(var i = 0; i < 4; i++){
    var temp = new IntroScene("intro"+String(i*10+0)+".mp4","intro"+String(i*10+1)+".mp4",
    "intro"+String(i*10+2)+".mp4","intro"+String(i*10+3)+".mp4");

    if(i == 0){temp.setChoices("I’m your new Navigator.", "Your mom.");}
    else if(i == 1){temp.setChoices("I am. Trust me.", "Screw what you think.");}
    // this bit needs an additional video with a different title (as it has the same response)
    else if(i == 2){temp.setChoices("Yes.", "Bring it.");}
    else if(i == 3){temp.setChoices(locationArrayRight[0].name, locationArrayWrong[0].name)}

    sceneArray.push(temp);
}

// Load End Scenes.
for(var i = 0; i < 4; i++){
    var temp = new Ending("end"+i+".mp4");

    endingSceneArray.push(temp);
}

currentSequence = sceneArray[sceneCounter];

// ===================================================================================================
// ===================================================================================================
// Functions

// Scene. Choice. Scene. Choice. Scene. Choice.
function updateVideo(){

    // Intro Scene
    if(sceneCounter < 4){
        // checks if still in first 3 scenes (4th is the first location select)
        if(sceneCounter < 4){
            playSequence();
        }
        // location selections start here
        else if(sceneCounter >= 4){
            // check if D2 has been reached or if all jumps have been used
            if(ended()){
                console.log("ended!");
            }
            else{
                sceneCounter++;
                currentSequence = nextSequence;
                // update the internal count (back to 0) and update source
                internalCount = currentSequence.internalCounter;
                currentSource = currentSequence.allScenes[internalCount];

                // increment the INTERNAL COUNTER (not internalCount)
                currentSequence.internalCounter++;
            }
        }
    }
    else{
        playSequence();
    }
    
    source.src = currentSource;
    console.log(currentSource);
    vid.load();
    vid.play();
}


function playSequence(){
    var internalCount = currentSequence.internalCounter;
            // checks the current sequence (class) to see if it's completed.
            if(internalCount <= currentSequence.maxCount){
                // if first scene of entire video, don't update source, only increment internal counter
                if(internalCount != 1 && internalCount != 3){
                    // update the current source to the next video to be played
                    currentSource = currentSequence.allScenes[internalCount];

                    // increment the INTERNAL COUNTER (not internalCount)
                    currentSequence.internalCounter++;
                }
                // if scene is the last of intro OR a right location (consists of scene, loc select, exit)
                else if((sceneCounter == 3 || locationType == 1) && internalCount == 1){
                    
                    // choose location
                    locationSelect(currentSequence.choiceOne, currentSequence.choiceTwo);

                }
                // if dialogue selection
                else if(internalCount == 1){
                    isChoosing = true;
                    // display choice selection
                    $("#timeBar").css({"width":"100vw"});
                    $("#choiceSelect").css({"display":"flex"});
                    $("#choiceOneText").html(currentSequence.choiceOne);
                    $("#choiceTwoText").html(currentSequence.choiceTwo);

                    // update the current source to the next video to be played
                    currentSource = currentSequence.allScenes[internalCount];
                    // increment the INTERNAL COUNTER (not internalCount)
                    currentSequence.internalCounter++;
                }
                // location selection
                else if(internalCount == 3){
                    // display choice selection
                    $("#timeBar").css({"width":"100vw"});
                    $("#choiceSelect").css({"display":"flex"});
                    locationSelect(locationArrayRight[rightCounter].name, locationArrayWrong[wrongCounter].name);
                }
            }
            // if all videos in the sequence have been completed, go to next sequence
            else{
                sceneCounter++;
                if(sceneCounter > 3){
                    console.log("next sequence")
                    currentSequence = nextSequence;
                    console.log(nextSequence);
                }
                else{
                    console.log("still in scene")
                    currentSequence = sceneArray[sceneCounter];
                }
                
                console.log(currentSequence);
                // update the internal count (back to 0) and update source
                internalCount = currentSequence.internalCounter;
                currentSource = currentSequence.allScenes[internalCount];

                // increment the INTERNAL COUNTER (not internalCount)
                currentSequence.internalCounter++;
            }
}

function updateInternalCounter(){
    // update the internal count (back to 0) and update source
    var internalCount = currentSequence.internalCounter;
    currentSource = currentSequence.allScenes[internalCount];

    // increment the INTERNAL COUNTER (not internalCount)
    currentSequence.internalCounter++;
}

function locationSelect(choiceA, choiceB){
    var internalCount = currentSequence.internalCounter;
    isChoosingLoc = true;
    // display choice selection
    $("#timeBar").css({"width":"100vw"});
    $("#choiceSelect").css({"display":"flex"});

    // randomizes the selection layout of locations
    choiceLayout = Math.floor(Math.random()*2);
    if(choiceLayout == 0){
        $("#choiceOneText").html(choiceA);
        $("#choiceTwoText").html(choiceB);
    }
    else{
        $("#choiceOneText").html(choiceB);
        $("#choiceTwoText").html(choiceA);
    }

    // update the current source to the next video to be played
    currentSource = currentSequence.allScenes[internalCount];
    // increment the INTERNAL COUNTER (not internalCount)
    currentSequence.internalCounter++;
}

// Check if D2 has been reached, or if all jumps have been used, or if hidden ending is achieved.
function ended(){
    return (jumpCount == 7 || rightCounter == 4 || hiddenEnd);
}


// Select First Choice.
function selectFirst(){
    console.log("Selected Choice 1.");
    var internalCount = currentSequence.internalCounter;
    // if in dialogue selection
    if(isChoosing){
        // update the current source to the next video to be played
        currentSource = currentSequence.allScenes[internalCount];
        
        // if the sequence is an intro scene
        if(currentSequence.seqType = 0){
            // increment the INTERNAL COUNTER (not internalCount) twice (to get past responses)
            currentSequence.internalCounter+=2;
        }
        // else, the sequence is a wrong location (only one response)
        else{
            currentSequence.internalCounter++;
        }
        isChoosing = false;

        console.log(currentSource);
        vid.load();
        vid.play();
    }
    // if selecting location
    else if(isChoosingLoc){

        // if layout is right, wrong, select right
        if(choiceLayout == 0){
            locationType = 1;
            // update next sequence to right location, then increment counter
            nextSequence = locationArrayRight[rightCounter];
            rightCounter++;
        }
        // else if layout is wrong, right, select wrong
        else{
            locationType = 0;
            // update next sequence to wrong location, then increment counter
            nextSequence = locationArrayWrong[wrongCounter];
            wrongCounter++;

            // if you've selected the last wrong location (random coordinate) you get the hidden ending
            if(wrongCounter == 4){
                hiddenEnd = true;
            }
        }

        // increment jump count by 1
        jumpCount++;

        // location selection is different as it doesn't update the current source
        isChoosingLoc = false;
        console.log(currentSource);
        vid.load();
        vid.play();
    }
    $("#choiceSelect").css({"display":"none"});
}


// Select Second Choice.
function selectSecond(){
    console.log("Selected Choice 2.");
    var internalCount = currentSequence.internalCounter;
    // if in dialogue selection
    if(isChoosing){
        // update the current source to the next, NEXT video to be played
        currentSource = currentSequence.allScenes[internalCount+1];

        // if the sequence is an intro scene
        if(currentSequence.seqType = 0){
            // increment the INTERNAL COUNTER (not internalCount) twice (to get past responses)
            currentSequence.internalCounter+=2;
        }
        // else, the sequence is a wrong location (only one response)
        else{
            currentSequence.internalCounter++;
        }
        isChoosing = false;

        console.log(currentSource);
        vid.load();
        vid.play();
    }

    // if selecting location
    else if(isChoosingLoc){
        // if layout is right, wrong, select wrong
        if(choiceLayout == 0){
            locationType = 0;
            // update next sequence to wrong location, then increment counter
            nextSequence = locationArrayWrong[wrongCounter];
            wrongCounter++;

            // if you've selected the last wrong location (random coordinate) you get the hidden ending
            if(wrongCounter == 4){
                hiddenEnd = true;
            }
        }
        // else if layout is wrong, right, select right
        else{
            locationType = 1;
            // update next sequence to right location, then increment counter
            nextSequence = locationArrayRight[rightCounter];
            rightCounter++;
        }

        // increment jump count by 1
        jumpCount++;

        // location selection is different as it doesn't update the current source
        isChoosingLoc = false;
        console.log(currentSource);
        vid.load();
        vid.play();
    }
    $("#choiceSelect").css({"display":"none"});
}

// ===================================================================================================
// ===================================================================================================
// Event Listeners

$("#choiceOne").on("click", function(){
    selectFirst();
});
$("#choiceTwo").on("click", function(){
    selectSecond();
});

$(document).ready(function(){
    updateVideo();
});

vid.addEventListener('ended', function(){
    $("#timeBar").css({"width":"100vw"});
    $("#choiceSelect").css({"display":"none"});
    // autoselect randomly
    if(isChoosingLoc){
        choiceLayout = Math.floor(Math.random()*2);
        if(choiceLayout == 0){
            selectFirst();
        }
        else{
            selectSecond();
        }
        isChoosingLoc = false;
    }
    // autoselect first option
    else if(isChoosing){
        selectFirst();
        isChoosing = false;
    }
    updateVideo();
});

vid.addEventListener('playing', function(){
    var durationTime = vid.duration*1000;
    $("#timeBar").animate({"width":"0"},durationTime);
});

