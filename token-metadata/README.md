# Token Metadata Downloader

The Token Metadata Downloader is a CLI that anyone can use to:

1. Download all metadata of all tokens in a collection into a single csv 
2. Download all images of all tokens (ie. token previews for generative art collections) into a single folder

---

### Download token metadatas

This command lets you download all metadata of all tokens in a collection into a single csv. This is particularly useful for inspecting / analyzing distribution of traits.

Arguments: 
- address Collection contract address
- network Network name, as available in chains.json
- dest Path of csv file to put token metadata in
- recursion (optional) recursion depth: Toggle to try longer/shorter to get all token metadata in the case of failures

```
Format: yarn download:collection:metadatas --address <collection contract address> --network <network name> --dest <file path for csv> --recursion <(advanced) recursion depth, inspect code to see ability>
```

```
Example: yarn download:collection:metadatas --address 0xc111b1033DC8f32d85c152D7ac89C4311344D77D --network base --dest ./features.csv
```

---

### Download token previews/images

This command lets you download all images of all tokens (ie. token previews for generative art collections) into a single folder. If you've already run "Download token metadatas" for this collection, it is advised to pass the path to the csv file (from the root of this repository) to the `metadata` argument (to not re-compute token metadata) to save time. If your collection is really big, you can easily stop and start this process by re-running the command with `--skip`, which will let you start where you left off. 

Arguments: 
- address Collection contract address
- network Network name, as available in chains.json
- dest Path where to put folder of downloaded images
- metadata (optional) Path of a csv file to draw token metadata from
- skip (optional) If true, skip uploading token images that already exist at destination folder
- recursion (optional) recursion depth: Toggle to try longer/shorter to get all token metadata in the case of failures

```
Format: yarn download:collection:previews --address <collection contract address> --network <network name> --dest <folder path for downloaded images> --metadata <path of csv to draw token metadata from> --skip <if true, skip uploading uploaded token previews> --recursion <(advanced) recursion depth, inspect code to see ability>
```

```
Example: yarn download:collection:previews --address 0xc111b1033DC8f32d85c152D7ac89C4311344D77D --network base --dest ../Collection-Name --metadata ./features.csv --skip
```