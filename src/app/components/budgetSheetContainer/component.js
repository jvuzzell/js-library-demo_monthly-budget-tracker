import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-cable-js/ComponentBuilder'; 
import { Expandables } from 'expandables-js';
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'budgetSheetContainer', 
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
            eventListeners : {

                expandAndCollapseTransactions: { 

                    onClickCollapse : { 

                        eventInit : function( componentKey, component ) { 

                            const inlineTemplateNode = component.get.inlineTemplateNode();

                            inlineTemplateNode.querySelector( '#collapseExpandables' ).addEventListener( 'click', event => {
                                Expandables.collapseAll( '[data-inline-template=budgetSheetContainer]' );
                            });

                        }

                    }, 

                    onClickExpand : { 

                        eventInit : function( componentKey, component ) { 

                            const inlineTemplateNode = component.get.inlineTemplateNode();

                            inlineTemplateNode.querySelector( '#expandExpandables' ).addEventListener( 'click', event => {
                                Expandables.expandAll( '[data-inline-template=budgetSheetContainer]' );
                            });

                        }  

                    }

                }

            }
        },
        dispatch : {
              
            update : function( notifierKey, delta ) {

                if( notifierKey.includes( '_summaryLine_' ) ) { 
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

            addSummaryLine : function( summaryLineKey = null, transactions = [{ lineType : 'credit' }]  ) { 
                Builder.getComponentByName( 'summaryLine' ).dispatch.setTransactions( summaryLineKey, transactions );
            }

        }
        
    }

    Builder.registerComponent( ComponentConfigs.budgetSheetContainer );

})(
    Builder,
    ComponentConfigs
);
