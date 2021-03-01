## Assignment 1: a journey.

###### Note that the images in this are not available as this is a copy of the original, whose link is [here](https://docs.google.com/document/d/1gCU_oIFEtCYb_b0R0Uexfbj5LIz46aXEX5Fu415uEGM/edit).

### Project Description
This website is designed to implement the concept of moving forward through horizontal scrolling. It carries the user through the process of creating the film and the website.
There were several features that I wanted to focus on in order to create the full experience of moving forward. The first was horizontal scrolling, which was something I hadn’t really come across before (I know why now; read The Process to find out). This, I thought, was a great way to emphasize the idea of moving forward. Another was through the navigation bar. I was planning on creating a navigation bar made up of stars, which would connect as the user progressed through the website. This was meant to add more meaning to the idea of advancing: that with each moment we live, we leave behind us a trail of legacies. At the end, we realize what we truly gained from each experience and see how they all interacted with one another, forming a coherent picture of linked points in time–– a constellation of stars, shining bright in the night sky. This didn’t work out (again, horizontal scrolling problems, and in the end, time). Finally, I wanted to add animations to the scrolling, similar to how the Apple websites display their products. Once again, this did not work out (horizontal. scrolling.).
On top of implementing the concept of moving forward, I also wanted to add a lot of other features, such as creating an interactive preface before the actual website and adding music.

### The Process - Preface
I thought that it would be a great idea to create a horizontally scrolling website. It was a bad, bad idea.

#### The Wireframe: All Roads Lead to  Rome Horizontal Scrolling
I mean, as a wireframe it didn’t seem like a mistake. It was rather nice (except I never really figured out how to make it scroll horizontally). The idea was that the user could scroll their mouse vertically and it would be translated into a horizontal scroll. That, and changing background colors/text colors, seemed like a really cool experience for the user. I also debated whether or not I should make it impossible to go back once the user progressed (“keep going forward” lol), but I decided against it because even though the website is technically a piece of art, it is still in essence a website.

#### The First Week: The Calm Before the Storm
So the first week wasn’t too bad. I looked for ways to implement horizontal scrolling and planned out how I wanted the website to look. Implementing the horizontal scrolling was a little bit complicated. Basically, I needed two pieces: an outer and inner wrapper, which would hold the content of the website. I needed to rotate the outer wrapper (and translate it), then reverse that rotation (so that the content of the website would be right-side up) with the inner wrapper. After that, I created several pages that I could display content on.

    #outer_wrapper {
       /* starts the page 100vh below the screen. this factors in the rotation's
       origin point (when rotated, the page will not be outside of the display area */
       top: 100vh;
       left: 0;
       margin: 5;
       padding: 0;
       /* fills entire visible screen WHEN ROTATED (which is why vh and vw are inverted) */
       width: 100vh;
       height: 100vw;
       /* this transformation rotates the page so scrolling down will be translated
       into horizontal scrolling */
       transform: rotate(-90deg);
       transform-origin: top left;
       overflow-y: visible;
       overflow-x: hidden;
       /* the position is absolute as this is the main display of the webpage */
       position: absolute;
    }

    #inner_wrapper {
       /* creates seamless transition between inner elements */
       display: flex;
       flex-direction: row;
       transform: rotate(90deg) translateY(-100vh);
       transform-origin: top left;
       /* width of inner wrapper = 100vw + (# subslides * subslide width) */
       height: 100vh;
       width: calc(100vw + (var(--subSlideCount) * var(--slideWidth)));
       /* gradient background */
       background-image: linear-gradient(to right, black, black, rgb(30, 30, 30), rgb(90, 90, 90), white, white);
    }

This is the completed code of the final first version (I’ll get to this). After implementing the first prototype of the website, I added more variables to make the website dynamic (hence you could change the size of the sub slides and this would reflect in the inner wrapper). Something pretty cool was the gradient, which I had come across as I looked for a way to add some flair to the background (I thought of stars as a background but.. wait a sec that’s actually a really good idea, to have two layers of stars that move slower than your scroll and give the feeling of a moving backgrou––ahem). In any case, the prototype (first draft) was more or less complete so I had an idea of what would be in the website.

