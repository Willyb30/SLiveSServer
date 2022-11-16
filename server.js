var yetify = require('yetify'),
    config = require('getconfig'),
    //socketIO = require('socket.io'),
    fs = require('fs'),
    sockets = require('./sockets'),
    port = parseInt(3000),//process.env.PORT || config.server.port, 10),
    server_handler = function (req, res) {

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

        var content;
        var fs = require('fs');
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
                /*else if (atts == "senderoriginal") {
                    content = fs.readFileSync('Streamer_original.html');
                    peerMode = 'Sender';
                }
                else if (atts == "receiver") {
                    content = fs.readFileSync('Preview.html');
                    //peerMode = 'Sender';
                }*/
                
                else if (peerMode && peerMode.toLowerCase() == 'receiver')
                    content = fs.readFileSync('Preview.html');
                else
                    content = fs.readFileSync('Preview.html');

            }
            console.log("peerMode=" + peerMode)
        }

        res.end(content);

    },

    server = null;
    config.server.secure =true;
// force ssl

    server = require('https').Server({
        key: `-----BEGIN PRIVATE KEY-----
        MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAMd9Gqd7gBWTZ7GM
        8xaIliCKyU+HEAuv/f4S2XiSSeqBRfadJBPl0IsqdsUC1pBxGIPBK44i955OiNL4
        FgaSa5n6gm1A0cL7bcGKfzHhsxn3Gqy+ABHcnzx8VRiD05E3evtkz6BJodpwn8Lp
        PvpNRfMSNuRR5jKmhUTLgZQcoFWxAgMBAAECgYBb5taQseSgC/iJY1XZ27LN6yIy
        8RYDTGDG3Agz87D5x/RjWKF2STl542Yz/Mq8YF3a1PMr2BAbbjK6fnAnNu06gkxB
        HJfTKps1zWOvfIjJFT3k/FOb4NWKBo+O7NBxm+vR3fvReNH1vnmf4XUmuWTJbK0r
        nITWyXe9ZdGSASd5AQJBAOkXJ/MIBQS75vanTBh7aRvFNwkAwlWGsvK0Gulb8Xv9
        iiElRZTlGRIGbgwU8Jv76vLHs3gobco6P6ou+wod37UCQQDbGHxxzJfSNvATSb9B
        WL7Y1StpW+Z8OwouYXPvIK0O8iIWpO6tYd82T9Ch1f3m6jpxLzjohmO9GkIQgkkk
        eQONAkBC7bU44Xqfa1zcQhllhjoeETjGSwOCD1Vevzxi+VWTpq986Pjb0hSqylHb
        AkA8ac+CurjbrbAouyUAttC6jO1pAkAVxE4AxFHFCb46PFZq+JUlV7BTbFTuvLLb
        PsVU2Ys38+hdFY+82/9gFvfkTC1IdrbNreJaf5eDHwu3NipsHDW1AkA0aZYl+a0T
        ROGFloEhYMZYdv9fZabTCr3lFRyCEY6aLZFKT/eWU3Yu0XYY6+HkTTB4fLefR+WP
        4bi9s0LX+Xrx
        -----END PRIVATE KEY-----
        `,
        cert: `-----BEGIN CERTIFICATE-----
        MIICajCCAdMCFBm6JZE7JedL2C5tlA4j1ovEadIkMA0GCSqGSIb3DQEBCwUAMHMx
        CzAJBgNVBAYTAkZSMRMwEQYDVQQIDApTb21lLVN0YXRlMQ4wDAYDVQQHDAVOaW1l
        czEOMAwGA1UECgwFU3RybVIxDjAMBgNVBAMMBVN0cm1SMR8wHQYJKoZIhvcNAQkB
        FhBjb250YWN0QHN0cm1yLmZyMCAXDTIyMTExNDIyMTIwNFoYDzIwNTAwMzMxMjIx
        MjA0WjBzMQswCQYDVQQGEwJGUjETMBEGA1UECAwKU29tZS1TdGF0ZTEOMAwGA1UE
        BwwFTmltZXMxDjAMBgNVBAoMBVN0cm1SMQ4wDAYDVQQDDAVTdHJtUjEfMB0GCSqG
        SIb3DQEJARYQY29udGFjdEBzdHJtci5mcjCBnzANBgkqhkiG9w0BAQEFAAOBjQAw
        gYkCgYEAx30ap3uAFZNnsYzzFoiWIIrJT4cQC6/9/hLZeJJJ6oFF9p0kE+XQiyp2
        xQLWkHEYg8ErjiL3nk6I0vgWBpJrmfqCbUDRwvttwYp/MeGzGfcarL4AEdyfPHxV
        GIPTkTd6+2TPoEmh2nCfwuk++k1F8xI25FHmMqaFRMuBlBygVbECAwEAATANBgkq
        hkiG9w0BAQsFAAOBgQChdchnoHLAmAA1zH6W2ePscowzSLPHkrdPbI5UJuro+CUh
        aIlN84zSAN+atVgXN2wihUEi04UoFSgU7RaoeOvPQioYkwHWitKrpIa6CA/hgZGZ
        EFTWF3Z5BPpZd9g7AmIsW+vIzHdcdRUKo2VQCnQr6AeIIg/kNF9VXJjNVbZJrQ==
        -----END CERTIFICATE-----        
        `,
        passphrase: "mk4tbgdx"
    }, server_handler);





/*// Create an http(s) server instance to that socket.io can listen to
if (config.server.secure) {
    server = require('https').Server({
        key: fs.readFileSync(config.server.key),
        cert: fs.readFileSync(config.server.cert),
        passphrase: config.server.password
    }, server_handler);
} else {
    server = require('http').Server(server_handler);
}
*/
server.listen(port);
config.server.port=port;
sockets.ListenSocket(server, config);
//onsole.log("socket on port "+sockets.PORT)
if (config.uid) process.setuid(config.uid);

var httpUrl;
if (config.server.secure) {
    httpUrl = "https://localhost:" + port;
} else {
    httpUrl = "http://localhost:" + port;
}
console.log(yetify.logo() + ' -- signal master is running at: ' + httpUrl);
