#!/usr/bin/env bash
set -e

[ -z "$NEAR_ENV" ] && echo "Missing \$NEAR_ENV environment variable" && exit 1
[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

echo
echo 'About to call createRaffle() on the contract'
echo near call \$CONTRACT createRaffle '{"title":"$title", "name":"$name", "category":"$category", "description":"$description", "price":"$price", "maxTicketCount":$maxTicketCount}' --accountId \$OWNER
echo
echo \$NEAR_ENV is $NEAR_ENV
echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER
echo \$title is [ $title ] '(the title)'
echo \$name is [ $name ] '(the name)'
echo \$category is [ $category ] '(the category)'
echo \$description is [ $description ] '(the description)'
echo \$imageUrl is [ $imageUrl ] '(the image Url)'
echo \$price is [ $price ] '(the price as a yoctoNear)'
echo \$maxTicketCount is [ $maxTicketCount ] '(the maxTicketCount)'

echo
near call $CONTRACT createRaffle '{"title":"'"$title"'", "name":"'"$name"'", "category":"'"$category"'", "description":"'"$description"'", "imageUrl":"'"$imageUrl"'", "price":"'"$price"'", "maxTicketCount":'$maxTicketCount'}' --accountId $OWNER
