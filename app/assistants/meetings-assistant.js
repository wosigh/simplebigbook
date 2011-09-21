/* SimpleBigBook Copyright (C) 2009  Rick Boatright, John Kiernan
 *
 * This file is part of Simple Big Book.
 *
 * Simple Biig Book is free software: you can redistribute it and/or modify
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

function MeetingsAssistant() {
	this.debugMe = false;
}

MeetingsAssistant.prototype.setup = function () {

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

		$('MeetingsContainer1').addClassName('touchpadfix');
		$('MeetingsContainer2').addClassName('touchpadfix');
		$('zipcodeSearch').addClassName('touchpadfix');
	}

	this.textfieldAttributes = {
		hintText: '"City, State" and/or "Zipcode"',
		multiline: false,
		enterSubmits: true,
		focus: true
	};
	this.textfieledModel = {
		value: '',
		disabled: false
	};
	this.controller.setupWidget('meetingSearchVal', this.textfieldAttributes, this.textfieldModel);

	this.controller.setupWidget('zipcodeSearch', {}, {
		label: 'Search'
	});

	//  ****  Setup for Application Menu
	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);
};

MeetingsAssistant.prototype.activate = function (event) {
	this.controller.listen('zipcodeSearch', Mojo.Event.tap, this.meetingSearch.bind(this));
	this.controller.listen('meetingSearchVal', Mojo.Event.keydown, this.validateText.bind(this));
	this.controller.document.addEventListener("keyup", this.keyDownHandler.bind(this), true);
};
MeetingsAssistant.prototype.deactivate = function (event) {
	this.controller.stopListening('zipcodeSearch', Mojo.Event.tap, this.meetingSearch.bind(this));
	this.controller.stopListening('meetingSearchVal', Mojo.Event.keydown, this.validateText.bind(this));
};
MeetingsAssistant.prototype.cleanup = function (event) {
	this.controller.stopListening('zipcodeSearch', Mojo.Event.tap, this.meetingSearch.bind(this));
	this.controller.stopListening('meetingSearchVal', Mojo.Event.keydown, this.validateText.bind(this));
};
 
/********************
 *
 * ENTER KEY
 * 
 ********************/
MeetingsAssistant.prototype.keyDownHandler = function(event)
{
	if (Mojo.Char.isEnterKey(event.keyCode)) {
		$('meetingSearchVal').mojo.blur();
		//setTimeout(this.enterKeyContinue.bind(this), 10);
		setTimeout(this.meetingSearch.bind(this), 10);
	}
}


MeetingsAssistant.prototype.meetingSearch = function (event) {
try{ 
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER meetingSearch @@");}

	//Mojo.Log.info($('meetingSearchVal').mojo.getValue());
	theZip = $('meetingSearchVal').mojo.getValue();

	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		method: 'open',
		parameters: {
			id: 'com.palm.app.browser',
			params: {
				target: 'http://www.google.com/xhtml/search?site=local&loc=' + theZip +'&action=setloc&client=ms-palm-webOS&q=alcoholics+anonymous'
			}
		}
	});


} catch (error) {Mojo.Log.error("MEETINGS ASSISTANT meetingSearch ERROR", error);}
if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE meetingSearch @@");}
};


MeetingsAssistant.prototype.validateText = function (event) {
try{ 
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER meetingSearch @@");}
	Mojo.Log.info(event.keyCode);
	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE meetingSearch @@");}
	} catch (error) {Mojo.Log.error("MEETINGS ASSISTANT meetingSearch ERROR", error);}
};
