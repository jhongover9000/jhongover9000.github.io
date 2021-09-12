// A.r.t. Intel Project 1: Mind Over Matter.
// Description: This is the JS script for the website. All it does really is load the partials.
// ===================================================================================================
// ===================================================================================================
// Variables
var isVisible = false;
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)


// ===================================================================================================
// ===================================================================================================
// Event Listeners

$(document).ready(function(){
    // Loads the NavBar & Footer (for reuse). Referenced from https://stackoverflow.com/questions/31954089/how-can-i-reuse-a-navigation-bar-on-multiple-pages.
    $("#navBarPlaceholder").load("partials/navBar.html");
    $("#footerPlaceholder").load("partials/footer.html");
    // Load Title
    $("#titleDiv1").fadeIn(1000, function(){
        $("#titleDiv2").fadeIn(1000, function(){
            $("#arrow").fadeIn(1000);
        })
    });
});

// scroll down button
$("#scrollDown").click(function(){
    window.scrollTo(0, 1.1*vh);
});