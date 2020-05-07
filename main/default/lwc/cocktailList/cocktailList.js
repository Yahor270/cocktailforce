import { LightningElement, wire, api } from 'lwc';
import getCocktailList from '@salesforce/apex/CocktailController.getCocktailList';
import PICTURES from '@salesforce/resourceUrl/cocktails';

export default class CocktailList extends LightningElement {
    searchKey = [];
    error;
    allCocktailWrapper;
    selectedCocktailWrapper;

    @wire(getCocktailList) all({ error, data }) {
        if (data) {
            this.allCocktailWrapper = [];
            this.error = undefined;
            data.forEach(el => {
                let picture = PICTURES + el.picture;
                this.allCocktailWrapper.push({info: el, picture: picture});
            });
            this.selectedCocktailWrapper = this.allCocktailWrapper;
        } else if (error) {
            this.error = error;
            this.allCocktailWrapper = undefined;
        }
    };
    
    @api
    findCocktails(detail) {
        if(detail.value.length > 0) {
            this.selectedCocktailWrapper = [];
        } else {
            this.selectedCocktailWrapper = this.allCocktailWrapper;
            return;
        }
        if(detail.strict) {
            console.log('is strict');
            this.allCocktailWrapper.forEach(element => {
                if(this.arrayContainsArray(detail.value, element.info.ingridients)) {
                    this.selectedCocktailWrapper.push(element);
                }
            });
        } else {
            console.log('non strict');
            this.allCocktailWrapper.forEach(element => {
                if(this.arrayCrossesArray(element.info.ingridients, detail.value)) {
                    this.selectedCocktailWrapper.push(element);
                }
            });
        }
    }
    
    arrayContainsArray(superset, subset) {
        if (0 === subset.length) {
            return false;
        }
        return subset.every(value => {
            return (superset.indexOf(value) >= 0);
        });
    }

    arrayCrossesArray(superset, subset) {
        if (0 === subset.length) {
            return false;
        }
        let flag = false;
        subset.forEach(el => {
            if(superset.indexOf(el) >= 0) {
                flag = true;
            }   
        });
        return flag;
    }
}