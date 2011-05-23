Mojo.Log.info("=======================  START  MAIN  =======================");
Mojo.Log.info(Mojo.Controller.appInfo.title, "-", Mojo.Controller.appInfo.version);

/*  SimpleBigBook Copyright (C) 2009  Rick Boatright, John Kiernan
 *
 *  This file is part of Simple Big Book.
 *
 *  Simple Big Book is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Simple Big Book is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Simple Big Book.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


var url;
var request;
var cmd = "";
searchBook = false;
searchPage = false;
search_string = false;
isPhrase = false;
highsearch = false;
wasHighSearch = false;
forceSelection = false;

function BookAssistant() {
	this.debugMe = false;

	this.dbName = "SBB_Bookmarks";
	this.dbVersion = "0.1";
	this.dbDisplayName = "Simple Big Book Bookmarks";
	this.dbSize = 200000;

	this.maxScreenHeight = Mojo.Environment.DeviceInfo.screenHeight;
	this.maxScreenWidth = Mojo.Environment.DeviceInfo.screenWidth;
	this.pageNumber = false;
	this.scroller = null;
	this.isVisible = true;
	this.ImThisBig = null;
	this.percentDown = null;
	this.DI = Mojo.Environment.DeviceInfo;
	this.firstResize = true;
	this.headerAdjustment = 56;	//88 //32 //78
	this.whichWay = null;
}

/********************
 *
 * SETUP
 *
 ********************/
