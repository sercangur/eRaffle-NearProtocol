## Setting up your terminal

The scripts in this folder support a simple demonstration of the contract.

It uses the following setup:

### Terminal

*This window is used to compile, deploy and control the contract*
- Environment
  ```sh
  export CONTRACT=        # depends on deployment
  export OWNER=           # any account you control and create, complete Raffle
  export USER=            # any account buy ticket


  # for example
  # export CONTRACT=dev-1650913307591-45011705943591
  # export OWNER=sercangur.testnet
  # export USER=p1.sercangur.testnet
  # export OWNER=p2.sercangur.testnet

  ```

- Commands

  _Owner scripts_
  ```sh
  1.dev-deploy.sh           # cleanup, compile and deploy contract
  2.create-subaccounts.sh   # generate a summary report of the contract state
  3.create-raffle.sh       
  5.complete-raffle.sh      
  6.report.sh
  ```

  _Public scripts_
  ```sh
  4.buy-ticket.sh         
  2.say-anon-thanks.sh    
  ```