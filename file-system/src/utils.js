const { ENV_ACCOUNT_PREFIX } = require("./constants");
const { ethers } = require('ethers');

require("dotenv").config();

const chunkArrayInGroups = (arr, size) => {
    const resArr = [];
  
    while (arr.length) {
      resArr.push(arr.splice(0, size));
    }
  
    return resArr;
}

const getAccountOrThrow = (accountName) => {
  const account = ENV_ACCOUNT_PREFIX + accountName.toUpperCase();
  if (!process.env[account]) throw new Error(`Could not find account ${account} (${accountName}) in environment`);
  try {
    return (new ethers.Wallet(process.env[account]));
  } catch (error) {
    throw new Error(`Invalid private key value for ${account} (${accountName}) in environment`);
  }
}

module.exports = {
    chunkArrayInGroups,
    getAccountOrThrow
}