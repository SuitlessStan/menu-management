# Menu Management Application

This application is a comprehensive menu management system built with Node.js, MySQL, and Docker. It allows for the creation, retrieval and updating, categories, and subcategories. The application also includes health check endpoints and robust error handling.

The application is containerized using Docker and Docker Compose, running multiple services including a Node.js application, MySQL, and PHPMyAdmin. The Node.js application runs on port 4000, MySQL on port 8989, and PHPMyAdmin on port 8080. These ports are mapped to your local machine, allowing for easy access to PHPMyAdmin's graphical interface at localhost://8080.

Below, you'll find details on the project structure, how to get started, how to run tests, and information on the various API endpoints.

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running tests](#running-tests)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Categories](#categories)
  - [Subcategories](#subcategories)
  - [Items](#items)
  - [Create](#create)
  - [Update](#update)
  - [Error Handling](#error-handling)
  - [Middleware](#middleware)
  - [Logging](#logging)
  - [Cross-Origin Resource Sharing (CORS)](#cross-origin-resource-sharing-cors)
  - [Configuration](#configuration)
  - [Dependencies](#dependencies)

# Project Structure

The main components of this project are:

- `migrations`: Contains migration files to create or change the database structure.
- `lib/app.js`: The starter file that creates the server and serves as the main point of the application.
- `lib/workflow/index.js`: Houses the main application middleware.
- `lib/workflow/schema.js`: Defines the schema to validate incoming requests.
- `lib/models`: Includes database models for direct access to database tables.
- `lib/utils`: Provides utilities for handling errors and accessibility options for the application.
- `tests`: Contains integration tests for models and the API.
  

# Getting Started

The main Node.js module of this application is located in /lib/app.js. To ensure the correct configuration of Knex, the application also imports a config.js file that must be created beforehand.

1. Edit the .env file to include the values for the environmental variables. For example : 

```
MYSQL_HOST = menu-management-sql # has to be the same name as the mysql docker container
MYSQL_USER = root
MYSQL_PASSWORD = root
MYSQL_DATABASE = menu
MYSQL_PORT = 3306 # mysql's docker container port is 3306
MYSQL_ROOT_PASSWORD = root
```

2. Create a `config.js` file in the base of the app's directory

```
config = {
  port: process.env.PORT || 4000,
  mysql: {
    host:  process.env.MYSQL_HOST || "menu-management-sql",
    database:  process.env.MYSQL_DATABASE || "menu",
    user: "root" ,
    password: "root" ,
    port: 3306
  },
}

export { config }

```

3. Run the docker-compose build command. Or docker compose depending on your version of docker compose **(NOTE: The node_modules directory is installed within the application's Docker container. Any new packages that are installed are added to the package.json file, and then the Docker-compose build command is run again)**

```
#!/bin/bash

docker-compose up --build
```

4. You have to bash into the node application's docker container to be able to install the migrations for the category, subcategory and items models 

```
#!/bin/bash

docker exec menu-management bash
```
and then 

```
#!/bin/bash

npm run migrate:up
```

# Running tests 

In order to run the tests in tests directory, you have to bash into the node application's docker container. Example
```
#!/bin/bash

docker-compose docker exec -it menu-management bash
```

then 
```
#!/bin/bash

npm run test
```

# API Endpoints
## Health Check

- GET /v1/health: Check the health of the server.

## Categories

- GET /v1/categories: Get all categories.
- GET /v1/categories/:id([0-9]+): Get a category by numeric ID.
- GET /v1/categories/:name([a-zA-Z]+): Get a category by name.

## Subcategories

- GET /v1/subcategories: Get all subcategories.
- GET /v1/subcategories/:id([0-9]+): Get a subcategory by numeric ID.
- GET /v1/subcategories/:name([a-zA-Z]+): Get a subcategory by name.

## Items

- GET /v1/items: Get all items.
- GET /v1/items/:id([0-9]+): Get an item by numeric ID.
- GET /v1/items/:name([a-zA-Z]+): Get an item by name.
- GET /v1/search: Search for an item.

## Create

- POST /v1/categories: Create a new category.
- POST /v1/categories/:category_id/subcategories: Create a subcategory under a category.
- POST /v1/categories/:category_id/items: Create an item under a category.
- POST /v1/subcategories/:subcategory_id/items: Create an item under a subcategory.

## Update

- PUT /v1/categories/:id: Update a category.
- PUT /v1/subcategories/:id: Update a subcategory.
- PUT /v1/items/:id: Update an item.

## Error Handling

Errors are handled globally using middleware. Internal server errors result in a 500 status code.

## Middleware

Middleware functions handle database operations and request processing.
They are responsible for querying, creating, updating, and deleting data from the database.

## Logging

HTTP request logging is implemented using Morgan middleware.

## Cross-Origin Resource Sharing (CORS)

Cross-origin resource sharing is enabled to allow requests from different origins.(only during developement)

## Configuration

Database connection details are specified in the config.js file.
Environment-specific configurations can be set in this file.

## Dependencies

This project uses the following key dependencies:

- `Express.js`: Serves as the web server framework.
- `Knex.js`: Used as the SQL query builder.
- `cors`: Handles cross-origin requests.
- `morgan`: Provides HTTP request logging.

Additional dependencies may be found in the `package.json` file.
