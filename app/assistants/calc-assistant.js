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

function CalcAssistant() {}
CalcAssistant.prototype.setup = function () {

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

		$('CalcWrapperDiv').addClassName('touchpadfix');
	}

	//  ****  Setup for Application Menu
	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);

};

CalcAssistant.prototype.activate = function (event) {
};
CalcAssistant.prototype.deactivate = function (event) {};
CalcAssistant.prototype.cleanup = function (event) {};

