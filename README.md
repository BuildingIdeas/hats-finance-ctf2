# Solution to Hats Challenge #2 by Santiago Quinteros (@santypk4) 

## This is a fork from the original hardhat project from the challenge 


## To run the exploit

```
npm run test
```

## Explanation

By abusing self-destruct opcode an attacker can break the sync between the "*totalSupply*" and "*totalShares*" variables, responsible for transferring exceeding ether to the vault owner when call*ing the **Redeem** and **Withdraw** functions.

Combined with a reentrancy vulnerability in the aforementioned functions, an attacker could call **withdraw** several times until the smart contract balance becomes 0.

Possible solutions: 

1. Add a reentrancy guard to the withdraw and redeem functions
2. Find a way to keep in sync the contract balance with the erc20 shares state variable



### Original description below

--------------

# Hats Challenge #2

## Capture the Flag

The contract [`Vault.sol`](./contracts/Vault.sol) is an ERC4626-like vault customized to be used with ETH.
It allows anyone to deposit ETH in the vault and get shares corresponding to the amount deposited.
The shares are an ERC20 which can be freely used by users, functioning effectively just like [Wrapped ETH](https://weth.io).
The shares can also be redeemed at any time for the corresponding underlying amount of ETH.

## The Hats Challenge

The [`Vault.sol`](./contracts/Vault.sol) is deployed with the contract owning 1 ETH of the shares. 

Your mission is to capture the flag by emptying the vault, then calling `captureTheFlag` with an address you control to prove that you have succeeded in completing the challenge, so that `vault.flagHolder` returns your address.

## How to submit

- Solutions must be submitted through the hats application at https://app.hats.finance/vulnerability
- You must submit a working demonstration of the solution. This could be, for example, a hardhat project in which you fork the project and provide a script that will obtain the flag.
- The contract is deployed on goerli: https://goerli.etherscan.io/address/0x8043e6836416d13095567ac645be7C629715885c#code . However, if you do not want to give away the solution to your competitors, do not execute anything on-chain :)
