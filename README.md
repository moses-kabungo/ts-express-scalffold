# USING THE SCAFFOLD

## Cloning
Clone the repo under different name and delete remote. e.g. to create an application named `my-app-name` do the following:

```sh
app='my-app'
repo='https://github.com/babajosh/ts-express-scalfold.git' && \
git clone '$repo' '$app'&& \
my-app-name && \
git remote remove origin
```

> Note: This scalffold uses yarn to as the build tool and to manage dependencies. If you are using npm, you can remove the `yarn.lock` file.

> Note: Do not forget to edit package.json. Add or modify details to fit yours.

## Customize environments

This scalffold uses `dotenv` to load environment variables. Create `.env` at the root of the project, i.e. where the same level as the root `package.json` file.

The two need variables are `PORT` and `HOST`. Copy and paste the following content into your `.env` file:

```sh
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
```

## Building

To run the scalffold simply type:

```sh
yarn install && yarn build # if you are using yarn
npm install && npm build # if you are using npm
```

The application should respond by creating the `dist` folder and start on desired port you configured in `.env`

## Testing the scalffold

This scalffold uses jest to facilitate testing. It is a good practise to use the scalffold in test watch mode during developement. You can do that by running

```sh
yarn install && yarn test # If you are using yarn
npm install && npm test # If you are using NPM
```