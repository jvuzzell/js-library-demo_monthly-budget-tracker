import "./component.css"; 
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

            renderValue : function({ totalCredit = 0.00, totalDebit = 0.00, balance = 0.00 })  { 

                const ref = this.parent().get.ref(); 

                switch( ref ) { 
                    case 'total-income' : 
                        this.parent().get.inlineTemplateNode().querySelector('[data-amount]').innerHTML = parseFloat( totalCredit ).toFixed(2);
                        break; 
                    case 'total-expense' : 
                        totalDebit = ( parseFloat( totalDebit ).toFixed(2) == -0.00 ) ? 0.00 : totalDebit;
                        this.parent().get.inlineTemplateNode().querySelector('[data-amount]').innerHTML = parseFloat( totalDebit ).toFixed(2);
                        break; 
                    case 'monthly-balance' : 
                        balance = ( parseFloat( balance ).toFixed(2) == -0.00 ) ? 0.00 : balance;
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
