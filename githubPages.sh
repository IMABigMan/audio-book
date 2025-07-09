#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build:githubPages

# 进入生成的文件夹
cd dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

# 第一次需要初始化分支
rm -rf .git
git init
git checkout -b main
git add -A
git commit -m 'deploy'

# 发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/IMABigMan/audio-book.git main:gh-pages

cd -
