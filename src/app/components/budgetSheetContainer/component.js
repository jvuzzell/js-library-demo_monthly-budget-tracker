import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-cable-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'budgetSheetContainer', 
        manifest: {}, 
        budgetSheetId: 0, 
        month: 1,  
        year: 1, 
        totalCredit: 0, 
        totalDebit: 0, 
        balance: 0, 
        finalized: false
    };

    // Return registered module (object) to developer
    ComponentConfigs.budgetSheetContainer = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {

        },
        hooks : {},  
        dispatch : {
              
            update : function( notifierKey, delta ) {

                if( notifierKey.includes( '_summaryLine_' ) ) { 
                    console.error( delta );
                    this.calcStats( delta );
                }

            }, 
            
            calcStats : function({ 
                derivativeDebit : derivativeSummaryLineDebit = 0 , 
                derivativeCredit : derivativeSummaryLineCredit = 0,
                derivativeBalance : derivativeSummaryLineBalance = 0
            }) {
 
                const budgetState = this.parent().get.state();
                const totalCredit = budgetState.totalCredit; 
                const totalDebit = budgetState.totalDebit; 
                const balance = budgetState.balance; 
     
                this.parent().commit.state({
                    totalCredit : ( parseFloat( derivativeSummaryLineCredit ) + parseFloat( totalCredit ) ), 
                    totalDebit : ( parseFloat( derivativeSummaryLineDebit ) + parseFloat( totalDebit ) ), 
                    balance : ( parseFloat( derivativeSummaryLineBalance ) + parseFloat( balance ) )
                }); 

            }, 

            addSummaryLine : function() {
                Builder.getComponentByName( 'summaryLine' ).dispatch.setTransactions();
            }

        }
        
    }

    Builder.registerComponent( ComponentConfigs.budgetSheetContainer );

})(
    Builder,
    ComponentConfigs
);
