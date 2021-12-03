//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds; //allow us to keep track of tokenIds with utilities functions
    address contractAddress; //marketplace address for NFT to interact

    //NFT market needs ability to transact with token or change ownership
    constructor(address marketplaceAddress) ERC721("TKCollection", "TK") {
        contractAddress = marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns (uint256) {
        //mint token, set for sale and return id

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        //set the token URI: id and url
        _setTokenURI(newItemId, tokenURI);

        //marketplace approval to transact between users
        setApprovalForAll(contractAddress, true);

        return newItemId;
    }
}
