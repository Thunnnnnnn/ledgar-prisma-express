# LEDGAR PROJECT

This is API for user accounting.                

## Features

- Manage user accounting
- Manage accounting

## Prerequisites

- Git
- NodeJs version 18 or higher
- Docker (Optional)

## Installation

- Installation Git, Nodejs version 18 or higher and Docker

- Clone this project to your repository 

      git clone https://github.com/Thunnnnnnn/ledgar-prisma-express

- if you install node success you can check your version

      node -v

### This project required branch dev

- switch branch using:

      git switch dev

- Install Dependencies: Navigate to the project directory and install all required modules by running:

      npm install

- But if you want to use Docker. Please be check a folder node_module in repository file and delete it

## Usage

- How to use this project
   - Start the Application: Run the application in development mode using:

         docker-compose up -d --build

   - If Docker is start you should run in cmd using:

         npm run db:push


## Port using

    http://localhost:3000
## API Endpoint

- Path: /users
  - GET /users (Get all user in database.)
    - Optional query page and limit
      
    EX.

        GET http://localhost:3000/users

        GET http://localhost:3000/users?page=1&limit=10

    - Default page = 1 and limit = 10 if you choose not send a query.

  - GET /users/:id (Get user in database)
    - Required id

    EX.
    
        GET http://localhost:3000/users/:id

  - POST /users (Create user in database)
    - Required body field
       - email
       - password
       - name (Optional)

    EX.
    
        POST http://localhost:3000/users

   - PUT /users/:id (Update user in database)
      - Required body field and params id
         - email
         - password
         - name

      EX.
      
         PUT http://localhost:3000/users/:id

  - DELETE /users/:id (Delete user in database)
    - Required params id

    EX.
    
        DELETE http://localhost:3000/users/:id

  - GET /users/payment-per-date/:id (Get summary about money that use per day until the end of the month.)
    - Required params id
   
    EX.

        GET http://localhost:3000/users/payment-per-date/:id

  - GET /users/export-payment/:id (Export all payment in this user to excel)
    - Required params id
      - excel file (Column have paymant type name and amount)
   
    EX.

        GET http://localhost:3000/users/export-payment/:id

  - POST /users/import-payment/:id (Import payment in user to database)
    - Required body field and params id

    EX.

        POST http://localhost:3000/users/import-payment/:id
  
- Path: /payment-types
  - GET /payment-types (Get all payment type in database.)
    - Optional query page and limit
      
    EX.

        GET http://localhost:3000/payment-types

        GET http://localhost:3000/payment-types?page=1&limit=10

    - Default page = 1 and limit = 10 if you choose not send a query.

  - POST /payment-types (Create payment type in database)
    - Required body field
       - name
       - increment (If income = true, If expense = false)

    EX.
    
        POST http://localhost:3000/payment-types

   - PUT /payment-types/:id (Update payment type in database)
      - Required body field and params id
         - name (Optional)
         - increment (Optional)

      EX.
      
         PUT http://localhost:3000/payment-types/:id

  - DELETE /payment-types/:id (Delete payment type in database)
    - Required params id

    EX.
    
        DELETE http://localhost:3000/payment-types/:id

- Path: /auth
  - POST /login (Login by email.)
    - Required body field
        - email
        - password
      
    EX.

        POST http://localhost:3000/auth/login


  - POST /logout (logout)
   
    EX.
    
        POST http://localhost:3000/auth/logout

- Path: /payments

   - GET /payments (Get all payments)

       - Optional you choose search some value if you want (month, year, user id, payment type id)
          - page (Default = 1)
          - limit (Default = 10)
          - month (number of month)
          - year (Anno Domini year)
          - userId
          - paymentTypeId

      EX.

         GET http://localhost:3000/payments
         GET http://localhost:3000/payments?page=1&limit=10
         GET http://localhost:3000/payments?month=12&year=2024
         GET http://localhost:3000/payments?year=2024&userId=1&paymentType=1&limit=20

  - GET /payments/:id (Get one payment)

      - Required params id
   
      EX.

        GET http://localhost:3000/payments/:id

  - POST /payments (Create payment)
 
     - Required body field

      - userId
      - paymentId
      - amount
      - transaction (Optional)
          - slipUrl (Optional)
          - note (Optional) (Can censor bad word (edit bad word in payment controller))
       
      EX.

        POST http://localhost:3000/payments

  - PUT /payments/:id (Update payment)

    - Required params id
    - Optional body field
   
      - userId (Optional)
      - paymentId (Optional)
      - amount (Optional)
      - transaction (Optional)
          - slipUrl (Optional)
          - note (Can censor bad word (edit bad word in payment controller))
       
     EX.

        PUT http://localhost:3000/payments/:id

  - DELETE /payments/:id (Delete payment)
 
      - Required params id
   
      EX.

        DELETE  http://localhost:3000/payments/:id
  

