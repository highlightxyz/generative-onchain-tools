const axios = require("axios");
const ethers = require("ethers");

const rpcConfig = require("../../chains.json");
const GenSeriesABI = require("../abi/ERC721Generative.json").abi;

const apiUrl = "https://api.highlight.xyz:8080/";

const getPublicCollection = async (address, chain) => {
  const getCollectionByOnChainIdQuery = `query GetCollectionByOnChainId($onChainId: String!) {
        getCollectionByOnChainId(onChainId: $onChainId) {
          id
          name
        }
      }`;

  const getPublicCollectionQuery = `query GetPublicCollection($collectionId: String!) {
        getPublicCollection(collectionId: $collectionId) {
          id
          name
          chainId
          baseUri
          address
          onChainBaseUri
          size
        }
      }`;

  const { chainId, rpc: networkUrl } = rpcConfig[chain];

  try {
    // get collection by on-chain id
    const getCollectionByOnChainIdResponse = await axios.request({
      url: apiUrl,
      method: "post",
      data: {
        query: getCollectionByOnChainIdQuery,
        variables: { onChainId: `${chainId}:${address}` },
        operationName: "GetCollectionByOnChainId",
      },
    });
    if (getCollectionByOnChainIdResponse.data.errors && getCollectionByOnChainIdResponse.data.errors.length > 0) {
      throw getCollectionByOnChainIdResponse.data.errors[0];
    }
    const collectionData = getCollectionByOnChainIdResponse.data.data.getCollectionByOnChainId;
    console.log(`Found collection ${collectionData.name}`);

    // get collection
    const getPublicCollectionResponse = await axios.request({
      url: apiUrl,
      method: "post",
      data: {
        query: getPublicCollectionQuery,
        variables: { collectionId: collectionData.id },
        operationName: "GetPublicCollection",
      },
    });
    if (getPublicCollectionResponse.data.errors && getPublicCollectionResponse.data.errors.length > 0) {
      throw getPublicCollectionResponse.data.errors[0];
    }
    const collection = getPublicCollectionResponse.data.data.getPublicCollection;

    const provider = ethers.getDefaultProvider(networkUrl);
    const contract = new ethers.Contract(collection.address, GenSeriesABI, provider);
    const supply = await contract.totalSupply();

    collection.supply = Number(supply);

    return collection;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getPublicCollection
}
  

