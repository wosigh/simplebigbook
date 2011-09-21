function HelpAssistant() {}

HelpAssistant.prototype.setup = function () {
	try {

		//  ****  Get the preferences from cookie
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();

		if(this.prefsModel.isTouchPad === true) {
			var menuModel = {
				visible: true,
				items: [ 
					{ icon: "back", command: "cmd-Return"}
				]
			}; 

			this.controller.setupWidget(Mojo.Menu.commandMenu,
				this.attributes = {
					spacerHeight: 0,
					menuClass: 'no-fade'
				},
				menuModel
			);

			//$('HelpWrapperDiv').addClassName('touchpadfix');
			$('HelpContainer1').addClassName('touchpadfix');
			$('HelpContainer2').addClassName('touchpadfix');
		}

		$('appname').innerHTML = _APP_Name;
		$('appdetails').innerHTML = _APP_VersionNumber + " by " + _APP_PublisherName;

		var supportitems = [];
		var i = 0;
		if (typeof _APP_Publisher_URL !== "undefined" && _APP_Publisher_URL) {
			supportitems[i++] = {
				text: _APP_PublisherName + ' Website',
				detail: $L(_APP_Publisher_URL),
				Class: $L('img_web'),
				type: 'web'
			};
		}
		if (typeof _APP_Support_URL !== "undefined" && _APP_Support_URL) {
			supportitems[i++] = {
				text: 'Support Website',
				detail: $L(_APP_Support_URL),
				Class: $L('img_web'),
				type: 'web'
			};
		}
		if (typeof _APP_Support_Email !== "undefined" && _APP_Support_Email) {
			supportitems[i++] = {
				text: 'Send Email',
				address: _APP_Support_Email.address,
				subject: _APP_Support_Email.subject,
				Class: $L('img_email'),
				type: 'email'
			};
		}
		if (typeof _APP_Support_Phone !== "undefined" && _APP_Support_Phone) {
			supportitems[i++] = {
				text: $L(_APP_Support_Phone),
				detail: $L(_APP_Support_Phone),
				Class: $L('img_phone'),
				type: 'phone'
			};
		}
		if (typeof _APP_Support_Extra !== "undefined" && _APP_Support_Extra) {
			supportitems[i++] = {
				text: 'Wikipedia 12 Step article',
				detail: 'http://en.m.wikipedia.org/wiki/Twelve-step_program',
				Class: $L('img_web'),
				type: 'web'
			};
		}
	} catch (e) {
		Mojo.Log.error(e);
	}
	try {
		var helpitems = [];
		i = 0;
		for (j = 0; j < _APP_Help_Resource.length; j++) {
			if (_APP_Help_Resource[j].type === 'web') {
				helpitems[i++] = {
					text: _APP_Help_Resource[j].label,
					detail: _APP_Help_Resource[j].url,
					Class: $L('img_web'),
					type: 'web'
				};
			}
			else if (_APP_Help_Resource[j].type === 'scene') {
				helpitems[i++] = {
					text: _APP_Help_Resource[j].label,
					detail: _APP_Help_Resource[j].sceneName,
					Class: $L('img_icon'),
					type: 'scene'
				};
			}
		}
		if (_APP_Help_Resource.length > 0) {
			this.controller.setupWidget('AppHelp_list', {
				itemTemplate: 'help/listitem',
				listTemplate: 'help/listcontainer',
				emptyTemplate: 'help/emptylist',
				swipeToDelete: false
			}, {
				listTitle: $L('Help'),
				items: helpitems
			});
		}
	} catch (e) {
		Mojo.Log.error(e);
	}
	try {
		this.controller.setupWidget('AppSupport_list', {
			itemTemplate: 'help/listitem',
			listTemplate: 'help/listcontainer',
			emptyTemplate: 'help/emptylist',
			swipeToDelete: false
		}, {
			listTitle: $L('Support'),
			items: supportitems
		});
		$('copywrite').innerHTML = _APP_Copyright;
	} catch (e) {
		Mojo.Log.error(e);
	}

	//  ****  Setup for Application Menu
	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);

};

HelpAssistant.prototype.handleListTap = function (event) {
	if (event.item.type === 'web') {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'open',
			parameters: {
				id: 'com.palm.app.browser',
				params: {
					target: event.item.detail
				}
			}
		});
	} else if (event.item.type === 'email') {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'open',
			parameters: {
				target: 'mailto:' + event.item.address + '?subject=' + Mojo.appInfo.title + ' ' + event.item.subject
			}
		});
	} else if (event.item.type === 'phone') {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'open',
			parameters: {
				target: 'tel://' + event.item.detail
			}
		});
	} else if (event.item.type === 'scene') {
		this.controller.stageController.swapScene(event.item.detail);
	}
};

HelpAssistant.prototype.activate = function (event) {
	this.handleListTap = this.handleListTap.bind(this);
	Mojo.Event.listen($('AppHelp_list'), Mojo.Event.listTap, this.handleListTap);
	Mojo.Event.listen($('AppSupport_list'), Mojo.Event.listTap, this.handleListTap);
};

HelpAssistant.prototype.deactivate = function (event) {};

HelpAssistant.prototype.cleanup = function (event) {
	Mojo.Event.stopListening($('AppHelp_list'), Mojo.Event.listTap, this.handleListTap);
	Mojo.Event.stopListening($('AppSupport_list'), Mojo.Event.listTap, this.handleListTap);
};
