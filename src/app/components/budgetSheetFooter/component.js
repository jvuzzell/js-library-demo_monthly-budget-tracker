import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs, ComponentProps } from 'ui-cable-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    let initialState = {
        componentName : 'budgetSheetFooter'
    }; 
 
    ComponentProps.budgetSheetFooter = {

        eventListeners : {

            triggerAddSummaryLine : { 

                onButtonClick : {

                    eventInit : function( componentKey, component ) {
            
                        let inlineTemplateNode = component.get.inlineTemplateNode();
                        inlineTemplateNode.querySelector( '[data-trigger-add-summary]' ).addEventListener( 'click', (event) => {
                            component.dispatch.triggerAddSummaryLine();
                        });

                    }

                }

            }

        }

    }


    // Return registered module (object) to developer
    ComponentConfigs.budgetSheetFooter = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : ComponentProps.budgetSheetFooter,
        hooks : {

        },  
        dispatch : {
            
            triggerAddSummaryLine : () => { 

                let budgetSheetContainer = Builder.getComponentByName( 'budgetSheetContainer' ); 
                budgetSheetContainer.dispatch.addSummaryLine();

            }

        }
        
    }

    Builder.registerComponent( ComponentConfigs.budgetSheetFooter );

})(
    Builder,
    ComponentConfigs
);
