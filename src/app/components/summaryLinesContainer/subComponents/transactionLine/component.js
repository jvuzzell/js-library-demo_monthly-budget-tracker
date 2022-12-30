import "./component.css"; 
import { ComponentBuilder as Builder, ComponentConfigs } from 'ui-cable-js/ComponentBuilder'; 
(function(
    Builder,
    ComponentConfigs
){

    // State of individual modules
    var initialState = {
        componentName : 'transactionLine', 
        heading : 'Hello Obi'
    };

    // Return registered module (object) to developer
    ComponentConfigs.transactionLine = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {

        },
        hooks : {

     

        },  
        dispatch : {

        },
        template : `
            <form data-inline-template="transaction-line" data-transaction-type="income">
                <div class="summary-columns"> 
                    <div class="column"> 
                        <label for="transaction-codes">Transaction Code</label>
                    </div>
                    <div class="column">
                        <label for="transaction-summary">Transaction Summary</label>
                        <input type="text" name="transaction-summary" placeholder="Transaction Summary" data-transaction-summary/>
                    </div>
                    <div class="column"> 
                        <label for="transaction-codes">Transaction Due Date</label>
                        <select name="transaction-codes" data-transaction-due-date>
                            <option value="1">1</option>
                        </select>
                    </div>
                    <div class="column">
                        <label for="income">Income</label>
                        <input data-income type="text" name="income" placeholder="$0.00"/>
                    </div>
                    <div class="column">
                        <label for="expense">Expense</label>
                        <input data-expense type="text" name="expense"  data-expense  disabled/>
                    </div>
                    <div class="column">
                        <label for="balance">Balance</label>
                        <input data-balance type="text" name="balance" data-balance  disabled/>
                    </div>
                    <div class="column">
                        <label for="transaction-status">Status</label>
                        <select name="transaction-status" data-transaction-status>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="void">Void</option>
                        </select>
                    </div>
                    <div class="column actions-column has-text-center">
                        <button class="btn-no-background" data-delete-transaction-line><img class="icon" src="<%=require('../../../../src/app/assets/icons/close.svg')%>"/></button>
                    </div>
                </div> 
                <hr class="has-mg-top-20">
            </form>
        `
        
    }

    Builder.registerComponent( ComponentConfigs.transactionLine );

})(
    Builder,
    ComponentConfigs
);
