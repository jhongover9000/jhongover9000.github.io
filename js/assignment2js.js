// IM Assignment 2: a love letter. (JavaScript)

//=================================================================================================
//=================================================================================================
// Variables

// Page Height & Width
var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

// Number of Elements on Page
var imgPanelCount = $(".imgPanel").length;
var txtPanelCount = $(".txtPanel").length;
var quarterGutterCount = $(".gutterQuarter").length;
var halfGutterCount = $(".gutterFull").length;
var fullGutterCount = $(".gutterFull").length;

console.log(imgPanelCount);
console.log(txtPanelCount);
console.log(quarterGutterCount);
console.log(halfGutterCount);
console.log(fullGutterCount);


// Full Page Length (using CSS variables)
var fullPage = ( ($("body").css("--imgPanelWidth")/100 * imgPanelCount) + ($("body").css("--txtPanelWidth")/100 * txtPanelCount) + ($("body").css("--quarterGutterWidth")/100 * quarterGutterCount) + ($("body").css("--halfGutterWidth")/100 * halfGutterCount) + ($("body").css("--fullGutterWidth")/100 * fullGutterCount) );
var fullPageLength = fullPage * vw;

console.log(fullPageLength);
$("body").css("--wrapperWidth", fullPageLength + "px");

console.log($("body").css("--wrapperWidth"));

// $(.class).length

// Variables for Plane Animation/Update
var initialHeight = parseInt($("#paperPlane").css("top"),10);
var initialX = parseInt($("#paperPlane").css("left"),10);


//=================================================================================================
//=================================================================================================
// Functions

// Move Right (button click)
function scrollR(){
    var locX = window.scrollX + vw;
    window.scrollTo(locX,0);
    document.body.style.setProperty("--scroll",locX);
}

// Move Left (button click)
function scrollL(){
    var locX = window.scrollX - vw;
    if(locX <= 0){
        window.scrollTo(0,0);
    }
    else{
        window.scrollTo(locX,0);
        document.body.style.setProperty("--scroll",locX);
    }
    
}


//=================================================================================================
//=================================================================================================
// Updaters and Event Listeners

// Main Event Listener (when website is ready)
$(document).ready(function() {
    
    // Conversion of Vertical to Horizontal Scroll
    $('html, body, *').mousewheel(function(e, delta) {
    this.scrollLeft -= (delta);
    e.preventDefault();
      });
});

window.onload = function() {
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
}

// Scroll Event Listener
document.addEventListener("scroll", function(){
    // Updating the scroll variable in CSS
    document.body.style.setProperty("--scroll", window.scrollX);

    // Plane Animation/Location Updates
    var scrollX = document.body.style.getPropertyValue("--scroll");
    var newY = initialHeight + (vh/1.6)*(scrollX/fullPageLength) + "px";
    console.log(initialHeight);
    console.log(initialX);
    if(scrollX == 0 ){
        $("#paperPlane").css({"animation":"shudder 100s infinite alternate"});
    }
    // Until last image panel, paper plane will move forward and down. This changed from the initial plan of only making it move forward at the end (which also worked, but didn't give as much sense of movement)
    else if(0 < scrollX && scrollX < (fullPageLength - window.innerWidth * 2) ){
        $("#paperPlane").css({"animation":"shudder 4s infinite alternate"});
        var newX = initialX + (window.innerWidth/2.5)*((scrollX)/fullPageLength) + "px";
        $("#paperPlane").css({"top": newY});
        $("#paperPlane").css({"left": newX});
    }
    // Starting from last two panels, scrolling will move the plane forward as well
    else if((fullPageLength - window.innerWidth * 2) <= scrollX && scrollX < fullPageLength){
        
        // Originally was going to make the plane move forward only at the end
        // var newX = initialX + (window.innerWidth/2.5)*((scrollX - (fullPageLength - window.innerWidth * 2))/(window.innerWidth * 2)) + "px";
        
        // Updated code relfects the one above (so there isn't much difference, but I left this for possible improvement where the plane moves forward faster in this section)
        var newX = initialX + (window.innerWidth/2.5)*((scrollX)/fullPageLength) + "px";        
        $("#paperPlane").css({"animation":"shudder 4s infinite alternate"});
        $("#paperPlane").css({"top": newY});
        $("#paperPlane").css({"left": newX});
    }
    // At the end, the plane will come to a stop (well it will move, just really slowly)
    else if(scrollX == fullPageLength){
        $("#paperPlane").stop();
        $("#paperPlane").css({"animation":"shudder 100s infinite alternate"});
    }
});