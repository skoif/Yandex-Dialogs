[![npm version](https://badge.fury.io/js/yandex-dialogs.svg)](https://badge.fury.io/js/yandex-dialogs)
# Yandex Dialogs SDK [BETA]
This is something like express, but for Yandex Dialogs.
This is community library, not official.
## Installation
Install from NPM
```
npm install yandex-dialogs
```
Install from GIT
```
npm install https://github.com/skoif/Yandex-Dialogs
```
## Usage
```javascript
const Dialog = require("yandex-dialogs");
const dialog = new Dialog({port: 3000, url: "/alice", default_response: "Я вас не понимаю"});
dialog.bind("Привет", (req,res)=>{
    res.send("Приветствую!");
});
```
## Dialog constructor parameters
```
new Dialog({[port], [url], [default_response]});
```
Port - web port, default: 3000\
Url - app's url, default: /\
Default response - response to send if no binds found, default: К сожалению, я вас не понимаю
## Bind
This function binds event for command
```
dialog.bind([command (or array of commands)], [callback]);
```
## BindOriginal
This function binds event for original_utterance
```
dialog.bindOriginal([original_utterance (or array)], [callback]);
```
## Bind's callbacks
```
([Request data],[Response object])=>{
    res.send([text], [tss], [buttons], [end_session]);
}
```
Check official docs at https://tech.yandex.ru/dialogs/alice/doc/protocol-docpage/ To understand what is Request data, text, tss, buttons and end_session
# Disclaimer
This is not official Yandex's library.
<br><br><br>
Lib version: 0.3.0
Readme for version: 0.3.0