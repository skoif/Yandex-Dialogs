class Dialog {
    constructor(object, fallback1, fallback2){
        this._binds = {command: {}, original: {}};
        if(typeof object === "number" || typeof object === "string"){
            this._port = object;
            if(fallback1 == null){ this._url = "/" }else{ if(fallback1.charAt(0) !== "/"){ this._url = "/"+fallback1; }else{ this._url = fallback1; } }
            if(fallback2 == null){ this._default_response = "К сожалению, я вас не понимаю"; }else{ this._default_response = fallback2; }
        }else{
            if(typeof object === "object"){
                if(object.port == null){ this._port = 3000; }else{ this._port = object.port; }
                if(object.url == null){ this._url = "/"; }else{ if(object.url.charAt(0) !== "/"){ this._url = "/"+object.url; }else{ this._url = object.url; } }
                if(object.default_response == null){ this._default_response = "К сожалению, я вас не понимаю"; }else{ this._default_response = object.default_response; }
            }else{
                this._port = 3000;
                this._url = "/";
                this._default_response = "К сожалению, я вас не понимаю";
            }
        }
        this._app = require("express")();
        this._bodyParser = require("body-parser");
        this._app.use(this._bodyParser.urlencoded({ extended: false }));
        this._app.use(this._bodyParser.json());

        this._app.post(this._url, (req,res)=>{
            let postParams = req.body;
            let responseParams = {session: postParams.session, version: postParams.version, response: {}};
            if(this._binds.original[postParams.request["original_utterance"]] != null ){ this._binds.original[postParams.request["original_utterance"]](postParams, new Response(responseParams, res)) }else{
                if(this._binds.command[postParams.request["command"]] != null){ this._binds.command[postParams.request["command"]](postParams, new Response(responseParams, res)) }else{
                    if(postParams.request.command === "test" && postParams.request.original_utterance === "test"){ res.send({session: postParams.session, version: postParams.version, response: {text: "test"}}) }else{
                        res.send({session: postParams.session, version: postParams.version, response: {text: this._default_response}})
                    }
                }
            }
        });
        this._app.listen(this._port);
    }
    bind(text, callback){
        if(typeof text === "string"){ this._binds.command[text] = callback; }
        if(typeof text === "object"){ text.forEach((item)=>{ this._binds.command[item] = callback; }); }
    }
    bindOriginal(text, callback){
        if(typeof text === "string"){ this._binds.original[text] = callback; }
        if(typeof text === "object"){ text.forEach((item)=>{ this._binds.original[item] = callback; }); }
    }
}

class Response{
    constructor(params, sender){
        this._params = params;
        this._senderapp = sender;
        this.send = (text, tts, buttons, end_session)=>{
            let params = this._params;
            params["response"]["text"] = text;
            params["response"]["tts"] = tts;
            params["response"]["buttons"] = buttons;
            if(end_session == null){ params["end_session"] = false; }else{ params["end_session"] = end_session; }
            this._senderapp.send(params);
        }
    };
}

module.exports = Dialog;