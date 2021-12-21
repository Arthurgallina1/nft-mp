// const hre = require('hardhat')

async function main() {
    const [deployer] = await ethers.getSigners();

    const TKToken = await ethers.getContractFactory("TKToken");
    const tkToken = await TKToken.deploy(deployer.address);
  
    console.log("TKToken deployed to:", tkToken.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  