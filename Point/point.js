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
    function PointNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        node.products = config.product.map(function(product) {
            return {
                name: product.name,
                points: product.points
            }
        });
        //node.expiration = config.expiration || "none";
        
        node.on('input', function(msg) {
            var input_json = msg.payload;

            var order = msg.order + 1;
            msg.order = order;
            
            var output_json = {
                //"expiration": node.expiration,
                "items": node.products
            };

            var container = {
                "ComponentType": ComponentType.Point, 
                "Order": order, 
                "Component": output_json
            };

            msg.components.push(container);
            node.send(msg);
        });
    }
    RED.nodes.registerType("point",PointNode);
}