BookAssistant.prototype.setup = function () {
	try{
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER SETUP @@");}

	this.bookFade = this.controller.get('book-fade');
	this.bookData = this.controller.get('bookdata');
	this.chapMenu = this.controller.get('chapMenu');
	this.pageMenu = this.controller.get('pageMenu');
	this.bookmarkMenu = this.controller.get('bookmarkMenu');
	this.hightlight = this.controller.get('highlight');
	
	//DI = Mojo.Environment.DeviceInfo;
	//Mojo.Log.info(DI.platformVersion, " -", DI.platformVersionDot, " -", DI.platformVersionMajor, " -", DI.platformVersionMinor);

	/*******  COOKIE SECTION  *******/
	////////////////////////////////////////////////////
	// Delete the ancient cookie
	try{
		obsoleteCookie = new Mojo.Model.Cookie("SimpleBigBook");
		obsoleteCookie.get();
		//if (obsoleteCookie !== "undefined") {
			//Mojo.Log.info("OBSOLETE IS HERE")
			obsoleteCookie.remove();
			obsoleteCookie = null;
		//}
	} catch (obsoletecookieerror) {Mojo.Log.error(">>>>> BookAssistant - OBSOLETE COOKIE CRUMBLED!", obsoletecookieerror);}
	////////////////////////////////////////////////////

	try {

	/*this.deleteprefs = new Mojo.Model.Cookie("SimpleBigBookv2");
	this.deleteprefs.remove();
	this.deleteprefs = null;*/

	////////////////////////////////////////////////////
	//  ****  Default model for preferences cookie
	this.prefsModel = {
		chapterNumber:0,
		cookieVersion: 2,
		daynight:'day',
		dockPhraseSpeed:30000,
		isFullScreen:false,
		pageNumber:0,
		pagePosition:false,
		screenSize:false,
		scrollingEffect:true,
		textsize:'18px',
		wasBookmarkJump:false,
		wasChapterJump:false
	};
	////////////////////////////////////////////////////

	this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
	prefstest = this.prefs.get();

	if (prefstest === undefined) {
		//Mojo.Log.info("NEW COOKIE!");
		this.prefs.put(this.prefsModel);
		this.prefsModel = this.prefs.get();
		prefstest = null;
	}
	else {
		//Mojo.Log.info("COOKIE ALREADY HERE!");
		this.prefsModel = this.prefs.get();
		//prefstest = null;
	//}

	try {

	if (this.prefs) {
			prefstest = this.prefs.get();
			//Mojo.Log.info("+++++", prefstest, "+", this.prefsModel, "|");
		if (prefstest) {
			if (this.debugMe===true) {Mojo.Log.info("+++++ Checking Old Prefs...");}

			if (prefstest.chapterNumber !== "undefined") {
				this.prefsModel.chapterNumber = prefstest.chapterNumber;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: chapterNumber", this.prefsModel.chapterNumber, "--", prefstest.chapterNumber);}
			}
			if (prefstest.daynight !== "undefined") {
				this.prefsModel.daynight = prefstest.daynight;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: daynight", this.prefsModel.daynight, "--", prefstest.daynight);}
			}
			if (prefstest.dockPhraseSpeed !== "undefined") {
				this.prefsModel.dockPhraseSpeed = prefstest.dockPhraseSpeed;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: dockPhraseSpeed", this.prefsModel.dockPhraseSpeed, "--", prefstest.dockPhraseSpeed);}
			}
			if (prefstest.isFullScreen !== "undefined") {
				this.prefsModel.isFullScreen = prefstest.isFullScreen;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: isFullScreen", this.prefsModel.isFullScreen, "--", prefstest.isFullScreen);}
			}
			if (prefstest.pageNumber !== "undefined") {
				this.prefsModel.pageNumber = prefstest.pageNumber;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: pageNumber", this.prefsModel.pageNumber, "--", prefstest.pageNumber);}
			}
			if (prefstest.pagePosition !== "undefined") {
				this.prefsModel.pagePosition = prefstest.pagePosition;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: pagePosition", this.prefsModel.pagePosition, "--", prefstest.pagePosition);}
			}
			if (prefstest.screenSize !== "undefined") {
				this.prefsModel.screenSize = prefstest.screenSize;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: screenSize", this.prefsModel.screenSize, "--", prefstest.screenSize);}
			}
			if (prefstest.scrollingEffect !== "undefined") {
				this.prefsModel.scrollingEffect = prefstest.scrollingEffect;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: scrollingEffect", this.prefsModel.scrollingEffect, "--", prefstest.scrollingEffect);}
			}
			if (prefstest.textsize !== "undefined") {
				this.prefsModel.textsize = prefstest.textsize;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: textsize", this.prefsModel.textsize, "--", prefstest.textsize);}
			}
			if (prefstest.wasBookmarkJump !== "undefined") {
				this.prefsModel.wasBookmarkJump = prefstest.wasBookmarkJump;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: wasBookmarkJump", this.prefsModel.wasBookmarkJump, "--", prefstest.wasBookmarkJump);}
			}
			if (prefstest.wasChapterJump !== "undefined") {
				this.prefsModel.wasChapterJump = prefstest.wasChapterJump;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: wasChapterJump", this.prefsModel.wasChapterJump, "--", prefstest.wasChapterJump);}
			}
		}
	}
	prefstest = null;
	} catch (prefstesterror) {Mojo.Log.error(">>>>> BookAssistant - COOKIE CRUMBLED!", prefstesterror);}
	}

	this.prefs.put(this.prefsModel);

	//this.prefsModel = this.prefs.get();
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: chapterNumber", this.prefsModel.chapterNumber);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: cookieVersion", this.prefsModel.cookieVersion);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: daynight", this.prefsModel.daynight);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: dockPhraseSpeed", this.prefsModel.dockPhraseSpeed);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: isFullScreen", this.prefsModel.isFullScreen);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: pageNumber", this.prefsModel.pageNumber);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: pagePosition", this.prefsModel.pagePosition);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: screenSize", this.prefsModel.screenSize);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: scrollingEffect", this.prefsModel.scrollingEffect);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: textsize", this.prefsModel.textsize);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: wasBookmarkJump", this.prefsModel.wasBookmarkJump);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS CHECK: wasChapterJump", this.prefsModel.wasChapterJump);}
	// END OF COOKIE SECTION**********************/

	} catch (cookieerror) {Mojo.Log.error(">>>>> BookAssistant - COOKIE CRUMBLED!", cookieerror);}


	////////////////////////////////////////////////////
	// Initial states
	//
	if ((this.prefsModel.screenSize === true) && (this.prefsModel.isFullScreen === true)) {
		this.doFullScreen('big');
	}
	else if ((this.prefsModel.screenSize === true) && (this.prefsModel.wasChapterJump === false)) {
		this.doFullScreen('big');
	}

	this.myIndex = this.prefsModel.chapterNumber;
	this.pageNumber = this.prefsModel.pageNumber;
	////////////////////////////////////////////////////


	////////////////////////////////////////////////////
	//  Make the chapter list model for the popup
	this.bookMenuModelItems = [];
	
	for (i = 0; i < SBB.chapterList.length; i++) {
		bookcmd = i;
		booklbl = SBB.chapterList[i].label;
		this.bookMenuModelItems.push({
			label: booklbl,
			command: bookcmd
		});
	}
	////////////////////////////////////////////////////


	////////////////////////////////////////////////////
	//  Setup Menus
	try{
		this.bookmarkMenu = this.controller.get('bookmarkMenu');
		this.chapMenu = this.controller.get('chapMenu');
		this.pageMenu = this.controller.get('pageMenu');
	
		Mojo.Event.listen(this.bookmarkMenu, Mojo.Event.tap, this.selectBookmark.bindAsEventListener(this, event));
		Mojo.Event.listen(this.chapMenu, Mojo.Event.tap, this.selectChapter.bindAsEventListener(this, event));
		Mojo.Event.listen(this.pageMenu, Mojo.Event.tap, this.selectPage.bindAsEventListener(this, event));

		this.chapMenu.innerHTML = SBB.chapterList[this.myIndex].label;
	} catch (menuserror) {Mojo.Log.error(">>>>> BookAssistant - setup menus ERROR", menuserror);}
	////////////////////////////////////////////////////


	////////////////////////////////////////////////////
	//  Setup for Application Menu
	if (this.DI.platformVersionMajor === 1) {
		this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.myMenuWithQuotesAttr, StageAssistant.myMenuWithQuotesModel);
	}
	else {
		this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.myMenuAttr, StageAssistant.myMenuModel);
	}
	////////////////////////////////////////////////////


	////////////////////////////////////////////////////
	//  Get the data via ajax request
	try {
		this.url = "books/" + SBB.chapterList[this.myIndex].file;

		if (this.debugMe===true) {Mojo.Log.info("book url", this.url);}

		this.request = new Ajax.Request(this.url, {
			method: "get",
			evalJSON: "force",
			onSuccess: this.getChapterSuccess.bind(this),
			onFailure: this.getChapterFailure.bind(this)
		});
	} catch (ajaxerror) {Mojo.Log.error(">>>>> BookAssistant - AJAX Error Opening File", ajaxerror);}
	////////////////////////////////////////////////////


	////////////////////////////////////////////////////
	//  Capture scroller movement and location
	this.wholeScreenScroller = this.controller.getSceneScroller();
	this.scrollWasStarted = this.scrollStarted.bind(this);
	////////////////////////////////////////////////////
	

	} catch (error) {Mojo.Log.error(">>>>> BookAssistant - setup ERROR", error);}
