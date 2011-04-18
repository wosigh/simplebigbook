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

	this.maxScreenHeight = Mojo.Environment.DeviceInfo.screenHeight;
	this.maxScreenWidth = Mojo.Environment.DeviceInfo.screenWidth;
	this.pageNumber = false;
	this.scroller = undefined;
	this.isVisible = true;
	//this.ImHere = undefined;
	this.ImThisBig = undefined;
	this.percentDown = undefined;
	this.DI = Mojo.Environment.DeviceInfo;
	this.firstResize = true;
	this.headerAdjustment = 56 
	//88 //32 //78


}

BookAssistant.prototype.handleCommand = function(event) {};

/********************
 *
 * SETUP
 *
 ********************/
BookAssistant.prototype.setup = function () {
	try{
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER SETUP @@");}

	//DI = Mojo.Environment.DeviceInfo;
	//Mojo.Log.info(DI.platformVersion, " -", DI.platformVersionDot, " -", DI.platformVersionMajor, " -", DI.platformVersionMinor);

	/*******  COOKIE SECTION  *******/
	this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");

	//  ****  Default model for preferences cookie
	this.prefsModel = {
		textsize: '18px',
		chapterNumber: 0,
		pageNumber: 0,
		screenSize: false,
		isFullScreen: false,
		pagePosition: false,
		wasChapterJump: false,
		scrollingEffect: true,
		dockPhraseSpeed: 30000,
		daynight: 'day'
	};

	/*if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: textsize", this.prefsModel.textsize);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: chapterNumber", this.prefsModel.chapterNumber);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: pageNumber", this.prefsModel.pageNumber);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: screenSize", this.prefsModel.screenSize);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: isFullScreen", this.prefsModel.isFullScreen);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: pagePosition", this.prefsModel.pagePosition);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: wasChapterJump", this.prefsModel.wasChapterJump);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: scrollingEffect", this.prefsModel.scrollingEffect);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: dockPhraseSpeed", this.prefsModel.dockPhraseSpeed);}
	if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS DEFAULTS: daynight", this.prefsModel.daynight);}*/

	// Get the preferences from cookie
	try {
	if (this.prefs) {
			var oldprefs = this.prefs.get();
		if (oldprefs) {
			if (this.debugMe===true) {Mojo.Log.info("+++++ Checking Old Prefs...");}

			if (oldprefs.textsize !== 'undefined') {
				this.prefsModel.textsize = oldprefs.textsize;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: textsize", this.prefsModel.textsize, "--", oldprefs.textsize);}
			}
			if (oldprefs.chapterNumber !== 'undefined') {
				this.prefsModel.chapterNumber = oldprefs.chapterNumber;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: chapterNumber", this.prefsModel.chapterNumber, "--", oldprefs.chapterNumber);}
			}
			if (oldprefs.pageNumber !== 'undefined') {
				this.prefsModel.pageNumber = oldprefs.pageNumber;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: pageNumber", this.prefsModel.pageNumber, "--", oldprefs.pageNumber);}
			}
			if (oldprefs.pagePosition !== 'undefined') {
				this.prefsModel.pagePosition = oldprefs.pagePosition;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: pagePosition", this.prefsModel.pagePosition, "--", oldprefs.pagePosition);}
			}
			if (oldprefs.screenSize !== 'undefined') {
				this.prefsModel.screenSize = oldprefs.screenSize;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: screenSize", this.prefsModel.screenSize, "--", oldprefs.screenSize);}
			}
			if (oldprefs.isFullScreen !== 'undefined') {
				this.prefsModel.isFullScreen = oldprefs.isFullScreen;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: isFullScreen", this.prefsModel.isFullScreen, "--", oldprefs.isFullScreen);}
			}
			if (oldprefs.wasChapterJump !== 'undefined') {
				this.prefsModel.wasChapterJump = oldprefs.wasChapterJump;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: wasChapterJump", this.prefsModel.wasChapterJump, "--", oldprefs.wasChapterJump);}
			}
			if (oldprefs.scrollingEffect !== 'undefined') {
				this.prefsModel.scrollingEffect = oldprefs.scrollingEffect;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: scrollingEffect", this.prefsModel.scrollingEffect, "--", oldprefs.scrollingEffect);}
			}
			if (oldprefs.dockPhraseSpeed !== 'undefined') {
				this.prefsModel.dockPhraseSpeed = oldprefs.dockPhraseSpeed;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: dockPhraseSpeed", this.prefsModel.dockPhraseSpeed, "--", oldprefs.dockPhraseSpeed);}
			}
			if (oldprefs.daynight !== 'undefined') {
				this.prefsModel.daynight = oldprefs.daynight;
				if (this.debugMe===true) {Mojo.Log.info("+++++ PREFS: daynight", this.prefsModel.daynight, "--", oldprefs.daynight);}
			}
		}

		this.prefs.put(this.prefsModel);

		////////////////////////////////
		// Should I be Full Screen?
		//
		if ((this.prefsModel.screenSize === true) && (this.prefsModel.isFullScreen === true)) {
			this.doFullScreen('big');
		}
		else if ((this.prefsModel.screenSize === true) && (this.prefsModel.wasChapterJump === false)) {
			this.doFullScreen('big');
		}
	}

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
	// END OF COOKIE SECTION**********************/


	this.myIndex = this.prefsModel.chapterNumber;
	this.pageNumber = this.prefsModel.pageNumber;

	} catch (error) {Mojo.Log.error("COOKIE CRUMBLED!", error);}


	////////////////////////////////////////////////////
	//  ****  Make the chapter list model for the popup
	this.bookMenuModelItems = [];
	
	for (i = 0; i < SimpleBigBook.chapterList.length; i++) {
		bookcmd = i;
		booklbl = SimpleBigBook.chapterList[i].label;
		this.bookMenuModelItems.push({
			label: booklbl,
			command: bookcmd
		});
	}
	////////////////////////////////////////////////////


	////////////////////////////////////////////////////
	//  ****  Setup Menus ****
	this.chapMenu = this.controller.get('chapMenu');
	this.pageMenu = this.controller.get('pageMenu');
	
	Mojo.Event.listen(this.chapMenu, Mojo.Event.tap, this.selectBook.bindAsEventListener(this, event));
	Mojo.Event.listen(this.pageMenu, Mojo.Event.tap, this.selectChapter.bindAsEventListener(this, event));

	this.chapMenu.innerHTML = SimpleBigBook.chapterList[this.myIndex].label;
	////////////////////////////////////////////////////


	////////////////////////////////////////////////////
	//  ****  Setup for Application Menu
	if (this.DI.platformVersionMajor === 1) {
		this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.myMenuWithQuotesAttr, StageAssistant.myMenuWithQuotesModel);
	}
	else {
		this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.myMenuAttr, StageAssistant.myMenuModel);
	}
	////////////////////////////////////////////////////


	////////////////////////////////////////////////////
	//  ****  Get the data via ajax request
	try {
		this.url = "books/" + SimpleBigBook.chapterList[this.myIndex].file;

		if (this.debugMe===true) {Mojo.Log.info("book url", this.url);}

		this.request = new Ajax.Request(this.url, {
			method: "get",
			evalJSON: "force",
			onSuccess: this.getBookSuccess.bind(this),
			onFailure: this.getBookFailure.bind(this)
		});
	} catch (error) {Mojo.Log.error("error opening file", error);}
	////////////////////////////////////////////////////

	
	//  *********  NEEDED TO CAPTURE SCREEN MOVEMENT and LOCATION  *********
	this.wholeScreenScroller = this.controller.getSceneScroller();
	this.scrollWasStarted = this.scrollStarted.bind(this);
	
	} catch (error) {Mojo.Log.error("BOOK ASSISTANT SETUP ERROR", error);}
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


	if (this.controller.stageController.setWindowOrientation) {
		this.controller.stageController.setWindowOrientation("free");
	}

	this.controller.listen(this.wholeScreenScroller, Mojo.Event.scrollStarting, this.scrollWasStarted);

	this.resizeHandler = this.handleWindowResize.bindAsEventListener(this);
	this.controller.window.addEventListener('resize', this.resizeHandler, true);

	// Moved to changedOrientation()
	//this.doubleClickHandler = this.doubleClick.bindAsEventListener(this);
	//this.controller.document.addEventListener(Mojo.Event.tap, this.doubleClickHandler, true);

	this.appClosingHandler = this.appClosingRoutine.bindAsEventListener(this);
	window.document.addEventListener(Mojo.Event.deactivate, this.appClosingHandler, true);

	this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
	this.prefsModel = this.prefs.get();
	this.changeTextSize(this.prefsModel.textsize);

	if (this.debugMe===true) {Mojo.Log.info("activating book, about to jump to search");}
	highsearch = false;
	if (searchBook !== false) {
		setTimeout(function () {
			this.jumpToBook(searchBook);
			searchBook = false;
		}.bind(this), 150);
	} 
	else {
		if (searchPage !== false) {
			setTimeout(function () {
				this.jumpToPage(searchPage);
				searchPage = false;
			}.bind(this), 150);
		}
	}

	//////////////////////////
	// Set the color theme
	switch (this.prefsModel.daynight){
		case 'day':
			this.controller.document.body.className = 'main';
			break;
		case 'night':
			this.controller.document.body.className = 'palm-dark';
			break;
	}

	} catch (error) {Mojo.Log.error("ACTIVE ERROR", error);}
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
	this.controller.getSceneScroller().removeEventListener(Mojo.Event.scrollStarting, this.doubleClickHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);

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
	this.controller.getSceneScroller().removeEventListener(Mojo.Event.scrollStarting, this.doubleClickHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);

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
	if (this.debugMe===true) {Mojo.Log.info("@@ APP CLOSING - this.prefs.pagePosition", this.prefs.pagePosition);}

	if (this.prefsModel.wasChapterJump !== true) {
		this.prefsModel.pagePosition = this.ImHere.y;
		this.prefsModel.wasChapterJump = false;
		this.prefs.put(this.prefsModel);
		if (this.debugMe===true) {Mojo.Log.info("@@ APP CLOSING NOT JUMP - this.prefs.pagePosition", this.prefs.pagePosition, "this.prefsModel.wasChapterJump", this.prefsModel.wasChapterJump);}
	}

	if (this.debugMe===true) {Mojo.Log.info("@@ APP CLOSING -", this.ImHere.y, "-- this.prefs.pagePosition", this.prefs.pagePosition);}

} catch (error) {Mojo.Log.error("APP CLOSING ROUTINE", error);}
};


