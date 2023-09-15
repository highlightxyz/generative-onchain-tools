const FILE_NAME_FORMAT = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z0-9]+$/;
const MAX_FILE_CHUNK_SIZE_BYTES = 20000;
const MAX_CHUNKS_IN_TX = 4;

module.exports = {
    FILE_NAME_FORMAT,
    MAX_FILE_CHUNK_SIZE_BYTES,
    MAX_CHUNKS_IN_TX
}