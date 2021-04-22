// Loads the NavBar & PageNav (for reuse). Referenced from https://stackoverflow.com/questions/31954089/how-can-i-reuse-a-navigation-bar-on-multiple-pages.
$(document).ready(function(){
    $("#navBarPlaceholder").load("partials/navBar.html");
    $("#pageNavPlaceholder").load("partials/pageNav.html");
});

// Scrolling Changes. Emphasizes the "Begin Assignment" at the bottom of Home page.
$(window).scroll(function(){
    if(document.documentElement.scrollTop > 0){
        $("#titleBar").fadeOut();
        document.getElementById("navBar").style.boxShadow = "0 0 8px white";
    }
    else{
        $("#titleBar").fadeIn();
        document.getElementById("navBar").style.boxShadow = "0 0 4px white";
    }
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    if(document.documentElement.scrollTop >= vh){
        $("#game").css({"animation":"textEmphasis 3s infinite"})
    }
    else{
        $("#game").css({"animation":"none"})
    }
});