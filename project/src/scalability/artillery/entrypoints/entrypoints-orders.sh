#!/bin/sh

curl --request POST -d 'test' scapp_users-daemon/products # don't know why but it's needed to don't have ssh error

artillery run orders-daemon-load-test.yml