var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(RED) {

    function DeployNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var connection_in_progress = false;
        var connection_loop;
        var ring_connection = false;

        function errorHandler(e) {
            if(connection_loop) {
                clearInterval(connection_loop);
            }
            console.log("Deploy: Error connect");
            connection_in_progress = false;
            node.status({fill:"red",shape:"ring",text:"no connection"});
        }
        function loadHandler(e) {
            if(connection_loop) {
                clearInterval(connection_loop);
            }
            console.log("Deploy: Loaded");
            connection_in_progress = false;
            if(e == undefined) node.status({fill:"red",shape:"ring",text:"no connection"});
            else node.status({fill:"green",shape:"dot",text:"uploaded"});
        }

        function connecting_visual() {
            if(ring_connection) {
                node.status({fill:"grey",shape:"dot",text:"connecting..."}); 
            } else {
                node.status({fill:"grey",shape:"ring",text:"connecting..."}); 
            }
            ring_connection = !ring_connection;
        }

        function connection_loop_start() {
            connection_in_progress = true;
            connection_loop = setInterval(connecting_visual, 1000);
        }


        //console.log(node.outputs);
        
        node.debug = config.debug || false;

        node.on('input', function(msg) {
            if(connection_in_progress) return;
            connection_loop_start();

            msg.payload.components = msg.components;

            var url = "";
            var message = "";
            if(msg.type == "campaign") {
                console.log("[INFO]: Campaign Deployed!");

                url='http://localhost/campaigns';
                message = JSON.stringify(msg);
            } else if (msg.type == "tier") {
                console.log("[INFO]: Tiers Deployed!");
                url='http://localhost/campaigns'; // tiers
                message = JSON.stringify(msg);
            } else {
                console.log("[ERROR]: Unknown Campaign Type!");
            }

            const Http = new XMLHttpRequest();
            Http.addEventListener('error', errorHandler);
            Http.addEventListener('loadend', loadHandler);
            Http.open("POST", url);
            Http.send(message);
            
            Http.onreadystatechange = (e) => {
              console.log(Http.responseText)
            }     


            console.log(msg);
            node.send(msg);

            /*
            var alert_msg = "";
            alert_msg += "Created new Campaign with following information:\n\n";
            alert_msg += JSON.stringify(msg.payload);
            alert(alert_msg);
            */
        });
    }
    RED.nodes.registerType("deploy",DeployNode);
}