if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE SETUP @@");}
};

/********************
 *
 * ACTIVATE
 *
 ********************/
BookAssistant.prototype.activate = function (event) {
try {
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Activate @@");}

	if (this.controller.stageController.setWindowOrientation) {this.controller.stageController.setWindowOrientation("free");}

	this.controller.listen(this.wholeScreenScroller, Mojo.Event.scrollStarting, this.scrollWasStarted);

	this.resizeHandler = this.handleWindowResize.bindAsEventListener(this);
	this.controller.window.addEventListener('resize', this.resizeHandler, true);

	this.doubleClickHandler = this.doubleClick.bindAsEventListener(this);
	this.controller.document.addEventListener(Mojo.Event.tap, this.doubleClickHandler, true);

	//this.doubleClickHandler = this.doubleClick.bindAsEventListener(this);
	//Mojo.Event.listen(this.bookData, Mojo.Event.tap, this.doubleClickHandler);
	//this.bookData.addEventListener('tap', this.doubleClickHandler, true);

	this.appClosingHandler = this.appClosingRoutine.bindAsEventListener(this);
	window.document.addEventListener(Mojo.Event.deactivate, this.appClosingHandler, true);

	this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
	this.prefsModel = this.prefs.get();
	this.changeTextSize(this.prefsModel.textsize);


	////////////////////////////////////////////////////
	//  Make the bookmark model for the popup

	this.initialPopulate();
	//DatabaseWork.initialPopulate();
	////////////////////////////////////////////////////


	////////////////////////////////////////////////////
	//  Decide to only load or to do search/highlight too.
	if (this.debugMe===true) {Mojo.Log.info("activating book, about to jump to search");}
	highsearch = false;
	if (searchBook !== false) {
		//Mojo.Log.info("  *****  ACTIVE in IF", searchPage, highsearch, searchBook);
		setTimeout(function () {
			this.jumpToChapter(searchBook);
			searchBook = false;
		}.bind(this), 150);
	} 
	else {
		//Mojo.Log.info("  *****  ACTIVE in ELSE", searchPage, highsearch, searchBook);
		if (searchPage !== false) {
			setTimeout(function () {
				this.jumpToPage(searchPage);
				searchPage = false;
			}.bind(this), 150);
		}
	}
	////////////////////////////////////////////////////

	} catch (error) {Mojo.Log.error(">>>>> BookAssistant - ACTIVATE ERROR", error);}
if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Activate @@");}
};


/********************
 *
 * DEACTIVATE
 *
 ********************/
BookAssistant.prototype.deactivate = function (event) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Deactivate @@");}

	this.controller.stopListening(this.wholeScreenScroller, Mojo.Event.scrollStarting, this.scrollWasStarted);
	//this.controller.getSceneScroller().removeEventListener(Mojo.Event.scrollStarting, this.doubleClickHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);
	this.bookData.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Deactivate @@");}
};


/********************
 *
 * CLEANUP
 *
 ********************/
BookAssistant.prototype.cleanup = function (event) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Cleanup @@");}

	this.controller.stopListening(this.wholeScreenScroller, Mojo.Event.scrollStarting, this.scrollWasStarted);
	//this.controller.getSceneScroller().removeEventListener(Mojo.Event.scrollStarting, this.doubleClickHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);
	this.bookData.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Cleanup @@");}
};


/********************
 *
 * BEFORE APP CLOSE
 *
 ********************/
BookAssistant.prototype.appClosingRoutine = function(event) {
try {
	if (this.debugMe===true) {Mojo.Log.info("~+~+~+~+~+~+~  BLUR  ~+~+~+~+~+~+~");}
	if (this.debugMe===true) {Mojo.Log.info("@@ APP CLOSING - this.prefsModel.pagePosition", this.prefsModel.pagePosition);}

	if ( (this.prefsModel.wasChapterJump !== true) && (this.prefsModel.wasBookmarkJump === false) ){
		this.prefsModel.pagePosition = this.ImHere.y;
		this.prefsModel.wasChapterJump = false;
		this.prefsModel.wasBookmarkJump = false;
		this.prefs.put(this.prefsModel);
		if (this.debugMe===true) {Mojo.Log.info("@@ APP CLOSING NOT JUMP - this.prefsModel.pagePosition", this.prefsModel.pagePosition, "this.prefsModel.wasChapterJump", this.prefsModel.wasChapterJump);}
	}

	if (this.debugMe===true) {Mojo.Log.info("@@ APP CLOSING -", this.ImHere.y, "-- this.prefsModel.pagePosition", this.prefsModel.pagePosition);}

} catch (error) {Mojo.Log.error(">>>>> BookAssistant - appClosingRoutine ERROR: ", error);}
};


/********************
 *
 * HANDLE COMMAND
 *
 ********************/
