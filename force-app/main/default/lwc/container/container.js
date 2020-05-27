import { LightningElement } from 'lwc';

export default class Container extends LightningElement {
    openmodalwindow = false;

    processEvent(event) {
        this.template.querySelector('c-cocktail-list').findCocktails(event.detail);
    }
    
    openmodal() {
        this.openmodalwindow = true;
    }
    
    closeModal() {
        this.openmodalwindow = false;
    }  
}