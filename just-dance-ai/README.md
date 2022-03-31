# Just Dance AI

### The Overview
Hello~ we’re back again, this time for the final project of the semester! For the final project, our group created a game that makes you dance (!!!!). Just Dance AI, everyone’s favorite dancing game with a special flavor of artificial intelligence! Dance and pose like you’ve never done before! The major technology we deployed is the machine learning model PoseNet and TeachableMachine by Google, and the game itself is coded through p5.js!

### The Idea
Well, it actually started with the idea of an interactive performance using PoseNet. Different poses would trigger different effects, and with that you could create a really cool piece that could help people not only learn about how PoseNet works but also have fun in the process. Then, when learning about Teachable Machine, we saw the yoga pose clip and thought of an interactive yoga session. Then, out of left field, came the idea of making people dance along to choreography then grading them on it. A lot of the inspiration behind that came from Dance Dance Revolution, as well as the Dance Evolution Arcade Machine (even if it’s not all that related, it’s still really fun to watch). I’m actually curious as to whether the latter uses something similar to what we implemented with our project.


### The Process

#### Choreography and Videos (Jannie)

We chose three songs to come up with the choreography, shoot the videos and take out certain frames in the video to train the model. I chose distinctive poses from the choreography so that the machine will not confuse them. 

I also mirrored the video in order for the users to follow the movements and recorded each timestamp when each pose takes place.

### Training the Model (Jannie)

I trained this model based on poses in order to get rid of the effect of the background and clothing. I put in the screenshot from the video and recorded many other samples from a slightly different angle in order to allow some differences. I also invited Joseph and some of my other friends to take some sample images to enhance the diversity of the dataset. Because PoseNet only takes in a limited amount of joints as an input, some poses that look quite different actually were confused by the model. Such as Pose 2 and Pose 8 in Maria. I then disabled some classes and added in more distinct ones. When I tested on my side, it predicted my pose pretty accurately. However, when other people were testing it, it did not perform quite well, which shows the bias of the model. 


### Tensorflow and Teachable Machine (Joseph)

So, erm, before getting to anything, I’d like to say that there are some 600ish lines of code that I ended up writing for the project sketch. I won’t cover a lot of it, since it’s not as relevant to the machine learning aspect of the project. But yes, it was the fruition of many sleepless nights hard work and crying in a corner overcoming various obstacles. And I’m actually rather impressed with how well it works (despite being the one who coded the thing). There are a few hitches here and there, but I tried to make the most of what I had, especially considering the difficulties I encountered along the way.
The first issue I encountered was actually at the very start when I was trying to make Teachable Machine work on p5.js; the problem was that I couldn’t. Though TM had the p5.js starter code for the imageClassifier, it didn’t have it for the poseNet machine, only having a plain JS script instead. And so I tried to work with that, which led to even more errors. The main reason for my issues was something about the wifi at NYUAD–– it wouldn’t let me access Tensorflow.js or the Teachable Machine PoseNet min.js. I don’t know if it’s something that happens to everyone or just my computer, but this issue persisted and actually made me consider just doing something entirely different.

But it worked itself out eventually when I connected to a different network, and I had a moment of silent crying reflection before moving on to addressing the seemingly impossible task of linking Teachable Machine with p5.js.

At first, I tried to use the code that came with TM, the one using Canvas (ctx) instead of p5.js. It worked, but the problem was that I didn’t really know a lot about it and needed to learn it. And that was me for a while, until I came across a small example that was using p5.js with TM PoseNet. And that was where everything started coming together.

### Limitations and Workarounds (Joseph)

A problem that came up while playtesting was that the score would be very low. And I mean insanely low, like maybe 1000 tops (getting one pose lands you about 900). I didn’t really understand what was going on, since I was doing everything correctly and from the front-end it looked like it was working properly, but then as I recalled the past dealings with webcams and machine learning, I remembered that there were a few limitations with machine learning on live video, and PoseNet was no exception.

One of the limitations of TM PoseNet is that it registers poses a little bit slow. And when considering that our project is based around split second poses, we needed to balance that out. In the end, I added a ‘grace’ period after the pose ended, one that would essentially allow the late results to still be considered valid. And that actually helped boost scores up quite a bit. Also, adding the little “bonus” period at the end of each song helped balance out the score a bit, though this was less about the model’s accuracy and more about making the player feel at least a little better about themselves.

### Machine Learning in Artistic Performance: Implications

And that brings up something interesting, especially in regards to the question of assessing performance. What makes a performance ‘good’? Is it the accuracy of the movements–– something that our model was supposed to be doing ––or the expression that is conveyed through it? Most people who went for the latter rarely received good marks from the model because they weren’t in sync with what moves had been fed into it at the start, whereas those who went for the former (including myself) could score rather high without really dancing at all.

When it comes to using machine learning to assess performances, especially artistic performances, what would they need to look at? What could they look at? Is an expression of one’s self something that can be observed through patterns? Would there come a time where machine learning models would be able to somehow understand the concept of expressing one’s self, and if so, how would that differ from what people would understand it? These were just some of the questions that came to mind when considering the implications of machine learning in the realm of dance, also extending further out into artistic performance in general.

### The Biases Within the Model

As I mentioned earlier, the model is extremely biased since it only took samples from several persons. It can detect their poses really well but not other people. Initially I thought by training on poses the model should be able to steer away from the influence of different people playing. However, as it turned out, it is still a very biased dataset giving out limited predictions. This reminds me of the importance of having a well-rounded dataset that includes data from all identities as we discussed in class. Even though PoseNet is a mature model trained to recognize poses, somehow the model generated from Teachable Machine is still biased. Now we are only using it for a game, what if the machine learning algorithm is used to give predictions on social issues such as jurisdiction and salary? It should not be one person who makes these algorithms, it should be a team full of representatives from all identities. 

### Bringing Things Together…

Overall, this project started out as something that was just supposed to be fun and entertaining to something that started to make us question things about what makes humans human, and if those things could ever be understood by AI–– or perceived, even. I think that this is actually one of the most put-together projects that I’ve done over the semester, and definitely one of the ones where I had the most fun.
It’s been a long ride, learning about all sorts of different machine learning models. Not just about them, but in a sense learning about us humans as a whole, since the models cannot do anything without the data that we feed them. We assume that artificial intelligence is objective, but in the end it’s just spewing back everything we gave it in the first place. I think we learn more about ourselves, the innate biases we might have, the tendencies that we unknowingly possess, through these models. And if we know, then we can improve.
