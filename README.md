## Setup

1. clone the project from the terminal
   git clone https://github.com/KaanAkkaya94/Group-Visa-Application-System.git
2. change the current path to the project,
   npm run install-all
3. create an .env file in the project, add the mongodb uri , jwt secret and port
   MONGO_URI=
   JWT_SECRET=
   PORT=
4. after all libraries have been installed,
   type 'npm start'

**Users**

**Login**

## User

e.g.
Email: Steven@gmail.com
Password: steven

## Admin

name: admin
Email: admin@gmail.com

---

**Register**

Feel free to create/delete new users, which are added to MongoDB

1. Logout
2. Register (Name, Email, Password needed)
3. Login with the new credentials

**Update Profile**

1. Login
2. Click on "Profile"
3. Change/add details
4. Click on "Update Profile"

**Applications**

**Create new Application**

1. Login
2. Click on "Applications" (either from the main page or with the button in the Navbar)
3. Fill in the application form
4. Click on "Submit Application"

---

**View Applications**

1. Login
2. Click on "Applications" (either from the main page or with the button in the Navbar)
3. View existing applications of the user beneath the application form

---

**Edit Application**

1. Login
2. Click on "Applications" (either from the main page or with the button in the Navbar)
3. View existing applications of the user beneath the application form
4. Click on "Edit"
5. Fill in the application form with new details
6. Click on "Update Application"

---

**Delete Application**

1. Login
2. Click on Applications (either from the main page or with the button in the Navbar)
3. View existing applications of the user beneath the application form
4. Click on "Delete"

## Application for Admin

1. Login with admin account
2. admin can create, view, delete, edit and access invoice page to do the same action as user. Admin can change the status of the application to "Rejected", "Approval", "Pre-payment", "Pending".
3. if status is "Rejected", "Approval", edit and deletion action are disabled.

**Invoice**

**Create new Invoice**

1. Login
2. Click on "Applications" (either from the main page or with the button in the Navbar)
3. View existing applications of the user beneath the application form
4. Click on "Request Invoice"
5. Choose payment method from the drop down menu
6. Provide Payment Details
7. Click on "Request Invoice"
8. Once the invoice is created, status will change to ''

---

**View Invoice**

1. Login
2. Click on "Applications" (either from the main page or with the button in the Navbar)
3. View existing applications of the user beneath the application form
4. Click on "View Invoice"

---

**Update Invoice**

1. Login
2. Click on "Applications" (either from the main page or with the button in the Navbar)
3. View existing applications of the user beneath the application form
4. Click on "View Invoice"
5. Click on "Edit Invoice"
6. Choose new payment method fromt the drop down menu
7. Provide Payment Details
8. Click on "Save Changes"

---

**Delete Invoice**

1. Login
2. Click on "Applications" (either from the main page or with the button in the Navbar)
3. View existing applications of the user beneath the application form
4. Click on "Delete Invoice" (An Invoice must exist)

**Ticket**

### For user to ask questions about the application and admin to handle general enquiry

1. Login
2. Click on "Ticket" (either from the main page or with the button in the Navbar)
3. User can view the ticket created, edit and delete when the status is "In Progress".
4. Admin can edit, view and delete all tickets and chagne the status to "Completion".

**UserManagement**

### For user management

1. Login with admin account
2. click the 'Users' on the navbar, the top of the website.
3. view, edit and delete the user.

**Requirement**

1. **Choose a Real-World Application**

E-Visa Management System

2. **Project Design with System Diagram**

- We created a System Diagram to show the software and hardware components of the E-Visa Management System. This diagram was used to present the overall architecture of the system.

**3. Backend Development (Node.js + Express + MongoDB)**

- Set up and configure the MongoDB database connection.
- Implement various backend functions for handling application data.Ensure that all functions are compatible with an Application Programming Interface (API) structure(Follow existing patterns used in the Task Manager App where applicable).
- Implement CRUD operations forcreating, reading, updating, and deleting records for each functionality.

4. **Frontend Development (React.js)**

- Create a user-friendly interface to interact with your API endpoint (Follow task manager app).
- Implement different forms for adding, updating, and deleting records.
- Display data using tables, cards, or lists (Follow how we showed data in task manager app, try to implement better visualization for the frontend.)

**5. Authentication & Authorization** (Prerequisite Task)

- Ensure only authenticated users can access and perform CRUD operations. (Already developed in your project)
- Use JWT (JSON Web Tokens) for user authentication (Use the task manager one from .env file).

**6. GitHub Version Control & Branching Strategy**

- Use GitHub for version control and maintain:
- main branch (stable production-ready code)
- Difference branches for each developer
- Follow proper commit messages and pull request (PR) for code reviews.

**7. CI/CD Pipeline Setup**

- Implement a CI/CD pipeline using GitHub Actions to:
- Automatically run tests on every commit/pull request (Optional).
- Deploy the backend to AWS. (Use the QUT provided EC2 instance)
- Deploy the frontend to AWS.
- Document your CI/CD workflow in the README.

---

**Submission Requirements**

**A report **contains** the following (Provide screenshots as evidence for each implemented task. **The screenshot should **contain** your username** from JIRA, GITHUB, and AWS**):

- **JIRA Project **Management**(Provide screenshots in the **report o**f at least two epics**, **including user story, sub**t**a**sks**. **Please **don’t** provide **the **U**ser Authentication** epic**.**Provide your JIRA Board URL in the report and README file as well.**Through the JIRA Board, we will systematically review the completeness of the project features, organised under Epics, User Stories, and Sub-tasks.**
- Requirement diagram, Block Definition Diagram (BDD), Parametric Diagram (Using project features).
- **GitHub Repository (backend/ and frontend/)** link. We will **review** your code implementation, which you followed from the task description. We will also **review** your commits, main branch, feature branches, and pull requests. **(**Please note that the authorisation** (Log In, Registration)** is the prerequisite for backend development.**)**
- CI/CD pipeline details step by step screenshot.
- README.md with:
- Project setup instructions.
- Public URL of your project.
- Provide a project-specific username and password if we need to access your dashboard.

---

**Assessment Criteria:**

- Clarity and completeness of Jira board and SysML models.
- Adherence to Git best practices and practical contributions.
- Successful implementation, deploymentand CI/CD pipeline.
- Problem-solving skills and the ability to go beyond basic requirements.
