# KeyCanvas

## Overview
KeyCanvas is a project to demostrate techniques to create a basic web-based drawing application using HTML5, 
Javascript and storing the generated graphics in a LokiJS database with the backend written in NodeJs.
LokiJS is an in-memory database, I chose it because it has no other dependencies other than the node package,


## Dependencies
- bcrypt (encryption)
- jade (template engine)
- express (web framework)
- lokijs (lightweight and high perfomance in memory database)
- Passport - authentication middleware and sessions (with express-sessions)

## Known issues, possible improvements and other notes
- Selecting overlapping shapes on the canvas could lead to the wrong shape selected.
- No debounce (script wrongfully detects multiple clicks as double-clicks)
- Using LokiJS as a store for the 'documents' and user profiles, the db is human readable although passwords are encrypted using bcrypt
- New design name and dimensions are immutable
- Firefox - canvas.ellipse not supported (use chrome)

## Usage
1. Clone repo
2. cd KeyCanvas
3. npm install
4. npm start
5. register and log in