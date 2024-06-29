const solc = require("solc");

// //Compiler input structure
// const input = {
//   language: "Solidity",
//   sources: {
//     "test.sol": {
//       content: `
// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract HelloWorld {}
//             `,
//     },
//   },
// };

const compileSol = (input) => {
  // Compile the contract
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  // Check for errors
  if (output.errors) {
    // If there are errors, print each error message
    output.errors.forEach((err) => {
      console.error(err.formattedMessage);
      return 0;
    });
  } else {
    // If no errors, print a success message and the contract's ABI and bytecode
    return 1;
    // const contract = output.contracts['SimpleStorage.sol']['HelloWorld'];
    // console.log('ABI:', JSON.stringify(contract.abi));
    // console.log('Bytecode:', contract.evm.bytecode.object);
  }
};

module.exports = {compileSol}