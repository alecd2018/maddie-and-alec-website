# Web Apps using JHipster

## Introduction

Jhipster is an open-soruce Yeoman generator that simplifies the creation of full stack web services and microservices. Since it is based on many industry standards for web development, I decided to experiment with it and make my own project in the hope of learning some of the best practices and tools for web development.

The following application is what I created.

## Technology Stack

When generating a JHipster project, there are many different cutting edge technology choices to select from. Below is a list of the technologies used for this specific project.

### Frontend

- Framework: Angular
- Build System: Webpack
- CSS Framework: Twitter Bootstrap

### Backend

- Framework: Sprint Boot 11
- Security Framework: Sprint Security
- Production Database: PostgreSQL
- Development Database: Liquibase
- Build System: Maven
- Deployment Framework: Heroku

## Usage

Go to [https://www.dean-family.herokuapp.com](http://www.dean-family.herokuapp.com) and log in with the following credentials:

- user name: user
- password: user

This application was generated using JHipster 6.3.1, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v6.3.1](https://www.jhipster.tech/documentation-archive/v6.3.1).

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

2. [Java 11][]: The back end of the application is based on Sprint Boot 11, which requires Java.

3. [docker-compose][]: I used docker-compose to run the PostgreSQL database, since JHipster provided the functionality already built in.

## JHipster Documentation

#### The following documentation is taken directly from JHipster's default README.md

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

    npm install

We use npm scripts and [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

    ./mvnw
    npm start

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all of the scripts available to run for this project.

### Building for production

#### Packaging as jar

To build the final jar and optimize the alec application for production, run:

    ./mvnw -Pprod clean verify

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

    java -jar target/*.jar

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

#### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

    ./mvnw -Pprod,war clean verify

### Testing

To launch your application's tests, run:

    ./mvnw verify

#### Client tests

Unit tests are run by [Jest][] and written with [Jasmine][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

    npm test

For more information, refer to the [Running tests page][].

#### Code quality

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker-compose -f src/main/docker/sonar.yml up -d
```

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```
./mvnw -Pprod clean verify sonar:sonar
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```
./mvnw initialize sonar:sonar
```

or

For more information, refer to the [Code quality page][].

### Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a postgresql database in a docker container, run:

    docker-compose -f src/main/docker/postgresql.yml up -d

To stop it and remove the container, run:

    docker-compose -f src/main/docker/postgresql.yml down

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

    ./mvnw -Pprod verify jib:dockerBuild

Then run:

    docker-compose -f src/main/docker/app.yml up -d

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.
