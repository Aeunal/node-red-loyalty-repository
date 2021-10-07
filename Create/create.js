module.exports = function(RED) {

    const request = require('request');
    const TOTAL_CONNECTIONS = 2;

    var data = {"data":[{"name":"..."}]};

    //red, green, yellow, blue or grey /// ring or dot.
    
    var connected = 0;

    function Create(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.status({fill:"grey",shape:"ring",text:"connecting..."}); 
        
        request('http://localhost/companies', function (error, response, body) {
            connected++;
            var connection_finished = (connected >= TOTAL_CONNECTIONS);
            if (response === undefined) {
                console.log("Could not connect to companies API", error);
                companies = {
                    "data":[{"name":"company1"}, {"name":"company2"}]
                }
                if(connection_finished) node.status({fill:"red",shape:"ring",text:"disconnected"});
            } else { 
                companies = JSON.parse(body); 
                if(connection_finished) node.status({fill:"green",shape:"dot",text:"connected"});
            }
        });

        request('http://localhost/items', function (error, response, body) {
            connected++;
            var connection_finished = (connected >= TOTAL_CONNECTIONS);
            if (response === undefined) {
                console.log("Could not connect to items API", error);
                items = {
                    "data":[{"name":"item1"}, {"name":"item2"}]
                }
                if(connection_finished) node.status({fill:"red",shape:"ring",text:"disconnected"});
            } else {
                items = JSON.parse(body); 
                if(connection_finished) node.status({fill:"green",shape:"dot",text:"connected"});
            }
        });


        RED.httpAdmin.get('/apitest/:cmd', RED.auth.needsPermission('apitest.read'), function(req, res){
            var node = RED.nodes.getNode(req.params.id);
            switch(req.params.cmd) {
                case "companies":
                    if(companies) data = companies;
                    break;
                case "items":
                    if(items) data = items;
                    break;
            }
            // Return a list of all available items
            res.json(data);
        });
    
        RED.httpAdmin.post("/inject/:id", RED.auth.needsPermission("inject.write"), function(req,res) {
            var node = RED.nodes.getNode(req.params.id);
            if (node != null) {
                try {
                    node.receive();
                    res.sendStatus(200);
                } catch(err) {
                    res.sendStatus(500);
                    node.error(RED._("inject.failed",{error:err.toString()}));
                }
            } else {
                res.sendStatus(404);
            }
        });


        //node.publickey = config.publickey || "none";
        //node.privatekey = config.privatekey || "none";

        node.publickey = this.credentials.publickey;
        node.privatekey = this.credentials.privatekey;

        node.distribution = config.distribution || "none";
        node.consumerAge = config.consumerAge || "none";
        node.consumerFreq = config.consumerFreq || "none";
        node.partnered = config.partnered || "none";
        node.partner = config.partner || "none";

        node.on('input', function(msg) {
            msg.payload = {
                "name":node.name,
                "publickey":node.publickey,
                "privatekey":node.privatekey,
                "distribution": node.distribution,
                "consumerAge": node.consumerAge,
                "consumerFreq": node.consumerFreq,
                "partnered": node.partnered,
                "partner": node.partner,
                "timestamp": new Date().getTime(),
                "components":[]
            }
            msg.order = 0;
            msg.components = []
            msg.type = "campaign";
            node.send(msg);
        });
    }
    RED.nodes.registerType("create",Create, {
        credentials: {
            publickey: {type:"text"}, 
            privatekey: {type:"password"}
        }
    });
}