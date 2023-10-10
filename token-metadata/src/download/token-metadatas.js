/**
 * Highlight Token Metadata Downloader: V0
 * @version: 0.2.0
 * @description Downloads an entire collection's token metadata into a csv
    * @argument address Collection contract address
    * @argument network Network name, as available in chains.json
    * @argument dest Path of csv file to put token metadata in
    * @argument recursion (optional) recursion depth: Toggle to try longer/shorter to get all token metadata in the case of failures
 */

const resolve = require("path").resolve;
const commandLineArgs = require('command-line-args');
const fs = require("fs");

const rpcConfig = require("../../../chains.json");
const { getTokensMetadata } = require("../utils");
const { getPublicCollection } = require("../api-client");
const { DEFAULT_RECURSION_DEPTH } = require("../constants");

const downloadTokenMetadatas = async (address, network, dest, recursion) => {
    if (network === "mainnet") network = "ethereum";
    if (!(network in rpcConfig)) throw new Error("Unsupported network");
    
    console.log("Getting public collection...");
    const collection = await getPublicCollection(address, network);
    console.log("Got collection metadata");
    const url = collection.onChainBaseUri;
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

    const traitsArr = [...traits.values()];
    const traitToColIndex = {};
    traitsArr.forEach((trait, index) => {
      traitToColIndex[trait] = index + 2;
    });
    traitsArr.map(trait => {
      return `trait:${trait}`;
    });
    const rows = new Array(tokenIds.length + 1).fill([]);
    rows[0] = [
      "",
      "Name",
      ...traitsArr.map(trait => {
        return `trait:${trait}`;
      }),
      "Image",
      "Animation",
      "Description",
      "External Url",
    ];
    const imageIndex = traitsArr.length + 2;
    const animationIndex = traitsArr.length + 3;
    const descriptionIndex = traitsArr.length + 4;
    const externalUrlIndex = traitsArr.length + 5;
    const numCols = rows[0].length;

    await Promise.all(
      tokenMetadatas.map(async token => {
        const row = new Array(numCols).fill("");
        const tokenId = token.tokenId;
        row[0] = tokenId.toString();
        row[1] = token.name ? `"${token.name}"` : "";
        row[imageIndex] = token.image ? `"${token.image}"` : "";
        row[animationIndex] = token.animation_url ? `"${token.animation_url}"` : "";
        row[descriptionIndex] = token.description ? `"${token.description}"` : "";
        row[externalUrlIndex] = token.external_url ? `"${token.external_url}"` : "";

        if (token.attributes) {
          for (const attribute of token.attributes) {
            row[traitToColIndex[attribute.trait_type]] = `"${attribute.value}"`;
          }
        }
        rows[tokenId] = row;
      }),
    );

    const content = rows
      .map(row => {
        return row.join(",");
      })
      .join("\n");

    await fs.promises.writeFile(resolve(__dirname, "../../../", dest), content);
    console.log(`Downloaded token metadata to features.csv`);
}

const args = commandLineArgs([
    { name: 'address', type: String },
    { name: 'network', alias: 'n', type: String },
    { name: 'dest', alias: 'd', type: String },
    { name: 'recursion', alias: 'r', type: Number, defaultValue: DEFAULT_RECURSION_DEPTH }
])

downloadTokenMetadatas(args.address, args.network, args.dest, args.recursion)
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
    });