BookAssistant.prototype.handleCommand = function(event) {
	//Mojo.Log.info("BookAssistant - handleCommand:", event.command);
	switch (event.command) {
		case 'cmd-AddBookmarks':
			this.addBookmark(event);
			break;
	}
};


/********************
* SCROLL POSITION CAPTURING
* scrollStarted - calls the moved method repeadlly
* moved - callbackfunction for moved method (gets current position while on the move and stores it when stopped)
********************/
BookAssistant.prototype.scrollStarted = function(event){
	event.scroller.addListener(this);
};

BookAssistant.prototype.moved = function(scrollEnding, position){
	if (scrollEnding) {
		this.ImHere = position;
		this.ImThisBig = this.bookData.clientHeight;
		this.percentDown = ((0 - this.ImHere.y) / this.ImThisBig);
		if (this.debugMe===true) {Mojo.Log.info("scrollStarted - this.ImHere", this.ImHere.y, "this.ImThisBig", this.ImThisBig, "this.percentDown:", this.percentDown);}

		this.prefsModel.wasBookmarkJump = false;
		this.prefs.put(this.prefsModel);


		this.tableCount = document.getElementsByTagName("table");
		//Mojo.Log.info("=== this.tableCount:", this.tableCount.length, "-", this.maxScreenHeight);
		for (i = 0; i < this.tableCount.length; i++) {

			var humanOffset = (this.maxScreenHeight * 0.4);
			var lcId = document.getElementsByTagName("table").item(i).id;
			var shortName = lcId.substring(0, lcId.indexOf("_"));
			var thisPage = (humanOffset - document.getElementsByTagName("table").item(i).offsetTop);
			var prettylabel = "";

			if((i + 1) < this.tableCount.length) {
				var nextPage = (humanOffset - document.getElementsByTagName("table").item(i+1).offsetTop);

				if ( (this.ImHere.y < thisPage) && (this.ImHere.y > nextPage) ) {
					for (c = 0; c < SBB.chapterList.length; c++) {
						if (shortName === SBB.chapterList[c].shortname) {
							prettylabel = SBB.chapterList[c].label;
						}
					}

					//Mojo.Log.info("======== IF - You're reading:", lcId, "+", shortName, "+", prettylabel, "-", lcId, this.ImHere.y, "+", this.percentDown);
					this.pageNumber = lcId;
					this.prefsModel.pageNumber = lcId;
					//UGLY, but works!!
					break;
				}
			}
			else {
				//Mojo.Log.info("======== ELSE - You're reading:", lcId, "+", shortName, "+", prettylabel, "-", lcId, "+", this.ImHere.y, "+", this.percentDown);
				this.pageNumber = lcId;
				this.prefsModel.pageNumber = lcId;
			}
		}
	}
};


/********************
 *
 * HANDLE RESIZE
 *
 ********************/
BookAssistant.prototype.handleWindowResize = function(event){
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER RESIZE @@");}

	if (this.prefsModel.wasBookmarkJump === false) {
		this.NewThisBig = this.bookData.clientHeight;
		this.wasResized = true;
	}
	
	//this.prefsModel.wasBookmarkJump = false;
	//this.prefs.put(this.prefsModel);

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE RESIZE @@");}
};


/********************
 *
 * ORIENTATION CHANGE
 *
 ********************/
BookAssistant.prototype.orientationChanged = function (orientation) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Orientation Changed @@");}

	this.whichWay = this.controller.stageController.getWindowOrientation();

	if ((this.prefsModel.wasChapterJump === false) && (this.wasResized === true)) {
		this.goHere = Math.floor((0 - (this.NewThisBig * this.percentDown)));
		this.controller.getSceneScroller().mojo.scrollTo(0, this.goHere, false, false);
		this.wasResized = false;
	}

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Orientation Changed @@");}
};


/********************
 *
 * INITIAL POPULATE
 *
 ********************/
BookAssistant.prototype.initialPopulate = function(transaction, results){

	this.bookmarkMenuModelItems = [];

	if (!SBB.db) {
		SBB.db = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);
	}

	SBB.db.transaction(
		function (transaction) {
			transaction.executeSql(
				"SELECT * FROM 'SBB_Bookmarks_Table'",
				[],
				this.displayList.bind(this),
				this.createMyTable.bind(this)
			);
		}.bind(this)
	);
};


/********************
 *
 * SELECT CHAPTER
 *
 ********************/
BookAssistant.prototype.selectChapter = function (event) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER SELECTBOOK @@");}

	this.controller.popupSubmenu({
		onChoose: this.jumpToChapter.bind(this),
		placeNear: this.chapMenu,
		items: this.bookMenuModelItems
	});

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE SELECTBOOK @@");}
};


/********************
 *
 * JUMP TO CHAPTER
 *
 * Called by selectChapter() to swap the scene to a new book scene with the selected book
 *
 ********************/
BookAssistant.prototype.jumpToChapter = function (newindex) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Jump to Book @@");}

	/////////////////////////////////////////////////////////////
	//Need to KilllClick here or really ugly loop happens
	this.killlClick();

	//Mojo.Log.info("jumpToChapter - newindex:", newindex);
	
	/////////////////////////////////////////////////////////////
	//
	if (newindex) {
		//this.prefsModel = this.prefs.get();
		this.myIndex = newindex;
		this.prefsModel.chapterNumber = this.myIndex;
		this.prefsModel.pageNumber = 0;
		this.prefsModel.wasChapterJump = true;
		this.prefs.put(this.prefsModel);
		Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade,name: 'book'});
	}
	if (this.debugMe===true) {Mojo.Log.info("---- BOOK JUMP:", this.pageNumber, "BOOK:", this.myIndex, "CMDSTR:", cmdStr);}

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Jump to Book @@");}
};


