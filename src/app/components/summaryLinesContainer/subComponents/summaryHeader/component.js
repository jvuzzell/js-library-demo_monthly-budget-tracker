import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-cable-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'summaryLineHeader', 
        heading : 'Hello Obi'
    };

    // Return registered module (object) to developer
    ComponentConfigs.summaryLineHeader = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {

        },
        hooks : {

     

        },  
        dispatch : {

        }
        
    }

    Builder.registerComponent( ComponentConfigs.summaryLineHeader );

})(
    Builder,
    ComponentConfigs
);
