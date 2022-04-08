// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@openzeppelin/contracts-4.2.0/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-4.2.0/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-4.2.0/proxy/Clones.sol";
import "./Vesting.sol";
import "./SimpleGovernance.sol";

/**
 * @title Saddle DAO token
 * @notice A token that is deployed with fixed amount and appropriate vesting contracts.
 * Transfer is blocked for a period of time until the governance can toggle the transferability.
 */
contract Libra is ERC20, SimpleGovernance {
    using SafeERC20 for IERC20;

    // Token max supply is 100,000,000 * 1e18 = 1e27
    uint256 public constant MAX_SUPPLY = 1e8 ether;
    address public immutable vestingContractTarget;

    event Disallowed(address indexed target);
    event VestingContractDeployed(
        address indexed beneficiary,
        address vestingContract
    );

    struct Recipient {
        address to;
        uint256 amount;
        uint256 startTimestamp;
        uint256 cliffPeriod;
        uint256 durationPeriod;
    }

    /**
     * @notice Initializes SDL token with specified governance address and recipients. For vesting
     * durations and amounts, please refer to our documentation on token distribution schedule.
     * @param governance_ address of the governance who will own this contract
     * by the governance.
     * @param vestingContractTarget_ logic contract of Vesting.sol to use for cloning
     */
    constructor(
        address governance_,
        address vestingContractTarget_
    ) public ERC20("Libra DAO", "LIB") {
        require(governance_ != address(0), "SDL: governance cannot be empty");
        require(
            vestingContractTarget_ != address(0),
            "LIB: vesting contract target cannot be empty"
        );

        // Set state variables
        vestingContractTarget = vestingContractTarget_;
        governance = governance_;

        // Mint tokens to governance
        _mint(governance, MAX_SUPPLY);
        emit SetGovernance(governance_);
    }

    /**
     * @notice Deploys a clone of the vesting contract for the given recipient. Details about vesting and token
     * release schedule can be found on https://docs.saddle.finance
     * @param recipient Recipient of the token through the vesting schedule.
     */
    function deployNewVestingContract(Recipient memory recipient)
        public
        onlyGovernance
        returns (address)
    {
        require(
            recipient.durationPeriod > 0,
            "LIB: duration for vesting cannot be 0"
        );

        // Deploy a clone rather than deploying a whole new contract
        Vesting vestingContract = Vesting(Clones.clone(vestingContractTarget));

        // Initialize the clone contract for the recipient
        vestingContract.initialize(
            address(this),
            recipient.to,
            recipient.startTimestamp,
            recipient.cliffPeriod,
            recipient.durationPeriod
        );

        // Send tokens to the contract
        IERC20(address(this)).safeTransferFrom(
            msg.sender,
            address(vestingContract),
            recipient.amount
        );

        emit VestingContractDeployed(recipient.to, address(vestingContract));

        return address(vestingContract);
    }

    /**
     * @notice Transfers any stuck tokens or ether out to the given destination.
     * @dev Method to claim junk and accidentally sent tokens. This will be only used to rescue
     * tokens that are mistakenly sent by users to this contract.
     * @param token Address of the ERC20 token to transfer out. Set to address(0) to transfer ether instead.
     * @param to Destination address that will receive the tokens.
     * @param balance Amount to transfer out. Set to 0 to select all available amount.
     */
    function rescueTokens(
        IERC20 token,
        address payable to,
        uint256 balance
    ) external onlyGovernance {
        require(to != address(0), "LIB: invalid recipient");

        if (token == IERC20(address(0))) {
            // for Ether
            uint256 totalBalance = address(this).balance;
            balance = balance == 0
                ? totalBalance
                : Math.min(totalBalance, balance);
            require(balance > 0, "LIB: trying to send 0 ETH");
            // slither-disable-next-line arbitrary-send
            (bool success, ) = to.call{value: balance}("");
            require(success, "LIB: ETH transfer failed");
        } else {
            // any other erc20
            uint256 totalBalance = token.balanceOf(address(this));
            balance = balance == 0
                ? totalBalance
                : Math.min(totalBalance, balance);
            require(balance > 0, "LIB: trying to send 0 balance");
            token.safeTransfer(to, balance);
        }
    }
}
