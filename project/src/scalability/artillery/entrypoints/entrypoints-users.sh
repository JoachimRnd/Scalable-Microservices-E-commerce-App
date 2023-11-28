#!/bin/sh

curl --request POST -d 'username=bob&password=alice' scapp_users-daemon/user

artillery run users-daemon-load-test.yml