import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-cable-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'quickStats', 
        heading : 'Hello Obi'
    };

    // Return registered module (object) to developer
    ComponentConfigs.quickStats = {

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

    Builder.registerComponent( ComponentConfigs.quickStats );

})(
    Builder,
    ComponentConfigs
);
