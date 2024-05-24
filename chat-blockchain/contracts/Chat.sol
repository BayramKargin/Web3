// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    struct Message {
        address sender;
        string text;
        uint timestamp;
    }

    Message[] public messages;

    event NewMessage(address indexed sender, string text, uint timestamp);

    function sendMessage(string memory _text) public {
        messages.push(Message(msg.sender, _text, block.timestamp));
        emit NewMessage(msg.sender, _text, block.timestamp);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }
}
