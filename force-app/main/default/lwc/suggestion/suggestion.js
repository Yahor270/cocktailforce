import { LightningElement, wire } from 'lwc';
import getHangerId from '@salesforce/apex/CocktailController.getHangerId';
import reassignFile from '@salesforce/apex/CocktailController.reassignFile';

export default class Suggestion extends LightningElement {

    pictureId = '';
    @wire(getHangerId) hangerRecordId;

    get recordId() {
        if(this.hangerRecordId){
            console.log('recordId '+ JSON.stringify(this.hangerRecordId.data));
            return this.hangerRecordId.data;
        } else {
            return null;
        }
    }

    get acceptedFormats() {
        return ['.jpg', '.png'];
    }

    handleUploadFinished(event) {
        const uploadedFile = event.detail.files;
        alert("No. of files uploaded : " + uploadedFile.length);
        //let pictureId = uploadedFile[0].documentId;
        //console.log("Pic uploaded : " + JSON.stringify(uploadedFile));
    }
    
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
        //reassignFile({
        //    recordId : event.detail.id, 
        //    pictureId : this.pictureId})
        //   .then(result => {
        //        console.log("picture reattached");
        //    })
        //    .catch(error => {
        //        console.log('pic reattachmend error' + JSON.stringify(error));
        //    });
    }

}