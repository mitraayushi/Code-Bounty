function isValidTezosAddress(address) {
    // Tezos addresses should be 36 characters long
    if (typeof address !== 'string' || address.length !== 36) {
        return false;
    }

    // Regular expression to match valid Tezos addresses
    const tezosAddressRegex = /^(tz1|tz2|tz3|KT1)[1-9A-HJ-NP-Za-km-z]{33}$/;

    return tezosAddressRegex.test(address);
}

// Example usage:
const tezosAddress = "KT1XD7f184pDm11rwarywiqHxcqG5zLbx3h7";
if (isValidTezosAddress(tezosAddress)) {
    console.log(`The Tezos address ${tezosAddress} is valid.`);
} else {
    console.log(`The Tezos address ${tezosAddress} is not valid.`);
}