Afterwards, I created navigation buttons that would slide the screen when pressed. These would get brighter when a mouse hovered over them.

    /* navigation triangle (color will change as screen scrolls) */
    #button-right {
       position: fixed;
       bottom: 5vh;
       right: 5vw;
       width: 0;
       height: 0;
       border-top: 15px solid transparent;
       border-left: 30px solid rgba(var(--textColor),var(--textColor),var(--textColor),0.3);
       border-bottom: 15px solid transparent;
       animation: pulse 2s infinite;
    }
    /* when hovering over, the arrows become more opaque */
    #button-right:hover{
       transition:1s;
       border-left: 30px solid rgba(var(--textColor),var(--textColor),var(--textColor),0.7);
    }

The idea was to have the color of these triangles to change as the screen progressed. This was also something that I was thinking of implementing for the text as well.

    /* subscreen styles.  */
    .subScreen {
       width: var(--slideWidth);
       height: 100vh;
    }
    .subScreenTitle {
       color: rgba(var(--textColor),var(--textColor),var(--textColor),0.9);
       font-family: Helvetica;
       margin: 3vw;
       font-weight: normal;
       font-size: 3.5vw;
    }
    .descriptionBlock {
       display: block;
       width: 50%;
       height: 50vh;
    }
    .description {
       color: rgba(var(--textColor),var(--textColor),var(--textColor),0.9);
       margin: 3vw;
       font-family: Helvetica;
    }
    .descriptionSubtitle {
       color: rgba(var(--textColor),var(--textColor),var(--textColor),0.9);
       font-family: Helvetica;
       font-size: 2vw;
    }
    .descriptionText {
       line-height: 1.2;
       font-size: 1.5vw;
    }

In addition, I started looking into jQuery and linked a bunch of different scripts that I wanted to use for the website. This included changing the scrolling so that the mouse, scrolled in any direction, would result in a correct movement (done by overriding the mousewheel), using scrollLeft in order to move the screen, and having an animation around the mouse on click.
I also started looking into animations using jQuery and AOS. This took quite a bit of time, since I have zero experience in anything like this.
But overall, everything was going fine, and I was pretty sure I could finish the website in a few more days. Oh, how foolish I was.

#### The Second Week: The Beginning of the End (aka THE NIGHTMARE THAT IS HORIZONTAL SCROLLING)
The first problem that I came across was that I could actually reference any objects using the document offset, which was how I was planning on implementing the navigation for the website. I didn’t actually know this until recently and spent the entire time searching for the reason as to why my code was showing that the scrollX and scrollY values were always NaN or 0. Turns out that the way that I had transformed my website had messed up, well, everything related to the scrolling of the website.
This meant that pretty much everything I had built up was for nothing. The eventListener for scrolling was useless, as was everything regarding scrolling. In addition, turns out that AOS won’t work on horizontal scrolling (everything on-screen and out will appear at the same time), so I couldn’t use that anymore. This meant I needed to resort to using .fadeOut and .fadeIn, super basic functions. But the fact that I couldn’t update anything using JS really got on my nerves, so I decided to try and use the format that Prof. Shin suggested, which was basically doing no rotating and relying on (actual) horizontal scrolling.
It took a while to convert this, and it seemed to be working. I converted the vertical scrolling to horizontal using this bit of code:

    // This changes vertical scrolling to horizontal scrolling using the jquery script
    // mousewheel.min.js. Referenced from here: https://stackoverflow.com/questions/24639103/changing-vertical-scroll-to-horizontal
    $(document).ready(function() {
       $('html, body, *').mousewheel(function(e, delta) {
       this.scrollLeft -= (delta);
       e.preventDefault();
       });
       });

    In addition, after (many) failed attempts, I also got function to get the website to move on button click. However, something happened to the scrolling in the process.

    // Function to Move Right (button click)
    function scrollRight(){
       var locX = window.scrollX + vw;
       window.scrollTo(locX,0);
    }

    // Function to Move Left (button click)
    function scrollL(){
       var locX = window.scrollX - vw;
       if(locX <= 0){
           window.scrollTo(0,0);
       }
       else{window.scrollTo(locX,0);
       }
    }

A problem that arose from the different method of horizontal placement was that the divs were loading strange and wouldn’t respond to any of the position styles that I assigned. I wasn’t (and I’m still not) sure why this happened, and after a few hours of attempted ‘debugging’, I gave up.

