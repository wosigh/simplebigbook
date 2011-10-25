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
this.maxScreenHeight = Mojo.Environment.DeviceInfo.screenHeight;
this.maxScreenWidth = Mojo.Environment.DeviceInfo.screenWidth;
this.modelName = Mojo.Environment.DeviceInfo.modelNameAscii;
Mojo.Log.info("IN STAGE:", this.maxScreenHeight, this.maxScreenWidth, this.modelName);

// stage names
var dockStageName = 'dock';
if ( (this.maxScreenHeight >= 1024) || (this.maxScreenWidth >= 1024) || (this.modelName.indexOf("ouch") > -1) ) {
	var mainStageName = 'booktp';
}
else {
	var mainStageName = 'book'
}

StageAssistant.prototype.setup = function () {

	this.sceneArgs = {
		name: mainStageName,
		disableSceneScroller: false
	};
	this.controller.pushScene(this.sceneArgs);
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

	//shortcut: 's'},
	
	StageAssistant.myMenuModel = {
		visible: true,
		items: [
			{label: $L("Dock Test"), command: 'cmd-Dock'}, //, shortcut: 'd'},
			{label: $L("Search"), command: 'cmd-Search'},
			{label: $L("Bookmarks..."), items: [
				{label: $L("Add Bookmark"), command: 'cmd-AddBookmarks'},
				{label: $L("Edit Bookmarks"), command: 'cmd-Bookmarks'}
				]},
			{label: $L("Help..."), items: [
					{label: $L("12 Step Organizations"), command: 'cmd-Organizations'},
					{label: $L("Meetings"), command: 'cmd-Meetings'},
					{label: $L("Help & About"), command: 'cmd-HelpAbout'}
				]},
			{label: $L("Preferences"), command: 'cmd-Preferences'}
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
			{label: $L("Search"), command: 'cmd-Search'},
			{label: $L("Bookmarks..."), items: [
				{label: $L("Add Bookmark"), command: 'cmd-AddBookmarks'},
				{label: $L("Edit Bookmarks"), command: 'cmd-Bookmarks'}
				]},
			{label: $L("Quote Generator"), command: 'cmd-Dock'},
			{label: $L("Help..."), items: [
					{label: $L("12 Step Organizations"), command: 'cmd-Organizations'},
					{label: $L("Meetings"), command: 'cmd-Meetings'},
					{label: $L("Help & About"), command: 'cmd-HelpAbout'}
				 ]},
			{label: $L("Preferences"), command: 'cmd-Preferences'}
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
			{label: $L("Back to the book"), command: 'cmd-Return'}
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
try{
	/*******  List of chapters  *******/
	SBB = {};
	SBB.chapterList = [];
	SBB.chapterList.push({
		chapternumberlabel: "Forward",
		label: "Foreword",
		value: "1",
		shortname: "forward",
		firstpage: "foreword_pxiii_text",
		file: "01_foreword.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "The Doctor's Opinion",
		label: "The Doctor's Opinion",
		value: "2",
		shortname: "drsopinion",
		firstpage: "drsopinion_pxxiii_text",
		file: "02_drsopinion.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 1",
		label: "Bill's Story",
		value: "3",
		shortname: "billsstory",
		firstpage: "bill_p1_text",
		file: "03_billsstory.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 2",
		label: "There is a Solution",
		value: "4",
		shortname: "thereis",
		firstpage: "thereis_p17_text",
		file: "04_thereis.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 3",
		label: "More About Alcoholism",
		value: "5",
		shortname: "moreabout",
		firstpage: "moreabout_30p_text",
		file: "05_moreabout.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 4",
		label: "We Agnostics",
		value: "6",
		shortname: "weagnostics",
		firstpage: "weagnostics_p44_text",
		file: "06_weagnostics.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 5",
		label: "How It Works",
		value: "7",
		shortname: "howitworks",
		firstpage: "howitworks_p58_text",
		file: "07_howitworks.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 6",
		label: "Into Action",
		value: "8",
		shortname: "intoaction",
		firstpage: "intoaction_p72_text",
		file: "08_intoaction.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 7",
		label: "Working With Others",
		value: "9",
		shortname: "workingwithothers",
		firstpage: "working_p89_text",
		file: "09_workingwithothers.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 8",
		label: "To Wives",
		value: "10",
		shortname: "towives",
		firstpage: "towives_p104_text",
		file: "10_towives.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 9",
		label: "The Family Afterward",
		value: "11",
		shortname: "thefamily",
		firstpage: "thefamily_p122_text",
		file: "11_thefamily.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 10",
		label: "To Employers",
		value: "12",
		shortname: "toemployers",
		firstpage: "toemployers_p136_text",
		file: "12_toemployers.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Chapter 11",
		label: "A Vision for You",
		value: "13",
		shortname: "avisionforyou",
		firstpage: "avision_p151_text",
		file: "13_avisionforyou.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "Doctor Bob's Nightmare",
		label: "The Doctor's Nightmare",
		value: "14",
		shortname: "drsnightmare",
		firstpage: "drsnightmare_p171_text",
		file: "14_drsnightmare.html"
	});
	SBB.chapterList.push({
		chapternumberlabel: "II",
		label: "Spiritual Experience",
		value: "15",
		shortname: "spiritual",
		firstpage: "spiritual_p569_text",
		file: "15_spiritual.html"
	});
} catch (error) {Mojo.Log.error("STAGE CHAPTERS!", error);
};
