const ENV_ACCOUNT_PREFIX = "HL_FS_PK_";

const FILE_NAME_FORMAT = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z0-9]+$/;
const MAX_FILE_CHUNK_SIZE_BYTES = 20000;
const MAX_CHUNKS_IN_TX = 4;

const UTF_BASED_FILE_EXTENSIONS = ["txt", "html", "css", "js", "json", "xml", "md", "csv"];

module.exports = {
    ENV_ACCOUNT_PREFIX,
    FILE_NAME_FORMAT,
    MAX_FILE_CHUNK_SIZE_BYTES,
    MAX_CHUNKS_IN_TX,
    UTF_BASED_FILE_EXTENSIONS
}