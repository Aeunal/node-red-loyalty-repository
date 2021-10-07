module.exports = function(RED) {

    //const request = require('request');
    const ComponentType = {
        Point: 0,
        Barter: 1,
        Distribution: 2,
        Lottery: 3,
        Enrollment: 4,
        Ordered: 5,
        Unordered: 6
    };
    //console.error('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.


    function BarterNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;


        node.items = config.item.map(function(item) {
            return {
                name: item.name,
                amount: item.amount
            }
        });
        node.benefits = config.benefit.map(function(benefit) {
            return {
                name: benefit.name,
                amount: benefit.amount
            }
        });
        //node.benefits = config.benefit || [];
        //node.items = config.items || [];
        node.expiration = config.expiration || "none";


        node.on('input', function(msg) {
            var input_json = msg.payload;
            
            var order = msg.order + 1;
            msg.order = order;

            var output_json = {
                "expiration": node.expiration,
                "items": node.items,
                "benefits": node.benefits
            };
            
            var container = {
                "ComponentType": ComponentType.Barter, 
                "Order": order, 
                "Component": output_json
            };

            msg.components.push(container);
            node.send(msg);
        });
    }


    RED.nodes.registerType("barter",BarterNode);
}
