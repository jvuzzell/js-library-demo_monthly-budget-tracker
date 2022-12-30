import "./component.css"; 
import "./sub-components/summary-header/component.js";
import "./sub-components/summary-line/component.js";
import "./sub-components/transaction-line/component.js";
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-cable-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'exampleComponent', 
        heading : 'Hello Obi'
    };

    // Return registered module (object) to developer
    ComponentConfigs.exampleComponent = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {

        },
        hooks : {

     

        },  
        dispatch : {

        },
        template : `
            <div>
                <h1 data-heading></h1>
                <form>
                    <input data-update-heading type="text"/>
                </form>
            </div>
        `
        
    }

    Builder.registerComponent( ComponentConfigs.exampleComponent );

})(
    Builder,
    ComponentConfigs
);
