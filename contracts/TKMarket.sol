//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; //security against multiple requests
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract TKMarket is ReentrancyGuard {
    using Counters for Counters.Counter;

    //keep track of items minted, transactions, token that are not sold, total of items - tokenId;
    Counters.Counter private _tokensIds;
    Counters.Counter private _tokensSold;

    //charge fee for comission

    address payable owner;
    uint256 listingPrice = 0.045 ether; //different from ETH BC

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketToken {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    //use tokenId to return which MarketToken
    mapping(uint256 => MarketToken) private idToMarketToken;

    event MarketTokenMinted(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    //create market item and put it to sale
    function mintMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least one wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _tokensIds.increment();
        uint256 itemId = _tokensIds.current();
        //minting - putting for sale
        idToMarketToken[itemId] = MarketToken(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
    }
}
