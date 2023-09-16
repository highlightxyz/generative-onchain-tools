# generative-onchain-tools

Generative art collections are Highlight are sets of NFTs that are rendered by an artist's code at the time they're minted. 

- [How to make generative art on Highlight](https://github.com/highlightxyz/generative-art/tree/main)

# Generative Series File System

- [File deployment context](#file-deployment)
- [File management context](#file-management)
- [Setup](#setup)
- [Check how much it costs to deploy a file](#check-a-files-deploy-cost)
- [Deploy a file](#deploy-a-file)
- [Add a file to a file system](#add-a-file)
- [Remove a file from a file system](#remove-a-file)

The File System client is a CLI tool to upload generative art projects on-chain, and manage your on-chain file systems. Each Generative Series contract hosts its own FileSystem to enable flexibility. 

Writing a new file on-chain consists of two major steps: deploying the file, and adding it to a contract's file system. Since this process is modular, creators can easily add files that are already deployed (to a given chain) to their contract's file system, without having to deploy a new copy themselves. For example, Highlight has deployed the minified version of [p5.js 1.6.0](https://github.com/processing/p5.js/releases/tag/v1.6.0) to Base (mainnet) and Goerli (testnet) already. The tools in this repository make both steps extremely easy, and are flexible to customization.

---

**Supported networks**

All 12 networks that are supported on [Highlight](https://highlight.xyz/) are supported here. They are:

| Chain    | Supported networks (chainId)     | CLI name (used in CLI args) |
| -------- | -------------------------------- | -------------------------   |
| Ethereum | Mainnet (1), Goerli (5)          | ethereum, goerli            |
| Polygon  | Mainnet (137), Mumbai (80001)    | polygon, mumbai             |
| Arbitrum | Mainnet (42161), Goerli (421613) | arbitrum, arbitrum-goerli   |
| Optimism | Mainnet (10), Goerli (420)       | optimism, optimism-goerli   |
| Base     | Mainnet (8453), Goerli (84531)   | base, base-goerli           |
| Zora     | Mainnet (7777777), Goerli (999)  | zora, zora-goerli           |

---

## File deployment

When you deploy a Generative Series collection on Highlight, your contract has a file system built in that will let you, the creator, put your project on-chain. The most gas-efficient way of storing files on-chain (on the storage trie) is to deploy file contents as the raw bytecode of new smart contracts. Highlight has deployed a light-weight factory called the "FileDeployer", which uses parts of [SSTORE2](https://github.com/transmissions11/solmate/blob/main/src/utils/SSTORE2.sol) by [Solmate](https://github.com/transmissions11/solmate/tree/main) to deploy text as contract bytecode. 

- [File Deployer](https://github.com/highlightxyz/hl-evm-contracts/tree/main/contracts/erc721/onchain/FileDeployer.sol)

As per [EIP-170](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-170.md), smart contracts on Ethereum have a 24kb size limit. Therefore, files over 24kb need to be partitioned into chunks of 24kb and uploaded. Additionally, deploying a 24kb smart contract costs about 5M compute units. While different chains place different limits on the total amount of compute units a single block can consume, Ethereum's (and most L2's) limit is 30M. 

The deploy tool in this repository currently chunks files into 20kb blocks, and deploys a maximum of 4 contracts per transaction. Deploying files that are larger than 80kb will submit multiple transactions. Although on most chains this config can be bumped up, this allows users of chains with a 20M block compute limit to deploy files through the deploy tool. Users deploying files that are greater than 20kb but less than 24kb may want to update `file-system/src/constants.js` to bump the config. A maximum configuration would probably consist of 24kb chunks with 5 contracts being deployed per transaction.

Once deployed as bytecode, an uploaded chunk can be read by converting the bytes back to human-readable text. Files split up into chunks can be read by appending the text of each deployed contract together. The file system on each Generative Series contract handles the conversion and concatenation of bytecode into a file's full contents. 

---

## File management

Once a file is "uploaded" to the chain, with its content stored in bytes format, the owner of a Highlight Generative Series contract can add a file to the 

- [Onchain file system](https://github.com/highlightxyz/hl-evm-contracts/tree/main/contracts/erc721/onchain/OnchainFileStorage.sol)

The file system has 5 functions:

| Function       | Type  | Parameters                     | Description                        |
| -------------- | ----- | ------------------------------ | ---------------------------------- |
| `addFile`      | write | fileName, fileStorageAddresses | Add a file to the file system      |
| `removeFile`   | write | fileName                       | Remove a file from the file system |
| `fileStorage`  | read  | fileName                       | Return addresses that make up file |
| `fileContents` | read  | fileName                       | Return human-readable contents     |
| `files`        | read  |                                | Return all file names in system    |

fileStorageAddresses are the addresses that hold the bytecode making up the contents of a file. Concatenating the human-readable version of the bytecode at these addresses returns the full file contents, which is what `fileContents` does.

This repository has tools to add and remove files from a file system. To read a contract's file system, it is recommended to access the contract's interface on a block explorer, like Etherscan. 

---

## Usage

There are 4 functions supported here: 

- Deploying a file
- Checking the cost to deploy a file
- Adding a file to a file system
- Removing a file from a file system. 

`file-system` has 3 folders / files a regular user will want to interact with. 

- `file-system/files` are where you'll add files you want to deploy
- `file-system/deployments` are where files you've deployed will have their addresses automatically recorded (per-chain). You shouldn't need to ever edit these files, unless you want to add a file to a file system that has already been deployed elsewhere or before
- `file-system/config.json` are where you can edit the rpc urls of each chain, and manage your Ethereum accounts

---

### Config

The config is made up of:

- `addresses`, which holds the deployed address of the `FileDeployer` singleton on each chain (not recommended to edit)
- `rpc`, which holds the rpc urls for each chain (recommended to edit with private rpc urls)
- `accounts` which uses a name-based accounts system to submit transactions with different Ethereum accounts

`accounts` is a key-value store where the key is an account name, and the value is your account's private key. Each command that submits a transaction takes in an optional `--acount` argument, which lets you specify what account you want to use to submit transactions. It defaults to the `default` account, which this repository seeds `accounts` with. You will need to add a private key here. 

---

### Setup

After cloning the repository, make sure you have yarn installed. [Installing yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable). Then, follow these steps:

1. Run `yarn install`
2. Add a private key to the `default` account in `file-system/config.json`

Common arguments in the following commands:

| Argument     | Description                                        | Example         | 
| ------------ | -------------------------------------------------- | --------------- |
| `--name`     | Name of file in `file-system/files/`               | p5.min.js       | 
| `--network`  | Network name, choices in `file-system/config.json` | arbitrum-goerli |
| `--account`  | Account name, from `file-system/config.json`       | default         |
| `--contract` | Your generative series contract address            | 0x...           |

`--account` is always optional as it defaults to `default`. 

The following commands are all meant to be run in the root of this repository.

---

### Check a file's deploy cost

Before deploying a file, you can check how much it will cost to deploy a file. The cost is calculated using the network's current gas fee. Add a file to `file-system/files/` to proceed. 

```
Format: yarn cost --name <file name> --network <network name> --legacy <optional, defaults to true>
```

```
Example: yarn cost --name p5.min.js --network ethereum
```

If legacy is set to false, the cost estimator will use the `maxFeePerGas` value to estimate the cost, instead of `gasPrice`. It's recommended to keep legacy as true, since most rpcs are backwards compatible when returning the legacy `gasPrice`. 

---

### Deploy a file

To deploy a file, add a file to `file-system/files/` to proceed. The tool uses the name of the file to name the chunks that are deployed on-chain (these names are emitted in events, and are of the format `sample-1`, `sample-2`, etc.) and to name the deployment file that will be generated in `file-system/deployments/`.For example, deploying `sample.js` will create or update `file-system/deployments/sample.js.json`. Every file in `file-system/deployments` stores file storage addresses by chain, so that you can deploy the same file to multiple chains without overwriting anything. However, deploying a file by the same name to the same chain as another entry will overwrite that entry.

You will be able to use the generated deployment file immediately after deployment to add a given file to your contract's file system. 

Files that are larger than 20kb will be automatically split up into chunks of 20kb. These chunks will be stored in a "split" folder, named in the format `{fileName}-split` in the `file-system/files` folder (the same folder). If you run the deploy command with a file that already has a split folder, the tool will re-use the existing chunks in the split folder.

Therefore, ***if you modify any files larger than 20kb and wish to re-deploy them***, (meaning they have an existing split folder that was previously deployed), make sure to ***delete the split folder corresponding to the file.***

```
Format: yarn deploy --name <file name> --network <network name> --account <optional>
```

```
Example: yarn deploy --name p5.min.js --network ethereum
```

---

### Add a file

Files that have an entry in a deployment file (in `file-system/deployments`) are eligible to be added to a file system via the CLI. You can seamlessly move on from deploying a file to this step, or manually paste in the storage addresses for a file that you know is already deployed to a chain.

You must be the owner of the contract hosting the file system you're adding a file to. The file name must not already exist on the file system - otherwise, remove the file if you wish to overwrite it.

```
Format: yarn add-file --name <file name> --network <network name> --contract <contract address of file system> --account <optional>
```

```
Example: yarn add-file --name p5.min.js --network ethereum --contract 0xc279f14a9fC0Ea2c715B025040E121BECF943323
```

---

### Remove a file

You must be the owner of the contract hosting the file system you're removing a file from. The file name must already exist on the file system.

```
Format: yarn remove-file --name <file name> --network <network name> --contract <contract address of file system> --account <optional>
```

```
Example: yarn remove-file --name p5.min.js --network ethereum --contract 0xc279f14a9fC0Ea2c715B025040E121BECF943323
```

---

## Approved Files

*TBD*

This section will contain the addresses of approved files on each chain, eg. p5.min.js.