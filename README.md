# Video Game Library - Assignment 3/ Assignment 4

## Implemented:

* Full CRUD Operations
* Filtering and Pagination
* Statistics highlighted on the list
* Three types of charts supporting real time data updates

## Prerequisites

In order to build and run the application, the node.js + npm is required. Tested with: node 22.14.0 and npm 10.9.2

After downloading the repository run the command:

```bash
npm install
```

in order to fetch the required libraries

# Running the frontend application:

The application is developed and built using the `vite` framework.

In order to run the application in production
preview mode, use the command:

```bash
npm run build && npm run preview
```

The `preview` command will launch a web server. Please use the url displayed in order to open the application in browser

```
> mpp-videogames@1.0.0 preview
> vite preview

  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

```

# Running the unit tests:

Unit tests are developed using `vitest` framework and use `testing-library/react` to test React components.

In order to run unit tests use the command:

```bash
npm test
```

And in order to run the test with coverage, use the command:

```bash
npm run coverage
```
