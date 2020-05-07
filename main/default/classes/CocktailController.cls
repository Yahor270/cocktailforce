public with sharing class CocktailController {
    @AuraEnabled(cacheable=true)
    public static List<CocktailWrapper> getCocktailList() {
        List<CocktailWrapper> returnList = new List<CocktailWrapper>();
        List<Cocktail__c> cocktails = [SELECT 
            Name, 
            Description__c,
            Picture__c, 
            (SELECT Component__r.Name FROM CocktailItems__r) 
            FROM Cocktail__c
            ORDER BY Name ASC NULLS LAST];
        for(Cocktail__c coc : cocktails) {
           List<String> items = new List<String>();
           for(CocktailItem__c cI : coc.CocktailItems__r) {
                items.add(cI.Component__r.Name);
            }
            CocktailWrapper cocktail = new CocktailWrapper();
            cocktail.Id = coc.Id;
            cocktail.Name = coc.Name;
            cocktail.ingridients = items;
            cocktail.Description = coc.Description__c;
            cocktail.Picture = coc.Picture__c;
            returnList.add(cocktail);
        }
        return returnList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Component__c> getIngridientsList() {
    
        return [SELECT Name FROM Component__c ORDER BY Name ASC NULLS LAST];
    }

    
    public class CocktailWrapper {
        @AuraEnabled 
        public String Id;
        @AuraEnabled 
        public String Name;
        @AuraEnabled 
        public List<String> ingridients;
        @AuraEnabled 
        public String Description;
        @AuraEnabled 
        public String picture;
    }
}