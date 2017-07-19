#!/bin/bash

networkservice=$(networksetup -listallnetworkservices | head -n 3 | tail -n 1)  #获取Mac当前使用的网络名称

if [ $1 == "on" ]
    then
        echo Open web proxy for networkservice: $networkservice
    
        sudo networksetup -setwebproxy "$networkservice" $2 $3   #设置Web HTTP代理
        # sudo networksetup -setsecurewebproxy "$networkservice" $2 $3   #设置Web HTTPS代理
        sudo networksetup -setwebproxystate "$networkservice" on   #打开Web HTTP代理
        # sudo networksetup -setsecurewebproxystate "$networkservice" on  #打开Web HTTPS代理

        echo proxy on $2 $3

        forever -w index.js -watchDirectory ./
    else
        echo Close web proxy for networkservice: $networkservice
    
        sudo networksetup -setwebproxystate "$networkservice" off   #打开Web HTTP代理
        # sudo networksetup -setsecurewebproxystate "$networkservice" off  #打开Web HTTPS代理

        echo proxy off
fi
