# Pickcel

A cloud based signage provider

# Prerequisites
- Node
- NPM
- Git
- MongoDB
- Express
- React
- Redux
- React Router

## Commands
For install dependencie
> npm install

For start dev server on local (Nodejs + React)
> npm run dev

For compile our Nodejs + React app
> npm run build

For compile front-end assets (css, images, fonts, ...)
> npm run fe:prod

For watching changes front-end assets (css, images, fonts, ...)
> npm run fe:watch

`All generated file will be placed in /dist/ folder (included: HTML, CSS, JavaScript, Images, Fonts, ...`

# Note: Using /dist/ folder with generated HTML files for doing back-end integration
# Must be running `npm run fe:prod` before `npm run build` cause `bundle.js` of `npm run build` script is gonna be deleted if you trying to run `npm run fe:prod` after that (Cause `bundle.js` is inside /dist folder)
