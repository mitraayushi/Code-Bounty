const {
    Connection,
    PublicKey,
    Keypair,
    clusterApiUrl,
    Transaction,
    sendAndConfirmTransaction,
  } = require('@solana/web3.js');
  const {
    Token,
    TOKEN_PROGRAM_ID,
  } = require('@solana/spl-token');
  
  // Define network
  const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
  
  // Load sender's keypair
  const senderSecretKey = Uint8Array.from([/* Your sender's private key array here */]);
  const senderWallet = Keypair.fromSecretKey(senderSecretKey);
  
  // Define recipient and token addresses
  const recipientPublicKey = new PublicKey('RecipientPublicKeyHere');
  const tokenPublicKey = new PublicKey('TokenMintAddressHere');
  
  // Create a token object
  const token = new Token(
    connection,
    tokenPublicKey,
    TOKEN_PROGRAM_ID,
    senderWallet
  );
  
  async function transferToken() {
    try {
      // Get or create the associated token accounts for sender and recipient
      const senderTokenAccount = await token.getOrCreateAssociatedAccountInfo(senderWallet.publicKey);
      const recipientTokenAccount = await token.getOrCreateAssociatedAccountInfo(recipientPublicKey);
  
      // Create the transaction to transfer tokens
      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          senderTokenAccount.address,
          recipientTokenAccount.address,
          senderWallet.publicKey,
          [],
          1e6 // Amount of tokens to send (e.g., 1 CBT if decimals = 6)
        )
      );
  
      // Sign and send the transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderWallet]
      );
  
      console.log('Transfer successful, transaction signature:', signature);
    } catch (error) {
      console.error('Error transferring token:', error);
    }
  }
  
  transferToken();