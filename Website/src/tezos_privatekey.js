const { InMemorySigner } = require('@taquito/signer');
const bip39 = require('bip39');
const { createHash } = require('crypto');

async function deriveTezosPrivateKeyFromMnemonic(words) {
    try {
        // Join the words into a mnemonic phrase
        const mnemonic = words.join(' ');

        // Derive the seed from the mnemonic
        const seed = await bip39.mnemonicToSeed(mnemonic);

        // Generate the Tezos private key from the seed
        const privateKey = createHash('sha512').update(seed).digest().slice(0, 32);
        console.log('Private Key:', privateKey.toString('hex'));

        // Get the public key hash (tz1 address)
        const signer = await InMemorySigner.fromSecretKey(privateKey);
        const publicKeyHash = await signer.publicKeyHash();
        console.log('Public Key Hash:', publicKeyHash);

        return { privateKey: privateKey.toString('hex'), publicKeyHash, mnemonic };
    } catch (error) {
        console.error('Error deriving Tezos private key:', error);
    }
}

// List of words corresponding to the mnemonic phrase
const words = [
    'deliver', 'elder', 'carry', 'decline', 'marine', 'drive', 'aerobic', 'seed',
    'flower', 'grit', 'try', 'place', 'same', 'pole', 'mechanic', 'cross', 'team',
    'spoil', 'train', 'error', 'runway', 'gas', 'crazy', 'bonus'
];

deriveTezosPrivateKeyFromMnemonic(words);
