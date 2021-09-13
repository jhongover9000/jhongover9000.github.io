// A.r.t. Intel Project 1: Mind Over Matter.
// Description: This is the JS script for the website. All it does really is load the partials.
// ===================================================================================================
// ===================================================================================================
// Variables
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

// ===================================================================================================
// ===================================================================================================
// Event Listeners

// when document is ready
$(document).ready(function(){
    document.scrollY = 0;
    // Loads the NavBar & Footer (for reuse). Referenced from https://stackoverflow.com/questions/31954089/how-can-i-reuse-a-navigation-bar-on-multiple-pages.
    $("#navBarPlaceholder").load("partials/navBar.html");
    $("#footerPlaceholder").load("partials/footer.html");
    
});

// scroll down button
$("#scrollDown").click(function(){
    window.scrollTo(0, 1.1*vh);
});


// ===================================================================================================
// ===================================================================================================
// functions

// show page after startup video ends
function showPage(){
    $("#start-video").css("display","none");
    $("#start-video-div").css({"background-color":"black"}, 1000).css({"opacity":"0", "display":"none"}, 1000).delay(1000, function(){
        loadTitle();
    });
}

// load title headers
function loadTitle(){
    // Load Title
    $("#titleDiv1").fadeIn(1000, function(){
        $("#titleDiv2").fadeIn(1000, function(){
            $("#arrow").fadeIn(1000);
        })
    });
}