
let startScreen = document.getElementById("startScreen");
let webPage = document.getElementById("outer_wrapper");

// View Width and Height. This, however, will have to be changed if the subscreen width
// is changed on CSS.
// https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

//============================================================================================
//============================================================================================
// Functions

// General fade in/out functions for elements
function fadeIn(elem, time = 500){
    $this = $(elem);
    $this.stop().fadeIn(time);
    elem.style.display = "flex";
}
function fadeOut(elem, time = 500){
    $this = $(elem);
    $this.stop().fadeOut(time);
}

// Functions for displaying and hiding film div
function filmIn(){
    var film = document.getElementById("filmDiv");
    //for initial appearance (since I set it as hidden in the beginning)
    if(film.style.display === "none"){
        film.style.display = "block";
    }
    $("#filmDiv").fadeIn();
    document.getElementById("mainFilm").play();
}
function filmOut(){
    var film = document.getElementById("filmDiv");
    var outer_wrapper = document.getElementById("outer_wrapper");

    if(film.style.display !== "none"){
        document.getElementById("mainFilm").load();       // reset film (can also use currentTime = 0)
        document.getElementById("mainFilm").pause();
        $("#filmDiv").fadeOut();
    }
    // displays the website if it isn't displaying already
    if(outer_wrapper.style.display === "none"){
        $("outer_wrapper").fadeIn();
    }
}

// Function to Move Right (button click)
function scrollRight(){
    var locX = window.scrollX + vw;
    window.scrollTo(locX,0);
    document.body.style.setProperty('--scroll',locX);
}

// Function to Move Left (button click)
function scrollL(){
    var locX = window.scrollX - vw;
    if(locX <= 0){
        window.scrollTo(0,0);
    }
    else{
        window.scrollTo(locX,0);
        document.body.style.setProperty('--scroll',locX);
    }
    
}

// This changes vertical scrolling to horizontal scrolling using the jquery script.
// Theoretically, this should work, since I'm converting the event difference directly into
// scrollLeft. And it did work. But for some reason, at one point it just kinda stopped.
// There is a possibility that it may be because I'm using a trackpad, rather than an actual scroll.
// mousewheel.min.js. Referenced from here: https://stackoverflow.com/questions/24639103/changing-vertical-scroll-to-horizontal
$(document).ready(function() {
    $('html, body, *').mousewheel(function(e, delta) {
    this.scrollLeft -= (delta * 60);
    document.body.style.setProperty('--scroll',window.scrollX);
    e.preventDefault();
    });
    });


// Function that retrieves the current Y offset and converts it into which subslide
// is being displayed; this is reflected in the navigation.


//============================================================================================
//============================================================================================
// Event Listeners

// This event listener updates the Y scroll. This will be used to update colors and
// for the navigation bar (so the program knows which slide the user is on).
window.addEventListener('scroll', function() {
    document.body.style.setProperty('--scroll',window.scrollX); 
  });

