import "../../../../../../node_modules/expandables-js/expandables.css";
import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs, ComponentProps } from 'ui-component-eventbus-js/ComponentBuilder';  
import { initExpandables } from "expandables-js"; 
import CloseIcon from '../../../../assets/icons/close.svg'; 
import CaretRight from '../../../../assets/icons/caret-right.svg';

(function(
    Builder,
    ComponentConfigs
){

    ComponentProps.summaryLine = {
        defaultState : {
            componentName : 'summaryLine', 
            budgetSheetId : 0, 
            billingCode : 'Freelance Income', 
            description : '', 
            dueDate : 1, 
            totalCredit : 0.00, 
            totalDebit : 0.00, 
            balance : 0.00,
            status : 'pending', 
            transactionManifest : [], 
            void : false
        },

        transactionSummaryTemplates : {
            'Default' : {
                description : '', 
                transactionTemplates : [
                    {
                        description : '', 
                        amount : 0,  
                        dueDate : 1, 
                        lineType : 'debit'
                    }
                ]
            },
            'Freelance Service' : {
                description : 'Project Type A', 
                transactionTemplates : [
                    {
                        description : 'Client Payment Installment 1', 
                        amount : 120.50,  
                        dueDate : 15, 
                        lineType : 'credit'
                    }, 
                    { 
                    description : 'Client Payment Installment 2', 
                        amount : 120.50,  
                        dueDate : 1, 
                        lineType : 'credit'
                    }, 
                    { 
                        description : 'Client Payment Installment 3', 
                        amount : 120.50, 
                        dueDate : 20,
                        lineType : 'credit'
                    }, 
                    { 
                        description : 'Supplies', 
                        amount : 33.44, 
                        dueDate : 2,
                        lineType : 'debit'
                    }
                ]
            }, 
            'Gift' : {
                description : 'Birthday', 
                transactionTemplates : [
                    {
                        description : 'Venmo from Paul', 
                        amount : 99.57, 
                        dueDate : 20,
                        lineType : 'credit'
                    }, 
                    {
                        description : 'Venmo from Paul', 
                        amount : 99.57, 
                        dueDate : 20,
                        lineType : 'credit'
                    }
                ]
            }, 
            'NewDebt' : {
                description : 'Birthday', 
                transactionTemplates : [
                    {
                        description : 'Venmo from Paul', 
                        amount : 99.57, 
                        dueDate : 20,
                        lineType : 'debit'
                    }
                ]
            }
        },
        eventListeners : {

            addTransactionLine : { 

                addCredit : { 
                    
                    eventInit : function( componentKey, component ) {
                        let inlineTemplateNode = component.get.inlineTemplateNode();

                        inlineTemplateNode.querySelector( '[data-add-credit]' ).addEventListener( 'click', (event) => {  
                            component.dispatch.setTransactions( componentKey, [{ lineType : 'credit' }] ); 
                        });
                    }
    
                }, 
                addDebit : { 
                    
                    eventInit : function( componentKey, component ) {
                        let inlineTemplateNode = component.get.inlineTemplateNode();

                        inlineTemplateNode.querySelector( '[data-add-debit]' ).addEventListener( 'click', (event) => {  
                            component.dispatch.setTransactions( componentKey, [{ lineType : 'debit' }] );
                        });
                    }
    
                }, 
                preventSubmitOnKeyPress : { 

                    eventInit : function( componentKey, component ) { 
                        let inlineTemplateNode = component.get.inlineTemplateNode(); 
                        inlineTemplateNode.querySelector( 'form' ).addEventListener( 'keydown', event => {
                            if(event.keyCode == 13){
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        });
                    }

                }, 
    
            }, 

            deleteLine : {  

                onClickDelete : {

                    eventInit : function( componentKey, component ) {

                        const inlineTemplateNode = component.get.inlineTemplateNode();  
                        inlineTemplateNode.querySelector( '[data-delete-summary-line]' ).addEventListener( 'click', event => {
                            event.preventDefault();
                            event.stopPropagation();
                            component.dispatch.deleteLine(); 
                        });
    
                    }

                }

            }, 

            useTransactionTemplate : { 

                onSelectTemplate : { 

                    eventInit : function( componentKey, component ) { 

                        const inlineTemplateNode = component.get.inlineTemplateNode(); 
                        inlineTemplateNode.querySelector( '[data-transaction-codes]' ).addEventListener( 'change', event => {
                            
                            component.dispatch.useTransactionTemplate( event.target.value );

                        });

                    }

                }
                    
            }

        }
    } 
    // Return registered module (object) to developer
    ComponentConfigs.summaryLine = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : ComponentProps.summaryLine.defaultState, 
        props : ComponentProps.summaryLine,
        hooks : {

            onMount : function( state ) { 
       
                if ( !state.firstRenderFlag ) { return }; 
                const summaryLineNode = this.parent().get.inlineTemplateNode();
                this.parent().dispatch.loadTransactionTemplateSelect( summaryLineNode );           

            }, 

            onUpdate : function( state ) {  
                 
                if( state.firstRenderFlag ) { return; }
                this.parent().dispatch.renderTotals( state ); 
                this.parent().dispatch.updateTransactionColor( state.balance );

            }

        },  
        dispatch : {

            update : function( notifierKey, deltaState ) {

                switch( true ) {
                    case notifierKey.includes( '_transactionLine_' ) : 
                        if( !notifierKey.includes( 'transactionLine' )  ) { return; }
                        const publisher = Builder.getComponentByKey( notifierKey );
                        const summaryState = this.parent().get.state(); 
                        
                        if( publisher.get.state( 'summaryLineKey' ) === summaryState.key ) {
                            this.calcSummary( deltaState, publisher.get.state( 'lineType' ) ); 
                        }
                        break; 
                }

            }, 

            deleteLine : function( leaveContainerBlank = false ) {

                const summaryState = this.parent().get.state(); 
                summaryState.transactionManifest.map( transactionKey => {  
                    Builder.getComponentByKey( transactionKey ).dispatch.deleteLine();
                });

                this.parent().commit.state({ void : true }, false, false);
                this.parent().get.inlineTemplateNode().remove(); 

                if( 
                    document
                        .querySelector( '[data-summary-line-container]' )
                        .querySelectorAll( '[data-inline-template=summaryLine]' )
                        .length === 0 
                    && !leaveContainerBlank
                ) { 
                    let budgetSheetContainer = Builder.getComponentByName( 'budgetSheetContainer' ); 
                    budgetSheetContainer.dispatch.addSummaryLine();
                } 

            },

            calcSummary : function({ derivative = 0.00, amount = 0.00 }, lineType ) {

                let summaryState = this.parent().get.state();
                let totalDebit = summaryState.totalDebit; 
                let totalCredit = summaryState.totalCredit; 
                let balance = summaryState.balance; 
                let derivativeCredit = 0.00; // issue
                let derivativeDebit = 0.00; // issue

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
            
            updateTransactionColor( balance = 0.00 ) { 
                
                const templateNode = this.parent().get.inlineTemplateNode();
                if( balance == 0.00 ) {
                    templateNode.classList.remove( 'credit-background', 'debit-background' ); 
                    return; 
                }
            
                if( balance > 0.00 ) { 
                    templateNode.classList.add( 'credit-background' ); 
                    templateNode.classList.remove( 'debit-background' ); 
                } 
                else { 
                    templateNode.classList.add( 'debit-background' ); 
                    templateNode.classList.remove( 'credit-background' ); 
                }

            }, 

            calcTotalCredit( derivativeCredit = 0.00 ) {

                return parseFloat( this.parent().get.state( 'totalCredit' ) ) + parseFloat( derivativeCredit );

            },

            calcTotalDebit( derivativeDebit = 0.00 ) {

                return parseFloat( this.parent().get.state( 'totalDebit' ) ) + parseFloat( derivativeDebit );

            }, 

            calcBalance( totalCredit = 0.00, totalDebit = 0.00 ) {
                return parseFloat( totalCredit ) - parseFloat( totalDebit ); 
            },

            setTransactions : function( summaryLineKey = null, transactions = [{ lineType : 'credit' }]  ) { 

                if( summaryLineKey === null ) { 
                    summaryLineKey = this.createNewSummaryLine();
                }

                transactions.map( transaction => { 
                     
                    ComponentConfigs.transactionLine.state = {
                        ...ComponentProps.transactionLine.defaultTransaction,
                        ...transaction
                    };

                    let transactionLineNode = Builder.templateToHTML( ComponentConfigs.transactionLine.template );  
                    transactionLineNode.setAttribute( 'data-transaction-type', transaction.lineType );

                    let summaryLineNode = Builder.getComponentByKey( summaryLineKey ).get.inlineTemplateNode(); 
                    summaryLineNode.querySelector( '[data-transaction-line-container]' ).appendChild( transactionLineNode );

                    Builder.registerComponent( ComponentConfigs.transactionLine );  

                });

            },  

            useTransactionTemplate : function( templateName ) {
                const summaryState = this.parent().get.state(); 
                summaryState.transactionManifest.map( transactionKey => {  
                    Builder.getComponentByKey( transactionKey ).dispatch.deleteLine();
                }); 

                let transactionSummaryTemplates = this.parent().get.props( 'transactionSummaryTemplates' ); 
                let transactionSummaryTemplate = transactionSummaryTemplates[ templateName ]; 
                this.setTransactions( summaryState.key, transactionSummaryTemplate.transactionTemplates );
                 
                this.parent().get.inlineTemplateNode().querySelector( '[data-transaction-summary]' ).value = transactionSummaryTemplate.description;
            },

            manifestTransaction : function( transactionLineKey ) {

                let manifest = this.parent().get.state( 'transactionManifest' );  
                manifest.push( transactionLineKey );
                this.parent().commit.state({ transactionManifest : manifest });

            },

            unManifestTransaction : function( transactionLineKey ) {

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

            createNewSummaryLine : function() {
                 
                let summaryLineNode = Builder.templateToHTML( ComponentConfigs.summaryLine.template ); 
                let containerNode = Builder.getComponentByName( 'budgetSheetContainer' ).get.inlineTemplateNode();  
                containerNode.querySelector( '[data-summary-line-container]' ).appendChild( summaryLineNode );
                initExpandables();
                
                ComponentConfigs.summaryLine.state.transactionManifest = []; // clean-up
                let newSummaryLines = Builder.registerComponent( ComponentConfigs.summaryLine ); 
                let newSummaryLine = newSummaryLines[ Object.keys( newSummaryLines )[0] ];
                let summaryLineKey = newSummaryLine.get.state( 'key' );

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

            },  

            loadTransactionTemplateSelect : function( summaryLineNode ) {
   
                let transactionSummaryTemplates = this.parent().get.props( 'transactionSummaryTemplates' ); 
                for( let templateKey in transactionSummaryTemplates ) { 
                    let option = document.createElement( 'option' );
                    option.text = templateKey; 
                    summaryLineNode.querySelector( '[data-transaction-codes]' ).add( option );
                }

                return summaryLineNode;
                
            }

        },
        template : `
            <div data-inline-template="summaryLine" data-expandable-container="expanded">
                <div class="h-row">
                    <div class="v-col trigger-margin has-text-center has-mg-bottom-0">
                        <button class="btn-no-background" data-expandable-trigger="click">
                            <img class="icon" src="${CaretRight}" alt="Expand Summary Line"/>
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
                                            <input type="text" name="transaction-summary" placeholder="Add transaction summary" data-transaction-summary required/>
                                        </div>
                                        <div class="column"> 
                                            <label for="transaction-due-date">Transaction Due Date</label>
                                            <input type="text" name="transaction-due-date" placeholder="1st" data-transaction-due-date disabled/>
                                        </div>
                                        <div class="column">
                                            <label for="income">Income</label>
                                            <input type="number" step=0.01 name="income" data-income disabled/>
                                        </div>
                                        <div class="column">
                                            <label for="expense">Expense</label>
                                            <input type="number" step=0.01 name="expense" data-expense disabled/>
                                        </div>
                                        <div class="column">
                                            <label for="balance">Balance</label>
                                            <input type="number" step=0.01 name="balance" data-balance disabled/>
                                        </div>
                                        <div class="column">
                                            <label for="status">Status</label>
                                            <input type="text" name="status" placeholder="Pending" data-status disabled/>
                                        </div>
                                        <div class="column actions-column has-text-center">
                                            <button class="btn-no-background" data-delete-summary-line><img class="icon" src="${CloseIcon}"/></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="v-col trigger-margin has-text-center has-mg-bottom-0"><!-- Placeholder --></div>
                    <div class="v-col expandable-body has-mg-bottom-0 has-mg-top-10">
                        <div data-expandable-target>
                            <div class="h-row">
                                <div class="v-col has-mg-top-0 has-mg-bottom-10" data-transaction-line-container></div>
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
