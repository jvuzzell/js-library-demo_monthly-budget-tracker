import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs, ComponentProps } from 'ui-component-eventbus-js/ComponentBuilder'; 
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

                    eventInit : ( componentKey, component ) => {
            
                        let inlineTemplateNode = component.get.inlineTemplateNode();
                        inlineTemplateNode.querySelector( '[data-trigger-add-summary]' ).addEventListener( 'click', (event) => {
                            component.dispatch.triggerAddSummaryLine();
                        });

                    }

                }

            }, 

            triggerSaveBudgetSheet : { 

                onSaveBudgetClick : {

                    eventInit : ( componentKey, component ) => {
            
                        let inlineTemplateNode = component.get.inlineTemplateNode(); 
                        inlineTemplateNode.querySelector( '[data-trigger-save-budget]' ).addEventListener( 'click', (event) => {
                            component.dispatch.triggerSaveBudgetSheet();
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
        dispatch : {
            
            triggerAddSummaryLine : () => { 
                let budgetSheetContainer = Builder.getComponentByName( 'budgetSheetContainer' ); 
                budgetSheetContainer.dispatch.addSummaryLine();
            },

            triggerSaveBudgetSheet : () => {
                let budgetSheetContainer = Builder.getComponentByName( 'budgetSheetContainer' ); 
                budgetSheetContainer.dispatch.saveBudgetSheet();
            }

        }
        
    }

    Builder.registerComponent( ComponentConfigs.budgetSheetFooter );

})(
    Builder,
    ComponentConfigs
);
