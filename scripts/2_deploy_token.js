// const hre = require('hardhat')

async function main() {
    const [deployer] = await ethers.getSigners();

    const TKToken = await ethers.getContractFactory("TKToken");
    const tkToken = await TKToken.deploy('1000000000000000000000');

    const TKTokenCapped = await ethers.getContractFactory("TKTokenCapped");
    const tkTokenCapped = await TKTokenCapped.deploy('1000000000000000000000');
  
    console.log("TKToken deployed to:", tkToken.address);
    
    await tkTokenCapped.deployed()
    console.log("TKTokenCapped deployed to:", tkTokenCapped.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  