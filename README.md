# PeerPrep

<img width="1503" alt="Screenshot 2022-11-09 at 1 58 54 AM" src="https://user-images.githubusercontent.com/60286063/200640637-cc93a4c3-d86f-4ffc-aa88-8bb741ce4380.png">

PeerPrep a web application that seeks to help students better prepare themselves for the highly challenging technical interviews. 

PeerPrep helps users to find a fellow peer who wants to work on a problem of similar difficulty, and allows them to work together and communicate with each other on the problem.

Access our app [here](http://peerprepfe.s3-website-ap-southeast-1.amazonaws.com/login) (Active as of Nov 9th, 2022)

## How to start (locally)

### Prerequisite
1. Go into respective directories by running `cd <dirname>`
2. Run `npm install`

### Frontend
1. Rename `.env.sample` file to `.env`.
2. Run `npm start` (Frontend runs on `localhost:3000`)

### User Service
1. Rename `.env.sample` file to `.env`.
2. Create a Cloud DB URL using Mongo Atlas.
3. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
4. Run `npm start` (User Service runs on `localhost:8000`)

### Matching Service
1. Rename `.env.sample` file to `.env`.
2. Run `npm start` (Matching Service runs on `localhost:8001`)

### Collaboration Service
1. Rename `.env.sample` file to `.env`.
2. Run `npm start` (Collaboration Service runs on `localhost:3001`)

### Question Service
1. Rename `.env.sample` file to `.env`.
2. Create a Cloud DB URL using Mongo Atlas.
3. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
4. Run `npm start` (Question Service runs on `localhost:3002`)

### Chat Service
1. Rename `.env.sample` file to `.env`.
2. Run `npm start` (Collaboration Service runs on `localhost:3003`)
