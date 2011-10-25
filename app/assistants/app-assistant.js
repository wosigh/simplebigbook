Mojo.Log.info("=======================  START APP ASST =======================");

var mainStageName = 'book';
var dockStageName = 'dock';

function AppAssistant() {
	this.debugMe = false;

	/*SBB.dbName = "SBB_Bookmarks";
	SBB.dbVersion = "0.1";
	SBB.dbDisplayName = "Simple Big Book";
	SBB.dbSize = 200000;*/

}

AppAssistant.prototype.handleLaunch = function(params) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER AA-HANDLELAUNCH @@");}

try {
	if (!params) {
		var stageProxy = this.controller.getStageProxy(mainStageName);
		var mainStageController = this.controller.getStageController(mainStageName);
		
		if (stageProxy) {
			if (mainStageController) {
				mainStageController.window.focus();
			}
		}
	        else if (mainStageController) {
			mainStageController.popScenesTo(mainStageName);
			mainStageController.activate();
		}
		else {
			this.controller.createStageWithCallback({name: mainStageName}, this.launchFirstScene.bind(this));
		}
	}

	// launch dockmode
	else if (params.dockMode) {
		var dockStageController = this.controller.getStageController(dockStageName);
		if (!dockStageController) {
			this.controller.createStageWithCallback({name: dockStageName}, this.launchDockScene.bind(this), "dockMode");
		}
	}

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE AA-HANDLELAUNCH @@");}
	} catch (handleLaunchError) {Mojo.Log.logException(handleLaunchError, "AppAssistant#handleLaunch");}
};

AppAssistant.prototype.launchFirstScene = function(controller) {
	controller.pushScene(mainStageName);
};

AppAssistant.prototype.launchDockScene = function(controller) {
	controller.pushScene(dockStageName);
};

AppAssistant.prototype.cleanup = function (event) {
};

AppAssistant.prototype.handleCommand = function (event) {
try {
	this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
	this.prefsModel = this.prefs.get();
	//Mojo.Log.info("APPASS Device:", this.prefsModel.isTouchPad);

	if (this.prefsModel.isTouchPad === true) {
		var mainScene = 'booktp';
	}
	else {
		var mainScene = 'book'
	}
	
	if (event.type === Mojo.Event.command) {
		if (this.debugMe===true) {Mojo.Log.info("AppAss handleCommand", event.command);}
		switch (event.command) {
			case 'cmd-Dock':
				this.controller.getStageController(mainScene).pushScene({name: 'dock', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Search':
				this.controller.getStageController(mainScene).pushScene({name: 'search', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Bookmarks':
				this.controller.getStageController(mainScene).pushScene({name: 'bookmarks', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Organizations':
				this.controller.getStageController(mainScene).pushScene({name: 'organizations', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Calculator':
				this.controller.getStageController(mainScene).pushScene({name: 'calc', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Meetings':
				this.controller.getStageController(mainScene).pushScene({name: 'meetings', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Preferences':
				this.controller.getStageController(mainScene).pushScene({name: 'prefs', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-HelpAbout':
				this.controller.getStageController(mainScene).pushScene({name: 'help', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Return':
				this.controller.getStageController(mainScene).popScenesTo(mainScene);
				break;
		}
	}
} catch (handleCommandError) {Mojo.Log.logException(handleCommandError, "AppAss handleCommand");}
};