#### The Third Week: Last Minute Recoveries (and Failures)
As the deadline drew near, I told myself that I needed to get my act together and rewrote the entire code read through each line of CSS and JS until I found what the problem was, thanks to the help of the trusty Inspector on Chrome. Basically, when I was calling the .fadeIn(elem) function that I had created, I was setting the display value of elem to “block”, and that was causing the problem. Using what I remembered from the previous format (the outer and inner wrappers), I switched this to “flex” and boom. It worked. The divs are now loading properly, and adding an image no longer breaks the entire website. What gets me is that this was literally a one-line mistake:
elem.style.display = "block";
This happens to me a lot, and apparently this project is no exception. In any case, solution found, even if it’s super last minute. Finally added another image without breaking the website(!!).

Another fun little thing I did was adding extra animations to the website. I can only use AOS for the start screen, since AOS is based on the scrollY and for me everything is on the same scrollY, which means everything is animated at once rather than on scroll (ugh, horizontal scroll is really a nightmare), but other animations (still ones) are okay. I used an illumination animation on the start screen text, as well as the final text of the website. It’s not really much, but I thought it was a cute touch that made it feel a bit more complete.



Though I didn’t get to do the full interactive preface I wanted to make (didn’t have the time, mostly, but I also wasn’t confident in my js functions; too many could cause errors for some reason or another, knowing me), I still added an option for users to watch the film first or to skip it and watch it later on.



Adding the navigation arrows –– and animations on hover –– was a nice touch that I decided to add to make the thing a bit more interesting. I realize that I didn’t actually use any buttons in my HTML, but that’s because I tried it and I didn’t like the weird blue highlight that you get even after you set all borders to none and all the CSS stuff. So I just stuck with making the elements themselves ‘buttons’. The instructions appear at the bottom of the screen, but disappear when you make the correct gesture (click the navigation triangle), also a fun little feature I added because I didn’t want the instructions to get in the way of the experience.



However, something that I haven’t been able to figure out is the vertical-to-horizontal scroll translation. See, in theory, it should work since it converts the difference in the vertical scroll directly into a horizontal scroll. And it was working, up until I switched something somewhere else in the code and ended up making it break. In any case, I’ve tried to compensate by multiplying the difference in the scroll when converting.

    $(document).ready(function() {
       $('html, body, *').mousewheel(function(e, delta) {
       this.scrollLeft -= (delta * 60);
       e.preventDefault();
       });
       });

However, this may just be a result of me using a trackpad/Magic Mouse 2, where there is no actual physical scroll. But then again, it was working for me before…

Another thing I haven’t been able to do is create the navigation constellation. This was supposed to be a set of stars that appeared based on the scrollX and were linked as the user progressed through the website. They would also double as the navigation bar (would have the text of where they’re at under the active star). However, I don’t have the time to implement all of that. I have the necessary tools, now that I have the div thing figured out (I can’t believe I made such a stupid mistake with that), so all I have to do is anchor the elements to the ids for the subscreens (already set the ids) and scrollTo using the offsetWidth for each subscreen. But that’s for another day.


### The Aftermath: Evaluation & Reflection (while on the verge of tears)
This, by far, is one of the worst projects that I’ve created (the project prompt was good; I just really, really suck). It’s almost a complete failure, with barely anything good to speak of.
Update: after figuring out that everything was not working because of a single line of code, I realize once again that I have the ability to sabotage myself (this isn’t the first time this has happened to me; check out my Intro to IM project documentations for details) and admit that my frustration got the better of me. Nonetheless, I feel like I could have done better, but also admit that I probably couldn’t have (this paradox is the reason why I challenge myself and oftentimes regret it).
One reason is that I have zero experience with any of this (spent maybe 20 hours+ just reading up on jQuery and figuring out how to make things work without so many errors). Another is that despite that, I tried to think too big and got caught up in the technicalities (errors upon errors, strange misplacements that make zero sense), instead of focusing on the basics (i.e. text formatting, image loading, etc.). Faced between a choice of zero interactivity but a working CSS and a messed up CSS but with interactivity, I chose the latter. There isn’t a lot of content, which is also a downside for me.
If I had time (and a lot more lessons in CSS, JS, and HTML), I could probably make what I envisioned. But for now, that’s a goal that’s unreachable with my skills. But horizontal scrolling websites are not really something I want to get involved with again (but if I do, I know what to do–– and what not to). Still, it was a good experience and lesson in patience, patience, and crying in a corner learning how to use HTML alongside CSS and JavaScript. Oh, I also learned that no matter what… I gotta keep moving forward. Ha.
