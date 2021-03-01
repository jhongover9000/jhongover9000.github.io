// IM Assignment 2: a love letter. (JavaScript)
// Joseph Hong
// Description: this is the JavaScript script for the interactive comic 'a love letter.' This file
// makes use of jQuery and jQuery plugins such as jQuery-Visible and mouswheel.js.
//=================================================================================================
//=================================================================================================
// Variables

// Site First Loaded?
var firstLoad = true;

// Page Height & Width
var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

// Number of Elements on Page
var imgPanelCount = $(".imgPanel").length;
var txtPanelCount = $(".txtPanel").length;
var quarterGutterCount = $(".gutterQuarter").length;
var halfGutterCount = $(".gutterHalf").length;
var fullGutterCount = $(".gutterFull").length;
// console.log(imgPanelCount);
// console.log(txtPanelCount);
// console.log(quarterGutterCount);
// console.log(halfGutterCount);
// console.log(fullGutterCount);

// Panels (For Animations)
var panels = $(".panel")
// console.log(panels);

// Variables for Visibility (replaced with jQuery-Visible)
// var bodyRect = document.body.getBoundingClientRect();
// var elemRect = element.getBoundingClientRect();
// var offset = elemRect.left - bodyRect.left;

// Full Page Length (using CSS variables)
var fullPageLength = ( (vw * ($("body").css("--imgPanelWidth")/100 * imgPanelCount)) + (vw * ($("body").css("--txtPanelWidth")/100 * txtPanelCount)) + (vw * ($("body").css("--quarterGutterWidth")/100 * quarterGutterCount)) + (vw * ($("body").css("--halfGutterWidth")/100 * halfGutterCount)) + (vw * ($("body").css("--fullGutterWidth")/100 * fullGutterCount)) );
var fullScrollLength = document.documentElement.scrollWidth - vw;
$("body").css("--wrapperWidth", fullPageLength + "px");

// console.log($("body").css("--wrapperWidth"));
// console.log(vw);
// console.log(document.documentElement.offsetWidth);
// console.log(fullScrollLength);

// Variables for Plane Animation/Update
var initialHeight = parseInt($("#paperPlane").css("top"),10);
var initialX = parseInt($("#paperPlane").css("left"),10);

var autoscroll = false;

// var scrollAuto = setInterval(scrollCheck,1000);

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

// Visibility Checker. Uses the offsets of an element and compares it with the client's viewport
// to see if the position of the element is visible. This is from the jQuery plugin Visible.
// The actual .js file didn't work so I looked ended up having to paste the code here.
(function(e) {
    e.fn.visible = function(t, n, r) {
      var i = e(this).eq(0),
        s = i.get(0),
        o = e(window),
        u = o.scrollTop(),
        a = u + o.height(),
        f = o.scrollLeft(),
        l = f + o.width(),
        c = i.offset().top,
        h = c + i.height(),
        p = i.offset().left,
        d = p + i.width(),
        v = t === true ? h : c,
        m = t === true ? c : h,
        g = t === true ? d : p,
        y = t === true ? p : d,
        b = n === true ? s.offsetWidth * s.offsetHeight : true,
        r = r ? r : "both";
      if (r === "both") return !!b && m <= a && v >= u && y <= l && g >= f;
      else if (r === "vertical") return !!b && m <= a && v >= u;
      else if (r === "horizontal") return !!b && y <= l && g >= f
    }
  })(jQuery);

// Animating Panels. Based on visibility function (above).
function animatePanels(){
    panels.each(function(){
        // If any part of the image is visible, it will be displayed via fading in.
        if($(this).visible(true) && window.scrollX != fullScrollLength){
            $(this).animate({opacity:1}, 2500);
        }
    });
}

// Autoscroll
function scrollCheck(){
    // console.log(autoscroll);
    $("body").css("--scroll", window.scrollX);
    var scrollX = $("body").css("--scroll");
    if(autoscroll){
        if(scrollX < fullScrollLength){
            // console.log(scrollX);
            window.scrollTo(window.scrollX+1,0);
            $("body").css("--scroll", window.scrollX);
        }
    }
    else{
        clearInterval(scrollAuto);
    }
}

// Update Scroll (for testing)
function scrollUpdate(){
    console.log(window.scrollX);
    $("body").css("--scroll", window.scrollX);
}

// First load brings scrollX to 0 and resets the plane height.
function initialize(){
    window.scrollTo(0,0);
    $("#paperPlane").css({"top": initialHeight});
    $("#paperPlane").css({"left": initialX});
}

// Meant to hide the panels on restart, but it didn't work so I just reload the page when scrollX == 0.
// function hidePanels(){
//     $(".panel").each(function(i){
//         $(this).animate({opacity:0});
//         console.log($(this));
//     });
// }

// Display Polaroids for Epilogue
function displayPolaroids(){
    $(".epilogue img").each(function(i){
        $(this).delay(i * 500).animate({opacity:1});
    });
}

// Hide Polaroids
function hidePolaroids(){
    $(".epilogue img").each(function(i){
        $(this).animate({opacity:0});
    });
    $(".epilogue").fadeOut("slow");
}


//=================================================================================================
//=================================================================================================
// Updaters and Event Listeners