/********************
 *
 * GET CHAPTER SUCCESS
 *
 ********************/
BookAssistant.prototype.getChapterSuccess = function (transport) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER getChapterSuccess @@");}
try {

	////////////////////////////////////////
	// Put the response into the scene
	if (search_string !== false) {
		var temp = transport.transport.responseText;
		this.highlightSearchTerms(search_string, temp);
	}
	else {
		this.bookData.innerHTML = transport.transport.responseText;
	}


	////////////////////////////////////////////////////
	// Scroll to the exact last location in a page!
	if (this.prefsModel.wasChapterJump === false) {
		if (this.debugMe===true) {Mojo.Log.info("~_~_~_~_~_~_~_~  FALSE - this.prefsModel.pagePosition", this.prefsModel.pagePosition, this.prefsModel.scrollingEffect);}

		if (this.prefsModel.wasBookmarkJump === true) {
			//this.prefsModel.pagePosition = Math.floor((0 - (this.prefsModel.pagePosition * this.bookData.clientHeight)));
			this.prefsModel.pagePosition = (0 - (this.prefsModel.pagePosition * this.bookData.clientHeight));
			//Mojo.Log.info(this.prefsModel.pagePosition, "+", this.bookData.clientHeight, "+", ( 0 - (this.prefsModel.pagePosition * this.bookData.clientHeight)));
		}

		this.controller.getSceneScroller().mojo.scrollTo(0, this.prefsModel.pagePosition, this.prefsModel.scrollingEffect, false);
		this.prefsModel.pagePosition = 0;
		this.prefsModel.wasChapterJump = false;
		//this.prefsModel.wasBookmarkJump = false;
		this.prefs.put(this.prefsModel);
	}
	else if (this.prefsModel.wasChapterJump === true) {
		if (this.debugMe===true) {Mojo.Log.info("~_~_~_~_~_~_~_~  TRUE - this.prefsModel.pagePosition", this.prefsModel.pagePosition, this.prefsModel.scrollingEffect);}
		this.controller.getSceneScroller().mojo.scrollTo(0, 0, this.prefsModel.scrollingEffect, false);
		this.prefsModel.pagePosition = 0;
		this.prefsModel.wasChapterJump = false;
		this.prefsModel.wasBookmarkJump = false;
		this.prefs.put(this.prefsModel);
	}
	else {
		if (this.debugMe===true) {Mojo.Log.info("~_~_~_~_~_~_~_~  ELSE - this.prefsModel.pagePosition", this.prefsModel.pagePosition, this.prefsModel.scrollingEffect);}
		this.prefsModel.pagePosition = 0;
		this.prefsModel.wasChapterJump = false;
		this.prefsModel.wasBookmarkJump = false;
		this.prefs.put(this.prefsModel);
	}


	//////////////////////////////////
	// Build the new chapterMenuModel (page numbers)
	this.pagenumberMenuModelItems = [];

	this.tableCount = document.getElementsByTagName("table");

	for (i = 0; i < this.tableCount.length; i++) {
		lcId = document.getElementsByTagName("table").item(i).id;
		lcName = lcId.substr(lcId.indexOf("_p") + 2);

		// Filter out "_top" for display in the popup menu.
		if (lcName.indexOf('_top') >= 0) {
			lcName = lcName.replace('_top', '');
		}

		labelStr = "Page " + lcName;
		cmdStr = lcId;
		this.pagenumberMenuModelItems.push({
			label: labelStr,
			command: cmdStr
		});
	}

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE getChapterSuccess @@");}
} catch (error) {Mojo.Log.error(">>>>> BookAssistant - getChapterSuccess ERROR: ", error);}
};


/********************
 *
 * GET CHAPTER FAILURE
 *
 ********************/
BookAssistant.prototype.getChapterFailure = function (transport) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Get Book Failure @@");}

	this.bookData.innerHTML = "Problem getting the file!";

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Get Book Failure @@");}
};


/********************
 *
 * SELECT PAGE
 *
 ********************/
BookAssistant.prototype.selectPage = function (event) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Select Chapter @@");}
//Mojo.Log.info("@@ ENTER Select Chapter @@");

	this.controller.popupSubmenu({
		onChoose: this.jumpToPage.bind(this),
		placeNear: this.pageMenu,
		items: this.pagenumberMenuModelItems
	});

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Select Chapter @@");}
};


/********************
 *
 * JUMP TO PAGE
 *
 ********************/
BookAssistant.prototype.jumpToPage = function (pgnum) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Jump to Page @@");}

