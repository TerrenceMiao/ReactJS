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

``` js
{
  "presets": ["next/babel"]
}
```

Add Jest scripts to `package.json`:

``` js
{
  ...
    "test:watch": "jest --watchAll --collectCoverage",
    "test:unit": "jest --collectCoverage"
  ...
}
```