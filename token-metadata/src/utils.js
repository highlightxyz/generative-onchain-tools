const axios = require("axios");
const { parse } = require("csv-parse");
const { createReadStream, promises, writeFile } = require("fs");
const { extension } = require("mime-types");

const { DEFAULT_RECURSION_DEPTH, DEFAULT_RETRIES_PER_SINGLE_QUERY } = require("./constants");

const getTokensMetadata = async (
  url,
  tokenIds,
  traits,
  recursionDepth = DEFAULT_RECURSION_DEPTH,
  iteration = 1
) => {
  let failedTokenIds = [];
  let tokenMetadatas = [];
  iteration = iteration ?? 1;
  recursionDepth = recursionDepth ?? DEFAULT_RECURSION_DEPTH;
  if (iteration == recursionDepth + 1) {
    return { tokenMetadatas, failedTokenIds: tokenIds };
  }
  await Promise.all(
    tokenIds.map(async tokenId => {
      let i = 1;
      while (i <= DEFAULT_RETRIES_PER_SINGLE_QUERY) {
        try {
          tokenMetadatas.push(await queryMetadata(url, tokenId, traits));
          break;
        } catch (error) {
          i++;
        }
      }
      if (i > DEFAULT_RETRIES_PER_SINGLE_QUERY) failedTokenIds.push(tokenId);
    }),
  );

  // recursively resolve failed tokens
  if (failedTokenIds.length > 0) {
    console.log(`Retrying to get metadata for ${failedTokenIds.length} failed tokens...`);
    const { tokenMetadatas: additionalTokenMetadatas, failedTokenIds: newFailedTokenIds } = await getTokensMetadata(
      url,
      failedTokenIds,
      traits,
      recursionDepth,
      iteration + 1,
    );
    tokenMetadatas = tokenMetadatas.concat(additionalTokenMetadatas);
    failedTokenIds = newFailedTokenIds;
  }

  return { tokenMetadatas, failedTokenIds };
};

const queryMetadata = async (url, tokenId, traits) => {
  const response = await axios.get(`${url}/${tokenId}`);

  for (const attribute of response.data.attributes) {
    traits.add(attribute.trait_type);
  }

  return { ...response.data, tokenId };
};

const downloadTokensImages = async (
  tokenMetadatas,
  destLocation,
  skipExisting = false,
  recursionDepth = DEFAULT_RECURSION_DEPTH,
  iteration = 1
) => {
  let failedTokenMetadatas = [];
  iteration = iteration ?? 1;
  recursionDepth = recursionDepth ?? DEFAULT_RECURSION_DEPTH;
  skipExisting = skipExisting ?? false;
  if (iteration == recursionDepth + 1) {
    return { failedTokenMetadatas: tokenMetadatas };
  }

  await Promise.all(
    tokenMetadatas.map(async tokenMetadata => {
      const dest = `${destLocation}/${tokenMetadata.tokenId}`;

      // skip upload if the file exists and caller doesn't want to overwrite
      if (skipExisting && (await findImageFile(dest))) return;

      if (tokenMetadata.image) {
        let i = 1;
        while (i <= DEFAULT_RETRIES_PER_SINGLE_QUERY) {
          try {
            await downloadImage(tokenMetadata.image, dest);
            break;
          } catch (error) {
            i++;
          }
        }
        if (i > DEFAULT_RETRIES_PER_SINGLE_QUERY) failedTokenMetadatas.push(tokenMetadata);
      }
    }),
  );

  if (failedTokenMetadatas.length > 0) {
    console.log(`Retrying to download images for ${failedTokenMetadatas.length} failed tokens...`);
    const { failedTokenMetadatas: newFailedTokenMetadatas } = await downloadTokensImages(
      failedTokenMetadatas,
      destLocation,
      skipExisting,
      recursionDepth,
      iteration + 1,
    );
    failedTokenMetadatas = newFailedTokenMetadatas;
  }

  return { failedTokenMetadatas };
};

// don't download via stream, want to be able to easily re-run script with --skip-existing true to fill in missing images
const downloadImage = async (url, filepath) => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        method: "GET",
        url,
        responseType: "arraybuffer",
      })
      .then(response => {
        const destFile =
          response.headers["content-type"] || response.headers["Content-Type"]
            ? `${filepath}.${extension(response.headers["content-type"] || response.headers["Content-Type"])}`
            : filepath;

        writeFile(destFile, response.data, err => {
          if (err) reject(err);
          resolve(destFile);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
};

const findImageFile = async (basePathWithoutExtension) => {
  const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"];

  const foundPaths = await Promise.all(
    extensions.map(async ext => {
      const fullPath = basePathWithoutExtension + ext;
      try {
        await promises.stat(fullPath);
        return fullPath;
      } catch (error) {
        if (error.code !== "ENOENT") {
          // throw error; // Some other error occurred
          // fail silently, non-critical path
        }
        return null;
      }
    }),
  );
  return foundPaths.some(foundPath => foundPath); // Image file not found with any of the extensions
};

const parseTokenMetadatasCsv = async (filePath) => {
  return new Promise((resolve, reject) => {
    const tokenMetadatas = [];
    let firstRowParsed = false;
    const attributes = [];

    createReadStream(filePath)
      .pipe(parse({ delimiter: "," }))
      .on("data", function (row) {
        if (!firstRowParsed) {
          row.forEach((colName, index) => {
            if (colName.indexOf("trait:") === 0) {
              attributes.push({ index, name: colName.slice(6) });
            }
          });

          firstRowParsed = true;
        } else if (row[0].length != 0) {
          const tokenId = parseInt(row[0], 10);
          const name = row[1];
          const image = row[attributes.length + 2];
          const animation_url = row[attributes.length + 3];
          const description = row[attributes.length + 4];
          const external_url = row[attributes.length + 5];
          const traits = [];

          for (const attribute of attributes) {
            traits.push({
              trait_type: attribute.name,
              value: row[attribute.index],
            });
          }

          tokenMetadatas.push({
            tokenId,
            name,
            description,
            image,
            animation_url,
            external_url,
            attributes: traits,
          });
        }
      })
      .on("end", function () {
        console.log("Parsed token metadatas");
        resolve(tokenMetadatas);
      })
      .on("error", function (error) {
        console.log(error.message);
        reject(error);
      });
  });
};

module.exports = {
    getTokensMetadata,
    downloadTokensImages,
    parseTokenMetadatasCsv
}