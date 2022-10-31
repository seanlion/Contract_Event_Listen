import BigNumber from "bignumber.js";
import { task } from "hardhat/config"
/*
 * Contract
 */
const ORACLE_MOCK = "0xC5533266c78Bb9ED46224a7a65351d500394B00b";

task("oracle-deploy")
  .setAction(async (taskArgs, hre) => {
    const ORACLE_CONTRACT = await hre.ethers.getContractFactory(
      "OracleMock"
    );
    const oracle = await ORACLE_CONTRACT.deploy();
    await oracle.deployed();
    console.log("oracle contract : ", oracle.address);
  });

task("oracle-setprice")
  .addParam("price")
  .setAction(async (taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt("OracleMock", ORACLE_MOCK);

    const price = new BigNumber(taskArgs.price)
      .multipliedBy(10 ** 6)
      .toString();

    const tx = await contract.setPrice(price);
    await tx.wait();

    const latestPrice = await contract.getLatestPrice();
    console.log("lastest price : ", latestPrice._price, latestPrice._timestamp);
  });