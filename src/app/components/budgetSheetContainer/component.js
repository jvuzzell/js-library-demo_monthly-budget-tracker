import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-component-eventbus-js/ComponentBuilder'; 
import { Expandables, initExpandables } from 'expandables-js';
import { BannerAlert } from 'banner-alert-js';

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

                switch( true ) {
                    case notifierKey.includes( '_summaryLine_' ) :  
                        this.calcStats( delta );
                        break; 
                    case notifierKey.includes( '_budgetSheetSelector_' ) : 
                        this.budgetQuery();
                        break; 
                }

            }, 
            
            displaySelectedBudget( budgetSummary ) {
                 
                for( let summaryKey in budgetSummary ) { 
                    let transactionLines = budgetSummary[ summaryKey ][ 'transactionLines' ]; 
                    let description = budgetSummary[ summaryKey ][ 'summaryDescription' ]; 
                    let transactionCode = budgetSummary[ summaryKey ][ 'transactionCode' ];  
          
                    this.addSummaryLine( 
                        null, 
                        transactionLines, 
                        description, 
                        transactionCode
                    );
                }

            }, 

            removeExistingSummaryLines() { 

                let summaryLineComponents = Builder.getComponentsByName( 'summaryLine' ); 

                for( let summaryKey in summaryLineComponents ) {
                    
                    let leaveContainerBlank = true;
                    summaryLineComponents[ summaryKey ].dispatch.deleteLine( leaveContainerBlank );

                }
                
            },

            budgetQuery : function() {

                const budgetId = this.getBudgetId();
                const result = localStorage.getItem( budgetId ); 
                let budgetState = {}; 

                if( result === '' || result === null ) {
                    this.removeExistingSummaryLines();
                    this.addSummaryLine(); 
                    return;
                }

                budgetState[ 'activeBudgetId' ] = budgetId; 
                budgetState[ 'budgets' ] = {};
                budgetState[ 'budgets' ][ budgetId ] = JSON.parse( result );

                const activeBudgetId = budgetState.activeBudgetId; 
                const budgetSummary = budgetState[ 'budgets' ][ activeBudgetId ]; 
   
                this.parent().commit.state( budgetState ); 

                this.removeExistingSummaryLines();
                this.displaySelectedBudget( budgetSummary );

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

            addSummaryLine : function( summaryLineKey = null, transactions = [{ lineType : 'credit' }], description = '', transactionCode = 'Default' ) { 
                Builder.getComponentByName( 'summaryLine' ).dispatch.setTransactions( summaryLineKey, transactions, description, transactionCode );
            }, 

            getBudgetId : function() {
                const budgetSheetSelector = Builder.getComponentByName( 'budgetSheetSelector' );
                const selectState = budgetSheetSelector.get.state(); 
                return selectState.year + "-" + selectState.month;
            },

            saveBudgetSheet : function() {
                const budgetId = this.getBudgetId();
                let budgetSheetSummary = this.compileBudgetSheetSummary();
                let budgetJson = JSON.stringify( budgetSheetSummary );

                localStorage.removeItem( budgetId ); 
                localStorage.setItem( budgetId, budgetJson ); 

                BannerAlert.transmit(
                    'success', 
                    'Budget sheet saved',
                    document.querySelector( '#banner-alerts' ), 
                    5000
                );
            },  

            compileBudgetSheetSummary : function() {
                let summaryLineComponents = Builder.getComponentsByName( 'summaryLine' ); 
                let budgetSheetSummary = {};

                for( let summaryKey in summaryLineComponents ) {
                    
                    let summary = summaryLineComponents[ summaryKey ].get.state(); 

                    if( summary.void ) continue;

                    budgetSheetSummary[ summaryKey ] = {
                        transactionCode : summary.transactionCode,
                        summaryDescription : summary.description,
                        transactionLines : []
                    };
                    
                    summary.transactionManifest.map( transactionKey => {
                        
                        let transactionComponent = Builder.getComponentByKey( transactionKey ); 
                        let transaction = transactionComponent.get.state();

                        if( transaction.void ) return;

                        budgetSheetSummary[ summaryKey ][ 'transactionLines' ].push({
                            description : transaction.description, 
                            amount : transaction.amount, 
                            dueDate : transaction.dueDate, 
                            lineType : transaction.lineType, 
                            status : transaction.status
                        }); 

                    });
                }

                return budgetSheetSummary; 
            }

        }
        
    }

    Builder.registerComponent( ComponentConfigs.budgetSheetContainer );

})(
    Builder,
    ComponentConfigs
);
