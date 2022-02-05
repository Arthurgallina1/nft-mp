// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

const erc20Abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_spender", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_from", "type": "address" },
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transferFrom",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "name": "", "type": "uint8" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transfer",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        { "name": "_owner", "type": "address" },
        { "name": "_spender", "type": "address" }
      ],
      "name": "allowance",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    { "payable": true, "stateMutability": "payable", "type": "fallback" },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "owner", "type": "address" },
        { "indexed": true, "name": "spender", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "from", "type": "address" },
        { "indexed": true, "name": "to", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ]
  
const cUsdcMainNetAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

async function main() {
    const richAccount = '0x55fe002aeff02f77364de339a1292923a15844b8'
    await hre.network.provider.request({ method: "hardhat_impersonateAccount", params: [richAccount] })
    const signer = await hre.ethers.getSigner(richAccount)
    const contract = await new hre.ethers.Contract(cUsdcMainNetAddress,erc20Abi, signer)
    const vl = 100000000
    const numbUsdcToMint = (vl).toString();
    const richAccountBalance = await contract.balanceOf(richAccount)
    console.debug('rich balance', richAccountBalance.toString())
    const tx = await contract.transfer(account, numbUsdcToMint)
    const poorAccountBalance = await contract.balanceOf(account)
    console.debug('poor balance 2', poorAccountBalance.toString())
    return tx

}

main()
  .then((result) => {
    console.log('steal ok')
    return process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
