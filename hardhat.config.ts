import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config"

import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

import "./tasks"


const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    mumbai: {
      url: `${process.env.NODE_URL}`,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
};

export default config;
