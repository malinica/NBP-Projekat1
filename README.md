# NBP-Projekat1

## Description
The project was developed as part of the **Advanced Databases** course.  
It is a **web application for auctions** that allows users to list items for auction, place bids, track results, and analyze the auction process.  
The application is divided into **backend** (API service in .NET) and **frontend** (user interface in React/TypeScript).

## Goal
The goal of the project is to demonstrate the integration of advanced databases with modern web applications through a practical auction scenario.  
Users can create accounts, list items, participate in bidding, and track results in real time.

## Features
- **User registration and login**
- **Adding items** to auction
- **Viewing active auctions** with item details
- **Bidding** – users can place bids in real time
- **Tracking auction results** (current price, number of bids, time remaining)
- **Closing auctions** and declaring winners
- **Auction history** – view completed auctions and winning bids
- **Administration** – manage users and auctions

## Technologies
- **Backend**: C#/.NET 9.0, REST API
- **Frontend**: TypeScript, React, CSS
- **Database**: Redis
- **Docker** – service orchestration

## Running the project
1. **Navigate to the ../backend folder and run the command `docker-compose up -d`**  
2. **Navigate to the ../backend/backend folder and run the command `dotnet run`**  
3. **Navigate to the ../frontend folder and run the command `npm run start`**  
