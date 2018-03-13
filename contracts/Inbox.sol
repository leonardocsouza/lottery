pragma solidity ^0.4.17; // version of solidity that our code is written with

// defines a new contract (remember classes!)
// that will contain methods and variables
contract Inbox {
    // declares all storage/instance variables (and their types)
    // this variable will automatically stored with
    // the contract in the blockchain
    string public message;

    // constructor function
    function Inbox(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    // getMessage() => function name + arguments
    // public view => function type
    // returns (string) => return types
    // Note: this get message isn't really needed since solidity
    // automatically creates a function called "message" to retrieve
    // the value of that variable from our instance
    //function getMessage() public view returns (string) {
    //    return message;
    //}
}