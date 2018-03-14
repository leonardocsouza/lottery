pragma solidity ^0.4.17; // version of solidity that our code is written with

contract Lottery {
    address public manager;
    address[] public players;

    // constructor function
    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);

        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _; // runs all the rest of the code inside the function w
    }
}