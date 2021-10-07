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

    function ChecklistBenefitNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        /*
        // is head of chain
        node.chain = config.chain || false;
        // checklist name
        node.checklist = config.checklist || "Element";
        // is it ordered
        node.unordered = config.unordered || false;

        node.task = config.task.map(function(task) {
            return {
                name: task.name,
                points: task.amount
                //, location: task.location
            }
        });
        */

        node.benefit = config.benefit.map(function(benefit) {
            return {
                name: benefit.name,
                points: benefit.amount
            }
        });

        node.on('input', function(msg) {
            var input_json = msg.payload;

            /*
            notification_options = {
                modal: true,
                fixed: true,
                type: 'warning',
                buttons: [
                    {
                        text: "cancel",
                        click: function(e) {
                            myNotification.close();
                        }
                    }, {
                        text: "okay",
                        class:"primary",
                        click: function(e) {
                            myNotification.close();
                        }
                    }
                ]
            };
            */
            //RED.notify('Your message here', notification_options);
            
            //console.log(notify);

            var order = msg.order;
            var component_type = ComponentType.Unordered;
            /*
            if(!node.unordered) {
                order += 1;
                component_type = ComponentType.Ordered;
            }
            */
            // else The order is not increased because it is connected to the previous node
            msg.order = order;

            var output_json = {
                //"expiration": node.expiration,
                //"unordered": node.unordered,
                //"tasks": node.task,
                "benefits": node.benefit
            };

            /*
            var checklist_name = "Element";
            if(node.chain) {
                checklist_name = node.checklist;
            }
            */

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
    RED.nodes.registerType("checklistbenefit",ChecklistBenefitNode);
}