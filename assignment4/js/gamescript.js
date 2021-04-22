
// Assignment 4: fly me to the moon. (JS - Game Script)
// Description: This is the JS script for the game content of the website.
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
var isPlaying = true;

// Intro Scene
var sceneArray = []; 
var sceneCounter = 0;

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
var hasEnded = false;
var isFinished = false;
var creditsSource = "credits.mp4"
var allDone = false;

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
        this.maxCount = 4;

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
        temp.setChoices("There’s a.. bug of some kind.", "It’s an error.");
    }
    else if(i == 1){
        temp.setName("C2 Roof");
        temp.setChoices("There’s a bug.", "And what were you called?");
    }
    else if(i == 2){
        temp.setName("Marketplace");
        temp.setChoices("Something's wrong!", "How old are you?");
    }
    else if(i == 3){
        temp.setName("Under a Bridge");
        temp.setChoices("There’s a bug in the system!", "It’s not my fault!");
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
for(var i = 0; i < 3; i++){
    var temp = new Ending("ending"+i+".mp4");
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
        var internalCount = currentSequence.internalCounter;
        // checks if still in first 3 scenes (4th is the first location select)
        if(sceneCounter < 4){
            // checks the current sequence (class) to see if it's completed.
            if(internalCount <= currentSequence.maxCount){
                // if first scene of entire video, don't update source, only increment internal counter
                if(internalCount != 1 && internalCount != 3){
                    // update the current source to the next video to be played
                    updateSource(internalCount);
                }
                // if scene is the last of intro OR a right location (consists of scene, loc select, exit)
                else if(sceneCounter == 3 && internalCount == 1){
                    // choose location
                    locationSelect(currentSequence.choiceOne, currentSequence.choiceTwo);
                    updateSource(internalCount);
                }
                // if dialogue selection
                else if(internalCount == 1){
                    dialogSelect(currentSequence.choiceOne, currentSequence.choiceTwo);
                    // update the current source to the next video to be played
                    updateSource(internalCount);
                }
            }
            // if all videos in the sequence have been completed, go to next sequence
            else{
                sceneCounter++;
                if(sceneCounter > 3){
                    currentSequence = nextSequence;
                    internalCount = currentSequence.internalCounter;
                    currentSource = currentSequence.allScenes[internalCount];
                }
                else{
                    $("#locationsTab").fadeIn();
                    currentSequence = sceneArray[sceneCounter];
                    // update the internal count (back to 0) and update source
                    internalCount = currentSequence.internalCounter;
                    updateSource(internalCount);
                }
                
            }
        }
        
    }
    // location selections start here
    if(jumpCount >= 1){
        // check if D2 has been reached or if all jumps have been used
        if(isEnding()){
            console.log("Ending Soon!");
            var internalCount = currentSequence.internalCounter;
            // there's actually 1 more step if you get 3 correct jumps
            if(rightCounter == 4 && internalCount == 1){
                // only one option, 'D2'
                isChoosingLoc = true;
                $("#choiceOne").css({"animation":"none"});
                $("#choiceTwo").css({"animation":"none"});
                $("#timeBar").css({"width":"80vw"});
                $("#choiceSelect").css({"display":"flex"});
                $("#choiceOneText").html("D2");
                $("#choiceTwo").css({"display":"none"});
                updateSource(internalCount);
            }
            else if(rightCounter < 4 && (internalCount < 3)){
                updateSource(internalCount);
            }
            // if ended, then play ending. afterwards, play credits
            else{
                if(isFinished){
                    currentSource = creditsSource;
                    $("#restart").fadeIn();
                    allDone = true;
                }
                // best ending. got rid of due to time constraints in editing.
                // else if(rightCounter == 5 && jumpCount == 5){
                //     console.log("Best Ending!");
                //     currentSource = endingSceneArray[0].scene;
                // }
                // okay ending (every other situation if you reach D2)
                else if(rightCounter == 5){
                    // console.log("Second Best Ending!");
                    currentSource = endingSceneArray[0].scene;
                }
                // bad ending
                else if(jumpCount >= 7){
                    // console.log("Bad Ending :(");
                    currentSource = endingSceneArray[1].scene;
                }
                // hidden ending (overwrites bad ending, if applicable)
                if(hiddenEnd && !isFinished){
                    // console.log("Hidden Ending :o");
                    currentSource = endingSceneArray[2].scene;
                }
                isFinished = true;
            }
        }
        // otherwise, you keep going
        else{
            var internalCount = currentSequence.internalCounter;
            // checks the current sequence (class) to see if it's completed.
            if(internalCount <= currentSequence.maxCount){
                // if internal count is 1, it's either dialog (wrong) or location selection (right)
                if(internalCount == 1){
                    // if right location, go to location select
                    if(locationType == 1){
                        // if on the final scene, you have the choice to type in a random coordinate
                    if(wrongCounter == 4){
                        // console.log("Location Select.");
                        locationSelect(locationArrayRight[rightCounter].name, "Type in a Random Coordinate.");
                        updateSource(internalCount);
                    }
                    else{
                        // console.log("Location Select.");
                        locationSelect(locationArrayRight[rightCounter].name, locationArrayWrong[wrongCounter].name);
                        updateSource(internalCount);
                    }
                    }
                    // if wrong location, go to dialog select
                    else{
                        // console.log("Dialog Select.");
                        dialogSelect(currentSequence.choiceOne, currentSequence.choiceTwo);
                        updateSource(internalCount);
                    }
                    
                }
                // else if 3 (wrong location only), go to location select
                else if(internalCount == 3){
                    // if on the final wrong location, you have the choice to type in a random coordinate
                    if(wrongCounter == 4){
                        // console.log("Location Select.");
                        locationSelect(locationArrayRight[rightCounter].name, "Type in a Random Coordinate.");
                        updateSource(internalCount);
                    }
                    else{
                        // console.log("Location Select.");
                        locationSelect(locationArrayRight[rightCounter].name, locationArrayWrong[wrongCounter].name);
                        updateSource(internalCount);
                    }
                    
                }
                // otherwise just play through as usual
                else{
                    // update the current source to the next video to be played
                    updateSource(internalCount);
                }
            }
            // if at the end of a sequence, change to the next sequence
            else{
                console.log("changing sequence!");
                currentSequence = nextSequence;
                internalCount = currentSequence.internalCounter;
                // update the current source to the next video to be played
                updateSource(internalCount);
            }
        }
    }
    
    source.src = currentSource;
    // console.log(currentSource);
    vid.load();
    vid.play();
}


