Mojo.Log.info("=======================  START  PREFS =======================");
Mojo.Log.info("                ", Mojo.Controller.appInfo.title, "-", Mojo.Controller.appInfo.version);

/* SimpleBigBook Copyright (C) 2009  Rick Boatright, John Kiernan
 *
 * This file is part of Simple Big Book.
 *
 * Simple Big Book is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Simple Big Book is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Simple Big Book.  If not, see <http://www.gnu.org/licenses/>.
 */

function PrefsAssistant() {
	this.debugMe = false;
}

PrefsAssistant.prototype.setup = function () {
try{
	//  ****  Get the preferences from cookie
	//if (! (this.prefsModel)) {
	//	Mojo.Log.info("********* NO COOKIE LOADED!");
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
	//}
	//  ****  End of getting Preferences from cookie
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: textsize", this.prefsModel.textsize);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: chapterNumber", this.prefsModel.chapterNumber);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: pageNumber", this.prefsModel.pageNumber);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: pagePosition", this.prefsModel.pagePosition);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: screenSize", this.prefsModel.screenSize);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: isFullScreen", this.prefsModel.isFullScreen);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: wasChapterJump", this.prefsModel.wasChapterJump);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: scrollingEffect", this.prefsModel.scrollingEffect);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: dockPhraseSpeed", this.prefsModel.dockPhraseSpeed);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: daynight", this.prefsModel.daynight);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: wasBookmarkJump", this.prefsModel.wasBookmarkJump);}

	// Attributes for Text Size radio selector
	this.radioAttributes = {
		choices: [{
			label: 'Small',
			value: '16px'
		}, {
			label: 'Medium',
			value: '18px'
		}, {
			label: 'Large',
			value: '21px'
		}]
	};

	this.radioModel = {
		value: this.prefsModel.textsize,
		disabled: false
	};

	this.screenSizeAttributes = {
		trueValue: true,
		trueLabel: 'YES',
		falseValue: false,
		falseLabel: 'NO'
	};

	this.screenSizeModel = { 
		value: this.prefsModel.screenSize,
		disabled: false
	};

	this.scrollEffectAttributes = {
		trueValue: true,
		trueLabel: 'YES',
		falseValue: false,
		falseLabel: 'NO'
	};

	this.scrollEffectModel = { 
		value: this.prefsModel.scrollingEffect,
		disabled: false
	};

	//this.controller.setupWidget("minTimeSelectorWidget",
	this.dockPhraseSpeedAttributes = {
		choices: [
			{label: "30 seconds", value: 30000},
			{label: "1 Minute", value: 60000},
			{label: "2 Minutes", value: 120000},
			{label: "3 Minutes", value: 240000},
			{label: "4 Minutes", value: 300000},
			{label: "5 Minutes", value: 360000}
		]
	},

	/*this.dockPhraseSpeedAttributes = {
		trueValue: 12000,
		trueLabel: 'Fast',
		falseValue: 36000,
		falseLabel: 'Slow'
	};*/

	this.dockPhraseSpeedModel = { 
		value: this.prefsModel.dockPhraseSpeed,
		disabled: false
	};

	this.dayNightToggleAttributes = {label: $L(''),
		trueValue: 'day',
		trueLabel: 'Day',
		falseValue: 'night',
		falseLabel: 'Night'
	};	

	this.daynightToggleModel = {
		value : this.prefsModel.daynight,
		disabled : false
	};

	this.controller.setupWidget('rbutton', this.radioAttributes, this.radioModel);
	this.controller.setupWidget('scrollEffectToggle', this.scrollEffectAttributes, this.scrollEffectModel);
	this.controller.setupWidget('screenSizeToggle', this.screenSizeAttributes, this.screenSizeModel);
	this.controller.setupWidget('dockPhraseSpeedToggle', this.dockPhraseSpeedAttributes, this.dockPhraseSpeedModel);
	this.controller.setupWidget('daynightToggle', this.dayNightToggleAttributes,this.daynightToggleModel );

	this.dayNightButton = this.controller.get('daynightToggle');
	this.dayNightButtonBinder = this.dayNightButtonToggle.bindAsEventListener(this);

	this.changeTextSize(this.prefsModel.textsize);

	//  ****  Setup for Application Menu
	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);

} catch (error) {Mojo.Log.error("PREF SETUP", error);}
};


