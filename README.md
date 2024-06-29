## TokenCreate

1. "dependencies":{
    "@metaplex-foundation/mpl-candy-machine":,
    "@metaplex-foundation/mpl-token-metadata":,
    "@metaplex-foundation/umi":,
    "@metaplex-foundation/umi-bundle-defaults":,
    "@solana/web3.js":,
    "bs58":,
    "fs":,
    "ts-node":
}

2. Generate Wallet:
```sh
npx ts-node wallet.ts
```
3. Generate key:
```sh
guideSecret.json
```
4. Minting Token in Solana:
```sh
npx ts-node mint.ts
```

## Website

1. 
my-token-project/
├── website/
│   ├── src/
│   │   ├── codemirror-5.65.16/
│   │   ├── fonts/
│   │   ├── backend.js
│   │   ├── cbt_logo.png
│   │   ├── code_editor.css
│   │   ├── code_editor.html
│   │   ├── home.css
│   │   ├── home.html
│   │   ├── landing.css
│   │   ├── landing.html
│   │   ├── login.css
│   │   ├── login.html
│   │   ├── profile.css
│   │   ├── profile.html
│   │   ├── question.html
│   │   ├── question.css
│   │   ├── signup.html
│   │   ├── signup.css
│   │   ├── solana_transaction.js
│   │   ├── solidity.js
│   │   ├── tezos_transaction.js
│   │   ├── tezon_token_check.js
│   │   ├── wallet.html
│   │   ├── wallet.css
│   ├── server.js
├── TokenCreated/
│   ├── wallet.ts
│   ├── mint.ts
│   ├── guideSecret.json
├── package.json
├── tsconfig.json
└── README.md



2. 
"dependencies":{
        "@solana/web3.js":,
        "@taquito/remote-signer":,
        "@taquito/signer":,
        "@taquito/taquito":,
        "bcrypt":,
        "body-parser":,
        "compilex":,
        "cookie-parser":,
        "express":,
        "mongodb":,
        "mongoose":,
        "nodemon":,
        "solc":
}

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/mitraayushi/Code-Bounty.git
   ```
2. Navigate to the project directory:
   ```sh
   cd Website
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage

To start the application, run:
```sh
npm node server.js
```

Open your browser and navigate to `http://localhost:5000` to access Socratech.