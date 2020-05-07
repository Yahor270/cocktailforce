import { LightningElement, wire} from 'lwc';
import getIngridientsList from '@salesforce/apex/CocktailController.getIngridientsList';

export default class CocktailSearch extends LightningElement {
    value = [];
    error;
    @wire(getIngridientsList) ingridients;

    get options() {
        var returnOptions = [];
        if(this.ingridients.data){
            this.ingridients.data.forEach(el =>{
                returnOptions.push({label:el.Name , value:el.Name});
            }); 
        }
        return returnOptions;
    }

    handleChange(e) {
        this.value = e.detail.value;
        const selectedEvent = new CustomEvent('selected', { detail: this.value });
        this.dispatchEvent(selectedEvent);
    }

    clearList() {
        this.template.querySelector('lightning-dual-listbox').value = [];
        const selectedEvent = new CustomEvent('selected', { detail: []});
        this.dispatchEvent(selectedEvent);
    }
}