PrefsAssistant.prototype.activate = function (event) {
	Mojo.Event.listen(this.controller.get('rbutton'), Mojo.Event.propertyChange, this.radioTextSize.bind(this));
	Mojo.Event.listen(this.controller.get('screenSizeToggle'), Mojo.Event.propertyChange, this.updateScreenSize.bind(this));
	Mojo.Event.listen(this.controller.get('scrollEffectToggle'), Mojo.Event.propertyChange, this.updateScrollEffect.bind(this));
	Mojo.Event.listen(this.controller.get('dockPhraseSpeedToggle'), Mojo.Event.propertyChange, this.updateDockPhraseSpeed.bind(this));
	Mojo.Event.listen(this.controller.get('daynightToggle'), Mojo.Event.propertyChange, this.dayNightButtonToggle.bind(this));
};


PrefsAssistant.prototype.deactivate = function (event) {
	this.prefs.put(this.prefsModel);
	//this.prefstest = this.prefs.get();
	//Mojo.Log.info("=-=-=-=--=-=-", this.prefstest.screenSize, "+", this.prefsModel.screenSize);
	//this.prefstest = null;
};


PrefsAssistant.prototype.cleanup = function (event) {
	this.prefs.put(this.prefsModel);
	Mojo.Event.stopListening(this.controller.get('rbutton'), Mojo.Event.propertyChange, this.radioTextSize.bind(this));
	Mojo.Event.stopListening(this.controller.get('screenSizeToggle'), Mojo.Event.propertyChange, this.updateScreenSize.bind(this));
	Mojo.Event.stopListening(this.controller.get('scrollEffectToggle'), Mojo.Event.propertyChange, this.updateScrollEffect.bind(this));
	Mojo.Event.stopListening(this.controller.get('dockPhraseSpeedToggle'), Mojo.Event.propertyChange, this.updateDockPhraseSpeed.bind(this));
	Mojo.Event.stopListening(this.controller.get('daynightToggle'), Mojo.Event.propertyChange, this.dayNightButtonToggle.bind(this));
};


PrefsAssistant.prototype.radioTextSize = function (event) {
	this.prefsModel.textsize = event.value;
	this.changeTextSize(event.value);
	this.prefs.put(this.prefsModel);
	if (this.debugMe===true) {Mojo.Log.info("radioTextSize", event.value, "-- this.prefsModel.textsize", this.prefsModel.textsize);}
};


PrefsAssistant.prototype.changeTextSize = function (size) {
	$('gen13').style.fontSize = this.prefsModel.textsize;
};


PrefsAssistant.prototype.updateScreenSize = function(event) {
	this.prefsModel.screenSize = event.value;
	this.prefs.put(this.prefsModel);
	if (this.debugMe===true) {Mojo.Log.info("updateScreenSize", event.value, "-- this.prefsModel.screenSize", this.prefsModel.screenSize);}
};

PrefsAssistant.prototype.updateScrollEffect = function(event) {
	this.prefsModel.scrollingEffect = event.value;
	this.prefs.put(this.prefsModel);
	if (this.debugMe===true) {Mojo.Log.info("updateScrollEffect", event.value, "-- this.prefsModel.scrollingEffect", this.prefsModel.scrollingEffect);}
};

PrefsAssistant.prototype.updateDockPhraseSpeed = function(event) {
	Mojo.Log.info(event.value);
	this.prefsModel.dockPhraseSpeed = event.value;
	this.prefs.put(this.prefsModel);
	if (this.debugMe===true) {Mojo.Log.info("updateDockPhraseSpeed", event.value, "-- this.prefsModel.updateDockPhraseSpeed", this.prefsModel.dockPhraseSpeed);}
};


PrefsAssistant.prototype.dayNightButtonToggle = function(event) {
	this.prefsModel.daynight = event.value;
	this.setDayNight(event.value);
	this.prefs.put(this.prefsModel);
	if (this.debugMe===true) {Mojo.Log.info("dayNightButtonToggle", event.value, "-- this.prefsModel.daynight", this.prefsModel.daynight);}
};


PrefsAssistant.prototype.setDayNight= function(dn){
	switch (dn){
		case 'day':
			var body = Element.select(this.controller.document, 'body');
			body[0].addClassName('main');  //palm-default
			body[0].removeClassName('palm-dark');
			break;
		case 'night':
			var body = Element.select(this.controller.document, 'body');
			body[0].addClassName('palm-dark');
			body[0].removeClassName('main');  //palm-default
			break;
	}
};