// Check if D2 is 1 stop away, if all jumps have been used, or if hidden ending is achieved.
function isEnding(){
    return (jumpCount == 7 || (rightCounter == 4 && (currentSequence.internalCounter == 1)) || rightCounter == 5 || hiddenEnd);
}

// Update Video Source.
function updateSource(internalCount){
    // update the internal count (back to 0) and update source
    currentSource = currentSequence.allScenes[internalCount];
    // increment the INTERNAL COUNTER (not internalCount)
    currentSequence.internalCounter++;
}

// Select Dialog Option.
function dialogSelect(choiceA, choiceB){
    isChoosing = true;
    // display choice selection
    $("#choiceOne").css({"animation":"none"});
    $("#choiceTwo").css({"animation":"none"});
    $("#timeBar").css({"width":"80vw"});
    $("#choiceSelect").css({"display":"flex"});
    $("#choiceOneText").html(choiceA);
    $("#choiceTwoText").html(choiceB);
}

// Select Location Option.
function locationSelect(choiceA, choiceB){
    // display choice selection
    $("#choiceOne").css({"animation":"none"});
    $("#choiceTwo").css({"animation":"none"});
    $("#timeBar").css({"width":"80vw"});
    $("#choiceSelect").css({"display":"flex"});
    var internalCount = currentSequence.internalCounter;
    isChoosingLoc = true;
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
}


// Select First Choice.
function selectFirst(){
    console.log("Selected Choice 1.");
    var internalCount = currentSequence.internalCounter;
    // if in dialogue selection
    if(isChoosing){
        // if the sequence is an intro scene, update source to next scene and increment counter twice
        if(currentSequence.seqType == 0){
            updateSource(internalCount);
            currentSequence.internalCounter++;
        }
        // if sequence is a wrong location (only one response available), update source
        else{
            updateSource(internalCount);
        }
        // console.log(currentSource);
        isChoosing = false;
        source.src = currentSource;
        vid.load();
        vid.play();
    }
    // if selecting location
    else if(isChoosingLoc){
        // console.log("Layout: "+String(choiceLayout));
        // if layout is right, wrong, select right
        if(choiceLayout == 0){
            // update next sequence to right location, then increment counter
            locationType = 1;
            nextSequence = locationArrayRight[rightCounter];
            rightCounter++;
        }
        // else if layout is wrong, right, select wrong
        else if(choiceLayout == 1){
            // update next sequence to wrong location, then increment counter
            locationType = 0;
            nextSequence = locationArrayWrong[wrongCounter];
            wrongCounter++;
            // if you've selected the last wrong location (random coordinate) you get the hidden ending
            if(wrongCounter == 5){
                hiddenEnd = true;
            }
        }
        // update the current source to the next video to be played (transition animation)
        updateSource(internalCount);
        // increment jump count by 1, load, and play
        jumpCount++;
        console.log(currentSource);
        isChoosingLoc = false;
        source.src = currentSource;
        vid.load();
        vid.play();
    }
    // remove timer
    $("#choiceOne").css({"animation":"selected 1s"});
    $("#choiceSelect").fadeOut();
}


