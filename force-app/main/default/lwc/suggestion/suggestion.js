import { LightningElement } from 'lwc';

export default class Suggestion extends LightningElement {
    
    handleSuccess(event) {
        alert("New suggestion created! : " + event.detail.id);
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}