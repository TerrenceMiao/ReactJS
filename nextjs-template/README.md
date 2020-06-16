This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Set up Next.js project template

#### Create a basic Next.js app

```
𝜆 npx create-next-app
npx: installed 1 in 2.855s
✔ What is your project named? … nextjs-template
✔ Pick a template › Default starter app
Creating a new Next.js app in /Users/terrence/Projects/nextjs-template.

Installing react, react-dom, and next using npm...

> fsevents@1.2.13 install /Users/terrence/Projects/nextjs-template/node_modules/fsevents
> node install.js

  SOLINK_MODULE(target) Release/.node
  CXX(target) Release/obj.target/fse/fsevents.o
  SOLINK_MODULE(target) Release/fse.node

> @ampproject/toolbox-optimizer@2.4.0 postinstall /Users/terrence/Projects/nextjs-template/node_modules/@ampproject/toolbox-optimizer
> node lib/warmup.js

AMP Optimizer Downloading latest AMP runtime data
+ react@16.13.1
+ react-dom@16.13.1
+ next@9.4.4
added 835 packages from 327 contributors in 118.564s

Success! Created nextjs-template at /Users/terrence/Projects/nextjs-template
```

Delete `/pages/api` and move `/pages` to `/src/pages` directory:

```
𝜆 rm -rf pages/api/; mkdir src; mv pages/ src/
```

#### Add TypeScript

```
𝜆 touch tsconfig.json

𝜆 npm i typescript @types/react @types/node -D
+ @types/react@16.9.36
+ @types/node@14.0.13
+ typescript@3.9.5
added 5 packages from 71 contributors in 11.267s
```

By running the dev server, `tsconfig.json` will be automatically populated:

```
𝜆 npm run dev

> nextjs-template@0.1.0 dev /Users/terrence/Projects/nextjs-template
> next dev

ready - started server on http://localhost:3000
We detected TypeScript in your project and created a tsconfig.json file for you.

Your tsconfig.json has been populated with default values.

event - compiled successfully
wait  - compiling...
```

Rename `index.js` to `index.tsx`:

```
𝜆 mv src/pages/index.js src/pages/index.tsx
```

#### Add Sass

```
𝜆 npm i sass -D
+ sass@1.26.8
added 1 package from 1 contributor in 10.471s
```

#### Add Jest

```
𝜆 npm i jest @types/jest react-test-renderer -D
+ react-test-renderer@16.13.1
+ @types/jest@26.0.0
+ jest@26.0.1
added 574 packages from 259 contributors in 44.628s
```

Create a `.babelrc` file with:

```javascript
{
  "presets": ["next/babel"]
}
```

Add Jest scripts to `package.json`:

```javascript
{
  "scripts": {
    "test:watch": "jest --watchAll --collectCoverage",
    "test:unit": "jest --collectCoverage"
  }
}
```

#### Add React Testing Library

```
𝜆 npm i @testing-library/react -D
+ @testing-library/react@10.2.1
added 8 packages from 4 contributors in 16.38s
```

#### Add ESLint & Prettier

```
𝜆 npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react -D
+ eslint-plugin-react@7.20.0
+ eslint@7.2.0
+ @typescript-eslint/parser@3.3.0
+ @typescript-eslint/eslint-plugin@3.3.0
added 95 packages from 58 contributors in 30.4s

𝜆 npm i prettier eslint-config-prettier eslint-plugin-prettier -D
+ eslint-config-prettier@6.11.0
+ eslint-plugin-prettier@3.1.4
+ prettier@2.0.5
added 6 packages from 6 contributors in 15.141s
```

Create a `.eslintrc.js` file with:

``` javascript
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  settings: {
    react: {
      version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  },
  extends: [
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'react/react-in-jsx-scope': 'off'
  }
};
```

Create `prettier.config.js` file with:

``` javascript
module.exports = {
  printWidth: 140,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'none'
};
```

Create `.prettierignore` file with:

``` javascript
package.json
package-lock.json

tsconfig.json
newRelic.js
CHANGELOG.md
coverage
commitMessage.config.js
```

Add ESLint script to `package.json`:

``` javascript
{
  "scripts": {
    "lint": "eslint '*/**/*.{js,ts,tsx,scss}' --quiet --fix",
  }
}
```

#### Add lint-staged

```
𝜆 npx mrm lint-staged
npx: installed 236 in 23.299s
Running lint-staged...
Warning: calling config.defaults() is deprecated. Use the default property instead
Warning: calling config.values() is deprecated. Access values directly instead
Update package.json
Installing lint-staged and husky...

> husky@4.2.5 install /Users/terrence/Projects/ReactJS/nextjs-template/node_modules/husky
> node husky install

husky > Setting up git hooks
husky > Done

> husky@4.2.5 postinstall /Users/terrence/Projects/ReactJS/nextjs-template/node_modules/husky
> opencollective-postinstall || exit 0

+ lint-staged@10.2.10
+ husky@4.2.5
added 81 packages from 43 contributors in 19.561s
```

