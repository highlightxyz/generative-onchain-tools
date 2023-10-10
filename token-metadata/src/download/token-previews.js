/**
 * Highlight Token Previews Downloader: V0
 * @version: 0.2.0
 * @description Downloads an entire collection's token images
    * @argument address Collection contract address
    * @argument network Network name, as available in chains.json
    * @argument dest Path where to put folder of downloaded images
    * @argument metadata (optional) Path of a csv file to draw token metadata from
    * @argument skip (optional) If true, skip uploading token images that already exist at destination folder
    * @argument recursion (optional) recursion depth: Toggle to try longer/shorter to get all token metadata in the case of failures
 */

const resolve = require("path").resolve;
const commandLineArgs = require('command-line-args');
const fs = require("fs");

const rpcConfig = require("../../../chains.json");
const { getTokensMetadata, downloadTokensImages, parseTokenMetadatasCsv } = require("../utils");
const { getPublicCollection } = require("../api-client");
const { DEFAULT_RECURSION_DEPTH } = require("../constants");

const downloadTokenMetadatas = async (address, network, dest, metadata, skip, recursion) => {
    if (network === "mainnet") network = "ethereum";
    if (!(network in rpcConfig)) throw new Error("Unsupported network");
    
    console.log("Getting public collection...");
    const collection = await getPublicCollection(address, network);
    console.log("Got collection metadata");
    const url = collection.onChainBaseUri;
    let tokens = [];
    
    if (!metadata) {
        const traits = new Set();
        console.log("Getting all token metadata...");
        const tokenIds = [...new Array(collection.supply).keys()].map(num => {
            return num + 1;
        });
        const { tokenMetadatas, failedTokenIds } = await getTokensMetadata(url, tokenIds, traits, recursion);
        console.log(`Got token metadata for ${tokenMetadatas.length}/${collection.supply} tokens`);
        if (failedTokenIds.length > 0) {
            console.log(`Failed to get metadata for tokens ${failedTokenIds.join(", ")}`);
        }
        tokens = tokenMetadatas;
    } else {
        const tokenMetadatas = await parseTokenMetadatasCsv(resolve(__dirname, "../../../", metadata));
        tokens = tokenMetadatas;
    }

    console.log("Downloading token images...");
    const directoryDest = resolve(__dirname, "../../../", dest);
    await fs.promises.mkdir(directoryDest, { recursive: true });
    const { failedTokenMetadatas } = await downloadTokensImages(tokens, directoryDest, skip, recursion);
    if (failedTokenMetadatas.length > 0) {
      console.log(`Failed to download images for ${failedTokenMetadatas.length} tokens`);
    }
    console.log(
      `Finished downloading images for ${collection.supply - failedTokenMetadatas.length}/${collection.supply} to ${
        directoryDest
      }`,
    );
}

const args = commandLineArgs([
    { name: 'address', type: String },
    { name: 'network', alias: 'n', type: String },
    { name: 'dest', alias: 'd', type: String },
    { name: 'metadata', alias: 'm', type: String, defaultValue: null },
    { name: 'skip', alias: 's', type: Boolean, defaultValue: false },
    { name: 'recursion', alias: 'r', type: Number, defaultValue: DEFAULT_RECURSION_DEPTH }
])

downloadTokenMetadatas(args.address, args.network, args.dest, args.metadata, args.skip, args.recursion)
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
    });