// Select Second Choice.
function selectSecond(){
    console.log("Selected Choice 2.");
    var internalCount = currentSequence.internalCounter;
    // if in dialogue selection
    if(isChoosing){
        // if the sequence is an intro scene
        if(currentSequence.seqType == 0){
            // update the current source to the next, NEXT video to be played
            currentSource = currentSequence.allScenes[internalCount+1];
            // increment the INTERNAL COUNTER (not internalCount) twice (to get past responses)
            currentSequence.internalCounter+=2;
        }
        // else, the sequence is a wrong location (only one response)
        else{
            // update the current source to the next video to be played
            updateSource(internalCount);
        }
        isChoosing = false;
        
        source.src = currentSource;
        vid.load();
        vid.play();
    }
    // if selecting location
    else if(isChoosingLoc){
        // console.log("Layout: "+String(choiceLayout));
        // if layout is right-wrong, select wrong
        if(choiceLayout == 0){
            // update next sequence to wrong location, then increment counter
            locationType = 0;
            nextSequence = locationArrayWrong[wrongCounter];
            wrongCounter++;
            // if you've selected the last wrong location (random coordinate) you get the hidden ending
            if(wrongCounter == 5){
                hiddenEnd = true;
            }
        }
        // else if layout is wrong-right, select right
        else{
            // update next sequence to right location, then increment counter
            locationType = 1;
            nextSequence = locationArrayRight[rightCounter];
            rightCounter++;
        }
        // update the current source to the next video to be played (transition animation)
        updateSource(internalCount);
        // increment jump count by 1, load, and play
        jumpCount++;
        isChoosingLoc = false;
        // console.log(currentSource);
        source.src = currentSource;
        vid.load();
        vid.play();
    }
    // remove timer
    $("#choiceTwo").css({"animation":"selected 1s"});
    $("#choiceSelect").fadeOut();
}

// Select Only Option. Displayed at end of right locations (behind D2).
function selectOnly(){
    var internalCount = currentSequence.internalCounter;
    rightCounter++;
    isChoosingLoc = false;
    updateSource(internalCount);
    console.log(currentSource);
    vid.load();
    vid.play();
    // remove timer
    $("#choiceOne").css({"background-color":"white"}).delay(500);
    $("#choiceSelect").fadeOut();
}

// ===================================================================================================
// ===================================================================================================
// Event Listeners

$("#choiceOne").on("click", function(){
    if(rightCounter == 4){
        selectOnly();
    }
    else if(sceneCounter > 2){
        selectSecond();
    }
    else{
        selectFirst();
    }
    
});
$("#choiceTwo").on("click", function(){
    if(rightCounter == 4){
        selectOnly();
    }
    else if(sceneCounter > 2){
        selectFirst();
    }
    else{
        selectSecond();
    }
    
});

$(document).ready(function(){
    updateVideo();
});

$("#locationsTab").hover(function(){
    $("#locationList").css({"animation":"slideIn 1s forwards"});
}, function(){
    $("#locationList").css({"animation":"slideOut 1s forwards"});
});

// This interfered with the video playing so I got rid of it.
// $("#playTab").click(function(){
//     if(isPlaying){
//         vid.pause();
//         $("#playTab").html("Play");
//     }
//     else{
//         vid.play();
//         $("#playTab").html("Pause");
//     }
// });

vid.addEventListener('ended', function(){
    $("#choiceSelect").fadeOut();
    if(allDone){
        $("#fixedElements").fadeIn();
        vid.pause();
    }
    // autoselect randomly if location selection
    else if(isChoosingLoc){
        var rand = Math.floor(Math.random()*2);
        if(rand == 0){
            selectFirst();
        }
        else{
            selectSecond();
        }
    }
    // autoselect first option if dialogue
    else if(isChoosing){
        selectFirst();
    }
    // otherwise update the video
    else{
        updateVideo();
    }
    
});

vid.addEventListener('play', function(){
    console.log("currentSource: " +String(currentSource));
    // console.log("internalCount: "+String(currentSequence.internalCounter));
    console.log("rightCount: "+String(rightCounter));
    console.log("wrongCount: "+String(wrongCounter));
    console.log("jumpCount: " +String(jumpCount));
})

vid.addEventListener('playing', function(){ 
    if(isChoosingLoc || isChoosing){
        var durationTime = vid.duration*1000;
        $("#timeBar").animate({"width":"0"},durationTime);
    }
});

