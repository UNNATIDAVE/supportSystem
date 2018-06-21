# Project Name - Ticket Based Support system using MEAN Stack
	A generic ticket based support system for resolving queries on a
	platform

## Project Description -
	Support is an essential feature for any platform, and dedicated support is
	best approach in case you are really concerned about the user experience
	of your platform.
	 The Aim of the project is to create an online ticket based support system,
	just like the one present on edwisor.com which should be usable by any
	kind of platform to get support queries from their users and resolve them.
	
This project should be a Single Page application with separate backend and
frontend. The backend should have REST APIs with proper documentation. Take
documentation from your previous project as reference.

You are allowed to use any kind of angular module, libraries or tool you want.
APIs have to be developed by you.

### Frontend Technologies allowed - 
	HTML 5, CSS, Javascript, Jquery and AngularJS

### Backend Technologies allowed - 
	NodeJs, ExpressJS, MongoDB.

### Features of the platform -
	1) Ticket Raising panel - User facing
	2) Ticket Resolution panel - Admin
	
	1) Ticket Raising panel - user end
		a) A view to login and Signup.
		b) A View to create a ticket. Get all the necessary information like
		name, email, phone number, Query title and Query details. File
		upload is optional.
		c) A View to view all queries raised  by the person.
		d) A view to show the details of a particular query. It should
		include the original question as well as the answer from admin
		and person in form of a conversation (chat like UI). This view
		should also have the option to set the status of the ticket to
		‘open’ or ‘closed’ depending on whether the query is resolved or
		not.
	2) Ticket Resolution Panel - Admin end
		a) View to Display ticket by status - This should list all tickets received
		by the support system. There should be a drop down menu to filter
		through the status of ticket. Ticket can be of status ‘open’ or ‘closed’
		depending on whether the query is resolved or not.
		b) A view to show the details of a particular query. It should include the
		original question as well as the answer from admin and person in
		form of a conversation (chat like UI). This view should also have the
		option to set the status of the ticket to ‘open’ or ‘closed’ depending on
		whether the query is resolved or not. The answer created here.
		
### Additional Features -
	1) On Status change of ticket, the person should receive an email
	notification.
	2) When the person receives the answer or the admin receives the
	reply, an email notification should be sent to the person concerned.
	3) For the sake of simplicity, treat the Admin as a user of the system.
	Don’t create special backend for admin.
	
### A few important points -
	1) Run the APIs in POSTMAN once to see the response format. That will
	enable you to easily use that in your Angular code.
	2) The frontend should be single page with well defined View, controllers,
	directives and services.
	3) Backend should follow MVC format and should have properly defined
	middlewares and libraries. Authentication should be done using JWT.
	3) Follow modern design guidelines while creating the view.
	4 Admin can be less intuitive, but try to make user experience as intuitive
	as you can