/********************
* SCROLL POSITION CAPTURING
* scrollStarted - calls the moved method repeadlly
* moved - callbackfunction for moved method (gets current position while on the move and stores it when stopped)
********************/
BookAssistant.prototype.scrollStarted = function(event){
	event.scroller.addListener(this);
}

BookAssistant.prototype.moved = function(scrollEnding, position){
	if (scrollEnding) {
		this.ImHere = position;
		this.ImThisBig = $('bookdata').clientHeight;
		this.percentDown = ((0 - this.ImHere.y) / this.ImThisBig);
		if (this.debugMe===true) {Mojo.Log.info("this.ImHere", this.ImHere.y, "this.ImThisBig", this.ImThisBig, "this.percentDown:", this.percentDown);}
	}
}


/********************
 *
 * HANDLE RESIZE
 *
 ********************/

BookAssistant.prototype.handleWindowResize = function(event){
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER RESIZE @@");}

	this.NewThisBig = $('bookdata').clientHeight;
	this.wasResized = true;

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE RESIZE @@");}
};


/********************
 *
 * ORIENTATION CHANGE
 *
 ********************/
BookAssistant.prototype.orientationChanged = function (orientation) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Orientation Changed @@");}

	if ((this.prefsModel.wasChapterJump === false) && (this.wasResized === true)) {
		this.goHere = Math.floor((0 - (this.NewThisBig * this.percentDown)));

		//Mojo.Log.info("NewThisBig", this.NewThisBig, "ImThisBig:", this.ImThisBig, "percentDown", this.percentDown, "goHere:", this.goHere);
		this.controller.getSceneScroller().mojo.scrollTo(0, this.goHere, false, false);
		this.wasResized = false;
	}

	this.whichWay = this.controller.stageController.getWindowOrientation();

	switch (this.whichWay) {
		case 'up':
			if (! this.doubleClickHandler) {
				this.doubleClickHandler = this.doubleClick.bindAsEventListener(this);
				this.controller.document.addEventListener(Mojo.Event.tap, this.doubleClickHandler, true);
			}
			break;
		case 'down':
			this.controller.document.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);
			this.doubleClickHandler = null
			break;
		case 'left':
			this.controller.document.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);
			this.doubleClickHandler = null
			break;
		case 'right':
			this.controller.document.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);
			this.doubleClickHandler = null
			break;
	}

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Orientation Changed @@");}
};


