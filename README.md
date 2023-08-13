# Kanban Inventory
This is the code repository for a minimalistic Inventory system powered by <a href="https://firebase.google.com">Firebase</a>. It is currently oriented to small companies following a B2B/B2C rental system.
###
<img align="middle" src="public/KanbanInv.png" class="pt-[10px]">

## Structure
The application is structured in 4 main pages:
1. Projects: In this page you can create/delete projects and assign products to it. It is structured using a Kanban-inspired Drag & Drop component. The project types can be added/deleted from the settings menu in the Navbar.
2. Inventory: In this page you can add/delete/query products that can then be assigned to projects. Upon creation they are set to have "In Stock" state by default. Only "In Stock" state products can be assigned to projects. 
3. Calendar (TODO:construction:): A calendar view of the projects page.
4. Dashboard (TODO:construction:): Analytics page.

## Get Started.
To get started:
1. Clone the repo & `npm install` dependencies.
2. Create a Firebase <a href="https://firebase.google.com/docs/firestore/quickstart">Firestore database</a>.
3. Save the Firebase credentials in a `.env` file in the root folder of the project.
4. Currently the app only supports email login, so create a user in Firebase-->Authentication, and give it read and write access to the previously created Firestore database.
5. `npm start` the App.
6. Create a few products in the Inventory page, and a Project Type in the Settings/Projects Settings.
