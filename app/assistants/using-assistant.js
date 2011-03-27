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

function UsingAssistant() {}
UsingAssistant.prototype.setup = function () {

	this.prefsModel = new Mojo.Model.Cookie("SimpleBigBookv2");
	this.prefsModel.get();

	this.controller.get('appname').innerHTML = _APP_Name;
	this.controller.get('appdetails').innerHTML = _APP_VersionNumber + " by " + _APP_PublisherName;
	this.controller.get('copywrite').innerHTML = _APP_Copyright;

	//  ****  Setup for Application Menu
	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);
};

UsingAssistant.prototype.activate = function (event) {};
UsingAssistant.prototype.deactivate = function (event) {};
UsingAssistant.prototype.cleanup = function (event) {};