/********************
 *
 * SELECT BOOK
 *
 ********************/
BookAssistant.prototype.selectBook = function (event) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER SELECTBOOK @@");}

	this.controller.popupSubmenu({
		onChoose: this.jumpToBook.bind(this),
		placeNear: event.target,
		items: this.bookMenuModelItems
	});

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE SELECTBOOK @@");}
};


/********************
 *
 * JUMP TO BOOK
 *
 * Called by selectBook() to swap the scene to a new book scene with the selected book
 *
 ********************/
BookAssistant.prototype.jumpToBook = function (newindex) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Jump to Book @@");}

	/////////////////////////////////////////////////////////////
	//Need to KilllClick here or really ugly loop happens
	this.killlClick();

	/////////////////////////////////////////////////////////////
	//
	if (newindex) {
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
 * GET BOOK SUCCESS
 *
 ********************/
BookAssistant.prototype.getBookSuccess = function (transport) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Get Book Success @@");}
//try {
	////////////////////////////////////////
	// Put the response into the scene
	if (search_string !== false) {
		var temp = transport.transport.responseText;
		this.highlightSearchTerms(search_string, temp);
	} else {
		$('bookdata').innerHTML = transport.transport.responseText;
	}


	////////////////////////////////////////////////////
	// Scroll to the exact last location in a page!
	if (this.prefsModel.wasChapterJump !== true) {
		if (this.debugMe===true) {Mojo.Log.info("~_~_~_~_~_~_~_~  this.prefs.pagePosition", this.prefsModel.pagePosition);}
		this.controller.getSceneScroller().mojo.scrollTo(0, this.prefsModel.pagePosition, this.prefsModel.scrollingEffect, false);
		this.prefsModel.pagePosition = 0;
		this.prefsModel.wasChapterJump = false;
		this.prefs.put(this.prefsModel);
	}
	else if (this.prefsModel.wasChapterJump === true) {
		this.controller.getSceneScroller().mojo.scrollTo(0, 0, this.prefsModel.scrollingEffect, false);
		this.prefsModel.pagePosition = 0;
		this.prefsModel.wasChapterJump = false;
		this.prefs.put(this.prefsModel);
	}
	else {
		this.prefsModel.pagePosition = 0;
		this.prefsModel.wasChapterJump = false;
		this.prefs.put(this.prefsModel);
	}


	//////////////////////////////////
	// Build the new chapterMenuModel
	this.chapterMenuModelItems = [];

	this.tableCount = document.getElementsByTagName("table");
	
	for (i = 0; i <= this.tableCount.length; i++) {
		//Mojo.Log.info(i, this.tableCount.length);
		lcId = document.getElementsByTagName("table").item(i).id;
		lcName = lcId.substr(lcId.indexOf("_p") + 2);

		// Filter out "_top" for display in the popup menu.
		if (lcName.indexOf('_top') >= 0) {
			lcName = lcName.replace('_top', '');
		}

		if (this.debugMe===true) {Mojo.Log.info(lcId, lcName);}

		labelStr = "Page " + lcName;
		cmdStr = lcId;
		this.chapterMenuModelItems.push({
			label: labelStr,
			command: cmdStr
		});
	}

	if (this.debugMe===true) {Mojo.Log.info("---- BOOK SUCCUCCESS - BOOK:", this.myIndex, "CMDSTR:", cmdStr);}
//} catch (error) {Mojo.Log.error("GET BOOK SUCCESS", error);}
if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Get Book Success @@");}
};


