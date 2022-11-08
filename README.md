# PeerPrep

PeerPrep a web application that seeks to help students better prepare themselves for the highly challenging technical interviews. 

PeerPrep helps users to find a fellow peer who wants to work on a problem of similar difficulty, and allows them to work together and communicate with each other on the problem.

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
