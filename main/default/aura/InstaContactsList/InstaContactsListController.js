({
	doInit : function(component, event) {
		//var code = component.get('v.code');
		let windowUrl = window.location.href;
		var redirectUrl = windowUrl;
		if(windowUrl.indexOf('?') > 0) {
			var code = windowUrl.slice(windowUrl.indexOf('?')+6, -2);
			redirectUrl = windowUrl.slice(0, windowUrl.indexOf('?'));
		}
		var getContacts = component.get("c.getContacts");
		getContacts.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.contacts", response.getReturnValue());
            } else {
                console.log("Get contacts is failed with state: " + state); 
            }
		});
        if(code) {
			console.log('code is '+code);
			var reqToken = component.get("c.requestToken");
        	reqToken.setParams({
				"code": code,
				"callbackUrl": redirectUrl
        	});
			reqToken.setCallback(this, function(response){
				var state = response.getState();
				if (state === "SUCCESS") {
					console.log("Request token done: " + state);
					$A.enqueueAction(getContacts);
				} else {
					console.log("Request token is failed with state: " + state); 
				}
			});
			$A.enqueueAction(reqToken);
		} else {
			$A.enqueueAction(getContacts);
		}
		var resetContacts = component.get("c.resetContactsStatus");
		$A.enqueueAction(resetContacts);
		var getContacts = component.get("c.getContacts");
		getContacts.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.contacts", response.getReturnValue());
            } else {
                console.log("Get contacts is failed with state: " + state); 
            }
		});
		$A.enqueueAction(getContacts);
	},
	instaDeauth : function(component) {
		var popup = window.open('https://instagram.com/accounts/logout', 'InstagramDelog' , "width=200,height=200");	
		setTimeout(popup.close, 1000);	
	},
    showInfo : function(component, event) {
		var userInfo = event.getParam('userInfo');
        component.set("v.userInfo", userInfo);
	},
	showMedia : function(component, event) {
		var userMedia = event.getParam('userMedia');
        component.set("v.userMedia", userMedia);
    },
})