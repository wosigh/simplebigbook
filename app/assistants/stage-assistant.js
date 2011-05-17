Mojo.Log.info("=======================  START STAGE ASST =======================");
//Mojo.Log.info("                ", Mojo.Controller.appInfo.title, "-", Mojo.Controller.appInfo.version);

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

//function StageAssistant() {}
function StageAssistant(stageController) {}

this.debugMe = false;

// stage names
var mainStageName = 'book';
var dockStageName = 'dock';

StageAssistant.prototype.setup = function () {

	this.sceneArgs = {
		name: mainStageName,
		disableSceneScroller: false
	};
	this.controller.pushScene(this.sceneArgs);
	
	//this.createMyTable();
};

StageAssistant.prototype.activate = function (event) {};
StageAssistant.prototype.deactivate = function (event) {};
StageAssistant.prototype.cleanup = function (event) {};


/********************
 *
 * APP MENUS
 * 
 * Global Simplicity
 *
 ********************/
	////////////////////////////////////////////////////
	//  ****  Setup for Main Application Menu
	StageAssistant.myMenuAttr = {
		omitDefaultItems: true
	};

	StageAssistant.myMenuModel = {
		visible: true,
		items: [
			{label: $L("Dock Test"), command: 'cmd-Dock'},//, shortcut: 'd'},
			{label: $L("Search"), command: 'cmd-Search'},//, shortcut: 's'},
			{label: $L("Add Bookmark"), command: 'cmd-AddBookmarks'},//, shortcut: 'b'},
			{label: $L("Edit Bookmarks"), command: 'cmd-Bookmarks'},//, shortcut: 'b'},
			{label: $L("12 Step Organizations"), command: 'cmd-Organizations'},//, shortcut: 'o'},
			{label: $L("Meetings"), command: 'cmd-Meetings'},//, shortcut: 'r'},
			{label: $L("Preferences"), command: 'cmd-Preferences'},//, shortcut: 'p'},
			{label: $L("Help & About"), command: 'cmd-HelpAbout'}// shortcut: 'h'}
		]
	};

	////////////////////////////////////////////////////
	//  ****  Setup for Main Application Menu with Quote Generator
	StageAssistant.myMenuWithQuotesAttr = {
		omitDefaultItems: true
	};

	StageAssistant.myMenuWithQuotesModel = {
		visible: true,
		items: [
			{label: $L("Search"), command: 'cmd-Search'},//, shortcut: 's'},
			{label: $L("Add Bookmark"), command: 'cmd-AddBookmarks'},//, shortcut: 'b'},
			{label: $L("Edit Bookmarks"), command: 'cmd-Bookmarks'},//, shortcut: 'b'},
			{label: $L("Quote Generator"), command: 'cmd-Dock'},//, shortcut: 's'},
			{label: $L("12 Step Organizations"), command: 'cmd-Organizations'},//, shortcut: 'o'},
			{label: $L("Meetings"), command: 'cmd-Meetings'},//, shortcut: 'r'},
			{label: $L("Preferences"), command: 'cmd-Preferences'},//, shortcut: 'p'},
			{label: $L("Help & About"), command: 'cmd-HelpAbout'}// shortcut: 'h'}
		]
	};

	////////////////////////////////////////////////////
	//  ****  Sub Menu (when a secondary page is open
	StageAssistant.mySimpleMenuAttr = {
		omitDefaultItems: true
	};

	StageAssistant.mySimpleMenuModel = {
		visible: true,
		items: [
			{label: $L("Back to the book"), command: 'cmd-Return'}//, shortcut: 'b'},
		]
	};

	////////////////////////////////////////////////////
	//  ****  Blank Menu
	StageAssistant.myBlankMenuAttr = {
		omitDefaultItems: true
	};

	StageAssistant.myBlankMenuModel = {
		visible: true,
		items: []
	};


/********************
 *
 * CHAPTER LIST
 * 
 * Global Simplicity.
 *
 ********************/
	SBB = {};

	/*******  List of chapters  *******/
	try{
	SBB.chapterList = [];
	SBB.chapterList.push({
		label: "Foreword",
		value: "1",
		shortname: "forward",
		file: "01_foreword.html"
	});
	SBB.chapterList.push({
		label: "The Doctor's Opinion",
		value: "2",
		shortname: "drsopinion",
		file: "02_drsopinion.html"
	});
	SBB.chapterList.push({
		label: "Bill's Story",
		value: "3",
		shortname: "billsstory",
		file: "03_billsstory.html"
	});
	SBB.chapterList.push({
		label: "There is a Solution",
		value: "4",
		shortname: "thereis",
		file: "04_thereis.html"
	});
	SBB.chapterList.push({
		label: "More About Alcoholism",
		value: "5",
		shortname: "moreabout",
		file: "05_moreabout.html"
	});
	SBB.chapterList.push({
		label: "We Agnostics",
		value: "6",
		shortname: "weagnostics",
		file: "06_weagnostics.html"
	});
	SBB.chapterList.push({
		label: "How It Works",
		value: "7",
		shortname: "howitworks",
		file: "07_howitworks.html"
	});
	SBB.chapterList.push({
		label: "Into Action",
		value: "8",
		shortname: "intoaction",
		file: "08_intoaction.html"
	});
	SBB.chapterList.push({
		label: "Working With Others",
		value: "9",
		shortname: "workingwithothers",
		file: "09_workingwithothers.html"
	});
	SBB.chapterList.push({
		label: "To Wives",
		value: "10",
		shortname: "towives",
		file: "10_towives.html"
	});
	SBB.chapterList.push({
		label: "The Family Afterward",
		value: "11",
		shortname: "thefamily",
		file: "11_thefamily.html"
	});
	SBB.chapterList.push({
		label: "To Employers",
		value: "12",
		shortname: "toemployers",
		file: "12_toemployers.html"
	});
	SBB.chapterList.push({
		label: "A Vision for You",
		value: "13",
		shortname: "avisionforyou",
		file: "13_avisionforyou.html"
	});
	SBB.chapterList.push({
		label: "The Doctor's Nightmare",
		value: "14",
		shortname: "drsnightmare",
		file: "14_drsnightmare.html"
	});
	SBB.chapterList.push({
		label: "Spiritual Experience",
		value: "15",
		shortname: "spiritual",
		file: "15_spiritual.html"
	});
	} catch (error) {Mojo.Log.error("STAGE CHAPTERS!", error);}

 
Mojo.Log.info("=======================  END STAGE ASST =======================");
