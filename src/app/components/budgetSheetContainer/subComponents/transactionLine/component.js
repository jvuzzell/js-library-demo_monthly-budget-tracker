import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs, ComponentProps } from 'ui-cable-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual components
    var initialState = {
        componentName : 'transactionLine', 
        summaryLineKey : null,
        summaryLineId : null,
        description : '', 
        lineType : 'credit', 
        amount : 0.00, 
        status : 'pending', 
        dueDate : 1, 
        void : false
    }; 

    ComponentProps.transactionLine = {
        
        eventListeners : {

            updateAmounts : { 

                onChangeAmount : { 

                    eventInit : function( componentKey, component ) {

                        const inlineTemplateNode = component.get.inlineTemplateNode();
                        const lineType = inlineTemplateNode.dataset.transactionType;
                        const selector = ( lineType === 'credit' ) ? '[data-income]' : '[data-expense]';

                        inlineTemplateNode.querySelector( selector ).addEventListener( 'change', event => {
                            const newAmount =  event.target.value;
                            const currAmount = component.get.state( 'amount' );
                            component.commit.state({
                                amount : newAmount, 
                                derivative : parseFloat( newAmount ) - parseFloat( currAmount )
                            })
                        });

                    }

                }, 

                onKeyPressEnter : { 

                    eventInit : function( componentKey, component ) { 

                        const inlineTemplateNode = component.get.inlineTemplateNode(); 
                        const lineType = inlineTemplateNode.dataset.transactionType;
                        const selector = ( lineType === 'credit' ) ? '[data-income]' : '[data-expense]';
                        const input = inlineTemplateNode.querySelector( selector );

                        inlineTemplateNode.addEventListener( 'keydown', event => {
                            if(event.keyCode == 13){
                                event.preventDefault();
                                event.stopPropagation();

                                const newAmount =  input.value;
                                const currAmount = component.get.state( 'amount' );
                                component.commit.state({
                                    amount : newAmount, 
                                    derivative : parseFloat( newAmount ) - parseFloat( currAmount )
                                })

                            }
                        });

                    }

                }, 

            }

        }
    }
    
    // Return registered component (object) to developer
    ComponentConfigs.transactionLine = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : ComponentProps.transactionLine,
        hooks : {

            afterCreate : function( state ) {

                if( this.parent().get.ref() === 'ssr' ) { 
                    this.parent().dispatch.loadServerSideRenderAttributes();
                }

            }, 

            onMount : function( state ) {

                if( state.firstRenderFlag && this.parent().get.ref() !== 'ssr' ) {
                    this.parent().dispatch.mountTransactionLine();    
                }

            }
        }, 

        dispatch : {  

            newLine : function( summaryKey, transaction = {} ) {

                transaction = {
                    'summaryLineKey' : summaryKey,
                    ...transaction
                }; 

                this.parent().commit.state( transaction, false ); 

            },

            loadServerSideRenderAttributes : function() { 

                const templateNode = this.parent().get.inlineTemplateNode();  
                const transactionKey = this.parent().get.state( 'key' );
                const lineType = templateNode.getAttribute( 'data-transaction-type' ); 
                const dueDate = templateNode.querySelector( '[data-transaction-summary]' ).value; 
                const description = templateNode.querySelector( '[data-transaction-due-date]' ).value;
                const triggerRender = false; 
                const triggerNotification = true; 

                let amount = 0; 
                let selector = null; 
                
                switch( lineType ) {
                    case 'credit' : 
                        selector = '[data-income]';
                        break; 
                    case 'debit' : 
                        selector = '[data-expense]';
                        break; 
                }
                 
                amount = templateNode.querySelector( selector ).value;  
 
                const summaryLineKey = templateNode.closest( '[data-inline-template="summaryLine"]' ).dataset.key;
                const summaryLineComponent = Builder.getComponentByKey( summaryLineKey );
 
                summaryLineComponent.dispatch.manifestTransaction( transactionKey ); 
            
                this.parent().commit.state({  
                        summaryLineKey : summaryLineKey,
                        amount : parseFloat( amount ).toFixed( 2 ),   
                        derivative : parseFloat( amount ),
                        lineType : lineType, 
                        dueDate : dueDate, 
                        description : description  
                    },  
                    triggerRender, 
                    triggerNotification
                );

            },

            mountTransactionLine : function() {

                const transactionLineNode = this.parent().get.inlineTemplateNode();
                const transactionState = this.parent().get.state(); 
                let activeInput = null; 

                const summaryLineKey = transactionLineNode.closest( '[data-inline-template="summaryLine"]' ).dataset.key;
                const lineType = transactionLineNode.dataset.transactionType;

                transactionLineNode.querySelector( '[data-transaction-summary]' ).value = transactionState.description;
                transactionLineNode.querySelector( '[data-transaction-due-date]' ).value = transactionState.dueDate;

                // @todo Update selects for dueDate and status
                
                const newAmount = parseFloat( transactionState.amount ).toFixed(2); 
                if( lineType === 'debit' ) { 
                    activeInput = transactionLineNode.querySelector( '[data-expense]' ); 
                    activeInput.removeAttribute( 'disabled' );
                    activeInput.value = newAmount;
                } 
     
                if( lineType === 'credit' ) {
                    activeInput = transactionLineNode.querySelector( '[data-income]' ); 
                    activeInput.removeAttribute( 'disabled' );
                    activeInput.value = newAmount;
                } 

                this.parent().commit.state({
                    amount : newAmount, 
                    derivative : ( parseFloat( newAmount ) - 0 ).toFixed( 2 )
                });

                this.newLine( summaryLineKey, { lineType : lineType } );

            }

        },
        template : `
            <form class="has-mg-bottom-10" data-inline-template="transactionLine" data-transaction-type="credit">
                <div class="summary-columns"> 
                    <div class="column"><!-- placeholder --></div>
                    <div class="column">
                        <label for="transaction-summary">Transaction Summary</label>
                        <input type="text" name="transaction-summary" placeholder="Add description of individual credit/debit" data-transaction-summary/>
                    </div>
                    <div class="column"> 
                        <label for="transaction-codes">Transaction Due Date</label>
                        <select name="transaction-codes" data-transaction-due-date>
                            <option value="1">1</option>
                        </select>
                    </div>
                    <div class="column">
                        <label for="income">Income</label>
                        <input class="has-text-center" type="text" name="income" data-income placeholder="0.00" disabled/>
                    </div>
                    <div class="column">
                        <label for="expense">Expense</label>
                        <input class="has-text-center" type="text" name="expense" data-expense placeholder="0.00" disabled/>
                    </div>
                    <div class="column"><!-- placeholder --></div>
                    <div class="column">
                        <label for="transaction-status">Status</label>
                        <select name="transaction-status" data-transaction-status>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="void">Void</option>
                            <option value="past-due">Past Due</option>
                            <option value="adjusted">Adjusted</option>
                        </select>
                    </div>
                    <div class="column actions-column has-text-center">
                        <button class="btn-no-background" data-delete-transaction-line><img class="icon" src="images/close.svg"/></button>
                    </div>
                </div> 
                <hr class="has-mg-top-10 has-mg-bottom-10">
            </form>
        `
        
    }

    Builder.registerComponent( ComponentConfigs.transactionLine );

})(
    Builder,
    ComponentConfigs
);
