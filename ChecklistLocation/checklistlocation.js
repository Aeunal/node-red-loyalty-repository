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
    //const notify = RED.notify;

    function ChecklistLocationNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;


        node.distributor = config.distributor || "";
        node.city = config.city || "";
        node.district = config.district || "";
        node.address = config.address || "";

        node.task = config.task.map(function(task) {
            return {
                name: task.name,
                points: task.amount
            }
        });


        node.on('input', function(msg) {
            var input_json = msg.payload;

            var order = msg.order;
            var component_type = ComponentType.Ordered;

            // else The order is not increased because it is connected to the previous node
            msg.order = order;

            var output_json = {
                "tasks": node.task,
                "distributor": node.distributor,
                "city": node.city,
                "district": node.district,
                "address": node.address,
            };

            var container = {
                //"Checklist": checklist_name,
                "ComponentType": component_type, 
                "Order": order, 
                "Component": output_json
            };

            msg.components.push(container);
            node.send(msg);
        });
    }
    RED.nodes.registerType("checklistlocation",ChecklistLocationNode);
}