const { TezosToolkit } = require('@taquito/taquito');
const { InMemorySigner } = require('@taquito/signer');

// Configuration
const RPC_URL = 'https://ghostnet-tezos.giganode.io'; // Replace with appropriate RPC URL
const PRIVATE_KEY = 'edsk...'; // Replace with your private key
const TOKEN_CONTRACT_ADDRESS = 'KT1TnNiUToG2dacjhfBUZNm56HY65fh6GBVK'; // Replace with your token contract address
const RECIPIENT_ADDRESS = 'KT1XD7f184pDm11rwarywiqHxcqG5zLbx3h7'; // Replace with the recipient's address
const TOKEN_ID = 100; // Replace with the appropriate token ID
const AMOUNT = 100; // Amount of tokens to transfer

async function transferTokens() {
    try {
        // Initialize Tezos toolkit and set the signer
        const tezos = new TezosToolkit(RPC_URL);
        tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(PRIVATE_KEY) });

        // Define the token contract
        const contract = await tezos.contract.at(TOKEN_CONTRACT_ADDRESS);

        // Transfer tokens
        const operation = await contract.methods.transfer([
            {
                from_: await tezos.signer.publicKeyHash(),
                txs: [
                    {
                        to_: RECIPIENT_ADDRESS,
                        token_id: TOKEN_ID,
                        amount: AMOUNT,
                    },
                ],
            },
        ]).send();

        // Await confirmation
        await operation.confirmation();

        console.log(`Transaction successful: ${operation.opHash}`);
    } catch (error) {
        console.error('Error transferring tokens:', error);
    }
}

// Execute the transfer
transferTokens();
