#!/usr/bin/env bash

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$USER" ] && echo "Missing \$USER environment variable" && exit 1


# exit on first error after this point
set -e

echo --------------------------------------------
echo
echo "deploying and initializing the contract in a single transaction"
echo \$USER is $USER
echo \$raffleId is [ $raffleId ] '(the raffle Id)'
echo \$attachmentDeposit is [ $attachmentDeposit ] '(the attachment deposit)'
echo
near call $CONTRACT buyTicket '{"raffleId":'$raffleId'}' --accountId $USER --deposit $attachmentDeposit
exit 0
