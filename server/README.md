# Run WLT-Mancala

## 1. Install dependencies (once)

`npm install`

## 2. Start server

`node index.js`

## 3. Open mancala in the browser

[http://localhost:8081/](http://localhost:8081/)

# File Structure & Overview

# index.html

Main html file

# Index.js

Main javascript file

## Backend/

Contains all backend routes as well as storage

### Backend/.storage/

Contains the .txt files in which the data for ranking and users is persisted

### Backend/database.js

Creates / Reads / Writes the files for storage

### Backend/hashing.js

Hashes an input string value

### Backend/requests.js

Handles the backend routes /ranking and /register

# Frontend

## Frontend/assets/

Contains icon images

## Frontend/scripts/

Contains the application's javascript files

### Frontend/scripts/enums/enums.js

Defines enums for play style, game status, etc.

### Frontend/scripts/game-utils/

Provides helper functions for the game logic like counting seeds for a player, choosing the ai move, etc.

### Frontend/scripts/multiplayer/

Handles multiplayer credentials and server events

### Frontend/scripts/requests/requests.js

Provides functions to call the backend services

### Frontend/scripts/requests/config.js

Declares the group number used for the multiplayer

### Frontend/scripts/game-logic.js

Manages the Mancala game logic

### Frontend/scripts/popups.js

Handles popup logic for settings, winner, etc.

### Frontend/scripts/settings.js

Handles game settings and starts game
