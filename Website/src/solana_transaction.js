const { Connection, PublicKey, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');

const connection = new Connection('https://api.testnet.solana.com', 'confirmed');

const senderPrivateKey = '5qTBeUrbDbymr8Gx7ur9gj1GywCMXq7PvEmiods2H6pK9dMb2EmEjuMBbAEVSiHKUL3HXj3RsrPYKT6L6pLHbTLv'; // Private key of sender wallet
const senderPublicKey = "8ogosbkoLdHBzVPrtdAAVMP9ckXYATgabtmKVpk4Xain"; // Public key of sender wallet
const receiverPublicKey = 'J4xWT1gt7yAUQdmKaXTvo53Rfw8ZVC4knNfmy5Sc1q24'; // Public key of receiver wallet

const tokenProgramId = new PublicKey('TokenGoirgJE3Lot6StyVCADXmuEnAdD9LPsEkh1c4wYSUS6z'); // Replace with actual Token Program ID

async function transferSPLToken() {
    const transaction = new Transaction().add(
        await Token.createTransferInstruction(
            tokenProgramId,
            new PublicKey(senderPublicKey),
            new PublicKey(receiverPublicKey),
            [], // Assuming you're not using additional instructions
            1000 // Amount (typically 1 for standard SPL tokens)
        )
    );

    // Sign the transaction
    const signedTransaction = await connection.sendTransaction(
        transaction,
        [new Account(Buffer.from(senderPrivateKey, 'hex'))], // Signers
        { skipPreflight: false, preflightCommitment: 'confirmed' }
    );

    // Confirm the transaction
    await connection.confirmTransaction(signedTransaction);
}

transferSPLToken().then(() => console.log('Transaction confirmed')).catch(err => console.error('Error:', err));
