![write](https://github.com/highlightxyz/generative-onchain-tools/assets/55633921/a01c5f6c-aecc-406c-81da-bb4762281d21)# generative-onchain-tools

Generative art collections on Highlight are sets of NFTs that are rendered by an artist's code at the time they're minted. 

- [How to make generative art on Highlight](https://github.com/highlightxyz/generative-art/tree/main)

# Generative Series File System

- [File deployment context](#file-deployment)
- [File management context](#file-management)
- [Setup](#setup)
- [Check how much it costs to deploy a file](#check-a-files-deploy-cost)
- [Deploy a file](#deploy-a-file)
- [Add a file to a file system](#add-a-file)
- [Remove a file from a file system](#remove-a-file)

The Highlight File System client is a CLI tool to upload generative art projects onchain, and manage your onchain file systems. Each Generative Series contract hosts its own FileSystem to enable flexibility. 

Writing a new file onchain consists of two major steps: deploying the file, and adding it to a contract's file system. Since this process is modular, creators can easily add files that are already deployed to a given chain to their contract's file system, without having to deploy a new copy themselves. For example, Highlight has already deployed the minified version of [p5.js 1.6.0](https://github.com/processing/p5.js/releases/tag/v1.6.0) to Base's Mainnet and its Goerli testnet. The tools in this repository make both steps extremely easy, and are easy to customize.

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

When you deploy a Generative Series collection on Highlight, your project is uploaded to Arweave by default. However, your contract has a file system built in that will let you, as the contract creator and owner, put your project onchain. The most gas-efficient way of storing files onchain (on the storage trie) is to deploy file contents as the raw bytecode of new smart contracts. Highlight has deployed a light-weight factory called the "FileDeployer", which uses parts of [SSTORE2](https://github.com/transmissions11/solmate/blob/main/src/utils/SSTORE2.sol) by [Solmate](https://github.com/transmissions11/solmate/tree/main) to deploy text as contract bytecode. 

- [File Deployer](https://github.com/highlightxyz/hl-evm-contracts/tree/main/contracts/erc721/onchain/FileDeployer.sol)

As per [EIP-170](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-170.md), smart contracts on Ethereum have a 24kb size limit. Therefore, files over 24kb need to be partitioned into chunks of 24kb and uploaded. Additionally, deploying a 24kb smart contract costs about 5M compute units. While different chains place different limits on the total amount of compute units a single block can consume, Ethereum's (and most L2's) limit is 30M. 

The deploy tool in this repository currently chunks files into 20kb blocks, and deploys a maximum of 4 contracts per transaction. Deploying files that are larger than 80kb will submit multiple transactions. Although on most chains this config can be bumped up, this allows users of chains with a 20M block compute limit to deploy files through the deploy tool. Users deploying files that are greater than 20kb but less than 24kb may want to update `file-system/src/constants.js` to bump the config. A maximum configuration would likely consist of 24kb chunks with 5 contracts being deployed per transaction.

Once deployed as bytecode, an uploaded chunk can be read by converting the bytes back to human-readable text. Files split up into chunks can be read by appending the text of each deployed contract together. The file system on each Generative Series contract handles the conversion and concatenation of bytecode into a file's full contents. 

---

![Uploading wr<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3001.2340385743973 1879.0715921286308" width="6002.468077148795" height="3758.1431842572615">
  <!-- svg-source:excalidraw -->
  <defs>
    <style class="style-fonts">
      @font-face {
        font-family: "Virgil";
        src: url("https://excalidraw.com/Virgil.woff2");
      }

      @font-face {
        font-family: "Cascadia";
        src: url("https://excalidraw.com/Cascadia.woff2");
      }
    </style>
  </defs>
  <rect x="0" y="0" width="3001.2340385743973" height="1879.0715921286308" fill="#ffffff"></rect>
  <g stroke-linecap="round" transform="translate(1412.7237879076538 1599.3326889199823) rotate(0 112.18790392217988 95.75011580171417)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C67.5 0, 102.99 0, 192.38 0 M32 0 C67.37 0, 102.73 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 82.07, 224.38 132.14, 224.38 159.5 M224.38 32 C224.38 70.38, 224.38 108.75, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C146.44 191.5, 100.5 191.5, 32 191.5 M192.38 191.5 C154.62 191.5, 116.86 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 129.04, 0 98.59, 0 32 M0 159.5 C0 133.2, 0 106.89, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(1423.7935277673341 1653.6595786581222) rotate(0 101.1181640625 41.42322606357425)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(1495.221125261669 1800.1700588006427) rotate(0 26.96484375 13.807742021191416)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">16kb</text>
  </g>
  <g stroke-linecap="round" transform="translate(1411.436922487922 1283.103858893199) rotate(0 112.18790392217988 95.75011580171417)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C87.81 0, 143.62 0, 192.38 0 M32 0 C73.92 0, 115.85 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 67.04, 224.38 102.09, 224.38 159.5 M224.38 32 C224.38 78.27, 224.38 124.54, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C155.88 191.5, 119.38 191.5, 32 191.5 M192.38 191.5 C137.8 191.5, 83.22 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 122.71, 0 85.91, 0 32 M0 159.5 C0 122.22, 0 84.93, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(1422.5066623476023 1337.430748631339) rotate(0 101.1181640625 41.42322606357425)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(1497.2578177763598 1484.8057790973137) rotate(0 26.96484375 13.807742021191416)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">20kb</text>
  </g>
  <g stroke-linecap="round" transform="translate(1415.682565093175 974.7149745308718) rotate(0 112.18790392217988 95.75011580171417)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C64.89 0, 97.77 0, 192.38 0 M32 0 C84.6 0, 137.19 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 66.17, 224.38 100.34, 224.38 159.5 M224.38 32 C224.38 73.27, 224.38 114.54, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C146.68 191.5, 100.98 191.5, 32 191.5 M192.38 191.5 C138.57 191.5, 84.76 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 127.02, 0 94.55, 0 32 M0 159.5 C0 123.37, 0 87.24, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(1426.7523049528554 1029.0418642690117) rotate(0 101.1181640625 41.42322606357425)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(1498.7878703620245 1175.7785284244117) rotate(0 26.96484375 13.807742021191416)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">20kb</text>
  </g>
  <g stroke-linecap="round" transform="translate(1419.2594429921128 678.6317595701314) rotate(0 112.18790392217988 95.75011580171417)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C96.13 0, 160.26 0, 192.38 0 M32 0 C65.16 0, 98.32 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 70.42, 224.38 108.85, 224.38 159.5 M224.38 32 C224.38 72.47, 224.38 112.94, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C145.73 191.5, 99.09 191.5, 32 191.5 M192.38 191.5 C136.55 191.5, 80.73 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 110, 0 60.51, 0 32 M0 159.5 C0 126.33, 0 93.17, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(1430.3291828517931 732.9586493082713) rotate(0 101.1181640625 41.42322606357425)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(1500.5509773150388 880.1208910040534) rotate(0 26.96484375 13.807742021191416)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">20kb</text>
  </g>
  <g stroke-linecap="round" transform="translate(1419.3279306204395 366.06194756369155) rotate(0 112.18790392217988 95.75011580171417)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C68.25 0, 104.51 0, 192.38 0 M32 0 C87.88 0, 143.76 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 64.96, 224.38 97.92, 224.38 159.5 M224.38 32 C224.38 70.63, 224.38 109.26, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C150.39 191.5, 108.41 191.5, 32 191.5 M192.38 191.5 C146.18 191.5, 99.98 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 118.42, 0 77.35, 0 32 M0 159.5 C0 116.64, 0 73.79, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(1430.3976704801198 420.3888373018315) rotate(0 101.1181640625 41.42322606357425)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(1500.0139389902715 567.981487322538) rotate(0 26.96484375 13.807742021191416)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">20kb</text>
  </g>
  <g transform="translate(10 443.36935630506537) rotate(0 426.744140625 675.5529419507259)">
    <text x="0" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">/*</text>
    <text x="0" y="26.4922722333618" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> * Globals</text>
    <text x="0" y="52.9845444667236" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> */</text>
    <text x="0" y="79.4768167000854" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">let backgroundColor, color1, color2, color3, color4, chosenColors;</text>
    <text x="0" y="105.9690889334472" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">let plexMono;</text>
    <text x="0" y="132.46136116680898" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="158.9536334001708" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">/*</text>
    <text x="0" y="185.4459056335326" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> * Preload</text>
    <text x="0" y="211.9381778668944" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> * Load any assets we need for the sketch</text>
    <text x="0" y="238.4304501002562" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> */</text>
    <text x="0" y="264.92272233361797" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">function preload() {</text>
    <text x="0" y="291.4149945669798" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> plexMono = loadFont("fonts/IBMPlexMono-Regular.ttf");</text>
    <text x="0" y="317.9072668003416" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">}</text>
    <text x="0" y="344.3995390337034" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="370.8918112670652" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">/*</text>
    <text x="0" y="397.384083500427" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> * Setup</text>
    <text x="0" y="423.8763557337888" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> */</text>
    <text x="0" y="450.3686279671506" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">function setup() {</text>
    <text x="0" y="476.8609002005124" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> createCanvas(windowWidth, windowHeight);</text>
    <text x="0" y="503.3531724338742" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> colorMode(HSB, 360, 100, 100, 1);</text>
    <text x="0" y="529.8454446672359" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> noLoop();</text>
    <text x="0" y="556.3377169005978" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> frameRate(60);</text>
    <text x="0" y="582.8299891339595" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> pixelDensity(2);</text>
    <text x="0" y="609.3222613673214" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="635.8145336006831" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> // Choose colors</text>
    <text x="0" y="662.306805834045" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> backgroundColor = hl.randomElement(["#ffffff", "#000000"]);</text>
    <text x="0" y="688.7990780674068" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> color1 = color(hl.random(0, 360), 20, 100);</text>
    <text x="0" y="715.2913503007686" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> color2 = color(hl.random(0, 360), 20, 100);</text>
    <text x="0" y="741.7836225341304" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> color3 = color(hl.random(0, 360), 20, 100);</text>
    <text x="0" y="768.2758947674922" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> color4 = color(hl.random(0, 360), 20, 100);</text>
    <text x="0" y="794.768167000854" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> chosenColors = [color1, color2, color3, color4];</text>
    <text x="0" y="821.2604392342158" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="847.7527114675776" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> // Set attributes</text>
    <text x="0" y="874.2449837009393" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> let attributes = {</text>
    <text x="0" y="900.7372559343012" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Background Color": backgroundColor,</text>
    <text x="0" y="927.2295281676629" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Hue 1": hue(color1).toFixed(2),</text>
    <text x="0" y="953.7218004010248" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Hue 2": hue(color2).toFixed(2),</text>
    <text x="0" y="980.2140726343865" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Hue 3": hue(color3).toFixed(2),</text>
    <text x="0" y="1006.7063448677484" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Hue 4": hue(color4).toFixed(2),</text>
    <text x="0" y="1033.1986171011101" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> };</text>
    <text x="0" y="1059.6908893344719" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="1086.1831615678338" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> hl.token.setAttributes(attributes);</text>
    <text x="0" y="1112.6754338011956" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">}</text>
    <text x="0" y="1139.1677060345573" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="1165.659978267919" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1192.152250501281" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1218.6445227346428" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1245.1367949680046" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1271.6290672013663" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1298.121339434728" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1324.61361166809" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
  </g>
  <g transform="translate(391.5400458629865 1832.7006481484234) rotate(0 35.5078125 18.18547199010368)">
    <text x="35.5078125" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="30.309119983506097px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">96kb</text>
  </g>
  <g stroke-linecap="round">
    <g transform="translate(855.7811622990585 1126.7935302253943) rotate(0 255.56139707622742 -0.2938267751380863)">
      <path d="M0 0 C34.78 0.17, 123.51 1.28, 208.7 1 C293.89 0.73, 460.72 -1.2, 511.12 -1.64 M0 0 C34.78 0.17, 123.51 1.28, 208.7 1 C293.89 0.73, 460.72 -1.2, 511.12 -1.64" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(855.7811622990585 1126.7935302253943) rotate(0 255.56139707622742 -0.2938267751380863)">
      <path d="M483.04 8.91 C493.27 5.06, 503.51 1.22, 511.12 -1.64 M483.04 8.91 C493.54 4.97, 504.04 1.02, 511.12 -1.64" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(855.7811622990585 1126.7935302253943) rotate(0 255.56139707622742 -0.2938267751380863)">
      <path d="M482.83 -11.61 C493.14 -7.98, 503.46 -4.34, 511.12 -1.64 M482.83 -11.61 C493.41 -7.88, 503.98 -4.15, 511.12 -1.64" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g transform="translate(894.6871833161777 1046.0760351667102) rotate(0 230.45391845703125 22.5)">
    <text x="230.45391845703125" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#e03131" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">1. DEPLOY FILE ONCHAIN</text>
  </g>
  <g stroke-linecap="round" transform="translate(2488.219300542437 808.9636217874074) rotate(0 251.5073690159802 308.992734926637)">
    <path d="M32 0 L471.01 0 L478.51 0.5 L485.01 2 L490.51 4.5 L495.01 8 L498.51 12.5 L501.01 18 L502.51 24.5 L503.01 32 L503.01 585.99 L502.51 593.49 L501.01 599.99 L498.51 605.49 L495.01 609.99 L490.51 613.49 L485.01 615.99 L478.51 617.49 L471.01 617.99 L32 617.99 L24.5 617.49 L18 615.99 L12.5 613.49 L8 609.99 L4.5 605.49 L2 599.99 L0.5 593.49 L0 585.99 L0 32 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#a5d8ff"></path>
    <path d="M32 0 M32 0 C165.53 0, 299.07 0, 471.01 0 M32 0 C143.57 0, 255.14 0, 471.01 0 M471.01 0 C492.35 0, 503.01 10.67, 503.01 32 M471.01 0 C492.35 0, 503.01 10.67, 503.01 32 M503.01 32 C503.01 164.43, 503.01 296.87, 503.01 585.99 M503.01 32 C503.01 168.84, 503.01 305.68, 503.01 585.99 M503.01 585.99 C503.01 607.32, 492.35 617.99, 471.01 617.99 M503.01 585.99 C503.01 607.32, 492.35 617.99, 471.01 617.99 M471.01 617.99 C336.82 617.99, 202.62 617.99, 32 617.99 M471.01 617.99 C376.12 617.99, 281.22 617.99, 32 617.99 M32 617.99 C10.67 617.99, 0 607.32, 0 585.99 M32 617.99 C10.67 617.99, 0 607.32, 0 585.99 M0 585.99 C0 406.53, 0 227.07, 0 32 M0 585.99 C0 407.09, 0 228.19, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(2493.219300542437 853.919282353166) rotate(0 145.2626953125 264.0370743608787)">
    <text x="0" y="0" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> File System</text>
    <text x="0" y="40.621088363212095" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="81.24217672642419" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="121.86326508963629" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> addFile (</text>
    <text x="0" y="162.48435345284838" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> fileName, </text>
    <text x="0" y="203.10544181606048" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> addresses</text>
    <text x="0" y="243.72653017927257" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> )</text>
    <text x="0" y="284.34761854248467" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="324.96870690569676" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> removeFile(...)</text>
    <text x="0" y="365.58979526890886" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> files()</text>
    <text x="0" y="406.21088363212095" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> fileStorage(...)</text>
    <text x="0" y="446.83197199533305" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> fileContents(...)</text>
    <text x="0" y="487.45306035854514" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
  </g>
  <g transform="translate(2517.1681848887292 741.7313559636812) rotate(0 220.753173828125 20.31054418160602)">
    <text x="220.753173828125" y="0" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">Generative Series Contract</text>
  </g>
  <g transform="translate(1964.8150830698642 721.3774751071257) rotate(0 107.45995330810547 22.5)">
    <text x="107.45995330810547" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">art-script.js</text>
  </g>
  <g stroke-linecap="round">
    <g transform="translate(1665.4521152627267 479.10752596258794) rotate(0 189.5745652705773 277.02540716361)">
      <path d="M0 0 C63.19 92.34, 315.96 461.71, 379.15 554.05 M0 0 C63.19 92.34, 315.96 461.71, 379.15 554.05" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1665.4521152627267 479.10752596258794) rotate(0 189.5745652705773 277.02540716361)">
      <path d="M354.76 536.58 C360.24 540.51, 365.73 544.44, 379.15 554.05 M354.76 536.58 C359.65 540.08, 364.54 543.59, 379.15 554.05" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1665.4521152627267 479.10752596258794) rotate(0 189.5745652705773 277.02540716361)">
      <path d="M371.7 524.99 C373.37 531.53, 375.05 538.06, 379.15 554.05 M371.7 524.99 C373.19 530.82, 374.69 536.65, 379.15 554.05" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g transform="translate(1977.167627570805 1066.0733044436085) rotate(0 116.08195495605469 22.5)">
    <text x="116.08195495605469" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">addresses []</text>
  </g>
  <g stroke-linecap="round">
    <g transform="translate(1652.2014038628859 786.964742027799) rotate(0 159.03194270248696 135.43326548244295)">
      <path d="M0 0 C53.01 45.14, 265.05 225.72, 318.06 270.87 M0 0 C53.01 45.14, 265.05 225.72, 318.06 270.87" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1652.2014038628859 786.964742027799) rotate(0 159.03194270248696 135.43326548244295)">
      <path d="M289.95 260.4 C295.84 262.6, 301.74 264.79, 318.06 270.87 M289.95 260.4 C299.4 263.92, 308.85 267.44, 318.06 270.87" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1652.2014038628859 786.964742027799) rotate(0 159.03194270248696 135.43326548244295)">
      <path d="M303.25 244.78 C306.36 250.25, 309.46 255.72, 318.06 270.87 M303.25 244.78 C308.23 253.55, 313.21 262.32, 318.06 270.87" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(1657.1864298616365 1091.290043789598) rotate(0 147.31021441161147 -0.6630257530653125)">
      <path d="M0 0 C49.1 -0.22, 245.52 -1.11, 294.62 -1.33 M0 0 C49.1 -0.22, 245.52 -1.11, 294.62 -1.33" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1657.1864298616365 1091.290043789598) rotate(0 147.31021441161147 -0.6630257530653125)">
      <path d="M266.48 9.06 C274.38 6.15, 282.28 3.23, 294.62 -1.33 M266.48 9.06 C273.51 6.47, 280.53 3.87, 294.62 -1.33" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1657.1864298616365 1091.290043789598) rotate(0 147.31021441161147 -0.6630257530653125)">
      <path d="M266.38 -11.46 C274.31 -8.61, 282.24 -5.77, 294.62 -1.33 M266.38 -11.46 C273.44 -8.93, 280.49 -6.4, 294.62 -1.33" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(1654.1422143801865 1383.2270982704943) rotate(0 162.61612848791765 -129.62729434955645)">
      <path d="M0 0 C54.21 -43.21, 271.03 -216.05, 325.23 -259.25 M0 0 C54.21 -43.21, 271.03 -216.05, 325.23 -259.25" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1654.1422143801865 1383.2270982704943) rotate(0 162.61612848791765 -129.62729434955645)">
      <path d="M309.58 -233.66 C313.41 -239.92, 317.24 -246.18, 325.23 -259.25 M309.58 -233.66 C314.49 -241.69, 319.4 -249.72, 325.23 -259.25" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1654.1422143801865 1383.2270982704943) rotate(0 162.61612848791765 -129.62729434955645)">
      <path d="M296.79 -249.71 C303.75 -252.04, 310.7 -254.38, 325.23 -259.25 M296.79 -249.71 C305.71 -252.7, 314.64 -255.7, 325.23 -259.25" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(1661.383309457422 1687.6135790479186) rotate(0 0.163280978156763 -0.008936528307458502)">
      <path d="M0 0 C0.05 0, 0.27 -0.01, 0.33 -0.02 M0 0 C0.05 0, 0.27 -0.01, 0.33 -0.02" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1661.383309457422 1687.6135790479186) rotate(0 0.163280978156763 -0.008936528307458502)">
      <path d="M0.18 0.05 C0.21 0.03, 0.24 0.02, 0.33 -0.02 M0.18 0.05 C0.22 0.03, 0.26 0.01, 0.33 -0.02" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1661.383309457422 1687.6135790479186) rotate(0 0.163280978156763 -0.008936528307458502)">
      <path d="M0.17 -0.07 C0.21 -0.05, 0.24 -0.04, 0.33 -0.02 M0.17 -0.07 C0.22 -0.05, 0.26 -0.04, 0.33 -0.02" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(1672.3991070039392 1691.6940672867183) rotate(0 188.63791563451286 -281.2155624927191)">
      <path d="M0 0 C62.88 -93.74, 314.4 -468.69, 377.28 -562.43 M0 0 C62.88 -93.74, 314.4 -468.69, 377.28 -562.43" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1672.3991070039392 1691.6940672867183) rotate(0 188.63791563451286 -281.2155624927191)">
      <path d="M370.09 -533.3 C372.15 -541.64, 374.2 -549.97, 377.28 -562.43 M370.09 -533.3 C372.21 -541.87, 374.32 -550.44, 377.28 -562.43" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1672.3991070039392 1691.6940672867183) rotate(0 188.63791563451286 -281.2155624927191)">
      <path d="M353.05 -544.74 C359.98 -549.8, 366.91 -554.86, 377.28 -562.43 M353.05 -544.74 C360.18 -549.94, 367.31 -555.15, 377.28 -562.43" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(2220.860336996834 1090.79154600658) rotate(0 174.3232065906709 -3.4579923430062536)">
      <path d="M0 0 C58.11 -1.15, 290.54 -5.76, 348.65 -6.92 M0 0 C58.11 -1.15, 290.54 -5.76, 348.65 -6.92" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(2220.860336996834 1090.79154600658) rotate(0 174.3232065906709 -3.4579923430062536)">
      <path d="M320.66 3.9 C328.64 0.82, 336.62 -2.27, 348.65 -6.92 M320.66 3.9 C331.65 -0.35, 342.64 -4.59, 348.65 -6.92" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(2220.860336996834 1090.79154600658) rotate(0 174.3232065906709 -3.4579923430062536)">
      <path d="M320.26 -16.62 C328.35 -13.85, 336.44 -11.09, 348.65 -6.92 M320.26 -16.62 C331.41 -12.81, 342.55 -9, 348.65 -6.92" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(2100.332444351583 775.5231329907804) rotate(0 236.49840794048578 131.6746343602597)">
      <path d="M0 0 C36.45 34.08, 139.85 160.61, 218.68 204.5 C297.51 248.4, 430.61 253.54, 473 263.35 M0 0 C36.45 34.08, 139.85 160.61, 218.68 204.5 C297.51 248.4, 430.61 253.54, 473 263.35" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(2100.332444351583 775.5231329907804) rotate(0 236.49840794048578 131.6746343602597)">
      <path d="M443.6 269.35 C450.53 267.93, 457.46 266.52, 473 263.35 M443.6 269.35 C455.33 266.95, 467.06 264.56, 473 263.35" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(2100.332444351583 775.5231329907804) rotate(0 236.49840794048578 131.6746343602597)">
      <path d="M446.62 249.05 C452.84 252.42, 459.05 255.79, 473 263.35 M446.62 249.05 C457.15 254.76, 467.67 260.46, 473 263.35" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g transform="translate(1829.6394650528027 468.5779544293639) rotate(0 235.79995727539062 22.5)">
    <text x="235.79995727539062" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#e03131" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">2. ADD FILE TO SYSTEM</text>
  </g>
  <g transform="translate(1293.677430431877 10) rotate(0 232.94825744628906 84.47585253175146)">
    <text x="0" y="0" font-family="Virgil, Segoe UI Emoji" font-size="135.16136405080232px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">WRITE</text>
  </g>