var jumpto = "";

	if (pgnum) {
		this.pageNumber = pgnum;
		
		if (highsearch === false) {
			jumpto = pgnum;
			wasHighSearch = false;
		} else {
			jumpto = highsearch;
			highsearch = false;
			wasHighSearch = true;
		}

		////////////////////////////////////////////////////////////////
		// This moves it up *unless* it's the 1st page in a chapter.
		// Good Stuff!
		this.controller.getSceneScroller().mojo.revealElement(jumpto);
		var ImHere = this.controller.getSceneScroller().mojo.getScrollPosition();


		if ((ImHere.top < 0) && (this.prefsModel.wasChapterJump === false)) {
			this.controller.getSceneScroller().mojo.scrollTo(0, (ImHere.top - (window.innerHeight - this.headerAdjustment)), this.prefsModel.scrollingEffect, false);
			wasHighSearch = false;
		}
		else {
			wasHighSearch = false;
		}

		if (this.debugMe===true) {Mojo.Log.info("++++++++++++++++++ ImHere X:", ImHere.top, "ImHere Y:", ImHere.left);}

		//this.prefsModel = this.prefs.get();
		this.prefsModel.chapterNumber = this.myIndex;
		this.prefsModel.pageNumber = this.pageNumber;
		this.prefs.put(this.prefsModel);
	}

	if (this.debugMe===true) {Mojo.Log.info("---- CHAPTER:", pgnum, "BOOK:", this.myIndex);}

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Jump to Page @@");}
};


/********************
 *
 * SELECT BOOKMARK
 *
 ********************/
BookAssistant.prototype.selectBookmark = function(event) {
try {
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER selectBookmark");}

	this.controller.popupSubmenu({
		onChoose: this.readBookmark.bind(this),
		placeNear: this.bookmarkMenu,
		items: this.bookmarkMenuModelItems
	});

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE selectBookmark");}
} catch (error) {Mojo.Log.error(">>>>> BookAssistant - selectBookmark ERROR", error);}
};


/********************
 *
 * READ BOOKMARK
 *
 ********************/
BookAssistant.prototype.readBookmark = function(event) {
try {
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER readBookmark");}

	if (event){
		if (event !== 'addBookmark') {
			this.theBookmark = event;

			var sqlbm = "SELECT * FROM 'SBB_Bookmarks_Table' WHERE ID = " + this.theBookmark;
	
			SBB.db.transaction(function (transaction) {

			transaction.executeSql(
				sqlbm,
				[], 
				this.jumpToBookmark.bind(this),
				this.dbErrorHandler.bind(this));
			}.bind(this));
		}
	}
	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE readBookmark");}
} catch (error) {Mojo.Log.error(">>>>> BookAssistant - readBookmark ERROR:", error);}
};


/********************
 *
 * JUMP TO BOOKMARK
 *
 ********************/
BookAssistant.prototype.jumpToBookmark = function(transaction, results) {
try {
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER jumpToBookmark");}

	for (i = 0; i < results.rows.length; i++) {
		row = results.rows.item(i);
		this.bmid = row.id;
		this.bmcn = row.chapterNumber;
		this.bmpn = row.pageNumber;
		this.bmpp = row.pagePosition;
	}

	//Mojo.Log.info("jumpToBookmark - results THIS:", this.bmid, "+", this.bmcn, "+", this.bmpn, "+", this.bmpp);

	/////////////////////////////////////////////////////////////
	//Need to KilllClick here or really ugly loop happens
	this.killlClick();

	this.prefsModel.chapterNumber = this.bmcn;
	this.prefsModel.pageNumber = this.bmpn;
	this.prefsModel.pagePosition = this.bmpp;
	this.prefsModel.wasChapterJump = false;
	this.prefsModel.wasBookmarkJump = true;
	this.prefs.put(this.prefsModel);
	Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade,name: 'book'});

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE jumpToBookmark");}
} catch (error) {Mojo.Log.error(">>>>> BookAssistant - jumpToBookmark ERROR:", error);}
};


/********************
 *
 * CHANGE TEXT SIZE
 *
 ********************/
BookAssistant.prototype.changeTextSize = function (size) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Change Text Size @@", size);}

	this.bookData.style.fontSize = size;

	////////////////////////////////////////////////////
	//  ****  Set the color theme while I'm here
	switch (this.prefsModel.daynight){
		case 'day':
			this.controller.document.body.className = 'main';
			this.bookFade.className = 'scene-fade my-fade-day top';
			//this.bookFade.removeClassName('my-fade-night');
			//this.bookFade.addClassName('my-fade-day');
			//Mojo.Log.info(" +++ this.prefsModel.daynight:", this.prefsModel.daynight, "+", this.bookFade.style.top);
			break;
		case 'night':
			this.controller.document.body.className = 'palm-dark';
			this.bookFade.className = 'scene-fade my-fade-night top';
			//this.bookFade.removeClassName('my-fade-day');
			//this.bookFade.addClassName('my-fade-night');
			//Mojo.Log.info(" +++ this.prefsModel.daynight:", this.prefsModel.daynight, "+", this.bookFade.style.top);
			break;
	}
	////////////////////////////////////////////////////

if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Change Text Size @@", size);}
};


/*
 * This is sort of a wrapper function to the doHighlight function.
 * It takes the searchText that you pass, optionally splits it into
 * separate words, and transforms the text on the current web page.
 * Only the "searchText" parameter is required; all other parameters
 * are optional and can be omitted.
 */


/********************
 *
 * HIGHLIGHT SEARCH TERMS
 *
 ********************/
BookAssistant.prototype.highlightSearchTerms = function (searchText, sentbodyText) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Do Highlight Search Terms @@");}

