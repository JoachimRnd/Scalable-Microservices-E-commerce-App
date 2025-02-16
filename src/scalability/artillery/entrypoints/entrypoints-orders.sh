#!/bin/sh

curl --request POST -d 'test' scapp_users-daemon/products

artillery run orders-daemon-load-test.yml