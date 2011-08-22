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
	if (this.debugMe === true) {Mojo.Log.info(">>>>> LAUNCH PARAMS:", "'", params, "'");}

	/*if (!SBB.db) {
		//Mojo.Log.info(">>>>> LOADING SBB.DB");
		SBB.db = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);
	}*/

	//try { 
	//	if (! (this.prefs)) {
	//		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
	//		this.prefsModel = this.prefs.get();
	//		this.prefsModel.launchParams = params;
	//		this.prefs.put(this.prefsModel);
	//	}
	//} catch (launchParamsError) {Mojo.Log.logException(launchParamsError, "launchParamsError: Can't set cookie param.");}

	
	
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
	if (event.type === Mojo.Event.command) {
		if (this.debugMe===true) {Mojo.Log.info("AppAss handleCommand", event.command);}
		switch (event.command) {
			case 'cmd-Dock':
				this.controller.getStageController('book').pushScene({name: 'dock', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Search':
				this.controller.getStageController('book').pushScene({name: 'search', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Bookmarks':
				this.controller.getStageController('book').pushScene({name: 'bookmarks', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Organizations':
				this.controller.getStageController('book').pushScene({name: 'organizations', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Calculator':
				this.controller.getStageController('book').pushScene({name: 'calc', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Meetings':
				this.controller.getStageController('book').pushScene({name: 'meetings', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Preferences':
				this.controller.getStageController('book').pushScene({name: 'prefs', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-HelpAbout':
				this.controller.getStageController('book').pushScene({name: 'help', transition: Mojo.Transition.crossFade}, this);
				break;
			case 'cmd-Return':
				this.controller.getStageController('book').popScenesTo('book');
				//this.controller.getStageController(this.getStageName()).popScenesTo();
				//this.controller.stageController.popScene();
				break;
			//case 'cmd-GoBack':
			//	this.controller.stageController.popScene();
			//	break;
		}
	}
} catch (handleCommandError) {Mojo.Log.logException(handleCommandError, "AppAss handleCommand");}
};

Mojo.Log.info("=======================  END APP ASST =======================");