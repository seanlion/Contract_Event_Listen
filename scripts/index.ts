import {ethers} from "ethers";
import oracleABI from "../abis/OracleMock.json";
import {gql, GraphQLClient} from 'graphql-request';
import dotenv from 'dotenv';
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
const signer = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);
const ORACLE="0xC5533266c78Bb9ED46224a7a65351d500394B00b";
const ENDPOINT = process.env.SUBGRAPH_ENDPOINT;
const client = new GraphQLClient(ENDPOINT, { headers: {} });

async function _request(block:number){
    const query = gql`
      query manyOracles($minBlock: Int!) {
        kiOracles(
          first: 10
          orderBy: timestamp
          orderDirection: desc
          block: { number_gte: $minBlock }
        ) {
            id
            timestamp
            price
        }}`;
    const variables = {
      minBlock: block,
    };

    return await client.request(query, variables);
} 

function main(){
    console.log("main start---");
    const contract = new ethers.Contract(ORACLE, oracleABI.abi, signer);

    contract.on('PriceUpdate', async (_,__, ___, event) => {
      console.log("Subgraph update");
      try{
        const data = await _request(parseInt(event.blockNumber));
        console.log("data length, ", data.kiOracles.length);
        console.log("data", data);
        console.log("event : ", event.blockNumber);
      } catch(e){
        console.log("error :", e);
        // while 같은 loop를 돌려야 함.
        //if (e.message.includes('has only indexed up to block number')) {
          //               await wait(1000);
          //             } else {
          //               throw e;
          //             }
        throw e;
      }
    })
}

main();