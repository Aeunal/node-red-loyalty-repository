module.exports = function(RED) {
    const ComponentType = {
        Point: 0,
        Barter: 1,
        Distribution: 2,
        Lottery: 3,
        Enrollment: 4,
        Ordered: 5,
        Unordered: 6,
        Tier: 7
    };
    function TierNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        /*
        node.benefits = config.benefit.map(function(benefit) {
            return {
                name: benefit.name,
                points: benefit.amount
            }
        });
        */

        node.name = config.name || "unnamed";
        node.paid = config.paid || false;
        node.price = config.price || 0;
        node.percentage = config.percentage || 0;
        node.limit = config.limit || 0;

        node.on('input', function(msg) {
            var input_json = msg.payload;

            // The order is not increased because it is connected to the previous node
            var order = msg.order + 1;
            msg.order = order;

            var output_json = {
                //"expiration": node.expiration,
                "name": node.name,
                "paid": node.paid,
                "price": node.price,
                "percentage": node.percentage,
                "limit": node.limit,
                //"items": node.benefits
            };

            var container = {
                "ComponentType": ComponentType.Tier, 
                "Order": order, 
                "Component": output_json
            };

            msg.payload.components.push(container);
            msg.components.push(container);
            node.send(msg);
        });
    }
    RED.nodes.registerType("tier",TierNode);
}