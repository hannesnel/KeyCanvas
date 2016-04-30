# KeyCanvas

## About
KeyCanvas is a project to demostrate techniques to create a basic web-based drawing application using HTML5, Javascript and storing the generated graphics in a LokiJS database with NodeJS as the driver.

## Dependencies
- bcrypt (encryption)
- jade (template engine)
- express (web framework)
- lokijs (lightweight and high perfomance in memory database)

## Known issues and possible improvements
- Selecting overlapping shapes on the canvas could lead to the wrong shape selected.
- No debounce (script wrongfully detects multiple clicks as double-clicks)
- Using LokiJS as a store for the 'documents' and user profiles, the db is human readable although passwords are encrypted using bcrypt
