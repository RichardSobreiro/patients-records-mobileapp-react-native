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

## Setup Social Login with Google

Take a look at the [Expo Google Authentication](https://docs.expo.dev/guides/google-authentication/) page for more details.

### Remarks

The Redirect URL which uses the proxy was removed due security reasons:

```
https://auth.expo.io/@richardsobreiro/patients-records
```

## Start Android Emulator and Run Locally (Windows)

1. Start the emulator

```
emulator @Pixel_4_API_UpsideDownCake -feature -Vulkan
```

- Restart the emulator from zero (delete all data)

```
emulator @Pixel_4_API_UpsideDownCake -feature -Vulkan -no-cache
```

2. Run the app

```
npm start
```

UPDATE ADB FILE

## Create the Production Build

### **[Check the EAS Build documentation before going into the following steps. EAS Build is a rapidly evolving service and those step may change in a weekly basis.](https://docs.expo.dev/build/setup/#install-the-latest-eas-cli)**

1. Install the latest EAS CLI

```
npm install -g eas-cli
```

2. Log in to your Expo account

```
eas login
```

3. [Configure the project](https://docs.expo.dev/build-reference/build-configuration/)

```
eas build:configure
```

4. Execute the build

- **preview** Profile for Android Local

```
eas build -p android --profile preview --local
```

- **preview** Profile for All platforms Remote

```
eas build -p all --profile preview
```

- **production** Profile

```
eas build -p android --profile production
```

## Create a Build Locally and Install it on Android Emulator (Windows 11)

1. [Install the Windows Subsystem for Linux (WSL2) and latest Ubuntu distribution](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-11-with-gui-support#1-overview)

2. Start the Ubuntu distribution and from the Ubuntu's linux bash shell cd to project directory

```
cd /mnt/c/github/patients-records-mobileapp-react-native/patients-records
```

3. [Install Expo CLI and EAS CLI in WSL](https://docs.expo.dev/archive/classic-updates/building-standalone-apps/?redirected)

```
npm install -g eas-cli
npm install -g expo-cli
```

4. Follow the instructions in following link:

- (Building a react native app in WSL2)[https://gist.github.com/bergmannjg/461958db03c6ae41a66d264ae6504ade]

- Execute only the following steps:
  - Install tools in Windows
  - Install tools in WSL2

5.  Create the local android build

```
npx expo run:android
npx expo run:android --variant release
npx expo run:android --variant debug
```
