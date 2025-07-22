// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "./Ownable.sol";
import {IPrimusZKTLS, Attestation} from "@primuslabs/zktls-contracts/src/IPrimusZKTLS.sol";
import {JsonParser} from "./JsonParser.sol";

contract CreatorRegistry is Ownable {
    using JsonParser for string;
    
    struct CreatorProfile {
        address wallet;
        string[] verifiedPlatforms;
        mapping(string => PlatformData) platformData;
        uint256 credibilityScore;
        uint256 creatorLevel;
        address personalToken;
        bool canIssueTokens;
        uint256 verifiedAt;
        uint256 lastScoreUpdate;
    }
    
    struct PlatformData {
        string username;
        uint256 followers;
        uint256 contentCount;
        uint256 engagement;
        uint256 verifiedAt;
        bytes32 attestationHash;
    }
    
    // Platform types
    enum PlatformType { TWITTER, QUORA, MEDIUM, BINANCE, OKX }
    
    // Mappings
    mapping(address => CreatorProfile) public creators;
    mapping(string => mapping(string => bool)) public usedUsernames; // platform => username => used
    mapping(address => bool) public isVerifiedCreator;
    mapping(PlatformType => string) public platformNames;
    
    // Constants
    uint256 public constant MIN_CREATOR_LEVEL = 1;
    uint256 public constant MAX_CREATOR_LEVEL = 5;
    uint256 public constant SCORE_DECAY_PERIOD = 30 days;
    
    // State variables
    address public primusAddress;
    uint256 public totalCreators;
    
    // Events
    event CreatorRegistered(address indexed creator, string platform, string username);
    event PlatformVerified(address indexed creator, string platform, uint256 score);
    event CreatorLevelUpdated(address indexed creator, uint256 oldLevel, uint256 newLevel);
    event TokenIssuePermissionGranted(address indexed creator, uint256 level);
    
    constructor(address _primusAddress) {
        require(_primusAddress != address(0), "Invalid Primus address");
        primusAddress = _primusAddress;
        
        // Initialize platform names
        platformNames[PlatformType.TWITTER] = "twitter";
        platformNames[PlatformType.QUORA] = "quora";
        platformNames[PlatformType.MEDIUM] = "medium";
        platformNames[PlatformType.BINANCE] = "binance";
        platformNames[PlatformType.OKX] = "okx";
    }
    
    function verifyPlatform(
        Attestation calldata attestation,
        PlatformType platformType
    ) external {
        // Verify attestation with Primus contract
        IPrimusZKTLS(primusAddress).verifyAttestation(attestation);
        
        // Verify the attestation is for the caller
        require(attestation.recipient == msg.sender, "Invalid recipient");
        
        string memory platform = platformNames[platformType];
        string memory username = _extractUsername(attestation.data, platformType);
        
        require(bytes(username).length > 0, "Username not found");
        require(!usedUsernames[platform][username], "Username already used");
        
        // Update or create creator profile
        CreatorProfile storage creator = creators[msg.sender];
        
        if (creator.wallet == address(0)) {
            // New creator
            creator.wallet = msg.sender;
            creator.verifiedAt = block.timestamp;
            creator.credibilityScore = 100; // Base score
            creator.creatorLevel = 1;
            totalCreators++;
            isVerifiedCreator[msg.sender] = true;
        }
        
        // Add platform verification
        _addPlatformVerification(creator, platform, username, attestation);
        
        // Update credibility score
        _updateCredibilityScore(creator, platformType, attestation.data);
        
        // Update creator level
        _updateCreatorLevel(creator);
        
        // Mark username as used
        usedUsernames[platform][username] = true;
        
        emit CreatorRegistered(msg.sender, platform, username);
        emit PlatformVerified(msg.sender, platform, creator.credibilityScore);
    }
    
    function _extractUsername(string memory data, PlatformType platformType) internal pure returns (string memory) {
        if (platformType == PlatformType.TWITTER) {
            return data.extractValue("screen_name");
        } else if (platformType == PlatformType.QUORA) {
            return data.extractValue("username");
        } else if (platformType == PlatformType.MEDIUM) {
            return data.extractValue("username");
        } else if (platformType == PlatformType.BINANCE) {
            return data.extractValue("accountId");
        } else if (platformType == PlatformType.OKX) {
            return data.extractValue("uid");
        }
        return "";
    }
    
    function _addPlatformVerification(
        CreatorProfile storage creator,
        string memory platform,
        string memory username,
        Attestation calldata attestation
    ) internal {
        // Check if platform already verified
        bool platformExists = false;
        for (uint i = 0; i < creator.verifiedPlatforms.length; i++) {
            if (keccak256(bytes(creator.verifiedPlatforms[i])) == keccak256(bytes(platform))) {
                platformExists = true;
                break;
            }
        }
        
        if (!platformExists) {
            creator.verifiedPlatforms.push(platform);
        }
        
        // Update platform data
        creator.platformData[platform] = PlatformData({
            username: username,
            followers: _extractFollowers(attestation.data),
            contentCount: _extractContentCount(attestation.data),
            engagement: _extractEngagement(attestation.data),
            verifiedAt: block.timestamp,
            attestationHash: keccak256(abi.encodePacked(attestation.data))
        });
    }
    
    function _extractFollowers(string memory data) internal pure returns (uint256) {
        string memory followersStr = data.extractValue("followers");
        if (bytes(followersStr).length == 0) {
            followersStr = data.extractValue("follower_count");
        }
        return _stringToUint(followersStr);
    }
    
    function _extractContentCount(string memory data) internal pure returns (uint256) {
        string memory countStr = data.extractValue("posts");
        if (bytes(countStr).length == 0) {
            countStr = data.extractValue("answers");
        }
        if (bytes(countStr).length == 0) {
            countStr = data.extractValue("articles");
        }
        return _stringToUint(countStr);
    }
    
    function _extractEngagement(string memory data) internal pure returns (uint256) {
        string memory engagementStr = data.extractValue("likes");
        if (bytes(engagementStr).length == 0) {
            engagementStr = data.extractValue("upvotes");
        }
        if (bytes(engagementStr).length == 0) {
            engagementStr = data.extractValue("claps");
        }
        return _stringToUint(engagementStr);
    }
    
    function _updateCredibilityScore(
        CreatorProfile storage creator,
        PlatformType platformType,
        string memory data
    ) internal {
        uint256 platformScore = _calculatePlatformScore(platformType, data);
        uint256 platformBonus = creator.verifiedPlatforms.length * 50; // Multi-platform bonus
        
        creator.credibilityScore = (creator.credibilityScore + platformScore + platformBonus) / 2;
        creator.lastScoreUpdate = block.timestamp;
    }
    
    function _calculatePlatformScore(
        PlatformType platformType,
        string memory data
    ) internal pure returns (uint256) {
        uint256 followers = _extractFollowers(data);
        uint256 content = _extractContentCount(data);
        uint256 engagement = _extractEngagement(data);
        
        // Different scoring weights for different platforms
        if (platformType == PlatformType.TWITTER) {
            return (followers / 100) + (content / 10) + (engagement / 50);
        } else if (platformType == PlatformType.QUORA) {
            return (followers / 50) + (content / 5) + (engagement / 10);
        } else if (platformType == PlatformType.MEDIUM) {
            return (followers / 50) + (content / 5) + (engagement / 20);
        } else if (platformType == PlatformType.BINANCE || platformType == PlatformType.OKX) {
            return 500; // High score for verified exchange accounts
        }
        return 100; // Default score
    }
    
    function _updateCreatorLevel(CreatorProfile storage creator) internal {
        uint256 oldLevel = creator.creatorLevel;
        uint256 newLevel = _calculateCreatorLevel(creator);
        
        if (newLevel != oldLevel) {
            creator.creatorLevel = newLevel;
            
            // Grant token issuance permission for level 3+
            if (newLevel >= 3 && !creator.canIssueTokens) {
                creator.canIssueTokens = true;
                emit TokenIssuePermissionGranted(creator.wallet, newLevel);
            }
            
            emit CreatorLevelUpdated(creator.wallet, oldLevel, newLevel);
        }
    }
    
    function _calculateCreatorLevel(CreatorProfile storage creator) internal view returns (uint256) {
        uint256 score = creator.credibilityScore;
        uint256 platforms = creator.verifiedPlatforms.length;
        
        // Level calculation based on score and platform diversity
        if (score >= 1000 && platforms >= 3) return 5;
        if (score >= 750 && platforms >= 3) return 4;
        if (score >= 500 && platforms >= 2) return 3;
        if (score >= 250 && platforms >= 2) return 2;
        return 1;
    }
    
    function _stringToUint(string memory str) internal pure returns (uint256) {
        bytes memory b = bytes(str);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            if (b[i] >= 0x30 && b[i] <= 0x39) {
                result = result * 10 + (uint256(uint8(b[i])) - 48);
            }
        }
        return result;
    }
    
    // View functions
    function getCreatorProfile(address creator) external view returns (
        address wallet,
        string[] memory verifiedPlatforms,
        uint256 credibilityScore,
        uint256 creatorLevel,
        address personalToken,
        bool canIssueTokens,
        uint256 verifiedAt
    ) {
        CreatorProfile storage profile = creators[creator];
        return (
            profile.wallet,
            profile.verifiedPlatforms,
            profile.credibilityScore,
            profile.creatorLevel,
            profile.personalToken,
            profile.canIssueTokens,
            profile.verifiedAt
        );
    }
    
    function getPlatformData(address creator, string memory platform) external view returns (
        string memory username,
        uint256 followers,
        uint256 contentCount,
        uint256 engagement,
        uint256 verifiedAt
    ) {
        PlatformData storage data = creators[creator].platformData[platform];
        return (data.username, data.followers, data.contentCount, data.engagement, data.verifiedAt);
    }
    
    function canCreateToken(address creator) external view returns (bool) {
        return creators[creator].canIssueTokens && creators[creator].personalToken == address(0);
    }
    
    function setPersonalToken(address creator, address token) external onlyOwner {
        creators[creator].personalToken = token;
    }
    
    function updatePrimusAddress(address _primusAddress) external onlyOwner {
        require(_primusAddress != address(0), "Invalid Primus address");
        primusAddress = _primusAddress;
    }
}