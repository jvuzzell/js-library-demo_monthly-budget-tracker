import "./component.css"; 
import "./subComponents/summaryHeader/component.js";
import "./subComponents/summaryLine/component.js";
import "./subComponents/transactionLine/component.js";
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-cable-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'summaryLinesContainer', 
        heading : 'Hello Obi'
    };

    // Return registered module (object) to developer
    ComponentConfigs.summaryLinesContainer = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {

        },
        hooks : {

     

        },  
        dispatch : {

        }
        
    }

    Builder.registerComponent( ComponentConfigs.summaryLinesContainer );

})(
    Builder,
    ComponentConfigs
);
