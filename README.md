# eRaffle - Near Protocol
Buy a Ticket. Join the Raffle and WIN!
Written in Assemblyscript and used Singleton Pattern for being Near Certified Developer! 

# Roles
## Admin Usage
- Choose anything like shoes,headphones etc. Set your items name,category,price,maximum ticket count and all details and Organize a eRaffle!
- After the time expires, Admin ends the eRaffle and the winner is determined randomly and the Account Id of the winner is updated as the winner of the item.
- If the eRaffle has been completed, reassignment cannot be done, Joins are closed.

## User Usage
- Buy ticket how much you want.
- If the tickets are sold out, Joins are closed.
- Hurry up to join the eRaffle!

# Models
## Raffle
| Name | Type |
| ------ | ------ |
| Title | AccountId |
| Name | String |
| Category | String |
| Description | String |
| imageUrl | String |
| price | Money |
| MaxTicketCount | i32 |
| isActive | bool |
| isCompleted | bool |
| Winner_AccountID | AccountId |
| Winner_TicketID | i32 |
| CreatedDate | Timestamp |
| ModifiedDate | Timestamp |
| DeletedDate | Timestamp |
| CompletedDate | Timestamp |
## Ticket
| Name | Type |
| ------ | ------ |
| AccountID | AccountId |
| RaffleID | i32 |
| isReturn | bool |
| CreatedDate | Timestamp |
| ReturnDate | Timestamp |

# Functions
## Initializing
init()
## Raffle
createRaffle()
modifyRaffle()
completeRaffle()
cancelRaffle()
getRafflesByRaffleID()
getRafflesByAccountId()
getAllRaffles()
## Ticket
buyTicket()
getTicketsByAccountId()
getTicketsByRaffleId()
getAllTickets()

# Build and devDeploy
```ts
yarn
yarn build:release
near dev-deploy ./build/release/eRaffle.wasm
export CONTRACT=<AccountId>
echo $CONTRACT
```
# Creating Accounts
```ts
near create-account <subAccName1>.<AccountName>.testnet --masterAccount <AccountName>.testnet --initialBalance 10
near create-account <subAccName2>.<AccountName>.testnet --masterAccount <AccountName>.testnet --initialBalance 10

near state <subAccName1>.<AccountName>.testnet
near state <subAccName2>.<AccountName>.testnet
near state <AccountName>.testnet

near send <AccountName>.testnet <subAccName1>.<AccountName>.testnet 10
near delete <subAccName1>.<AccountName>.testnet <AccountName>.testnet
near delete <subAccName2>.<AccountName>.testnet <AccountName>.testnet
```
# Functions Usage
Initializing
```ts
near call $CONTRACT init --accountId sercangur.testnet
```
Creating Raffle
```ts
near call $CONTRACT createRaffle '{"title":" Nike ", "name":" Total90", "category":"Shoes", "description":" football ", "imageUrl":" https://www.adidas.com.tr/en/stan-smith-shoes/FX5502.html " , "price":"900000000000000000000000", "maxTicketCount":300}' --accountId sercangur.testnet
```
Modifying Raffle
```ts
near call $CONTRACT modifyRaffle '{"raffleId":0, "title":"Adidas", "name":"AirMax", "category":"Shoes", "description":"limited", "imageUrl":"https://www.adidas.com.tr/en/hoops-3.0-low-classic-vintage-shoes/GY5432.html" , "price":"1100000000000000000000000", "maxTicketCount":200}' --accountId sercangur.testnet
```
Canceling Raffle
```ts
near call $CONTRACT cancelRaffle '{"raffleId":0}' --accountId sercangur.testnet
```
Getting All Raffles
```ts
near view $CONTRACT getAllRaffles
```
Getting Raffles By Raffle Id
```ts
near view $CONTRACT getRafflesByRaffleID '{"raffleId":0}'
```
Getting Tickets By Account Id
```ts
near view $CONTRACT getTicketsByAccountId '{"sender":"p1.sercangur.testnet"}'
```
Getting Tickets By Raffle Id
```ts
near view $CONTRACT getTicketsByRaffleId '{"raffleId":0}'
```
Getting All Tickets
```ts
near view $CONTRACT getAllTickets '{}'
```
Buying a Ticket
```ts
near call $CONTRACT buyTicket '{"raffleId":0}' --accountId p1.sercangur.testnet --deposit 2.5
```
Completing Raffle
```ts
near call $CONTRACT completeRaffle '{"raffleId":1}' --accountId sercangur.testnet
```
