module.exports = function(RED) {
    const ComponentType = {
        Point: 0,
        Barter: 1,
        Distribution: 2,
        Lottery: 3,
        Enrollment: 4,
        Ordered: 5,
        Unordered: 6
    };
    function TieredNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.benefits = config.benefit.map(function(benefit) {
            return {
                name: benefit.name,
                points: benefit.amount
            }
        });

        node.paid = config.paid || "none";

        node.on('input', function(msg) {
            var input_json = msg.payload;

            // The order is not increased because it is connected to the previous node
            var order = msg.order; // + 1;
            msg.order = order;

            var output_json = {
                //"expiration": node.expiration,
                "paid": node.paid,
                "items": node.benefits
            };

            var container = {
                "ComponentType": ComponentType.Enrollment, 
                "Order": order, 
                "Component": output_json
            };

            msg.components.push(container); // TODO is it msg.payload.components.push(container); ?
            node.send(msg);
        });
    }
    RED.nodes.registerType("tiered",TieredNode);
}