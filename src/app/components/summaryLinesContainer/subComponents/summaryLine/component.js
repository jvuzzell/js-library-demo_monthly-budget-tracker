import "../../../../../../node_modules/expandables-js/expandables.css";
import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-cable-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'summaryLine', 
    };

    // Return registered module (object) to developer
    ComponentConfigs.summaryLine = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {

        },
        hooks : {

     

        },  
        dispatch : {

        },
        template : `
            <div data-inline-template="summary-line" data-expandable-container="expanded">
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
