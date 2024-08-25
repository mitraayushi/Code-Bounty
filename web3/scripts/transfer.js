// tokenTransfer.js

import hre from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

export async function transfer(recipientAddress, amount) {
    const contractAddress = process.env.CONTRACT_ADDRESS || ""; // Replace with your contract's address
    const MyCustomToken = await hre.ethers.getContractFactory("MyCustomToken");
    const myCustomToken = MyCustomToken.attach(contractAddress);

    const tranc = await myCustomToken.transfer(recipientAddress, amount);
    await tranc.wait();
    console.log(`Transacted ${amount} tokens to ${recipientAddress}`);
}