</svg>ite.svg…]()

___

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

![read](https://github.com/highlightxyz/generative-onchain-tools/assets/55633921/79e37664-d7b5-49b7-9e19-ca34ff6e13e7)<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3533.1037866001507 1815.2937519999286" width="7066.207573200301" height="3630.5875039998573">
  <!-- svg-source:excalidraw -->
  <defs>
    <style class="style-fonts">
      @font-face {
        font-family: "Virgil";
        src: url("https://excalidraw.com/Virgil.woff2");
      }

      @font-face {
        font-family: "Cascadia";
        src: url("https://excalidraw.com/Cascadia.woff2");
      }
    </style>
  </defs>
  <rect x="0" y="0" width="3533.1037866001507" height="1815.2937519999286" fill="#ffffff"></rect>
  <g stroke-linecap="round" transform="translate(1206.2024144845664 788.7037444900898) rotate(0 251.50736901597975 308.9927349266368)">
    <path d="M32 0 L471.01 0 L478.51 0.5 L485.01 2 L490.51 4.5 L495.01 8 L498.51 12.5 L501.01 18 L502.51 24.5 L503.01 32 L503.01 585.99 L502.51 593.49 L501.01 599.99 L498.51 605.49 L495.01 609.99 L490.51 613.49 L485.01 615.99 L478.51 617.49 L471.01 617.99 L32 617.99 L24.5 617.49 L18 615.99 L12.5 613.49 L8 609.99 L4.5 605.49 L2 599.99 L0.5 593.49 L0 585.99 L0 32 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#a5d8ff"></path>
    <path d="M32 0 M32 0 C198.27 0, 364.54 0, 471.01 0 M32 0 C152.95 0, 273.89 0, 471.01 0 M471.01 0 C492.35 0, 503.01 10.67, 503.01 32 M471.01 0 C492.35 0, 503.01 10.67, 503.01 32 M503.01 32 C503.01 247.4, 503.01 462.81, 503.01 585.99 M503.01 32 C503.01 162.3, 503.01 292.6, 503.01 585.99 M503.01 585.99 C503.01 607.32, 492.35 617.99, 471.01 617.99 M503.01 585.99 C503.01 607.32, 492.35 617.99, 471.01 617.99 M471.01 617.99 C321.05 617.99, 171.08 617.99, 32 617.99 M471.01 617.99 C337.73 617.99, 204.45 617.99, 32 617.99 M32 617.99 C10.67 617.99, 0 607.32, 0 585.99 M32 617.99 C10.67 617.99, 0 607.32, 0 585.99 M0 585.99 C0 462.23, 0 338.48, 0 32 M0 585.99 C0 467.94, 0 349.9, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(1211.2024144845664 853.9699492374539) rotate(0 137.46511840820312 243.7265301792727)">
    <text x="0" y="0" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> File System</text>
    <text x="0" y="40.621088363212095" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="81.24217672642419" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="121.86326508963629" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> fileContents(</text>
    <text x="0" y="162.48435345284838" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> fileName</text>
    <text x="0" y="203.10544181606048" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> )</text>
    <text x="0" y="243.72653017927257" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="284.34761854248467" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> addFile (...)</text>
    <text x="0" y="324.96870690569676" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> removeFile(...)</text>
    <text x="0" y="365.58979526890886" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> files()</text>
    <text x="0" y="406.21088363212095" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> fileStorage(...)</text>
    <text x="0" y="446.83197199533305" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
  </g>
  <g transform="translate(1235.8212232733795 721.8064408876235) rotate(0 220.753173828125 20.31054418160602)">
    <text x="220.753173828125" y="0" font-family="Virgil, Segoe UI Emoji" font-size="32.49687069056968px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">Generative Series Contract</text>
  </g>
  <g transform="translate(1680.4135123152628 349.1514148470151) rotate(0 121.04996490478516 22.5)">
    <text x="121.04996490478516" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#e03131" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">1. READ FILE</text>
  </g>
  <g stroke-linecap="round">
    <g transform="translate(1942.7783614329683 499.3659540558101) rotate(0 -219.37279653522683 242.09286440756023)">
      <path d="M0 0 C-28.27 48.1, -96.47 207.88, -169.59 288.58 C-242.72 369.27, -393.89 451.58, -438.75 484.19 M0 0 C-28.27 48.1, -96.47 207.88, -169.59 288.58 C-242.72 369.27, -393.89 451.58, -438.75 484.19" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1942.7783614329683 499.3659540558101) rotate(0 -219.37279653522683 242.09286440756023)">
      <path d="M-420.63 460.28 C-427.45 469.29, -434.28 478.29, -438.75 484.19 M-420.63 460.28 C-426.75 468.36, -432.88 476.44, -438.75 484.19" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1942.7783614329683 499.3659540558101) rotate(0 -219.37279653522683 242.09286440756023)">
      <path d="M-409.5 477.52 C-420.52 480.03, -431.54 482.54, -438.75 484.19 M-409.5 477.52 C-419.38 479.77, -429.27 482.03, -438.75 484.19" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round" transform="translate(11.28686541973002 1576.8408980768854) rotate(0 112.18790392217988 95.75011580171395)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C65.62 0, 99.24 0, 192.38 0 M32 0 C81.86 0, 131.73 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 73.88, 224.38 115.75, 224.38 159.5 M224.38 32 C224.38 79.86, 224.38 127.72, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C135.41 191.5, 78.45 191.5, 32 191.5 M192.38 191.5 C153.96 191.5, 115.55 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 119.51, 0 79.51, 0 32 M0 159.5 C0 108.72, 0 57.94, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(22.35660527941036 1631.1677878150258) rotate(0 101.1181640625 41.42322606357402)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(93.78420277374516 1777.6782679575463) rotate(0 26.96484375 13.807742021191189)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">16kb</text>
  </g>
  <g stroke-linecap="round" transform="translate(10 1260.6120680501026) rotate(0 112.18790392217988 95.75011580171395)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C88.53 0, 145.06 0, 192.38 0 M32 0 C89.22 0, 146.43 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 76.63, 224.38 121.25, 224.38 159.5 M224.38 32 C224.38 69.27, 224.38 106.54, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C151.09 191.5, 109.81 191.5, 32 191.5 M192.38 191.5 C145.17 191.5, 97.97 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 132.59, 0 105.69, 0 32 M0 159.5 C0 115.48, 0 71.45, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(21.06973985968034 1314.938957788243) rotate(0 101.1181640625 41.42322606357402)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(95.82089528843699 1462.3139882542173) rotate(0 26.96484375 13.807742021191189)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">20kb</text>
  </g>
  <g stroke-linecap="round" transform="translate(14.245642605252215 952.2231836877754) rotate(0 112.18790392217988 95.75011580171395)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C93.44 0, 154.89 0, 192.38 0 M32 0 C79.2 0, 126.4 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 78.47, 224.38 124.94, 224.38 159.5 M224.38 32 C224.38 59.36, 224.38 86.72, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C149.05 191.5, 105.73 191.5, 32 191.5 M192.38 191.5 C151.37 191.5, 110.37 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 115.01, 0 70.52, 0 32 M0 159.5 C0 122.85, 0 86.2, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(25.315382464932554 1006.5500734259158) rotate(0 101.1181640625 41.42322606357402)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(97.35094787410253 1153.2867375813148) rotate(0 26.96484375 13.807742021191189)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">20kb</text>
  </g>
  <g stroke-linecap="round" transform="translate(17.822520504189015 656.139968727035) rotate(0 112.18790392217988 95.75011580171395)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C69.65 0, 107.3 0, 192.38 0 M32 0 C89.59 0, 147.17 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 59.73, 224.38 87.46, 224.38 159.5 M224.38 32 C224.38 65.82, 224.38 99.65, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C136.01 191.5, 79.64 191.5, 32 191.5 M192.38 191.5 C138.79 191.5, 85.21 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 108.74, 0 57.99, 0 32 M0 159.5 C0 118.33, 0 77.16, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(28.892260363869354 710.4668584651754) rotate(0 101.1181640625 41.42322606357402)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(99.11405482711689 857.629100160957) rotate(0 26.96484375 13.807742021191189)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">20kb</text>
  </g>
  <g stroke-linecap="round" transform="translate(17.891008132515708 343.57015672059515) rotate(0 112.18790392217988 95.75011580171395)">
    <path d="M32 0 L192.38 0 L199.88 0.5 L206.38 2 L211.88 4.5 L216.38 8 L219.88 12.5 L222.38 18 L223.88 24.5 L224.38 32 L224.38 159.5 L223.88 167 L222.38 173.5 L219.88 179 L216.38 183.5 L211.88 187 L206.38 189.5 L199.88 191 L192.38 191.5 L32 191.5 L24.5 191 L18 189.5 L12.5 187 L8 183.5 L4.5 179 L2 173.5 L0.5 167 L0 159.5 L0.5 24.5 L2 18 L4.5 12.5 L8 8 L12.5 4.5 L18 2 L24.5 0.5 L32 0" stroke="none" stroke-width="0" fill="#b2f2bb"></path>
    <path d="M32 0 M32 0 C72.6 0, 113.19 0, 192.38 0 M32 0 C92 0, 152 0, 192.38 0 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M192.38 0 C213.71 0, 224.38 10.67, 224.38 32 M224.38 32 C224.38 78.83, 224.38 125.66, 224.38 159.5 M224.38 32 C224.38 77.26, 224.38 122.51, 224.38 159.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M224.38 159.5 C224.38 180.83, 213.71 191.5, 192.38 191.5 M192.38 191.5 C148.72 191.5, 105.06 191.5, 32 191.5 M192.38 191.5 C139.83 191.5, 87.28 191.5, 32 191.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M32 191.5 C10.67 191.5, 0 180.83, 0 159.5 M0 159.5 C0 128.68, 0 97.87, 0 32 M0 159.5 C0 116.51, 0 73.53, 0 32 M0 32 C0 10.67, 10.67 0, 32 0 M0 32 C0 10.67, 10.67 0, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
  </g>
  <g transform="translate(28.960747992196048 397.89704645873553) rotate(0 101.1181640625 41.42322606357402)">
    <text x="101.1181640625" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">0x0e47725ed8ce6</text>
    <text x="101.1181640625" y="27.615484042382786" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">513743eaf4b27d2</text>
    <text x="101.1181640625" y="55.23096808476557" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">54a04af858c9</text>
  </g>
  <g transform="translate(98.57701650234867 545.4896964794416) rotate(0 26.96484375 13.807742021191189)">
    <text x="26.96484375" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="23.01290336865232px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">20kb</text>
  </g>
  <g transform="translate(683.4702307676798 659.6157876668331) rotate(0 116.08195495605469 22.5)">
    <text x="116.08195495605469" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">addresses []</text>
  </g>
  <g stroke-linecap="round">
    <g transform="translate(1229.2404868882086 994.107317870591) rotate(0 -142.43383915145114 -148.64812108482693)">
      <path d="M0 0 C-47.48 -49.55, -237.39 -247.75, -284.87 -297.3 M0 0 C-47.48 -49.55, -237.39 -247.75, -284.87 -297.3" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1229.2404868882086 994.107317870591) rotate(0 -142.43383915145114 -148.64812108482693)">
      <path d="M-257.96 -284.04 C-267.83 -288.9, -277.7 -293.76, -284.87 -297.3 M-257.96 -284.04 C-268.44 -289.2, -278.92 -294.37, -284.87 -297.3" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1229.2404868882086 994.107317870591) rotate(0 -142.43383915145114 -148.64812108482693)">
      <path d="M-272.77 -269.84 C-277.21 -279.91, -281.64 -289.98, -284.87 -297.3 M-272.77 -269.84 C-277.48 -280.54, -282.19 -291.23, -284.87 -297.3" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(323.8282534825048 1160.9516632564664) rotate(0 143.32708214960303 132.87229716586398)">
      <path d="M0 0 C47.78 44.29, 238.88 221.45, 286.65 265.74 M0 0 C47.78 44.29, 238.88 221.45, 286.65 265.74" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(323.8282534825048 1160.9516632564664) rotate(0 143.32708214960303 132.87229716586398)">
      <path d="M259 254.1 C269.06 258.34, 279.12 262.57, 286.65 265.74 M259 254.1 C269.13 258.37, 279.26 262.63, 286.65 265.74" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(323.8282534825048 1160.9516632564664) rotate(0 143.32708214960303 132.87229716586398)">
      <path d="M272.96 239.05 C277.94 248.77, 282.92 258.48, 286.65 265.74 M272.96 239.05 C277.97 248.83, 282.99 258.6, 286.65 265.74" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g transform="translate(569.1096134868194 1471.506439642435) rotate(0 214.61392211914062 22.5)">
    <text x="214.61392211914062" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">concatenated bytecodes</text>
  </g>
  <g stroke-linecap="round">
    <g transform="translate(959.7308252954554 1435.8880161820734) rotate(0 139.7973315923923 -184.82446250995508)">
      <path d="M0 0 C46.6 -61.61, 233 -308.04, 279.59 -369.65 M0 0 C46.6 -61.61, 233 -308.04, 279.59 -369.65" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(959.7308252954554 1435.8880161820734) rotate(0 139.7973315923923 -184.82446250995508)">
      <path d="M270.77 -340.98 C274.17 -352.03, 277.57 -363.08, 279.59 -369.65 M270.77 -340.98 C273.07 -348.45, 275.37 -355.93, 279.59 -369.65" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(959.7308252954554 1435.8880161820734) rotate(0 139.7973315923923 -184.82446250995508)">
      <path d="M254.41 -353.36 C264.12 -359.64, 273.83 -365.92, 279.59 -369.65 M254.41 -353.36 C260.97 -357.6, 267.54 -361.85, 279.59 -369.65" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(670.7042844312682 682.8457496868286) rotate(0 -130.5815610899599 102.82379480332202)">
      <path d="M0 0 C-43.53 34.27, -217.64 171.37, -261.16 205.65 M0 0 C-43.53 34.27, -217.64 171.37, -261.16 205.65" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(670.7042844312682 682.8457496868286) rotate(0 -130.5815610899599 102.82379480332202)">
      <path d="M-245.36 180.15 C-249.63 187.03, -253.89 193.91, -261.16 205.65 M-245.36 180.15 C-249.12 186.22, -252.88 192.29, -261.16 205.65" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(670.7042844312682 682.8457496868286) rotate(0 -130.5815610899599 102.82379480332202)">
      <path d="M-232.67 196.27 C-240.36 198.8, -248.04 201.33, -261.16 205.65 M-232.67 196.27 C-239.45 198.5, -246.23 200.73, -261.16 205.65" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(655.1445676892772 675.181148476885) rotate(0 -104.64389747159794 -20.049943641299706)">
      <path d="M0 0 C-34.88 -6.68, -174.41 -33.42, -209.29 -40.1 M0 0 C-34.88 -6.68, -174.41 -33.42, -209.29 -40.1" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(655.1445676892772 675.181148476885) rotate(0 -104.64389747159794 -20.049943641299706)">
      <path d="M-179.67 -44.87 C-186.25 -43.81, -192.84 -42.75, -209.29 -40.1 M-179.67 -44.87 C-189.61 -43.27, -199.56 -41.67, -209.29 -40.1" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(655.1445676892772 675.181148476885) rotate(0 -104.64389747159794 -20.049943641299706)">
      <path d="M-183.53 -24.72 C-189.26 -28.14, -194.98 -31.56, -209.29 -40.1 M-183.53 -24.72 C-192.18 -29.88, -200.83 -35.05, -209.29 -40.1" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(686.0334868511554 711.1894065421466) rotate(0 -85.55443017239668 114.02294895218665)">
      <path d="M0 0 C-28.52 38.01, -142.59 190.04, -171.11 228.05 M0 0 C-28.52 38.01, -142.59 190.04, -171.11 228.05" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(686.0334868511554 711.1894065421466) rotate(0 -85.55443017239668 114.02294895218665)">
      <path d="M-162.4 199.34 C-164.99 207.89, -167.59 216.44, -171.11 228.05 M-162.4 199.34 C-164.78 207.21, -167.17 215.07, -171.11 228.05" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(686.0334868511554 711.1894065421466) rotate(0 -85.55443017239668 114.02294895218665)">
      <path d="M-145.98 211.65 C-153.46 216.54, -160.95 221.42, -171.11 228.05 M-145.98 211.65 C-152.87 216.15, -159.75 220.64, -171.11 228.05" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(299.2880829418964 1348.5711119219277) rotate(0 110.20025311063637 62.59424321453935)">
      <path d="M0 0 C36.73 20.86, 183.67 104.32, 220.4 125.19 M0 0 C36.73 20.86, 183.67 104.32, 220.4 125.19" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(299.2880829418964 1348.5711119219277) rotate(0 110.20025311063637 62.59424321453935)">
      <path d="M190.82 120.19 C202.1 122.09, 213.37 124, 220.4 125.19 M190.82 120.19 C202.24 122.12, 213.67 124.05, 220.4 125.19" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(299.2880829418964 1348.5711119219277) rotate(0 110.20025311063637 62.59424321453935)">
      <path d="M200.96 102.34 C208.37 111.05, 215.78 119.76, 220.4 125.19 M200.96 102.34 C208.47 111.17, 215.97 119.99, 220.4 125.19" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g stroke-linecap="round">
    <g transform="translate(314.26190911520735 1669.0148339361476) rotate(0 108.88440052196165 -61.17754060994412)">
      <path d="M0 0 C36.29 -20.39, 181.47 -101.96, 217.77 -122.36 M0 0 C36.29 -20.39, 181.47 -101.96, 217.77 -122.36" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(314.26190911520735 1669.0148339361476) rotate(0 108.88440052196165 -61.17754060994412)">
      <path d="M198.22 -99.6 C204.73 -107.18, 211.24 -114.75, 217.77 -122.36 M198.22 -99.6 C202.39 -104.45, 206.56 -109.31, 217.77 -122.36" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(314.26190911520735 1669.0148339361476) rotate(0 108.88440052196165 -61.17754060994412)">
      <path d="M188.17 -117.49 C198.02 -119.11, 207.88 -120.73, 217.77 -122.36 M188.17 -117.49 C194.48 -118.53, 200.8 -119.57, 217.77 -122.36" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g transform="translate(592.8522154959228 441.83738185948914) rotate(0 187.30795288085938 22.5)">
    <text x="187.30795288085938" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#e03131" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">2. GET BYTECODES</text>
  </g>
  <g transform="translate(498.39806903711724 1226.1527580534512) rotate(0 282.20391845703125 22.5)">
    <text x="282.20391845703125" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#e03131" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">3. CONCATENATE BYTECODES</text>
  </g>
  <g stroke-linecap="round">
    <g transform="translate(1508.988826287733 1018.5994645940937) rotate(0 547.1689649482087 -3.174374310634448)">
      <path d="M0 0 C182.39 -1.06, 911.95 -5.29, 1094.34 -6.35 M0 0 C182.39 -1.06, 911.95 -5.29, 1094.34 -6.35" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1508.988826287733 1018.5994645940937) rotate(0 547.1689649482087 -3.174374310634448)">
      <path d="M1066.21 4.08 C1075.64 0.58, 1085.07 -2.91, 1094.34 -6.35 M1066.21 4.08 C1072.3 1.82, 1078.4 -0.44, 1094.34 -6.35" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
    <g transform="translate(1508.988826287733 1018.5994645940937) rotate(0 547.1689649482087 -3.174374310634448)">
      <path d="M1066.09 -16.45 C1075.56 -13.06, 1085.03 -9.68, 1094.34 -6.35 M1066.09 -16.45 C1072.21 -14.26, 1078.33 -12.07, 1094.34 -6.35" stroke="#1e1e1e" stroke-width="2" fill="none"></path>
    </g>
  </g>
  <mask></mask>
  <g transform="translate(2669.6155053501507 367.6222326402785) rotate(0 426.744140625 675.5529419507257)">
    <text x="0" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">/*</text>
    <text x="0" y="26.4922722333618" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> * Globals</text>
    <text x="0" y="52.9845444667236" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> */</text>
    <text x="0" y="79.4768167000854" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">let backgroundColor, color1, color2, color3, color4, chosenColors;</text>
    <text x="0" y="105.9690889334472" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">let plexMono;</text>
    <text x="0" y="132.46136116680898" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="158.9536334001708" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">/*</text>
    <text x="0" y="185.4459056335326" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> * Preload</text>
    <text x="0" y="211.9381778668944" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> * Load any assets we need for the sketch</text>
    <text x="0" y="238.4304501002562" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> */</text>
    <text x="0" y="264.92272233361797" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">function preload() {</text>
    <text x="0" y="291.4149945669798" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> plexMono = loadFont("fonts/IBMPlexMono-Regular.ttf");</text>
    <text x="0" y="317.9072668003416" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">}</text>
    <text x="0" y="344.3995390337034" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="370.8918112670652" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">/*</text>
    <text x="0" y="397.384083500427" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> * Setup</text>
    <text x="0" y="423.8763557337888" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> */</text>
    <text x="0" y="450.3686279671506" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">function setup() {</text>
    <text x="0" y="476.8609002005124" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> createCanvas(windowWidth, windowHeight);</text>
    <text x="0" y="503.3531724338742" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> colorMode(HSB, 360, 100, 100, 1);</text>
    <text x="0" y="529.8454446672359" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> noLoop();</text>
    <text x="0" y="556.3377169005978" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> frameRate(60);</text>
    <text x="0" y="582.8299891339595" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> pixelDensity(2);</text>
    <text x="0" y="609.3222613673214" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="635.8145336006831" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> // Choose colors</text>
    <text x="0" y="662.306805834045" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> backgroundColor = hl.randomElement(["#ffffff", "#000000"]);</text>
    <text x="0" y="688.7990780674068" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> color1 = color(hl.random(0, 360), 20, 100);</text>
    <text x="0" y="715.2913503007686" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> color2 = color(hl.random(0, 360), 20, 100);</text>
    <text x="0" y="741.7836225341304" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> color3 = color(hl.random(0, 360), 20, 100);</text>
    <text x="0" y="768.2758947674922" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> color4 = color(hl.random(0, 360), 20, 100);</text>
    <text x="0" y="794.768167000854" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> chosenColors = [color1, color2, color3, color4];</text>
    <text x="0" y="821.2604392342158" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="847.7527114675776" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> // Set attributes</text>
    <text x="0" y="874.2449837009393" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> let attributes = {</text>
    <text x="0" y="900.7372559343012" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Background Color": backgroundColor,</text>
    <text x="0" y="927.2295281676629" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Hue 1": hue(color1).toFixed(2),</text>
    <text x="0" y="953.7218004010248" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Hue 2": hue(color2).toFixed(2),</text>
    <text x="0" y="980.2140726343865" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Hue 3": hue(color3).toFixed(2),</text>
    <text x="0" y="1006.7063448677484" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> "Hue 4": hue(color4).toFixed(2),</text>
    <text x="0" y="1033.1986171011101" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> };</text>
    <text x="0" y="1059.6908893344719" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="1086.1831615678338" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"> hl.token.setAttributes(attributes);</text>
    <text x="0" y="1112.6754338011956" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">}</text>
    <text x="0" y="1139.1677060345573" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge"></text>
    <text x="0" y="1165.659978267919" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1192.152250501281" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1218.6445227346428" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1245.1367949680046" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1271.6290672013663" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1298.121339434728" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
    <text x="0" y="1324.61361166809" font-family="Cascadia, Segoe UI Emoji" font-size="22.0768935278015px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">.</text>
  </g>
  <g transform="translate(3051.155551213139 1756.953524483637) rotate(0 35.5078125 18.18547199010345)">
    <text x="35.5078125" y="0" font-family="Cascadia, Segoe UI Emoji" font-size="30.309119983506097px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">96kb</text>
  </g>
  <g transform="translate(1752.8762770167186 922.8439339822635) rotate(0 381.5459289550781 22.5)">
    <text x="381.5459289550781" y="0" font-family="Virgil, Segoe UI Emoji" font-size="36px" fill="#e03131" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">4. CONVERT TO HUMAN-READABLE TEXT</text>
  </g>
  <g transform="translate(1882.6813567078634 441.06504009044966) rotate(0 90.714111328125 18.99438760036037)">
    <text x="0" y="0" font-family="Virgil, Segoe UI Emoji" font-size="30.39102016057673px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">art-script.js</text>
  </g>
  <g transform="translate(1513.824794225934 10) rotate(0 188.4130401611328 84.47585253175157)">
    <text x="0" y="0" font-family="Virgil, Segoe UI Emoji" font-size="135.16136405080232px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="text-before-edge">READ</text>
  </g>
</svg>


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

To deploy a file, add a file to `file-system/files/` to proceed. The tool uses the name of the file to name the chunks that are deployed on-chain (these names are emitted in events, and are of the format `sample-1`, `sample-2`, etc.) and to name the deployment file that will be generated in `file-system/deployments/`. For example, deploying `sample.js` will create or update `file-system/deployments/sample.js.json`. Every file in `file-system/deployments` stores file storage addresses by chain, so that you can deploy the same file to multiple chains without overwriting anything. However, deploying a file by the same name to the same chain as another entry will overwrite that entry.

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

___

## Disclaimer

The Highlight File System client and related information is offered on an as-is basis. Sea Ranch Labs, Inc., dba Highlight, gives no warranties regarding its use and disclaims all liability for damages resulting from its use to the fullest extent possible. Usage is fully governed by Highlight’s [terms of service](https://highlight.xyz/terms-of-service) and [privacy policy](https://highlight.xyz/privacy-policy), available at the links provided. Please remember that blockchain transactions are immutable, and only proceed if you have requisite technical understanding.
