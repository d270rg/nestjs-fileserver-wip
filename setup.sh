#!/bin/bash
for D in */; do    
    if [ "$D" = "tools/" ] || [ "$D" = ".vscode/" ]; then
        continue
    fi
    echo "Building $D..."

    cd ./"$D"

    rm -rf ./node_modules
    rm -rf ./yarn.lock
    yarn
    yarn build

    cd ../
done