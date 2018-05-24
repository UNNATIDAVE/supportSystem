# Support System , A Ticket based Support System

## How to use
 # For New User
  1. Create your account
  2. login using your mailId
  3. Create tickets
  4. Get the solutions from admin panel
  5. you can send a message to admin
  6. you will receive a mails regarding your tickets status
 # For Admin
* Please signup with email **admin@supportsystem.com** to get the admin access of this system.

## Features
	1) Login
	2) Signup
        1. A welcome mail is sent on successful signup.
        2. Password is encrypted with 'bcrypt' module.
	3) Ticket Dashboard -User Facing
		    1. A view to create a ticket.
		    2. A view to display all queries raised by the user with status filter options.
        3.Search functionality is enabled in dashboard view. 
		    4. To view a particular query details.
		    5. File upload feature.
        6. A Chat box that establishes a direct communication between admin and user.
        7. This view has the option to set the status of the ticket to "close" / "delete" option is also present in this view. 
	4) Ticket Resolution panel - Admin facing
		    1. A view to display tickets by all users with their name and status of the ticket. There are buttons to filter through the status of ticket and search functionality is enabled in this view.
		    2. A view to show the details of a particular query.
        4. A Chat box that establishes a direct communication between admin and user.
        5. This view has the option to set the status of the ticket to ‘open’ or ‘closed’ depending on whether the query is resolved or not.
	5) Additional Features
        1. A welcome mail is sent on successful signup.
        2. When the status of ticket is change an email noticaion is sent to user.
	6) Security
		    - Secured with JWT.
		    - Default JWT expiry time is set to 45 minutes.
   8) Forgot password.
        - User can reset the password and user get the mail of new password.
        
## Prerequisites
	1) Nodejs
	2) Mongodb
	3) NPM

## Installing

Setting up the local server

** Note :
    - Start mongo server before running the application.
    - Run npm install command in command prompt

## Built With

* Angular Js
* Node Js
* MongoDb
