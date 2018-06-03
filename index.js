class Dialog {
    constructor(port, url, default_response){
        this._binds = {command: {}, original: {}};
        if(port == null){ this._port = 3000; }else{ this._port = port; }
        if(url == null){ this._url = "/" }else{ if(url.charAt(0) !== "/"){ this._url = "/"+url; }else{ this._url = url; } }
        if(default_response == null){ this._default_response = "К сожалению, я вас не понимаю"; }
        this._app = require("express")();
        this._bodyParser = require("body-parser");
        this._app.use(this._bodyParser.urlencoded({ extended: false }));
        this._app.use(this._bodyParser.json());

        this._app.post(this._url, (req,res)=>{
            let Response = (params, sender)=>{
                this._params = params;
                this._sender = sender;
                this.send = (text, tts, buttons, end_session)=>{
                    let params = this._params;
                    params["text"] = text;
                    params["tts"] = tts;
                    params["buttons"] = buttons;
                    if(end_session == null){ params["end_session"] = false; }else{ params["end_session"] = end_session; }
                    this._sender(params);
                }
            };
            let postParams = req.body;
            let responseParams = {session: postParams.session, version: postParams.version};
            if(this._binds.original[postParams.request["original_utterance"]] != null ){ this._binds.original[postParams.request["original_utterance"]](postParams, new Response(responseParams, res.send)) }else{
                if(this._binds.command[postParams.request["command"]] != null){ this._binds.command[postParams.request["command"]](postParams, new Response(responseParams, res.send)) }else{
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


    _postHandler(req,res){
        let Response = (params, sender)=>{
            this._params = params;
            this._sender = sender;
            this.send = (text, tts, buttons, end_session)=>{
                let params = this._params;
                params["text"] = text;
                params["tts"] = tts;
                params["buttons"] = buttons;
                if(end_session == null){ params["end_session"] = false; }else{ params["end_session"] = end_session; }
                this._sender(params);
            }
        };
        let postParams = req.body;
        let responseParams = {session: postParams.request.session, version: postParams.request.version};
        if(this._binds.original === postParams.request["original_utterance"]){ this._binds.original[postParams.request["original_utterance"]](postParams, new Response(responseParams, res.send)) }else{
            if(this._binds.command === postParams.request["command"]){ this._binds.command[postParams.request["command"]](postParams, new Response(responseParams, res.send)) }else{
                if(postParams.request.command === "test" && postParams.request.original_utterance === "test"){ res.send({session: postParams.request.session, version: postParams.request.version, response: {text: "test"}}) };
            }
        }
    }
}

module.exports = Dialog;