
// Location Class (for selecting)
class Location {
    constructor(source){
        this.source = source;
        this.string = "";
    }

    setName(string){
        this.string = string;
    }
}

var locationArrayWrong = [];
var locationArrayRight = [];
var wrongCounter = 0;
var rightCounter = 0;
for(var i = 0; i < 4; i++){
    var temp = new Location("wrong"+i+".mp4");
    locationArrayWrong.push(temp);
}
for(var i = 0; i < 4; i++){
    var temp = new Location("right"+i+".mp4");
    locationArrayRight.push(temp);
}

var sceneArray = []; 

var choiceArray = [];



// Video Sequence. 
class Video {
    constructor(){
        this.type = type;       // types: 0 is normal (for animations, post-choice scenes, etc.), 1 and 2 are timed (choices)
        this.source = source;   // source of video
        this.nextSourceOne = "";
        this.nextSourceTwo = "";
        this.optionStringOne = "";
        this.optionStringTwo = "";
    }

    setSourcesOne(locationOne){
        this.nextSourceOne = locationOne.source;
        this.optionStringOne = locationOne.string;
    }

    setSourcesTwo(locationOne, locationTwo){
        this.nextSourceOne = locationOne.source;
        this.optionStringOne = locationOne.string;
        this.nextSourceTwo = locationTwo.source;
        this.optionStringTwo = locationTwo.string;
    }
}

function nextVideo(video){
    // if video file is a 'choice' 
    if(video.type == 1){
        // 
    }
}