/*
 * if the treatAsPhrase parameter is true, then we should search for
 * the entire phrase that was entered; otherwise, we will split the
 * search string so that each word is searched for and highlighted
 * individually
 */

	if (isPhrase) {
		searchArray = [searchText];
	} 
	else {
		searchArray = searchText.split(" ");
	}

	var bodyText = sentbodyText;

	for (i = 0; i < searchArray.length; i++) {
		bodyText = this.doHighlight(bodyText, searchArray[i]);
	}

	this.bookData.innerHTML = bodyText;
	search_string = false;
	isPhrase = false;
	highsearch = this.highlight;

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Do Highlight Search Terms @@");}

	return true;
};


/********************
 *
 * DO HIGHLIGHT
 *
 ********************/
BookAssistant.prototype.doHighlight = function (bodyText, searchTerm) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Do Highlight @@");}
try {
	highlightStartTag = "<span id='highlight' class='searchHighlight'>";
	highlightEndTag = "</span>";

	/*
	 * find all occurrences of the search term in the given text,
	 * and add some "highlight" tags to them (we're not using a
	 * regular expression search, because we want to filter out
	 * matches that occur within HTML tags and script blocks, so
	 * we have to do a little extra validation)
	 */

	var newText = "";
	var i = -1;
	var lcSearchTerm = searchTerm.toLowerCase();
	var lcBodyText = bodyText.toLowerCase();

	while (bodyText.length > 0) {
		i = lcBodyText.indexOf(lcSearchTerm, i + 1);
		if (i < 0) {
			newText += bodyText;
			bodyText = "";
		} else {
			// skip anything inside an HTML tag
			if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
				// skip anything inside a <script> block
				if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
					newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, searchTerm.length) + highlightEndTag;
					bodyText = bodyText.substr(i + searchTerm.length);
					lcBodyText = bodyText.toLowerCase();
					i = -1;
				}
			}
		}
	}

	if (this.debugMe===true) {Mojo.Log.info("@@ Leave Do Highlight @@");}

	return newText;
} catch (error) {Mojo.Log.error(">>>>> BookAssistant - doHightlight ERROR:", error);}
};


/********************
 *
 * DOUBLE CLICK
 *
 ********************/
BookAssistant.prototype.doubleClick = function (event) {
try {

	//////////////////////////////////
	// Detect single tap vs double tap
	if (this.whichWay === 'up') {
		if (this.click === 1) {
			//DOUBLE
			this.doFullScreen(false);
			this.click = 0;
		} else {
			//SINGLE
			this.click = 1;
			this.clickInterval = this.controller.window.setInterval(this.killlClick.bind(this), 450);
		}
	}

} catch (error) {Mojo.Log.error(">>>>> BookAssistant - doubleClick ERROR:", error);}
};


/********************
 *
 * KILL CLICK
 *
 ********************/
BookAssistant.prototype.killlClick = function () {
try {
	//////////////////////////////////
	// Clear if only single tap
	this.click = 0;
	this.controller.window.clearInterval(this.clickInterval);
	this.clickInterval = null;

} catch (error) {Mojo.Log.error("KilllClick", error);}
};


/********************
 *
 * DO FULLSCREEN
 *
 ********************/
BookAssistant.prototype.doFullScreen = function(forceSelection, event) {
	////////////////////////////////////////
	// Do full screen detection / work

	if (this.debugMe===true) {Mojo.Log.info("---------------- FULL SCREEN -", forceSelection, "--", event);}

	if (forceSelection) {
		switch (forceSelection) {
			case 'big':
				if (this.debugMe===true) {Mojo.Log.info("---------------- FULL SCREEN -", forceSelection, "--", event);}
				//this.prefsModel = this.prefs.get();
				this.controller.enableFullScreenMode(true);
				this.windowHeight = this.controller.window.innerHeight;
				this.prefsModel.isFullScreen = true;
				this.prefs.put(this.prefsModel);
				forceSelection = false;
				break;
			case 'small':
				if (this.debugMe===true) {Mojo.Log.info("---------------- FULL SCREEN -", forceSelection, "--", event);}
				//this.prefsModel = this.prefs.get();
				this.controller.enableFullScreenMode(false);
				this.windowHeight = this.controller.window.innerHeight;
				this.prefsModel.isFullScreen = false;
				this.prefs.put(this.prefsModel);
				forceSelection = false;
				break;
		}
	}
	else if (forceSelection === false) {
		if (this.windowHeight !== this.maxScreenHeight) {
			if (this.debugMe===true) {Mojo.Log.info("---------------- FULL SCREEN -", forceSelection, "--", event);}
			//this.prefsModel = this.prefs.get();
			this.controller.enableFullScreenMode(true);
			this.windowHeight = this.controller.window.innerHeight;
			this.prefsModel.isFullScreen = true;
			this.prefs.put(this.prefsModel);
		}
		else if (this.windowHeight === this.maxScreenHeight) {
			if (this.debugMe===true) {Mojo.Log.info("---------------- FULL SCREEN -", forceSelection, "--", event);}
			//this.prefsModel = this.prefs.get();
			this.controller.enableFullScreenMode(false);
			this.windowHeight = this.controller.window.innerHeight;
			this.prefsModel.isFullScreen = false;
			this.prefs.put(this.prefsModel);
		}
	}
	else {
		Mojo.Log.error("doFullScreen - HIT ELSE - You should never see this.");
	}
};


