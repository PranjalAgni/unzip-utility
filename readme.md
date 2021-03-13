# Unzip and Evaluation utility to save my weekends ⌛ 🔥 🥇

---

## Introduction :rocket:

This is a compressed files **extractor** and **evaluation** utility. Currently it can extract (.zip and .rar files)

## How it works? :thinking:

### File Extraction:

1.  For zip files we use [unzipper](https://www.npmjs.com/package/unzipper) (NodeJS wrapper library to extract zip files)

2.For rar files, it uses command line utility [unrar](https://superuser.com/questions/52124/how-can-i-extract-rar-files-on-the-mac). This can cause problem in Windows environment, if you don't have `unrar` command line installed

### Evaluations

It parses the assignment files based on their extension, and then analyzes the files with the given evaluation criteria, then gives the marks and comments for each individual assignment

### How to use? :tada:

Install deps 📦

`npm i`

Extract zipped/rar files

`npm run start` Will listen for new (zip/rar) files, and will extract them

`npm run marks` Will evaluate all the assignments, and emits a `marks.json` file with all the marks and comments for each assignment
