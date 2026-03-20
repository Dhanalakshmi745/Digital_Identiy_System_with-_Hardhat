// contracts/Identity.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract Identity is AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    mapping(address => mapping(bytes32 => mapping(address => bool))) public permissions;
    mapping(bytes32 => address) public docOwners;
    mapping(address => bytes32[]) public userDocs;
    
    event IdentityStored(address indexed user, bytes32 docHash, string ipfsCid);
    event PermissionGranted(address indexed user, bytes32 docHash, address verifier);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function storeIdentity(bytes32 docHash, string memory ipfsCid, bytes memory signature) external {
        bytes32 messageHash = keccak256(abi.encodePacked(docHash, ipfsCid, msg.sender));
        bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address signer = ECDSA.recover(ethSignedHash, signature);
        require(signer == msg.sender, "Invalid signature");
        
        docOwners[docHash] = msg.sender;
        userDocs[msg.sender].push(docHash);
        emit IdentityStored(msg.sender, docHash, ipfsCid);
    }
    
    function grantPermission(bytes32 docHash, address verifier, bytes memory signature) external {
        require(docOwners[docHash] == msg.sender, "Not owner");
        bytes32 messageHash = keccak256(abi.encodePacked(docHash, verifier, msg.sender));
        bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address signer = ECDSA.recover(ethSignedHash, signature);
        require(signer == msg.sender, "Invalid signature");
        
        permissions[msg.sender][docHash][verifier] = true;
        _grantRole(VERIFIER_ROLE, verifier);
        emit PermissionGranted(msg.sender, docHash, verifier);
    }
    
    function verifyIdentity(bytes32 docHash, address user) external view returns (bool) {
        return hasRole(VERIFIER_ROLE, msg.sender) && permissions[user][docHash][msg.sender];
    }
}
