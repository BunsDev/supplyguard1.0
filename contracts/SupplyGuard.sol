// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./Batch.sol";

contract SupplyGuard {
    struct NFT {
        uint256 id;
        string title;
        string description;
        string imageUrl;
        string source;
        uint256 priceUSD; // USD price
        bool isMinted;
    }

    uint256 private _nextId = 0;
    mapping(uint256 => NFT) public nfts;
    mapping(uint256 => address) public nftOwners;

    // Chainlink Price Feed
    AggregatorV3Interface internal priceFeed;
    Batch internal batchContract;

    event NFTAdded(uint256 id, string title, uint256 priceUSD);
    event NFTMinted(uint256 id, address owner);

    // Initialize Chainlink Price Feed and Batch Precompile in the constructor
    constructor() {
        priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e); // ETH/USD on Goerli Testnet
        batchContract = Batch(0x0000000000000000000000000000000000000808); // Batch Precompile address on Moonbeam/Moonbase Alpha
    }

    // Add a new NFT in USD
    function addNFT(
        string memory title,
        string memory description,
        string memory imageUrl,
        string memory source,
        uint256 priceUSD
    ) public {
        uint256 newNFTId = _nextId++;
        nfts[newNFTId] = NFT(newNFTId, title, description, imageUrl, source, priceUSD, false);
        emit NFTAdded(newNFTId, title, priceUSD);
    }

    // Mint an NFT by paying the equivalent value in ETH
    function mintNFT(uint256 nftId) public payable {
        require(!nfts[nftId].isMinted, "NFT already minted");

        uint256 priceETH = getETHAmount(nfts[nftId].priceUSD);
        require(msg.value >= priceETH, "Not enough ETH sent");

        nftOwners[nftId] = msg.sender;
        nfts[nftId].isMinted = true;

        emit NFTMinted(nftId, msg.sender);
    }

    // Mint multiple NFTs in a batch
    function batchMintNFT(uint256[] memory nftIds, uint256[] memory pricesUSD, bytes[] memory callData) public payable {
        require(nftIds.length == pricesUSD.length, "Mismatch in NFT IDs and prices length");

        address[] memory to = new address[](nftIds.length);
        uint256[] memory values = new uint256[](nftIds.length);
        uint64[] memory gasLimits = new uint64[](nftIds.length);

        for (uint256 i = 0; i < nftIds.length; i++) {
            require(!nfts[nftIds[i]].isMinted, "NFT already minted");

            uint256 priceETH = getETHAmount(pricesUSD[i]);
            require(msg.value >= priceETH, "Not enough ETH sent");

            to[i] = address(this); // Address of the current contract
            values[i] = 0; // No native currency needed since we'll pay via callData
            gasLimits[i] = 300000; // Adjust as needed
        }

        batchContract.batchAll(to, values, callData, gasLimits);

        for (uint256 i = 0; i < nftIds.length; i++) {
            nftOwners[nftIds[i]] = msg.sender;
            nfts[nftIds[i]].isMinted = true;
            emit NFTMinted(nftIds[i], msg.sender);
        }
    }

    // Get all NFTs
    function getAllNFTs() public view returns (NFT[] memory) {
        NFT[] memory allNFTs = new NFT[](_nextId);
        for (uint256 i = 0; i < _nextId; i++) {
            allNFTs[i] = nfts[i];
        }
        return allNFTs;
    }

    // Get all minted NFTs by a specific user
    function getMintedNFTsByUser(address user) public view returns (NFT[] memory) {
        uint256 ownerCount = 0;
        for (uint256 i = 0; i < _nextId; i++) {
            if (nftOwners[i] == user && nfts[i].isMinted) {
                ownerCount++;
            }
        }

        NFT[] memory ownedNFTs = new NFT[](ownerCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < _nextId; i++) {
            if (nftOwners[i] == user && nfts[i].isMinted) {
                ownedNFTs[currentIndex] = nfts[i];
                currentIndex++;
            }
        }
        return ownedNFTs;
    }

    // Transfer funds
    function makePayment() public payable {
        payable(0xb3ed1424ac12B8B6A2472aE3d744A05f5A7e940a).transfer(msg.value);
    }

    // Withdraw all funds from the contract
    function withdraw(address payable recipient) public {
        require(recipient != address(0), "Invalid address");
        recipient.transfer(address(this).balance);
    }

    // Get the latest ETH/USD price from Chainlink
    function getLatestPrice() public view returns (int256) {
        (, int256 price, , ,) = priceFeed.latestRoundData();
        return price; // Price in USD with 8 decimal places
    }

    // Convert USD to ETH
    function getETHAmount(uint256 priceUSD) public view returns (uint256) {
        int256 ethPriceUSD = getLatestPrice();
        require(ethPriceUSD > 0, "Invalid ETH price");

        // Convert the USD price to ETH amount, considering price precision (8 decimals for USD price feed)
        uint256 priceETH = (priceUSD * 10**18) / uint256(ethPriceUSD);
        return priceETH;
    }
}
