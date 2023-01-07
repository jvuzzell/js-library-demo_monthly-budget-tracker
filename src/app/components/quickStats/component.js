import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-component-eventbus-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'quickStats',
    };

    // Return registered module (object) to developer
    ComponentConfigs.quickStats = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {

        },
        hooks : {},  
        dispatch : {

            update : function( publisherKey, delta ) { 

                if( publisherKey.includes( 'budgetSheetContainer' ) ) { 
                    this.renderValue( delta );
                }

            }, 

            renderValue : function({ totalCredit = 0, totalDebit = 0, balance = 0 })  { 

                const ref = this.parent().get.ref(); 

                switch( ref ) { 
                    case 'total-income' : 
                        this.parent().get.inlineTemplateNode().querySelector('[data-amount]').innerHTML = parseFloat( totalCredit ).toFixed(2);
                        break; 
                    case 'total-expense' : 
                        this.parent().get.inlineTemplateNode().querySelector('[data-amount]').innerHTML = parseFloat( totalDebit ).toFixed(2);
                        break; 
                    case 'monthly-balance' : 
                        this.parent().get.inlineTemplateNode().querySelector('[data-amount]').innerHTML = parseFloat( balance ).toFixed(2);
                        break;
                }

            }

        }
        
    }

    Builder.registerComponent( ComponentConfigs.quickStats );

})(
    Builder,
    ComponentConfigs
);
