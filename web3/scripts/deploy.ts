import hre from "hardhat";

async function main() {
  // Compile and deploy the contract
  const MyCustomToken = await hre.ethers.getContractFactory("MyCustomToken");
  const myCustomToken = await MyCustomToken.deploy();
  await myCustomToken.deployed();

  console.log("MyCustomToken deployed to:", myCustomToken.address);

  // Replace with the address to which you want to mint tokens and the amount
  const recipientAddress = "0xB702203B9FD0ee85aeDB9d314C075D480d716635";
  const mintAmount = hre.ethers.utils.parseUnits("100", 18); // Mint 90 tokens

  // Mint new tokens
  const tx = await myCustomToken.mint(recipientAddress, mintAmount);
  await tx.wait();

  console.log(`Minted ${mintAmount.toString()} tokens to ${recipientAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
