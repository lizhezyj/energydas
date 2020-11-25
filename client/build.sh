#!/bin/bash

echo '开始打包'
yarn build

scp -r dist root@47.94.10.52:/yantu/client