/********************
 *
 * DISPLAY LIST
 *
 ********************/
BookAssistant.prototype.displayList = function (transaction, results) {
try{

	if (results.rows.length === 0) {
		//Mojo.Log.info("results.rows.length", results.rows.length);
		this.writeDefaults(transaction, results);
	}

	this.bookmarkMenuModelItems = [];

	if (results.rows.length > 0) {
		for (i = 0; i < results.rows.length; i++) {
		try{
			row = results.rows.item(i);
			pn = row.pageNumber.substr(row.pageNumber.indexOf("_p") + 2);

			if (pn.indexOf('_top') >= 0) {pn = pn.replace('_top', '');}

			//var prettylabel = SBB.chapterList[row.chapterNumber].label + ', Page ' + pn;
			var prettylabel = 'p' + pn + ', ' + SBB.chapterList[row.chapterNumber].label;
			buildrow = {label: prettylabel, command: row.id};

			this.bookmarkMenuModelItems.push(buildrow);

		} catch (buildrowerror) {Mojo.Log.error(">>>>> BookAssistant - results.rows ERROR:", buildrowerror);}
		}
	}
	else {
		Mojo.Log.warning("--- displayList: ZOOT!");
	}

} catch (error) {Mojo.Log.error(">>>>> BookAssistant - displayList ERROR:", error);}
};


/********************
 *
 * CREATE MY TABLE
 *
 ********************/
BookAssistant.prototype.createMyTable = function(){ try { if (this.debugMe===true) {Mojo.Log.info("@@ ENTER createMyTable @@");}

	SBB.db = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);

	SBB.db.transaction(
		function (transaction) {
			transaction.executeSql(
				"CREATE TABLE IF NOT EXISTS 'SBB_Bookmarks_Table' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, chapterNumber INTEGER, pageNumber TEXT, pagePosition INTEGER)",
				[],
				this.writeDefaults.bind(this),
				this.dbErrorHandler.bind(this)
			);
		}.bind(this)
	);

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE createMyTable @@");}
} catch (error) {Mojo.Log.error("createMyTable ERROR", error);}
};


/********************
 *
 * WRITE DEFAULTS
 *
 ********************/
BookAssistant.prototype.writeDefaults = function(transaction, results) {
try {
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER writeDefaults @@");}

	if (results.rows.length === 0) {

		Mojo.Log.info("******* BLANK DB!");

		SBB.defaultEntries = [];
		//SBB.defaultEntries[0] = {chapterNumber: '6', pageNumber: 'howitworks_p59', pagePosition:'-1026'};
		//SBB.defaultEntries[1] = {chapterNumber: '12', pageNumber: 'avision_p164',  pagePosition:'-12890'};
		SBB.defaultEntries[0] = {chapterNumber: '6', pageNumber: 'howitworks_p59', pagePosition:'0.07853283616163154'};
		SBB.defaultEntries[1] = {chapterNumber: '12', pageNumber: 'avision_p164',  pagePosition:'0.9553167839940718'};

		SBB.db.transaction(
			function(transaction) {
				for (i = 0; i < SBB.defaultEntries.length; i++) {
					transaction.executeSql(
					"INSERT INTO 'SBB_Bookmarks_Table' (chapterNumber, pageNumber, pagePosition) VALUES (?, ?, ?)",
					[SBB.defaultEntries[i].chapterNumber, SBB.defaultEntries[i].pageNumber, SBB.defaultEntries[i].pagePosition],
					this.dbSuccessHandler.bind(this),
					this.dbErrorHandler.bind(this)
					);
				}
			}.bind(this)
		);
	}

	this.initialPopulate();

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE writeDefaults @@");}
} catch (error) {Mojo.Log.error(">>>>> BookAssistant - writeDefaults ERROR", error);}
};


/********************
 *
 * ADD BOOKMARK
 *
 ********************/
BookAssistant.prototype.addBookmark = function(transaction, results){
//this.percentDown
//this.ImHere.y
Mojo.Log.info(this.percentDown, "+", this.ImHere.y);
	SBB.db.transaction(
		function(transaction) {
			transaction.executeSql(
				"INSERT INTO 'SBB_Bookmarks_Table' (chapterNumber, pageNumber, pagePosition) VALUES (?, ?, ?)",
				[this.myIndex, this.pageNumber, this.percentDown],
				//this.dbSuccessHandler.bind(this),
				function (transaction, results) {
					var newBP = this.pageNumber.substr(this.pageNumber.indexOf("_p") + 2);
					if (newBP.indexOf('_top') >= 0) {newBP = newBP.replace('_top', '');}
					Mojo.Controller.getAppController().showBanner("Added bookmark to page " + newBP,{source: 'notification'});
					this.initialPopulate();
				}.bind(this),
				this.dbErrorHandler.bind(this)
			);
		}.bind(this)
	);
};


/********************
 *
 * DB RESPONSES
 *
 ********************/
BookAssistant.prototype.dbSuccessHandler = function(transaction, results){
	Mojo.Log.info(">>>>> BookAssistant - dbSuccessHandler", Object.toJSON(transaction), " -", Object.toJSON(results));
	this.initialPopulate();
};
BookAssistant.prototype.dbErrorHandler = function(transaction, errors){
	Mojo.Log.error(">>>>> BookAssistant - dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
};