// Main Event Listener (when website is ready)
$(document).ready(function() {
    // If first load of webpage, reset scrollX
    if(firstLoad){
        initialize();
        firstLoad = !firstLoad;
    }
    // Conversion of Vertical to Horizontal Scroll.
    // Referenced from here: https://stackoverflow.com/questions/24639103/changing-vertical-scroll-to-horizontal
    $("html, body, *").mousewheel(function(e, delta) {
    this.scrollLeft -= (delta);
    e.preventDefault();
      });
});

// Scroll Event Listener
document.addEventListener("scroll", function(){
    // var bodyRect = document.body.getBoundingClientRect();
    // console.log(bodyRect);
    // Updating the scroll variable in CSS
    $("body").css("--scroll", window.scrollX);
    

    // Plane Animation/Location Updates
    var scrollX = window.scrollX;
    var newY = initialHeight + (vh/1.6)*(scrollX/fullScrollLength) + "px";
    // console.log(initialHeight);
    // console.log(initialX);
    if(scrollX == 0 ){
        
        // Reload page when at start of page. Resets animations.
        if(reset){
            location.reload();
            reset = false;
        }

        // Instructions and Navi Animations
        $("#instruct").fadeIn();
        $("#next").css("display","inline-block");
        $("#epil").css("display","none");

        // Navi Gutter Animations
        $("#gutter1").css({"animation":"moveDown1 2s forwards"});
        $("#gutter2").css({"animation":"moveUp2 2s forwards"});
        $("#paperPlane").css({"animation":"shudder 100s infinite alternate"});
        
    }
    // Until last image panel, paper plane will move forward and down. This changed from the initial
    // plan of only making it move forward at the end (which also worked, but didn't give as much sense of movement)
    // The amount that the plane moves is determined by (window.innerWidth/2), which decides the end % location of the plane.
    
    // else if(0 < scrollX && scrollX < (fullScrollLength - window.innerWidth * 2) ){
    else if(0 < scrollX && scrollX < fullScrollLength ){

        // Animate Panels
        animatePanels();

        // Instructions and Navi Animations 
        $("#instruct").fadeOut();
        $("#next").css("display","inline-block");
        $("#epil").css("display","none");

        // Navi Gutter Animations
        $("#gutter1").css({"animation":"moveUp1 2s forwards"});
        $("#gutter2").css({"animation":"moveDown2 2s forwards"});

    //     $("#paperPlane").css({"animation":"shudder 4s infinite alternate"});
    //     var newX = initialX + (window.innerWidth/2.5)*((scrollX)/fullScrollLength) + "px";
    //     $("#paperPlane").css({"top": newY});
    //     $("#paperPlane").css({"left": newX});
    // }
    // // Starting from last two panels, scrolling will move the plane forward as well
    // else if((fullScrollLength - window.innerWidth * 2) <= scrollX && scrollX < fullScrollLength){

        // Originally was going to make the plane move forward only at the end
        // var newX = initialX + (window.innerWidth/2.5)*((scrollX - (fullPageLength - window.innerWidth * 2))/(window.innerWidth * 2)) + "px";
        
        // Updated code relfects the one above (so there isn't much difference, but I left this for
        // possible improvement where the plane moves forward faster in this section)
        var newX = initialX + (window.innerWidth/2.0)*((scrollX)/fullScrollLength) + "px";        
        $("#paperPlane").css({"animation":"shudder 4s infinite alternate"});
        $("#paperPlane").css({"top": newY});
        $("#paperPlane").css({"left": newX});
        
    }
    // At the end, the plane will come to a stop (well it will move, just really slowly)
    else if(scrollX == fullScrollLength){

        // Animate Panels
        animatePanels();

        // Navi Animations 
        $("#next").css("display","none");
        $("#epil").css("display","inline-block");

        // Navi Gutter Animations
        $("#gutter1").css({"animation":"moveDown1 2s forwards"});
        $("#gutter2").css({"animation":"moveUp2 2s forwards"});

        // Paper Plane has 'landed'.
        $("#paperPlane").css({"animation":"shudder 100s infinite alternate"});
        
    }
});

// Autoscroll on Button Click
$("#autoscroll").on("click", function(){
    console.log($("#autoscroll").css("color"));
    console.log(autoscroll);
    autoscroll = !autoscroll;
    // Turn autoscroll to false if at the end of the screen
    if(window.scrollX >= fullScrollLength){
        autoscroll = false;
    }

    if(autoscroll){
        $("#autoscroll").css("color","black");
        scrollAuto = setInterval(scrollCheck,10);
    }
    else{
        if($("#autoscroll").css("color") == "rgb(0, 0, 0)"){
            $("#autoscroll").css("color","gray");
        }
    }
});

// Restart from Beginning (Animations are not reset)
$("#restart").on("click", function(){
    reset = true;
    $('html, body').animate({scrollLeft: 0},1000);
    $("#paperPlane").css({"top": initialHeight});
    $("#paperPlane").css({"left": initialX});
    hidePanels();
});

// Next
$("#next").on("click", function(){
    $('html, body').animate({scrollLeft: window.scrollX + 0.5*vw},1000);
});

// Epilogue
$("#epil").on("click", function(){
    $(".epilogue").fadeIn("slow");
    displayPolaroids();
});