public with sharing class QueryForToken {

    static final String APP_PAGE_URL = 'https://instaintegration-dev-ed.lightning.force.com/c/instApp.app';
    static final String INSTA_AUTH_URL = 'https://api.instagram.com/oauth/access_token';
    static final String INSTA_API_URL = 'https://graph.instagram.com/';

    @AuraEnabled
    public static void setAuthContact(String contId) {
        Contact authorizingContact = [SELECT BeingAuthorized__c FROM Contact WHERE Id = : contId];
        authorizingContact.BeingAuthorized__c = true;
        update authorizingContact;
    }
    
    @AuraEnabled
    public static Contact getAuthContact() {

        return [SELECT AppId__c, AppSecret__c, AppToken__c, TokenIsAlive__c, BeingAuthorized__c
                FROM Contact WHERE BeingAuthorized__c = true LIMIT 1];
    }

    @AuraEnabled
    public static void resetContactsStatus() {
        List<Contact> resetedContacts =  [SELECT BeingAuthorized__c FROM Contact WHERE BeingAuthorized__c = true];
        if(resetedContacts.isEmpty()) {
            return;
        }
        for(Contact cont : resetedContacts) {
            cont.BeingAuthorized__c = false;
        }
        update resetedContacts;
    }

    @AuraEnabled
    public static List<Contact> getContacts() {

        return [SELECT Name, AppId__c, AppSecret__c, AppToken__c, 
                TokenIsAlive__c, BeingAuthorized__c
                FROM Contact 
                WHERE AppId__c != NULL AND AppSecret__c != NULL];
    }

    @AuraEnabled
    public static void requestToken(String code, String callbackUrl) {
        Contact curentContact = getAuthContact();
        String endPoint = INSTA_AUTH_URL;
        String postBody = 'app_id=' + curentContact.AppId__c +
            '&app_secret=' + curentContact.AppSecret__c +
            '&grant_type=authorization_code'+
            '&redirect_uri=' + callbackUrl +
            '&code=' + code;
            System.debug('post body '+postBody);
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endPoint);
        request.setBody(postBody);
        request.setMethod('POST');
        HttpResponse response = http.send(request);
        Map<String, String> answer = new Map<String, String>();
        if (response.getStatusCode() != 200) {
            System.debug('requestToken failed with code '+response.getStatusCode());
            return;
        }
        Map<String, Object> rawAnswer = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
        for(String key : rawAnswer.keyset()) {
            answer.put(key,String.valueOf(rawAnswer.get(key)));
        }
        curentContact.UserId__c = answer.get('user_id');
        curentContact.AppToken__c = answer.get('access_token');
        curentContact.BeingAuthorized__c = false;
        update curentContact;
        System.debug('answer is '+answer);
    }
    
    @AuraEnabled
    public static Map<String, String> requestData(String contId) {
        Contact curentContact = [SELECT UserId__c, AppToken__c, TokenIsAlive__c 
                                 FROM Contact WHERE Id = : contId];
        String endPoint = INSTA_API_URL +
            curentContact.UserId__c +
            '?fields=account_type,media_count,username' +
            '&access_token=' + curentContact.AppToken__c;
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endPoint);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        Map<String, String> answer = new Map<String, String>();
        if (response.getStatusCode() != 200) {
            System.debug('requestData failed with code '+response.getStatusCode());
            return answer;
        }
        Map<String, Object> rawAnswer = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
        for(String key : rawAnswer.keyset()) {
            answer.put(key,String.valueOf(rawAnswer.get(key)));
        }
      
        return answer;
    }

    @AuraEnabled
    public static List<String> requestMedia(String contId) {
        Contact curentContact = [SELECT UserId__c, AppToken__c, TokenIsAlive__c 
                                 FROM Contact WHERE Id = : contId];
        String endPoint = INSTA_API_URL +
        curentContact.UserId__c +
        '/media' +
        '?access_token=' + 
        curentContact.AppToken__c;
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endPoint);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        List<String> mediaUrls = new List<String>();
        if (response.getStatusCode() != 200) {
            System.debug('requestMedia failed with code '+response.getStatusCode());
            return mediaUrls;
        }
        Map<String, Object> rawAnswer = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
        List<Map<String, Object>> data = new List<Map<String, Object>>();
        for (Object instance : (List<Object>)rawAnswer.get('data')) {
            data.add((Map<String, Object>)instance);  
        }
              
        for(Map<String, Object> media : data) {
            mediaUrls.add(getImgUrl(String.valueOf(media.get('id')), curentContact.AppToken__c));
        }
       
        return mediaUrls;
    }

    private static String getImgUrl(String mediaId, String access_token) {
        String endPoint = INSTA_API_URL +
        mediaId +
        '?fields=caption,media_url' +
        '&access_token=' + 
        access_token;
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endPoint);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        if (response.getStatusCode() != 200) {
            System.debug('requestMedia' + mediaId + ' failed with code ' + response.getStatusCode());
            return 'none';
        }
        Map<String, Object> rawAnswer = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
    
        return String.valueOf(rawAnswer.get('media_url'));
    }
}