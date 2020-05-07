import { LightningElement, wire} from 'lwc';
import getIngridientsList from '@salesforce/apex/CocktailController.getIngridientsList';

export default class CocktailSearch extends LightningElement {
    value = [];
    error;
    isSelected = false;
    @wire(getIngridientsList) ingridients;

    handleClick() {
        this.isSelected = !this.isSelected;
        const selectedEvent = new CustomEvent('selected', { detail: {value: this.value, strict: this.isSelected}});
        this.dispatchEvent(selectedEvent);
    }

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
        const selectedEvent = new CustomEvent('selected',  { detail: {value: this.value, strict: this.isSelected}});
        this.dispatchEvent(selectedEvent);
    }

    clearList() {
        this.template.querySelector('lightning-dual-listbox').value = [];
        this.value = [];
        const selectedEvent = new CustomEvent('selected', { detail: {value: [], strict: this.isSelected}});
        this.dispatchEvent(selectedEvent);
    }
}