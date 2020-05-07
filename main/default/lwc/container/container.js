import { LightningElement } from 'lwc';

export default class Container extends LightningElement {
    processEvent(event) {
        this.template.querySelector('c-cocktail-list').findCocktails(event.detail);
    }
    
}