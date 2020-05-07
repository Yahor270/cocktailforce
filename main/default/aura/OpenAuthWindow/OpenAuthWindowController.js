({
	openActionWindow : function(component, event, helper) {	
		const instaAuthUrl = 'https://api.instagram.com/oauth/authorize';
		let windowUrl = window.location.href;
		var redirectUrl = windowUrl;
		if(windowUrl.indexOf('?') > 0) {
			redirectUrl = windowUrl.slice(0, windowUrl.indexOf('?'));
		} 
		var contact = component.get("v.contact");
		console.log('redirect url is '+redirectUrl);
        var targetString = instaAuthUrl +
  			'?app_id=' + contact["AppId__c"] +
  			'&redirect_uri=' + redirectUrl +
  			'&scope=user_profile,user_media' +
			'&response_type=code';
		var setContact = component.get("c.setAuthContact");
		setContact.setParams({
				"contId": contact["Id"]
        	});
			setContact.setCallback(this, function(response){
			var state = response.getState();
			if (state === "SUCCESS") { 
				console.log('Authorizing contact set');
			} else {
				console.log("setAuthContact failed with state: " + state); 
			}
		});
		$A.enqueueAction(setContact);
		window.open(targetString);	
	},
	
	getData : function(component, event, helper) {
		var contact = component.get("v.contact");
		var requestData = component.get("c.requestData");
		requestData.setParams({
			"contId": contact["Id"]
		});
		requestData.setCallback(this, function(response){
			var state = response.getState();
			if (state === "SUCCESS") { 
				var userInfo = response.getReturnValue();
				var gotInfo = component.getEvent("gotInfo");
				gotInfo.setParams({"userInfo": userInfo});
				gotInfo.fire();
			} else {
				console.log("Getting data failed with state: " + state); 
			}
		});
		var requestMedia = component.get("c.requestMedia");
		requestMedia.setParams({
			"contId": contact["Id"]
		});
		requestMedia.setCallback(this, function(response){
			var state = response.getState();
			if (state === "SUCCESS") {
				var userMedia = response.getReturnValue();
				var gotMedia = component.getEvent("gotMedia");
				gotMedia.setParams({"userMedia": userMedia});
				gotMedia.fire();
			} else {
				console.log("Getting media failed with state: " + state); 
			}
		});
		$A.enqueueAction(requestData);
		$A.enqueueAction(requestMedia);
	},
})