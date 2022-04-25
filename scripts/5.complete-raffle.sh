#!/usr/bin/env bash

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

# exit on first error after this point
set -e

echo "completing raffle by $OWNER and setting $OWNER as beneficiary"
echo \$OWNER is $OWNER
echo \$raffleId is [ $raffleId ] '(the raffle  Id)'
echo \$gas is [ $gas ] '(the gas, like 300000000000000)'
echo
near call $CONTRACT completeRaffle '{"raffleId":'$raffleId'}' --accountId $OWNER --gas=$gas