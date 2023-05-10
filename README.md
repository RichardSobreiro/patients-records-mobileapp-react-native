<!-- @format -->

# Patients Records Mobile App with React Native and Typescript

A mobile app to help healthcare professionals manage their patient's records.

## Steps to Create Project

1. Create the project with Expo framework support

```
npx create-expo-app patients-records
cd patients-records
```

2. Add Typescript support

```
touch tsconfig.json
mv App.js App.tsx
npm start
```

Type y to install typescript dependencies (typescript, @types/react, @types/react-native).

3. Create Prettier configuration

```
touch .prettierrc.js
```

Paste the following content in .prettierrc.js:

```
module.exports = {
  semi: false,
  trailingComma: 'none',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
}
```

4. Sort imports

```
npm i --dev @trivago/prettier-plugin-sort-imports
```

Add plugin configuration to the Prettier config .prettierrc.js:

```
importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    // '^(.*)/components/(.*)$', // Add any folders you want to be separate
    '^(.*)/(?!generated)(.*)/(.*)$', // Everything not generated
    '^(.*)/generated/(.*)$', // Everything generated
    '^[./]' // Absolute path imports
  ]
```

5. Check code for errors

We are using TypeScript compiler and ESLint for this.

- TypeScript Compiler

Add new check-typescript script to our package.json:

```
...
"scripts": {
  ...
  "check-typescript": "tsc --noEmit"
},
...
```

Run **_npm run check-typescript_** command to check the code for errors with TypeScript compiler.

- ESLint

ESLint has a lot configuration options and rules.
We are using the eslint-config-universe package:

```
npm i --dev eslint-config-universe
npm i --dev eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm i --dev eslint-plugin-react-hooks
npm i --dev eslint-import-resolver-typescript
```

Add .eslintrc.js config file to the project root:

```
touch .eslintrc.js
```

Paste the follwing code in touch .eslintrc.js:

```
module.exports = {
  extends: ['universe', 'universe/shared/typescript-analysis', 'plugin:react-hooks/recommended'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  ],
  settings: {
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to ESLint
    }
  },
  /* for lint-staged */
  globals: {
    __dirname: true
  }
}
```

Run npm run check-eslint command to check our code for errors with ESLint and npm run check-eslint --fix to fix errors automatically.

- Lint script

We also combined TypeScript and ESLint checks together so we can run both at once.

Add new lint script to our package.json:

```
...
"scripts": {
  ...
  "lint": "npm run check-typescript && npm run check-eslint"
},
...
```

## Publishing the App with EAS Build

Take a look at the [Expo Build](https://docs.expo.dev/build/introduction/) page for more details.

1. npm install -g eas-cli
2. eas login
3. eas build:configure
4. eas build -p android --profile preview

## Setup Social Login with Google

Take a look at the [Expo Google Authentication](https://docs.expo.dev/guides/google-authentication/) page for more details.

# Run Locally (Windows)

## Start Android Emulator

1. Start the emulator

```
emulator @Pixel_4_API_UpsideDownCake -feature -Vulkan
```

2. Run the app

```
npm start
```

UPDATE ADB FILE
