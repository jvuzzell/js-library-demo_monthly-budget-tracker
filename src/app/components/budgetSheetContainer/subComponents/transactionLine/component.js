import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs, ComponentProps } from 'ui-component-eventbus-js/ComponentBuilder'; 
import CloseIcon from '../../../../assets/icons/close.svg'; 

(function(
    Builder,
    ComponentConfigs
){

    // State of individual components

    ComponentProps.transactionLine = {
         
        defaultTransaction : {
            componentName : 'transactionLine', 
            summaryLineKey : null,
            summaryLineId : null,
            description : '', 
            lineType : 'credit', 
            amount : 0.00, 
            status : 'pending', 
            dueDate : 1, 
            void : false
        }, 
        eventListeners : {

            updateTransaction : { 

                onChangeAmount : { 

                    eventInit : function( componentKey, component ) {

                        const inlineTemplateNode = component.get.inlineTemplateNode();
                        const lineType = inlineTemplateNode.dataset.transactionType;
                        const selector = ( lineType === 'credit' ) ? '[data-income]' : '[data-expense]';

                        inlineTemplateNode.querySelector( selector ).addEventListener( 'change', event => {
                            const newAmount =  ( event.target.value === '' ) ? 0 : event.target.value;
                            const currAmount = component.get.state( 'amount' ); 

                            component.commit.state({
                                amount : newAmount, 
                                derivative : parseFloat( newAmount ) - parseFloat( currAmount )
                            })
                        });

                    }

                }, 

                onChangeStatus : { 

                    eventInit : function( componentKey, component ) {

                        const inlineTemplateNode = component.get.inlineTemplateNode();

                        inlineTemplateNode.querySelector( '[data-transaction-status]' ).addEventListener( 'change', event => {
                            component.commit.state({
                                status : event.target.value
                            })
                        });

                    }

                }, 


                onChangeDueDate : { 

                    eventInit : function( componentKey, component ) {

                        const inlineTemplateNode = component.get.inlineTemplateNode();

                        inlineTemplateNode.querySelector( '[data-transaction-due-date]' ).addEventListener( 'change', event => {  

                            component.commit.state({ 
                                dueDate : event.target.value
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

                                const newAmount =  ( input.value === '' ) ? 0 : input.value;
                                const currAmount = component.get.state( 'amount' );
            
                                component.commit.state({
                                    amount : newAmount, 
                                    derivative : parseFloat( newAmount ) - parseFloat( currAmount )
                                })
                            }
                        });

                    }

                }, 

                onDeleteLine : { 

                    eventInit : function( componentKey, component ) {

                        const inlineTemplateNode = component.get.inlineTemplateNode(); 
                        inlineTemplateNode.querySelector( '[data-delete-transaction-line]' ).addEventListener( 'click', event => {
                            event.preventDefault();
                            event.stopPropagation();
                            component.dispatch.deleteLine(); 
                        });

                    }

                }

            }

        }
    }
    
    // Return registered component (object) to developer
    ComponentConfigs.transactionLine = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : ComponentProps.transactionLine.defaultTransaction, 
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

            }, 

            onUpdate : function( deltaState ) { 

                for( const key of Object.keys( deltaState ) ) {
                    switch( key ) {
                        case 'dueDate' : 
                            this.parent().dispatch.checkPastDue( deltaState.dueDate );
                            break; 
                        case 'status' : 
                            this.parent().get.inlineTemplateNode().querySelector( '[data-transaction-status]' ).value = deltaState.status;
                            break;
                    }
                }

            }

        }, 

        dispatch : {  

            update : function( publisherKey, delta ) {
                
                if( publisherKey === this.parent().get.state( 'key' ) ) { 
                    console.error( 'notified self' );
                }   

            },

            checkPastDue : function( dueDate ) { 

                const todaysDate = Builder.getComponentByName( 'budgetSheetSelector' ).get.state( 'date' );
                const currentStatus = this.parent().get.state( 'status' ); 
                let status = ( currentStatus === 'pending' && ( dueDate <= todaysDate ) ) ? 'past-due' : currentStatus;

                this.parent().commit.state({ 
                    status : status
                })

            }, 

            newLine : function( summaryKey, transaction = {} ) {

                transaction = {
                    'summaryLineKey' : summaryKey,
                    ...transaction
                }; 

                this.parent().commit.state( transaction, false ); 

            },

            deleteLine : function() {

                const transactionState = this.parent().get.state();
                const amount = transactionState.amount;

                this.parent().commit.state({
                    amount : amount, 
                    derivative : amount * -1, 
                    void : true
                });
 
                this.parent().get.inlineTemplateNode().remove();

            },

            loadServerSideRenderAttributes : function() { 
    
                const templateNode = this.parent().get.inlineTemplateNode();  
                const transactionKey = this.parent().get.state( 'key' );
                const lineType = templateNode.getAttribute( 'data-transaction-type' ); 
                const dueDate = templateNode.querySelector( '[data-transaction-summary]' ).value; 
                const description = templateNode.querySelector( '[data-transaction-due-date]' ).value; 
                const status = templateNode.querySelector( '[data-transaction-status]' ).value;

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
                        description : description , 
                        status : status
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
                transactionLineNode.querySelector( '[data-transaction-status]' ).value = transactionState.status;

                const summaryLineComponent = Builder.getComponentByKey( summaryLineKey );
                summaryLineComponent.dispatch.manifestTransaction( transactionState.key );
                
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
            <form class="has-mg-bottom-0 has-pd-top-10" data-inline-template="transactionLine" data-transaction-type="credit">
                <div class="summary-columns has-mg-bottom-5"> 
                    <div class="column"><!-- placeholder --></div>
                    <div class="column">
                        <label for="transaction-summary">Transaction Summary</label>
                        <input type="text" name="transaction-summary" placeholder="Add description of individual credit/debit" data-transaction-summary required/>
                    </div>
                    <div class="column"> 
                        <label for="transaction-due-date">Transaction Due Date</label>
                        <select name="transaction-due-date" data-transaction-due-date>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                        </select>
                    </div>
                    <div class="column">
                        <label for="income">Income</label>
                        <input class="has-text-center" type="number" step=0.01 name="income" data-income placeholder="0.00" required disabled/>
                    </div>
                    <div class="column">
                        <label for="expense">Expense</label>
                        <input class="has-text-center" type="number" step=0.01 name="expense" data-expense placeholder="0.00" required disabled/>
                    </div>
                    <div class="column"><!-- placeholder --></div>
                    <div class="column">
                        <label for="transaction-status">Status</label>
                        <select name="transaction-status" data-transaction-status>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="void">Void</option>
                            <option value="past-due">Past Due</option>
                        </select>
                    </div>
                    <div class="column actions-column has-text-center">
                        <button class="btn-no-background" role="button" data-delete-transaction-line><img class="icon" src="${CloseIcon}"/></button>
                    </div>
                </div> 
                <hr class="has-mg-top-0 has-mg-bottom-0">
            </form>
        `
        
    }

    Builder.registerComponent( ComponentConfigs.transactionLine );

})(
    Builder,
    ComponentConfigs
);
