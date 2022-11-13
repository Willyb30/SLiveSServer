import express from 'express';

import yetify from 'yetify';
import fs from 'fs';
//import socketIO from './sockets.js';
import sockets from './sockets.js';



var port = 3000;

 var server_handler = function (req, res) {
     
     
 }

const app = express();



app.get("*", (req,res)=>{
   // var sockets = require('./sockets');
    
    //Trim arguments
var url = req.url.split("/");
     var origin=url[0];
    var page=url[1];
    var roomName=url[2];
    var peerId=url[3];
    var atts = url[4];
    
   
    
    
    var peerMode;
        var multicastType;
    
    var IO = sockets.io;
    
    
    var content="hello";
    
    //Socket io peer config
    if (IO) {
                console.log("io is ok");
                var targetPeer = IO.sockets.adapter.nsp.connected[peerId];
                
                if (!targetPeer) { //Try to find by nickname
                console.log("target peer is null");
                    var room = IO.sockets.adapter.rooms[roomName];
                    if (room) {
                        for (var id in room) {
                            var peer = IO.sockets.adapter.nsp.connected[id];
                            if (peer && peer.customProps && peer.customProps.nickName && peer.customProps.nickName == peerId)
                                targetPeer = peer;
                            console.log("targetPeer:" + targetPeer);
                        }
                    }
                }
                else
                {
                    console.log("targetpeer is ok")}
            }
            if (targetPeer && targetPeer.customProps) {
                if (targetPeer.customProps.mode)
                    peerMode = targetPeer.customProps.mode;
                if (targetPeer.customProps.multicastType)
                    multicastType = targetPeer.customProps.multicastType;
            }
            console.log("multicastType:" + multicastType);
    console.log("targetPeer:" + targetPeer);
    
    
    
    
    
    //url des styles et autres js
    if (req.url.indexOf("style.css") != -1) {
            res.writeHead(200, {
                "Content-Type": "text/css"
            });
            content = fs.readFileSync('css/style.css');
        } 
        else if (req.url.indexOf("StreamerStyles.css") != -1) {
            res.writeHead(200, {
                "Content-Type": "text/css"
            });
            content = fs.readFileSync('css/StreamerStyles.css');
        } 
        else if (req.url.indexOf("simplewebrtc.bundle.js") != -1) {
            res.writeHead(200, {
                "Content-Type": "text/javascript"
            });
            content = fs.readFileSync('js/simplewebrtc.bundle.js');
        } else if (req.url.indexOf("jquery.min.js") != -1) {
            res.writeHead(200, {
                "Content-Type": "text/javascript"
            });
            content = fs.readFileSync('js/jquery.min.js');
        } else if (req.url.indexOf("socketcommands.js") != -1) {
            res.writeHead(200, {
                "Content-Type": "text/javascript"
            });
            content = fs.readFileSync('js/socketcommands.js');
        }
    
    else
   if (page == "WebRtc"){
       res.writeHead(200, { 
                "Content-Type": "text/html; charset=utf-8" 
            });
            content = fs.readFileSync('StreamerNew.html');
                    peerMode = 'Sender';
       
   }
            
      
    
    

     
     //constent=JSON.stringify(req).toString();
    res.end(content);
}
 )




app.listen(port,()=>{
    console.log("Server Started listening 3000")
    
    
})
