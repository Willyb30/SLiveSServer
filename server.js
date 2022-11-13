var yetify = require('yetify'),
   config = require('getconfig'),
   
    //socketIO = require('socket.io'),
    fs = require('fs'),
    sockets = require('./sockets'),
    port = parseInt(process.env.PORT || config.server.port, 10),
    server_handler = function (req, res) {
        const path = require('path');
        const fs = require('fs');
        //joining path of directory 
        const directoryPath = path.join(__dirname, '');


        //Trim arguments
        var url = req.url.split('?')[0];

        //Try to get target peer mode to show appropriate page
        var peerMode;
        var multicastType;
        var splitted = url.split('/');
        if (splitted.length > 1) {
            var IO = sockets.io;
            var page = splitted[1];
            var roomName = splitted[2];
            var peerId = splitted[3];
            var atts = splitted[4];

            console.log(splitted[0] + ":" + splitted[1] + ":" + splitted[2] + ":" + splitted[3] + ":" + splitted[4])

            console.log('length' + splitted.length)

            //Get peer mode to determine page content
            if (IO) {
                console.log("io is ok");
                var targetPeer = IO.sockets.adapter.nsp.connected[peerId];
                if (!targetPeer) { //Try to find by nickname
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
            }
            if (targetPeer && targetPeer.customProps) {
                if (targetPeer.customProps.mode)
                    peerMode = targetPeer.customProps.mode;
                if (targetPeer.customProps.multicastType)
                    multicastType = targetPeer.customProps.multicastType;
            }
            console.log("multicastType:" + multicastType);
        }
        console.log("\n:" + req.url);
        let content=req.url;


        /*
        //passsing directoryPath and callback function
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                res.write("<br/>"+file);
                console.log(file);
            });
            res.end(content);
        });
*/

        //var fs = require('fs');

        if (req.url.indexOf("index") != -1)
        {
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });
            content = fs.readFileSync('index.html');
        }
        
        
            if (req.url.indexOf("style.css") != -1) {
            res.writeHead(200, {
                "Content-Type": "text/css"
            });
            content = fs.readFileSync('css/style.css');
            } else if (req.url.indexOf("StreamerStyles.css") != -1) {
            res.writeHead(200, {
                "Content-Type": "text/css"
            });
            content = fs.readFileSync('css/StreamerStyles.css');
            } else if (req.url.indexOf("simplewebrtc.bundle.js") != -1) {
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
            content = fs.readFileSync('public/socketcommands.js');
            }   else if (req.url.indexOf("js/socketcommands.js") != -1) {
                res.writeHead(200, {
                    "Content-Type": "text/javascript"
                });
                content = fs.readFileSync('js/socketcommands.js');
            } else if (req.url.indexOf("camtest") != -1) {
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                if (page == "WebRtc")
                    content = fs.readFileSync('https://www.strmr.fr/downloads/blank.html');
                else
                    content = fs.readFileSync('Receiver.html');
            } else if (splitted.length == 2) {
                console.log("page=" + page)
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                content = fs.readFileSync('CamRoomSelect.html');
            } else if (splitted.length > 3) {
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });

                if (page == "WSFull") {
                    content = fs.readFileSync('FullControl.html');
                } else
                if (page == "WSTime") {
                    content = fs.readFileSync('FullControl.html');
                } else
                if (page == "WebRtc") {
                    if (atts == "sender") {
                        content = fs.readFileSync('StreamerNew.html');
                        peerMode = 'Sender';
                    }
                    else if (atts == "senderoriginal") {
                        content = fs.readFileSync('Streamer_original.html');
                        peerMode = 'Sender';
                    }
                    else if (atts == "receiver") {
                        content = fs.readFileSync('Preview.html');
                        //peerMode = 'Sender';
                    }
                    else if (peerMode && peerMode.toLowerCase() == 'receiver')
                        content = fs.readFileSync('Preview.html');
                    else
                        content = fs.readFileSync('Preview.html');

                }
                console.log("peerMode=" + peerMode)
            }


            //res.write(content);
            res.end(content);

        },

        server = null;

       


        // Create an http(s) server instance to that socket.io can listen to
        if (config.server.secure) {
            server = require('https').Server({
                key: fs.readFileSync(config.server.key),
                cert: fs.readFileSync(config.server.cert),
                passphrase: config.server.password
            }, server_handler);
        } else {
            server = require('http').Server(server_handler);
        }
        server.listen(port);

        sockets.ListenSocket(server, config);

        if (config.uid) process.setuid(config.uid);

        var httpUrl;
        if (config.server.secure) {
            httpUrl = "https://localhost:" + port;
        } else {
            httpUrl = "http://localhost:" + port;
        }
        console.log(yetify.logo() + ' -- signal master is running at: ' + httpUrl);
