export const ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_token"
            },
            {
                "type": "address",
                "name": "_treasury"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Bid",
        "inputs": [
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": false
            },
            {
                "type": "address",
                "name": "bidder",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "bid",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OwnershipTransferred",
        "inputs": [
            {
                "type": "address",
                "name": "previousOwner",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newOwner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Paused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Start",
        "inputs": [
            {
                "type": "uint256",
                "name": "tokenId",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unpaused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "bid",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getAuction",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "uint256",
                        "name": "tokenId"
                    },
                    {
                        "type": "uint256",
                        "name": "startTime"
                    },
                    {
                        "type": "uint256",
                        "name": "endTime"
                    },
                    {
                        "type": "uint256",
                        "name": "currentBid"
                    },
                    {
                        "type": "address",
                        "name": "bidder"
                    },
                    {
                        "type": "uint256",
                        "name": "minBid"
                    },
                    {
                        "type": "bool",
                        "name": "isFinished"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "getConfig",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "tuple",
                "name": "",
                "components": [
                    {
                        "type": "address",
                        "name": "treasury"
                    },
                    {
                        "type": "address",
                        "name": "token"
                    },
                    {
                        "type": "address",
                        "name": "glmr"
                    },
                    {
                        "type": "uint256",
                        "name": "duration"
                    },
                    {
                        "type": "uint256",
                        "name": "extendedDuration"
                    },
                    {
                        "type": "uint256",
                        "name": "minFirstBid"
                    },
                    {
                        "type": "uint256",
                        "name": "minBidIncrementPercent"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "glmr",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "onERC721Received",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "uint256",
                "name": ""
            },
            {
                "type": "bytes",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "bytes4",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "owner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "pause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "paused",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "renounceOwnership",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setDuration",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_duration"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setExtendedDuration",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_extendedDuration"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setGLMR",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_glmr"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMinBidIncrementPercent",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_minBidIncrementPercent"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMinFirstBid",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_minFirstBid"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setTreasury",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_treasury"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "start",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newOwner"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "treasury",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "unpause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    }
]
