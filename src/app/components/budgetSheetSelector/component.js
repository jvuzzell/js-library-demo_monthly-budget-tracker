import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-component-eventbus-js/ComponentBuilder'; 
import { Expandables, initExpandables } from "expandables-js";

(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'budgetSheetSelector', 
        month : 1, 
        year : 2023
    };

    // Return registered module (object) to developer
    ComponentConfigs.budgetSheetSelector = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {

            eventListeners : {
                selectBudget : {

                    onChangeBudgetYear : {
    
                        eventInit : function( componentKey, component ) {
    
                            const inlineTemplateNode = component.get.inlineTemplateNode();
                            inlineTemplateNode.querySelector( '[data-report-year]' ).addEventListener( 'change', event => {
                                component.dispatch.updateYear(
                                    event.target.value
                                );
                            });
    
                        }
    
                    }, 
    
                    onChangeBudgetMonth : { 
    
                        eventInit : function( componentKey, component ) {
    
                            const inlineTemplateNode = component.get.inlineTemplateNode();
                            inlineTemplateNode.querySelector( '[data-report-month]' ).addEventListener( 'change', event => {
                                component.dispatch.updateMonth(
                                    event.target.value
                                );
                            });
    
                        }
    
                    }
    
                }
            }

        },
        hooks : {

            onMount : function() {  
                this.parent().dispatch.selectCurrentMonth();
            }, 

            onUpdate : function() { 
                Expandables.destroyExpandables();
            }

        },  
        dispatch : {

            selectCurrentMonth : function() {

                const dateObj = new Date();
                const month = dateObj.getUTCMonth() + 1; //months from 1-12
                const year = dateObj.getUTCFullYear();
                const triggerRender = false; 
                const triggerNotification = true; 

                this.parent().commit.state({
                        month : month, 
                        year : year
                    }, 
                    triggerRender, 
                    triggerNotification
                ); 

                this.updateSelectNode( year, month );
        
            }, 

            updateSelectNode : function( year, month ) { 

                const budgetSelectNode = this.parent().get.inlineTemplateNode();
                budgetSelectNode.querySelector( '[data-report-year]' ).value = year;
                budgetSelectNode.querySelector( '[data-report-month]' ).value = month;

            },  

            updateMonth : function( month ) { 

                this.parent().commit.state({ month : month });

            }, 

            updateYear : function( year ) {

                this.parent().commit.state({ year : year });

            }

        }
        
    }

    Builder.registerComponent( ComponentConfigs.budgetSheetSelector );

})(
    Builder,
    ComponentConfigs
);
