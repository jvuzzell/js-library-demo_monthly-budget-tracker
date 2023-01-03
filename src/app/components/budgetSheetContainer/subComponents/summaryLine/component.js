import "../../../../../../node_modules/expandables-js/expandables.css";
import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs, ComponentProps } from 'ui-cable-js/ComponentBuilder';  
import { initExpandables } from "expandables-js";

(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'summaryLine', 
        budgetSheetId : 0, 
        billingCode : 'Freelance Income', 
        description : '', 
        dueDate : 1, 
        totalCredit : 0.00, 
        totalDebit : 0.00, 
        balance : 0.00,
        status : 'pending', 
        transactionManifest : []
    }; 

    ComponentProps.summaryLine = {
        billingCode : {
            'Freelance Service' : {
                description : 'Project Type A', 
                transactionTemplates : [
                    {
                        name : 'Payment Installment 1', 
                        defaultAmount : 120.50, 
                        lineType : 'credit'
                    }, 
                    { 
                        name : 'Payment Installment 2', 
                        defaultAmount : 120.50, 
                        lineType : 'credit'
                    }, 
                    { 
                        name : 'Payment Installment 3', 
                        defaultAmount : 120.50, 
                        lineType : 'credit'
                    }, 
                    { 
                        name : 'Supplies', 
                        defaultAmount : 33.44, 
                        lineType : 'debit'
                    }
                ]
            }, 
            'Gift' : {
                description : 'Birthday', 
                transactionTemplates : [
                    {
                        name : 'Venmo from Paul', 
                        defaultAmount : 99.57, 
                        lineType : 'credit'
                    }
                ]
            }
        }, 
        statuses : {
            'Pending ': 'Payments processing', 
            'Paid' : 'Payment completed', 
            'Past due' : 'Payment due date passed', 
            'Void' : 'Payment canceled/refunded', 
            'Adjusted' : 'Budget sheet reopened after finalization'
        }, 
        eventListeners : {

            addTransactionLine : { 

                addCredit : { 
                    
                    eventInit : function( componentKey, component ) {
    
                        let inlineTemplateNode = component.get.inlineTemplateNode();
                        let mount = false;

                        inlineTemplateNode.querySelector( '[data-add-credit]' ).addEventListener( 'click', (event) => {  
                            component.dispatch.setTransactions( componentKey, mount, [{ lineType : 'credit' }] ); 
                        });
    
                    }
    
                }, 
                addDebit : { 
                    
                    eventInit : function( componentKey, component ) {
    
                        let inlineTemplateNode = component.get.inlineTemplateNode();
                        let mount = false;

                        inlineTemplateNode.querySelector( '[data-add-debit]' ).addEventListener( 'click', (event) => {  
                            component.dispatch.setTransactions( componentKey, mount, [{ lineType : 'debit' }] );
                        });
    
                    }
    
                }, 
                preventSubmitOnKeyPress : { 

                    eventInit : function( componentKey, component ) { 

                        let inlineTemplateNode = component.get.inlineTemplateNode(); 
                        inlineTemplateNode.querySelector( 'form' ).addEventListener( 'keydown', event => {
                            if(event.keyCode == 13){
                                alert( 'world' );
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        });

                    }

                }
    
            }

        }
    } 
    // Return registered module (object) to developer
    ComponentConfigs.summaryLine = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : ComponentProps.summaryLine,
        hooks : {

            onUpdate : function( state ) {  
                 
                if( state.firstRenderFlag ) { return; }
                this.parent().dispatch.renderTotals( state );

            }

        },  
        dispatch : {

            update : function( notifierKey, deltaState ) {

                if( !notifierKey.includes( 'transactionLine' )  ) { return; }
                const publisher = Builder.getComponentByKey( notifierKey );
                const summaryState = this.parent().get.state(); 
                
                if( publisher.get.state( 'summaryLineKey' ) === summaryState.key ) {
                    this.calcSummary( deltaState, publisher.get.state( 'lineType' ) ); 
                }

            },

            calcSummary : function({ derivative = 0, amount = 0 }, lineType ) {

                let summaryState = this.parent().get.state();
                let totalDebit = summaryState.totalDebit; 
                let totalCredit = summaryState.totalCredit; 
                let balance = summaryState.balance; 
                let derivativeCredit = 0; // issue
                let derivativeDebit = 0; // issue

                switch( lineType ) { 
                    case 'debit' : 
                        let currentDebitTotal = totalDebit; 
                        totalDebit = this.calcTotalDebit( derivative ); // Calc new debit
                        derivativeDebit = totalDebit - currentDebitTotal; // Calc difference between [new debit total] and [current debit total]
                        break; 
                    case 'credit' : 
                        let currentCreditTotal = totalCredit; 
                        totalCredit = this.calcTotalCredit( derivative ); // Calc new credit
                        derivativeCredit = totalCredit - currentCreditTotal; // Calc difference between [new credit total] and [current credit total]

                        break; 
                }
                
                let newBalance = this.calcBalance( totalCredit, totalDebit );

                this.parent().commit.state({
                    totalCredit : parseFloat( totalCredit ).toFixed( 2 ), 
                    totalDebit : parseFloat( totalDebit ).toFixed( 2 ), 
                    balance : parseFloat( newBalance ).toFixed( 2 ), 
                    derivativeCredit : derivativeCredit,
                    derivativeDebit : derivativeDebit,
                    derivativeBalance : newBalance - balance,
                    derivativeLineType : lineType
                }); 
           
                // @todo calcDueDate and calcStatus

            },
            
            calcTotalCredit( derivativeCredit = 0 ) {

                return parseFloat( this.parent().get.state( 'totalCredit' ) ) + parseFloat( derivativeCredit );

            },

            calcTotalDebit( derivativeDebit = 0 ) {

                return parseFloat( this.parent().get.state( 'totalDebit' ) ) + parseFloat( derivativeDebit );

            }, 

            calcBalance( totalCredit = 0, totalDebit = 0 ) {
                return parseFloat( totalCredit ) - parseFloat( totalDebit ); 
            },

            setTransactions : function( summaryLineKey = null, mount = false, transactions = [{ lineType : 'credit' }]  ) { 
                
                if( summaryLineKey === null ) {
                    summaryLineKey = this.createNewSummaryLine( mount );
                }

                transactions.map( transaction => { 

                    let htmlTemplate = Builder.templateToHTML( ComponentConfigs.transactionLine.template );  
                    htmlTemplate.setAttribute( 'data-transaction-type', transaction.lineType );
                    let summaryLineNode = Builder.getComponentByKey( summaryLineKey ).get.inlineTemplateNode(); 
                    summaryLineNode.querySelector( '[data-transaction-line-container]' ).appendChild( htmlTemplate );

                    Builder.registerComponent( ComponentConfigs.transactionLine );  
                    
                });

            },  

            manifestTransaction : function( transactionLineKey ) {
                
                let manifest = this.parent().get.state( 'transactionManifest' );  
                manifest.push( transactionLineKey );
                this.parent().commit.state({ transactionManifest : manifest });

            },

            unmanifestTransaction : function( transactionLineKey ) {

                let manifest = this.parent().get.state( 'transactionManifest' );
                let updatedManifest = [];

                updatedManifest.push(...manifest.filter(key => {
                    return (key !== transactionLineKey);
                }));

                this.parent().commit.state({ transactionManifest : updatedManifest });

            },  

            appendTransaction : function( transactionNode ) {

                let summaryLineNode = this.parent().get.inlineTemplateNode(); 
                summaryLineNode.querySelector( '[data-transaction-line-container]' ).appendChild( transactionNode );

            },

            createNewSummaryLine : function( mount = false ) {
                 
                let htmlTemplate = Builder.templateToHTML( ComponentConfigs.summaryLine.template ); 
                let containerNode = Builder.getComponentByName( 'budgetSheetContainer' ).get.inlineTemplateNode(); 
                containerNode.querySelector( '[data-summary-line-container]' ).appendChild( htmlTemplate );

                let newSummaryLines = Builder.registerComponent( ComponentConfigs.summaryLine ); 
                let newSummaryLine = newSummaryLines[ Object.keys( newSummaryLines )[0] ];
                let summaryLineKey = newSummaryLine.get.state( 'key' );
 
                initExpandables();
                return summaryLineKey; 
                
            }, 

            renderSummaryLine : function() {
    
                let summaryLineNode = this.parent().get.inlineTemplateNode();
                let containerNode = Builder.getComponentByName( 'budgetSheetContainer' ).get.inlineTemplateNode(); 
                containerNode.querySelector( '[data-summary-line-container]' ).appendChild( summaryLineNode );
                
            }, 

            renderTotals : function( summaryState ) {
                
                let summaryLineNode = this.parent().get.inlineTemplateNode(); 
                summaryLineNode.querySelector( 'input[data-income]' ).value = summaryState.totalCredit;
                summaryLineNode.querySelector( 'input[data-expense]' ).value = summaryState.totalDebit;
                summaryLineNode.querySelector( 'input[data-balance]' ).value = summaryState.balance;

            }

        },
        template : `
            <div data-inline-template="summaryLine" data-expandable-container="expanded">
                <div class="h-row">
                    <div class="v-col trigger-margin has-text-center has-mg-bottom-0">
                        <button class="btn-no-background" data-expandable-trigger="click">
                            <img class="icon" src="/images/caret-right.svg" alt="Expand Summary Line"/>
                        </button>
                    </div>
                    <div class="v-col expandable-body has-mg-bottom-0"> 
                        <div class="h-row">
                            <div class="v-col has-mg-bottom-0"> 
                                <form>
                                    <div class="summary-columns"> 
                                        <div class="column"> 
                                            <label for="transaction-codes">Transaction Code</label>
                                            <select name="transaction-codes" data-transaction-codes></select>
                                        </div>
                                        <div class="column">
                                            <label for="transaction-summary">Transaction Summary</label>
                                            <input type="text" name="transaction-summary" placeholder="Add description of transaction" data-transaction-summary/>
                                        </div>
                                        <div class="column"> 
                                            <label for="transaction-date">Transaction Due Date</label>
                                            <input type="text" name="transaction-date" placeholder="15th" data-transaction-date disabled/>
                                        </div>
                                        <div class="column">
                                            <label for="income">Income</label>
                                            <input type="text" name="income" placeholder="$0.00" data-income disabled/>
                                        </div>
                                        <div class="column">
                                            <label for="expense">Expense</label>
                                            <input type="text" name="expense" placeholder="$0.00" data-expense disabled/>
                                        </div>
                                        <div class="column">
                                            <label for="balance">Balance</label>
                                            <input type="text" name="balance" placeholder="$0.00" data-balance disabled/>
                                        </div>
                                        <div class="column">
                                            <label for="status">Status</label>
                                            <input type="text" name="status" placeholder="Pending" data-status disabled/>
                                        </div>
                                        <div class="column actions-column has-text-center">
                                            <button class="btn-no-background" data-delete-summary-line><img class="icon" src="/images/close.svg"/></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="v-col trigger-margin has-text-center has-mg-bottom-0"><!-- Placeholder --></div>
                    <div class="v-col expandable-body has-mg-bottom-0 has-mg-top-20">
                        <div data-expandable-target>
                            <div class="h-row">
                                <div class="v-col has-mg-top-0 has-mg-bottom-20" data-transaction-line-container></div>
                            </div>  
                            <div class="h-row has-text-center" data-transaction-controls>
                                <div class="v-col has-mg-top-0">
                                    <button class="has-underline" data-add-credit><strong class="no-underline">+</strong> Add Credit</button><button class="has-underline" data-add-debit><strong class="no-underline has-large-font-size">-</strong> Add Debit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
            </div>
        `
        
    }

    Builder.registerComponent( ComponentConfigs.summaryLine );

})(
    Builder,
    ComponentConfigs
);