/********************
 *
 * GET BOOK FAILURE
 *
 ********************/
BookAssistant.prototype.getBookFailure = function (transport) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Get Book Failure @@");}

	$('bookdata').innerHTML = "Problem getting the file!";

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Get Book Failure @@");}
};


/********************
 *
 * SELECT CHAPTER
 *
 * Called when the user taps the chapter select button
 *
 ********************/
BookAssistant.prototype.selectChapter = function (event) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Select Chapter @@");}

	try {
		this.controller.popupSubmenu({
			onChoose: this.jumpToPage.bind(this),
			placeNear: $('pageMenu'),
			//popupClass: 'pagePopup',
			items: this.chapterMenuModelItems
		});
	} catch (error) {Mojo.Log.error("Select Book Error", error);}

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

		this.prefsModel.chapterNumber = this.myIndex;
		this.prefsModel.pageNumber = this.pageNumber;
		this.prefs.put(this.prefsModel);
	}

	if (this.debugMe===true) {Mojo.Log.info("---- CHAPTER:", pgnum, "BOOK:", this.myIndex);}

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Jump to Page @@");}
};


/********************
 *
 * CHANGE TEXT SIZE
 *
 ********************/
BookAssistant.prototype.changeTextSize = function (size) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Change Text Size @@", size);}

	$('bookdata').style.fontSize = size;

