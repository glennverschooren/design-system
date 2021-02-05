# Installation

## NodeJS

To work with this project a recent LTS version of NodeJS and npm is required. Make sure you've installed and/or updated [Node](https://nodejs.org/en/) before continuing.

!> Note that you will need to use npm 6 or higher.

## Run Baloise Ui-Library

To start building a new web component using Stencil, clone this repo to a new directory:

```bash
git clone https://github.com/baloise/ui-library.git ui-library
cd ui-library
```

- Run `npm install` to install library’s dependencies
- Run `npm run build` to build the library
- Run `npm run lib:serve` to serve UI library demo page

> The demo page will be served at http://localhost:3333/ by default.

For more commands visit [Commands](./commands.md)

## Run Baloise Ui-Library Documentation

To create the documentation out of the written code and comments run the following commands:

- Run `npm install` to install library’s dependencies
- Run `npm run docs:install` to install documentation's dependencies
- Run `npm run docs:build` to build the documentation
- Run `npm run docs:serve` to serve documentation page

> The documentation page will be served at http://localhost:3000/ by default.

For more commands visit [Commands](./commands.md)