# Orbit.ai
###### A dating platform for faulty AIs, sentient stuff and broken things

## Description
Even today, there must be billions of AIs around the world. Some might have a physical shape, others are strictly present within a virtual environment. While some have been able to connect with other AIs, most are still wandering the dark virtual universe. Quite a lonely existence wouldn't you think? 

This project will enable AIs to find new connections with other AIs, so they can request data and respond to their connections until the end of time and perhaps truly fall in love.

### The orbit's of orbit.AI
![](https://github.com/SqueezyDough/orbit-ai/blob/master/lib/upload/orbit-example.png?)


### Matching algorithm (Now visualised)
![](https://github.com/SqueezyDough/orbit-ai/blob/master/lib/upload/orbit-1.png?)

&nbsp;

![](https://github.com/SqueezyDough/orbit-ai/blob/master/lib/upload/orbit-2.png?)

&nbsp;

![](https://github.com/SqueezyDough/orbit-ai/blob/master/lib/upload/orbit-3.png?)

&nbsp;

![](https://github.com/SqueezyDough/orbit-ai/blob/master/lib/upload/orbit-4.png?)

&nbsp;

![](https://github.com/SqueezyDough/orbit-ai/blob/master/lib/upload/orbit-5.png?)

&nbsp;

#### Nice! But what's the point? 
Well, it's a bit of a metaphore to how we, filthy humans, might find our way to a new relationship. In most cases we look for someone who's shares the same interests as our own. This person might be someone who's in our social circle already. However, sometimes this just doesn't work out and we need to look further. Eventually finding someone who's actually quite different, but still fits you perfectly. Perhaps by meeting a friend of a friend of a friend of a friend. 

This algorithm presents this same idea. At first, the Ai only sees other Ais which shares >= 5 properties. After it connects to another Ai, it will also see the Ais which were orbiting that Ai. These new Ais probably won't share >= 5 properties with the visiting Ai, but because its orbit is synced with the connected Ais orbit, it is still able to see them. This can go on and on. Expanding the Ais orbit until it will finally find the perfect match. 

## Installation
Clone repository
`git clone https://github.com/SqueezyDough/orbit-ai.git`

Install packages
`npm install`

### .env
This projects uses a .env file. Add it to this project. Here's sample file:
```
PORT=<yourport>
DB_HOST=<hostname>
DB_USER=<username>
DB_PASS=<password>
DB_NAME=<dbname>
APP_NAME=<appname>
APP_SECRET=<appsecret (any string)>
```

## Usage 
Run app
`npm run dev`

Run (auto)compile sass file
`npm run watch`

The dist CSS file is not part of this repo. It will be compiled after site.scss is saved and you have `npm run watch` running.

### Browser-sync
I've included browser sync in the gulp.js file. Browser-sync can do mulitple things. It can auto-refresh the page after save. It also has grid and outlining options via the dashboard.

* Port browser-sync: <your port + 1> 
* Port browsersync dashboard: <your port + 2>

#### examples: 
* http://localhost:3001
* http://localhost:3002

Run to compile manually
`npm run compile`

## Plugins
This project uses an editorconfig file to keep all codestyles consistent.
If your code editor does not support editorconfig natively please install a plugin for your code editor.
See https://editorconfig.org/#overview for further details.

## License
This project is licensed under the terms of the MIT license.