In `package.json` under "lint-staged", change "*.js" to "*.{js,ts,tsx,scss}":

``` javascript
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,ts,tsx,scss}": "eslint --cache --fix"
  }
}
```

#### Add Cypress

```
𝜆 npm i cypress -D

> cypress@4.8.0 postinstall /Users/terrence/Projects/ReactJS/nextjs-template/node_modules/cypress
> node index.js --exec install

Installing Cypress (version: 4.8.0)

  ✔  Downloaded Cypress
  ✔  Unzipped Cypress
  ✔  Finished Installation /Users/terrence/Library/Caches/Cypress/4.8.0

You can now open Cypress by running: node_modules/.bin/cypress open

https://on.cypress.io/installing-cypress

+ cypress@4.8.0
added 106 packages from 81 contributors in 98.662s
```

Add `cypress.json` with:

``` javascript
{
  "integrationFolder": "cypress/tests",
  "fixturesFolder": "false",
  "video": false
}
```

Run `cypress` to automatically configure based on the above config:

```
𝜆 npx cypress open
```

Add `tsconfig.json` in `cypress/` directory with:

``` javascript
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": "../node_modules",
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress"]
  },
  "include": [
    "**/*.ts"
  ]
}
```

Add Cypress scripts to `package.json`:

``` javascript
{
  "scripts": {
    "test:e2e:open": "cypress open",
    "test:e2e:run": "cypress run -b chrome"
  }
}
```

#### Add Commitzen

```
𝜆 npm i cz-customizable cz-customizable-ghooks -D
+ cz-customizable@6.2.0
+ cz-customizable-ghooks@1.5.0
added 28 packages from 10 contributors in 23.17s

𝜆 sudo npm i commitizen -g
Password:
npm WARN deprecated core-js@2.6.11: core-js@<3 is no longer maintained and not recommended for usage due to the number of issues. Please, upgrade your dependencies to the actual version of core-js@3.
/usr/local/bin/git-cz -> /usr/local/lib/node_modules/commitizen/bin/git-cz
/usr/local/bin/commitizen -> /usr/local/lib/node_modules/commitizen/bin/commitizen

> core-js@2.6.11 postinstall /usr/local/lib/node_modules/commitizen/node_modules/core-js
> node -e "try{require('./postinstall')}catch(e){}"

+ commitizen@4.1.2
added 214 packages from 171 contributors in 18.418s
```

Add `commitMessage.config.js` file with:

``` javascript
'use strict';

module.exports = {

  types: [
    { value: 'feat',     name: 'feat:     A new feature' },
    { value: 'fix',      name: 'fix:      A bug fix' },
    { value: 'docs',     name: 'docs:     Documentation only changes' },
    { value: 'style',    name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)' },
    { value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature' },
    { value: 'perf',     name: 'perf:     A code change that improves performance' },
    { value: 'test',     name: 'test:     Adding missing tests' },
    { value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation' },
    { value: 'revert',   name: 'revert:   Revert to a commit' },
    { value: 'WIP',      name: 'WIP:      Work in progress' }
  ],

  // Define your own scopes, but make sure that 'release' is a valid scope (for when Bamboo tries to commit changes back to the repository
  scopes: [
    { name: 'build' },
    { name: 'readme' },
    { name: 'contributing' },
    { name: 'release' } // RESERVED FOR BAMBOO - DO NOT USE DIRECTLY
  ],

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],

  // Appends the branch name to the footer of the commit. Useful for tracking commits after branches have been merged
  appendBranchNameToCommitMessage: false
};
```

Add Commitizen config to `package.json`:

``` javascript
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "cz-customizable-ghooks .git/COMMIT_EDITMSG"
    }
  },
  "lint-staged": {
    "*.{js,ts,tsx,scss}": "eslint --cache --fix"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    },
    "cz-customizable": {
      "config": "commitMessage.config.js"
    }
  }
}
```

**NOTE:** error raised when commit code, so "**commit-msg**" hook in `package.json` is omitted:

```
𝜆 npx cz-customizable-ghooks .git/COMMIT_EDITMSG
/Users/terrence/Projects/nextjs-template/node_modules/cz-customizable-ghooks/lib/index.js:169
  return buffer.toString().split('\n');
                ^
TypeError: Cannot read property 'toString' of undefined
    at getLinesFromBuffer (/Users/terrence/Projects/ReactJS/nextjs-template/node_modules/cz-customizable-ghooks/lib/index.js:169:17)
    at ReadFileContext.callback (/Users/terrence/Projects/ReactJS/nextjs-template/node_modules/cz-customizable-ghooks/lib/index.js:214:17)
    at FSReqCallback.readFileAfterOpen [as oncomplete] (fs.js:239:13)
```