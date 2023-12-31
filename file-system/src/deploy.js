/**
 * Highlight Generative Art Deployer : V0
 * @version: 0.1.0
 * @description Deploys a file on-chain
    * @argument file File name in file-system/files
    * @argument network Network name, as available in chains.json
    * @argument account (optional) Account name if different from 'default', as available in env
 */

const fs = require("fs");
const resolve = require("path").resolve;
const ethers = require("ethers");
const splitFile = require('split-file');
const commandLineArgs = require('command-line-args');
const { lookup } = require("mime-types");

const config = require("../config.json");
const rpcConfig = require("../../chains.json");
const FileDeployerABI = require("../abi/FileDeployer.json").abi;

const { chunkArrayInGroups, getAccountOrThrow } = require("./utils.js");
const { FILE_NAME_FORMAT, MAX_FILE_CHUNK_SIZE_BYTES, MAX_CHUNKS_IN_TX, UTF_BASED_FILE_EXTENSIONS } = require("./constants.js");

const deploy = async (fileName, network, accountName) => {
    if (network === "mainnet") network = "ethereum";
    if (!(network in config.addresses) || !(network in rpcConfig)) throw new Error("Unsupported network");
    if (!fileName.match(FILE_NAME_FORMAT)) throw new Error("Unsupported file name format");
    let filePath = resolve(__dirname, `../files/${fileName}`);
    if (!fs.existsSync(filePath)) throw new Error("File doesn't exist in file-system/files/");

    const fileNameSplit = fileName.split(".");
    const fileExtension = fileNameSplit[fileNameSplit.length - 1];
    const needsBase64Encoding = !UTF_BASED_FILE_EXTENSIONS.includes(fileExtension);

    const base64FileName = `${fileNameSplit.slice(0, fileNameSplit.length - 1).join(".")}-base64.${fileExtension}`;
    const base64FilePath = resolve(__dirname, `../files/${base64FileName}`);

    const provider = ethers.getDefaultProvider(rpcConfig[network].rpc);
    const signer = getAccountOrThrow(accountName).connect(provider);

    try {
        console.log(`Signer balance: ${ethers.formatEther(await signer.provider.getBalance(signer.address))}\n`);
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to connect to ${network} using rpc ${rpcConfig[network].rpc}`);
    }

    if (needsBase64Encoding) {
        console.log(`Needs base64 encoding, writing base64 encoded file to ${base64FileName}`)
        const fileData = await fs.promises.readFile(filePath);
        const base64EncodedFileData = fileData.toString("base64");
        const dataUri = `data:${lookup(fileExtension)};base64,${base64EncodedFileData}`
        await fs.promises.writeFile(base64FilePath, dataUri);
        filePath = base64FilePath;
        console.log(`Wrote base64 encoded version of file to ${base64FilePath}`);
    }

    let split = false;

    try {
        const stats =  await fs.promises.stat(filePath);

        console.log(`${fileName}, size: ${stats.size} bytes found`);
        if (stats.size > MAX_FILE_CHUNK_SIZE_BYTES) {
            split = true;
            console.log(`Size is over ${MAX_FILE_CHUNK_SIZE_BYTES} bytes, chunks will be placed in files/${fileName}-split directory`)
            if (fs.existsSync(resolve(__dirname, `../files/${fileName}-split`))) console.log(`Directory exists at files/${fileName}-split, chunks will be reused`)
        }
        console.log("");
    } catch (error) {
        console.error(error);
        throw new Error(`Could not find ${fileName} in /files`);
    }

    let paths = [filePath];
    const splitPath = resolve(__dirname, `../files/${fileName}-split`);
    if (split && !fs.existsSync(splitPath)) {
        await fs.promises.mkdir(splitPath);

        try {   
            paths = await splitFile.splitFileBySize(filePath, MAX_FILE_CHUNK_SIZE_BYTES, splitPath);
            console.log(`Split file into ${paths.length} chunks, and placed in ${splitPath}\n`);
        } catch (error) {
            console.error(error);
            await fs.promises.rmdir(splitPath);
            throw new Error("Failed to split file");
        }
    } else if (split) {
        // re-use chunks in existing split directory
        paths = (await fs.promises.readdir(splitPath)).filter((file) => file != fileName).map((file) => { return `${splitPath}/${file}` })
    }

    const uploadChunkPathsByTx = chunkArrayInGroups(paths, MAX_CHUNKS_IN_TX);
    console.log(`Onchain file upload will take ${uploadChunkPathsByTx.length} transactions\n`);

    const uploadChunks = await Promise.all(uploadChunkPathsByTx.map(async (uploadChunkPaths, index) => {
        const fileContents = await Promise.all(uploadChunkPaths.map(async (uploadChunkPath) => {
            return await fs.promises.readFile(uploadChunkPath, "utf8");
        }))
        const names = uploadChunkPaths.map((uploadChunkPath, innerIndex) => {
            return `${fileName}-${(index * MAX_CHUNKS_IN_TX) + innerIndex + 1}`
        })
        
        return { names, fileContents, txIndex: index + 1, uploadChunkPaths }
    }))

    const fileDeployer = new ethers.Contract(config.addresses[network].fileDeployer, FileDeployerABI, signer);
    const txHashes = [];
    console.log("Submitting transactions...\n")
    for (const uploadChunk of uploadChunks) {
        const tx = await fileDeployer.deploy(uploadChunk.names.map((name) => { return ethers.encodeBytes32String(name)}), uploadChunk.fileContents);
        txHashes.push(tx.hash);
        console.log({
            txHash: tx.hash,
            chunkNames: uploadChunk.names,
            chunkFileNames: uploadChunk.uploadChunkPaths.map((uploadChunkPath) => { return uploadChunkPath.split("/").pop() })
        })
        console.log("");
        await new Promise(r => setTimeout(r, 1000));
    }

    const addressesChunked = await Promise.all(txHashes.map(async (txHash) => {
        let receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
            receipt = await provider.waitForTransaction(txHash);
        }
        console.log(`tx complete: ${txHash}`);
        const addresses = [];
        for (const log of receipt.logs) {
            addresses.push("0x" + log.topics[2].slice(26));
        }
        return addresses;
    }))
    console.log("");

    const addresses = addressesChunked.flat()
    console.log("File content addresses:")
    console.log(addresses)
    console.log("");

    const deploymentPath = resolve(__dirname, `../deployments/${fileName}.json`);
    let deploymentFileContents = {};
    if (fs.existsSync(deploymentPath)) {
        deploymentFileContents = JSON.parse(await fs.promises.readFile(deploymentPath, "utf8"))
    }
    deploymentFileContents[network] = addresses;
    await fs.promises.writeFile(deploymentPath, JSON.stringify(deploymentFileContents, null, 4));

    console.log(`Process complete! Run the following to add this file to your generative series contract's file system:\nyarn add-file --name ${fileName} --network ${network} --contract <contract address>`);
}

const args = commandLineArgs([
    { name: 'name', type: String },
    { name: 'network', alias: 'n', type: String },
    { name: 'account', alias: 'a', type: String, defaultValue: "default" }
])

deploy(args.name, args.network, args.account)
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
    });