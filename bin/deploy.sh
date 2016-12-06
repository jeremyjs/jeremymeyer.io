#!/bin/bash

git push --tags

ssh -T appuser@192.81.216.138 'bash -s' << EOF
  export PATH="$PATH:/home/appuser/.nvm/versions/node/v6.9.1/bin:/home/appuser/.nvm/versions/node/v6.9.1/lib"
  cd ~/apps/jeremymeyer.io
  git remote update -p
  git checkout $(git describe --tags `git rev-list --tags --max-count=1`)
  pm2 restart jeremymeyer.io
EOF