if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Change Text Size @@", size);}
};



/*
 * This is sort of a wrapper function to the doHighlight function.
 * It takes the searchText that you pass, optionally splits it into
 * separate words, and transforms the text on the current web page.
 * Only the "searchText" parameter is required; all other parameters
 * are optional and can be omitted.
 */
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

	$('bookdata').innerHTML = bodyText;
	search_string = false;
	isPhrase = false;
	highsearch = $("highlight");

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Do Highlight Search Terms @@");}

	return true;
};

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
} catch (error) {Mojo.Log.error("Do Hightlight", error);}
};

/********************
 *
 * FULL SCREEN FUNCTIONS
 *
 ********************/
BookAssistant.prototype.doubleClick = function () {
try {

	//////////////////////////////////
	// Detect single tap vs double tap
	if (this.click === 1) {
		//DOUBLE
		this.doFullScreen(false);
		this.click = 0;
	} else {
		//SINGLE
		this.click = 1;
		this.clickInterval = this.controller.window.setInterval(this.killlClick.bind(this), 450);
	}

} catch (error) {Mojo.Log.error("doubleClick", error);}
};

BookAssistant.prototype.killlClick = function () {
try {
	//////////////////////////////////
	// Clear if only single tap
	this.click = 0;
	this.controller.window.clearInterval(this.clickInterval);
	this.clickInterval = null;

} catch (error) {Mojo.Log.error("KilllClick", error);}
};

BookAssistant.prototype.doFullScreen = function(forceSelection, event) {
	////////////////////////////////////////
	// Do full screen detection / work

	if (this.debugMe===true) {Mojo.Log.info("---------------- FULL SCREEN -", forceSelection, "--", event);}

	if (forceSelection) {
		switch (forceSelection) {
			case 'big':
				if (this.debugMe===true) {Mojo.Log.info("---------------- FULL SCREEN -", forceSelection, "--", event);}
				this.controller.enableFullScreenMode(true);
				this.windowHeight = this.controller.window.innerHeight;
				this.prefsModel.isFullScreen = true;
				this.prefs.put(this.prefsModel);
				forceSelection = false;
				break;
			case 'small':
				if (this.debugMe===true) {Mojo.Log.info("---------------- FULL SCREEN -", forceSelection, "--", event);}
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
			this.controller.enableFullScreenMode(true);
			this.windowHeight = this.controller.window.innerHeight;
			this.prefsModel.isFullScreen = true;
			this.prefs.put(this.prefsModel);
		}
		else if (this.windowHeight === this.maxScreenHeight) {
			if (this.debugMe===true) {Mojo.Log.info("---------------- FULL SCREEN -", forceSelection, "--", event);}
			this.controller.enableFullScreenMode(false);
			this.windowHeight = this.controller.window.innerHeight;
			this.prefsModel.isFullScreen = false;
			this.prefs.put(this.prefsModel);
		}
	}
	else {
		Mojo.Log.error("HIT ELSE - You should never see this.");
	}
};
