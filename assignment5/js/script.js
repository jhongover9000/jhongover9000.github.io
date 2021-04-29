// Assignment 5: simply seph. (Basic Script)
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
    $("#titleDiv").fadeIn(2000, function(){
        $("#arrow").fadeIn(2000, randomPage());})
        
});

// scroll down button
$("#scrollDown").click(function(){
    window.scrollTo(0, 1.1*vh);
});

// ===================================================================================================
// ===================================================================================================
// Functions

// makes sure that random page is not the current page
function randomPage(){
    var num = Math.floor(Math.random()*4);
    while(num == projNum){
        num = Math.floor(Math.random()*4);
    }
    $("#explore").attr("href", "/assignment5/project"+ String(num)+".html");
}