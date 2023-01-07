import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-component-eventbus-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'budgetSheetSelector', 
        heading : 'Hello Obi'
    };

    // Return registered module (object) to developer
    ComponentConfigs.budgetSheetSelector = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {

        },
        hooks : {

     

        },  
        dispatch : {

        }
        
    }

    Builder.registerComponent( ComponentConfigs.budgetSheetSelector );

})(
    Builder,
    ComponentConfigs
);
