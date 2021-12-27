//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract TKTokenCapped is ERC20Capped {
    constructor(uint256 totalSupply)
        ERC20("TKTokenCapped", "TKKC")
        ERC20Capped(totalSupply)
    {}

    function issueToken(address receiver, uint256 amount) public {
        _mint(receiver, amount);
    }
}
