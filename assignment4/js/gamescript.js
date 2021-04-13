// 

// Variables
var sceneArray = []; 
var sceneCounter = 0;
var choiceArray = [];
var choiceCounter = 0;

var vid = document.getElementById("vid");
var source = document.getElementById("videoSrc");

var locationArrayWrong = [];
var locationArrayRight = [];
var wrongCounter = 0;
var rightCounter = 0;
var jumpCount = 0;

var currentScene = "scene0.mp4";    // current scene
var isChoosing = false;             // passive vs active scene
var numChoices = 2;                 // typically 2, but can be 1 (for endings)
var dialogueChoiceOne;              // dialogue choices
var dialogueChoiceTwo;

// Choice (Singular).
class Choice {
    constructor(resultSource){
        this.resultSource = resultSource;               // resulting video
        this.choiceString = "";             // option name
    }
    setName(choiceString){
        this.choiceString = choiceString;
    }
}
// Choice Selection.
class ChoiceSelect {
    constructor(vidURL, choiceOne, choiceTwo){
        this.vidURL = vidURL;
        this.choiceOne = choiceOne;
        this.choiceTwo = choiceTwo;
    }
}

// Wrong Location Video Sequence. Scene in, choice select, response, location select, scene out.
// ex) "wrong10, wrong11, wrong12, wrong13, wrong14" are a set
class WrongLocation {
    constructor(jumpIn, choiceWait, resultSource, locationWait, jumpOut){
        this.name = "";                         // name of location (for location select)
        this.internalCounter = 0;               // keeps track of which video is being played
        this.jumpIn = jumpIn;                   // animation of jump in + comment

        this.choiceWait = choiceWait;           // waiting for dialogue select
        this.choiceOne = "";                    // dialog choices (strings)
        this.choiceTwo = "";
        this.resultSource = resultSource;       // resulting response

        this.locationWait = locationWait;       // waiting for location select
        this.jumpOut = jumpOut;                 // animation of jump out
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
        this.name = "";                         // name of location (for location select)
        this.internalCounter = 0;               // keeps track of which video is being played
        this.jumpIn = jumpIn;                   // animation of jump in + comment
        this.locationWait = locationWait;       // waiting for location select
        this.jumpOut = jumpOut;                 // animation of jump out
    }
    // set location name (appears in location selection)
    setName(name){
        this.name = name;
    }
}

// Load Scenes. 0-3 are in intro, 4-7 are endings.
for(var i = 0; i < 9; i++){
    sceneArray.push("scene"+i+".mp4");
}

// Load Choices (for intro and wrong locations).
for(var i = 0; i < 6; i++){
    var temp = new Choice("choice"+i+".mp4");

    if(i == 0){temp.setName("I’m your new Navigator.");}
    else if(i == 1){temp.setName("Your mom.");}

    else if(i == 2){temp.setName("I am. Trust me.");}
    else if(i == 3){temp.setName("Screw what you think.");}

    // These choices lead to the same response, meaning the same video file needs to be duplicated.
    else if(i == 4){temp.setName("Yes.");}
    else if(i == 5){temp.setName("Bring it.");}
}

// Load Wrong Location Choices. Saves video URLs in sets of i*10 + 0~4.
for(var i = 0; i < 4; i++){
    var temp = new WrongLocation("wrong"+i*10+0+".mp4","wrong"+i*10+1+".mp4",
    "wrong"+i*10+2+".mp4","wrong"+i*10+3+".mp4","wrong"+i*10+4+".mp4");
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

// Load Right Location Choices.
for(var i = 0; i < 4; i++){
    var temp = new Location("right"+i*10+0+".mp4","right"+i*10+1+".mp4",
    "right"+i*10+2+".mp4");
    if(i == 0){temp.setName("A3");}
    else if(i == 1){temp.setName("Highline (A5)");}
    else if(i == 2){temp.setName("Ampitheater");}
    else if(i == 3){temp.setName("Highline (A6)");}
    locationArrayRight.push(temp);
}

// Scene. Choice. Scene. Choice. Scene. Choice.
function updateVideo(){
    if(sceneCounter < 4){
        sceneCounter++;
    }
    else{
        if(jumpCount > 5){
            // good ending. managed to get to D2 in 7 jumps.
            if(rightCounter == 5){
                sceneCounter = 5;
            }
            // terrible ending. failed with less than half correct.
            else if (jumpCount == 7){
                sceneCounter = 6;
            }
        }
        // best ending. get everything right.
        else if(rightCounter == 5 && jumpCount == 5){
            sceneCounter = 4;
        }
        // hidden ending. get everything wrong.
        else if(wrongCounter == 5 && jumpCount == 5){
            sceneCounter = 7;
        }
    }

    if(isChoosing){

    }

    var newScene;

    source.src = newScene;
    vid.load();
    vid.play();
}

vid.addEventListener('ended',)