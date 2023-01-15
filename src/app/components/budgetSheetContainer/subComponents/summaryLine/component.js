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
        status : {
            'past-due' : { displayName : 'Past Due', weight : 3 }, 
            'pending' : { displayName : 'Pending', weight : 5 },  
            'void' : { displayName : 'Void', weight : 1 }, 
            'paid' : { displayName : 'Paid', weight : 8 }
        },
        defaultState : {
            componentName : 'summaryLine', 
            budgetSheetId : 0, 
            transactionCode : 'Default', 
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
            'Freelance Income' : {
                description : 'Website Design', 
                transactionTemplates : [
                    {
                        description : 'Client Payment 1', 
                        amount : 1200.50,  
                        dueDate : 15, 
                        lineType : 'credit'
                    }, 
                    { 
                    description : 'Client Payment 2', 
                        amount : 1200.50,  
                        dueDate : 30, 
                        lineType : 'credit'
                    }, 
                    { 
                        description : 'Stock Assets', 
                        amount : 500.00, 
                        dueDate : 15,
                        lineType : 'debit'
                    }
                ]
            }, 
            'Full-time Employment' : {
                description : 'Graphic Design at Cruise Company', 
                transactionTemplates : [
                    {
                        description : 'Paycheck 1, Gross Income', 
                        amount : 1300.00, 
                        dueDate : 1,
                        lineType : 'credit'
                    }, 
                    {
                        description : 'Paycheck 2, Gross Income', 
                        amount : 1300.00, 
                        dueDate : 15,
                        lineType : 'credit'
                    },
                    {
                        description : 'Organization Fees', 
                        amount : 19.99, 
                        dueDate : 30,
                        lineType : 'debit'
                    }, 
                ]
            },
            'Summer Vacation' : {
                description : 'Trip to Chicago', 
                transactionTemplates : [
                    {
                        description : 'Round trip flight', 
                        amount : 350.00, 
                        dueDate : 22,
                        lineType : 'debit'
                    }, 
                    {
                        description : 'Air BnB - 7 night stay', 
                        amount : 850.00, 
                        dueDate : 15,
                        lineType : 'debit'
                    }, 
                    {
                        description : 'Food Budget', 
                        amount : 500.00, 
                        dueDate : 20,
                        lineType : 'debit'
                    }, 
                    {
                        description : 'Annie Reimbursed me 50% of the Air BnB', 
                        amount : 425.00, 
                        dueDate : 18,
                        lineType : 'credit'
                    }
                ]
            }, 
            'Television/Streaming' : {
                description : 'Collection of all my streaming services', 
                transactionTemplates : [
                    {
                        description : 'Hulu', 
                        amount : 15.00, 
                        dueDate : 1,
                        lineType : 'debit'
                    }, 
                    {
                        description : 'Netflix', 
                        amount : 19.99, 
                        dueDate : 15,
                        lineType : 'debit'
                    }, 
                    {
                        description : 'Disney Plus', 
                        amount : 7.50, 
                        dueDate : 30,
                        lineType : 'debit'
                    }, 
                    {
                        description : 'HBO Max', 
                        amount : 15.00, 
                        dueDate : 30,
                        lineType : 'debit'
                    }
                ], 
            }, 

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

            onUpdate : function( deltaState ) {  
                
                let summaryState = this.parent().get.state(); 
                if( summaryState.firstRenderFlag ) { return; }
                for( const key of Object.keys( deltaState ) ) {
                    switch( key ) {
                        case ( 'status' ) : 
                            if( deltaState.status === 'past-due' ) { 
                                this.parent().dispatch.updateTransactionColor( 'past-due-background' )
                            } else {  
                                let colorClass = this.parent().dispatch.calcColorClassOnBalance( summaryState.balance ); 
                                this.parent().dispatch.updateTransactionColor( colorClass );
                            }
                            break; 
                        case ( 'balance' ) : 
                            if( summaryState.status === 'past-due' ) { 
                                this.parent().dispatch.updateTransactionColor( 'past-due-background' )
                            } else {  
                                let colorClass = this.parent().dispatch.calcColorClassOnBalance( summaryState.balance ); 
                                this.parent().dispatch.updateTransactionColor( colorClass );
                            }
                            break;
                    }
                }
                
                if( summaryState.firstRenderFlag ) { return; }
                this.parent().dispatch.renderSummary( summaryState ); 

            }

        },  
        dispatch : {

            update : function( notifierKey, deltaState ) {

                switch( true ) {
                    case notifierKey.includes( '_transactionLine_' ) : 
                        const publisher = Builder.getComponentByKey( notifierKey );
                        const summaryState = this.parent().get.state(); 
                        
                        if( publisher.get.state( 'summaryLineKey' ) === summaryState.key ) {

                            for( const key of Object.keys( deltaState ) ) {
    
                                switch( key ) { 
                                    case 'derivative' : 
                                        this.calcSummaryAmounts( deltaState, publisher.get.state( 'lineType' ) );  
                                        break;
                                    case 'status' : 
                                        this.calcSummaryStatus();
                                        break;                            
                                    case 'dueDate' : 
                                        this.calcSummaryDueDate( deltaState );
                                        break;

                                }
                            }
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

            calcSummaryAmounts : function({ derivative = 0.00, amount = 0.00 }, lineType ) {

                let summaryState = this.parent().get.state();
                let totalDebit = summaryState.totalDebit; 
                let totalCredit = summaryState.totalCredit; 
                let balance = summaryState.balance; 
                let derivativeCredit = 0.00; 
                let derivativeDebit = 0.00;

                switch( lineType ) { 
                    case 'debit' : 
                        let currentDebitTotal = totalDebit; 
                        totalDebit = this.calcTotalDebit( derivative ); 
                        derivativeDebit = totalDebit - currentDebitTotal;
                        break; 
                    case 'credit' : 
                        let currentCreditTotal = totalCredit; 
                        totalCredit = this.calcTotalCredit( derivative );
                        derivativeCredit = totalCredit - currentCreditTotal;
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

            calcSummaryStatus : function() {
                 
                let summaryState = this.parent().get.state(); 
                let statuses = this.parent().get.props( 'status' );
                let statusKeys = Object.keys( statuses );
                let transactionManifest = summaryState.transactionManifest; 
                let totalTransactions = transactionManifest.length; 
                let summaryStatusWeight = 0;
                let weightedStatus = [];
                let summaryStatus = 'pending';
                let status = null; 

                transactionManifest.map( transactionKey => { summaryStatusWeight += statuses[ Builder.getComponentByKey( transactionKey ).get.state( 'status' ) ][ 'weight' ]; } ); 
                statusKeys.map( key => weightedStatus[ key ] = ( statuses[ key ][ 'weight' ] * totalTransactions ) );

                const weightedStatusPaid = weightedStatus[ 'paid' ];
                const weightedStatusVoid = weightedStatus[ 'void' ];
                const weightedStatusPastDue = weightedStatus[ 'past-due' ];

                switch( true ) { 
                    case ( summaryStatusWeight <= weightedStatusVoid ) : 
                        summaryStatus = 'void';
                        break; 
                    case ( ( summaryStatusWeight > weightedStatusVoid ) && ( summaryStatusWeight <= weightedStatusPastDue ) ) : 
                        status = 'past-due';  
                        summaryStatus = ( this.statusExistsInTransactions( status, transactionManifest ) ) ? status : 'pending';
                        break;
                    case ( ( summaryStatusWeight > weightedStatusPastDue ) && ( summaryStatusWeight < weightedStatusPaid ) ) : 
                        status = 'past-due'; 
                        summaryStatus = ( this.statusExistsInTransactions( status, transactionManifest ) ) ? status : 'pending';
                        break;
                    case ( summaryStatusWeight === weightedStatusPaid ) : 
                        summaryStatus = 'paid';
                        break; 
                }

                this.parent().commit.state({
                    status : summaryStatus
                });

            },  

            statusExistsInTransactions : function( status, transactionManifest ) { 

                let statusExists = false; 
                for( let i = 0; i < transactionManifest.length; i++ ) {  
                    if( status === Builder.getComponentByKey( transactionManifest[ i ] ).get.state( 'status' ) )  { 
                        statusExists = true;
                        break;
                    }
                }

                return statusExists;

            },

            calcSummaryDueDate : function( transactionState ) { 
                 
                const transactionDueDate = transactionState.dueDate; 
                const summaryState = this.parent().get.state(); 
                let dueDate = 0; 

                let filteredDates = this.filterTransactionDates( transactionDueDate, summaryState.transactionManifest );

                if( filteredDates.length === 0 ) {
                    dueDate = transactionDueDate;
                } else { 
                    dueDate = this.getLatestDate( transactionDueDate, filteredDates ); 
                }

                this.parent().commit.state({
                    dueDate : dueDate
                });

            }, 

            filterTransactionDates : function( dueDate, transactionLineKeys ) { 

                let filteredTransactionDates = transactionLineKeys.map( transactionLineKey => {

                    let transactionState = Builder.getComponentByKey( transactionLineKey ).get.state(); 
                    let transactionDueDate = parseInt( transactionState.dueDate ); 

                    if( this.parent().get.state( 'key' ) !== transactionState.summaryLineKey ) return; 
                    if( transactionDueDate > dueDate ) { return transactionDueDate; }

                }).filter( element => { return element !== undefined });

                return filteredTransactionDates;

            }, 

            getLatestDate : function( dueDate, manifestIterable ) { 

                let deduped = manifestIterable.filter( ( value, index ) => { return ( value === manifestIterable[ index + 1 ] ) ? false : true; });  
                let filteredDates = deduped.filter( filteredDate => { 
                    if( filteredDate > dueDate ) return true;
                }); 
                
                if( filteredDates.length <= 1 ) {   
                    return ( filteredDates[0] === undefined ) ? dueDate : filteredDates[0];
                } else {
                    return this.getLatestDate( filteredDates[0], filteredDates );
                }

            },

            calcColorClassOnBalance( balance = 0.00 ) { 

                let colorClass = null; 

                switch( true ) { 
                    case ( balance === 0.00 ) :
                        colorClass = null;
                        break;
                    case ( balance > 0.00 ) : 
                        colorClass = 'credit-background'; 
                        break; 
                    case ( balance < 0.00 ): 
                        colorClass = 'debit-background';
                        break; 
                    default : 
                        colorClass = null;
                        break; 
                }

                return colorClass;

            },
            
            updateTransactionColor( colorClass ) { 
                
                const templateNode = this.parent().get.inlineTemplateNode();
                templateNode.classList.remove( 'credit-background', 'debit-background', 'past-due-background' );  

                if( colorClass !== null ) { 
                    templateNode.classList.add( colorClass ); 
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

            setTransactions : function( summaryLineKey = null, transactions = [{ lineType : 'credit' }], description = '', transactionCode = 'Default'  ) { 

                if( summaryLineKey === null ) {
                    summaryLineKey = this.createNewSummaryLine( description, transactionCode );
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
                let summaryState = this.parent().get.state();  
                summaryState.transactionManifest.map( transactionKey => {  
                    Builder.getComponentByKey( transactionKey ).dispatch.deleteLine();
                }); 

                this.parent().commit.state( { transactionManifest: [] }, false, false );

                let transactionSummaryTemplates = this.parent().get.props( 'transactionSummaryTemplates' ); 
                let transactionSummaryTemplate = transactionSummaryTemplates[ templateName ]; 
                this.setTransactions( summaryState.key, transactionSummaryTemplate.transactionTemplates );
                this.parent().commit.state({ transactionCode : templateName, description : transactionSummaryTemplate.description });
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

            createNewSummaryLine : function( description = '', transactionCode = 'Default' ) {
                
                let summaryLineNode = Builder.templateToHTML( ComponentConfigs.summaryLine.template ); 
                let containerNode = Builder.getComponentByName( 'budgetSheetContainer' ).get.inlineTemplateNode();  
                containerNode.querySelector( '[data-summary-line-container]' ).appendChild( summaryLineNode );
                initExpandables();
                
                ComponentConfigs.summaryLine.state.transactionManifest = []; // clean-up
                let newSummaryLines = Builder.registerComponent( ComponentConfigs.summaryLine ); 
                let newSummaryLine = newSummaryLines[ Object.keys( newSummaryLines )[0] ];
                let summaryLineKey = newSummaryLine.get.state( 'key' );
                newSummaryLine.commit.state({ description : description, transactionCode : transactionCode });
                return summaryLineKey; 
                
            }, 

            renderSummaryLine : function() {
    
                let summaryLineNode = this.parent().get.inlineTemplateNode();
                let containerNode = Builder.getComponentByName( 'budgetSheetContainer' ).get.inlineTemplateNode(); 
                containerNode.querySelector( '[data-summary-line-container]' ).appendChild( summaryLineNode );
                
            }, 

            renderSummary : function( summaryState ) {
                
                let summaryLineNode = this.parent().get.inlineTemplateNode(); 
                summaryLineNode.querySelector( 'input[data-income]' ).value = summaryState.totalCredit;
                summaryLineNode.querySelector( 'input[data-expense]' ).value = summaryState.totalDebit;
                summaryLineNode.querySelector( 'input[data-balance]' ).value = summaryState.balance; 
                summaryLineNode.querySelector( '[data-transaction-summary]' ).value = summaryState.description; 
                summaryLineNode.querySelector( '[data-transaction-codes]' ).value = summaryState.transactionCode; 
                summaryLineNode.querySelector( '[data-transaction-due-date]' ).value = summaryState.dueDate; 
                summaryLineNode.querySelector( '[data-transaction-status]' ).value = this.parent().get.props( 'status' )[ summaryState.status ][ 'displayName' ]; 

            },  

            loadTransactionTemplateSelect : function( summaryLineNode ) {
   
                let transactionSummaryTemplates = this.parent().get.props( 'transactionSummaryTemplates' ); 
                for( let templateKey in transactionSummaryTemplates ) { 
                    let option = document.createElement( 'option' );
                    option.text = templateKey;  
                    option.value = templateKey;
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
                                            <input type="text" name="status" placeholder="Pending" data-transaction-status disabled/>
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
                                    <button class="has-underline btn-no-background" data-add-credit><strong class="no-underline">+</strong> Add Credit</button><button class="has-underline btn-no-background" data-add-debit><strong class="no-underline has-large-font-size">-</strong> Add Debit</button>
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
