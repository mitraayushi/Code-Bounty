const { TezosToolkit } = require('@taquito/taquito');
const { RpcClient } = require('@taquito/rpc');

const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

async function getPublicKey(address) {
    try {
        const rpcClient = new RpcClient('https://ghostnet.ecadinfra.com');
        const managerKey = await rpcClient.getManagerKey(address);
        if (managerKey) {
            console.log('Public Key:', managerKey);
        } else {
            console.log('Public Key has not been revealed.');
        }
    } catch (error) {
        console.error('Error fetching public key:', error);
    }
}

getPublicKey('tz1L51Y2naZNYYZtM8i8QfcYtQFzhsvGUsbL');
