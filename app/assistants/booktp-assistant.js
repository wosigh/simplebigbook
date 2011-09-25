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
var searchBook = false;
var searchPage = false;
var search_string = false;
var isPhrase = false;
var highsearch = false;
var wasHighSearch = false;
var forceSelection = null;

function BooktpAssistant() {
	this.debugMe = false;

	this.dbName = "SBB_Bookmarks";
	this.dbVersion = "0.1";
	this.dbDisplayName = "Simple Big Book";
	this.dbSize = 200000;
	this.dbTable = "SBB_Bookmarks_Table";

	this.maxScreenHeight = Mojo.Environment.DeviceInfo.screenHeight;
	this.maxScreenWidth = Mojo.Environment.DeviceInfo.screenWidth;
	this.modelName = Mojo.Environment.DeviceInfo.modelNameAscii;
	this.pageNumber = false;
	this.scroller = null;
	this.isVisible = true;
	this.ImThisBig = null;
	this.percentDown = null;
	this.DI = Mojo.Environment.DeviceInfo;
	this.firstResize = true;
	this.headerAdjustment = 56; //88 //32 //78
	this.whichWay = null;
	this.isTouchPad = false;
}

/********************
 *
 * SETUP
 *
 ********************/
BooktpAssistant.prototype.setup = function () {
	try {
		if (this.debugMe === true) {Mojo.Log.info("@@ ENTER SETUP @@");}

		this.mainDiv = $('main');
		this.bookFade = $('book-fade');
		this.bookData = $('bookdata');
		this.chapMenu = $('chapMenu');
		this.pageMenu = $('pageMenu');
		this.bookmarkMenu = $('bookmarkMenu');
		this.bookMenuGroup = $('bookMenuGroup');
		this.menuFadingDiv = $('menuFadingDiv');

		/*******  COOKIE SECTION  *******/
		////////////////////////////////////////////////////
		// Delete the ancient cookie
		try {
			var obsoleteCookie = new Mojo.Model.Cookie("SimpleBigBook");
			obsoleteCookie.get();
			obsoleteCookie.remove();
			obsoleteCookie = null;
		} catch (obsoletecookieerror) {
			Mojo.Log.error(">>>>> BooktpAssistant - OBSOLETE COOKIE CRUMBLED!", obsoletecookieerror);
		}
		////////////////////////////////////////////////////
		try {

			////////////////////////////////////////////////////
			// *ONLY* uncomment this for DELETING the cookie
			//this.deleteprefs = new Mojo.Model.Cookie("SimpleBigBookv2");
			//this.deleteprefs.remove();
			//this.deleteprefs = null;

			////////////////////////////////////////////////////
			//  ****  Default model for preferences cookie
			this.prefsModel = {
				chapterNumber: 0,
				cookieVersion: 2,
				daynight: 'day',
				dockPhraseSpeed: 60000,
				isFullScreen: false,
				pageNumber: 0,
				pagePosition: false,
				screenSize: false,
				scrollingEffect: true,
				textsize: '18px',
				wasBookmarkJump: false,
				wasChapterJump: false,
				showScrim: false,
				isTouchPad: false
			};
			////////////////////////////////////////////////////
			this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
			var prefstest = this.prefs.get();

			if (prefstest === undefined) {
				this.prefs.put(this.prefsModel);
				this.prefsModel = this.prefs.get();
				prefstest = null;
			} else {
				this.prefsModel = this.prefs.get();

				if (this.prefs) {
					prefstest = this.prefs.get();
					if (prefstest) {
						if (prefstest.chapterNumber !== "undefined") {
							this.prefsModel.chapterNumber = prefstest.chapterNumber;
						}
						if (prefstest.daynight !== "undefined") {
							this.prefsModel.daynight = prefstest.daynight;
						}
						if (prefstest.dockPhraseSpeed !== "undefined") {
							this.prefsModel.dockPhraseSpeed = prefstest.dockPhraseSpeed;
						}
						if (prefstest.isFullScreen !== "undefined") {
							this.prefsModel.isFullScreen = prefstest.isFullScreen;
						}
						if (prefstest.pageNumber !== "undefined") {
							this.prefsModel.pageNumber = prefstest.pageNumber;
						}
						if (prefstest.pagePosition !== "undefined") {
							this.prefsModel.pagePosition = prefstest.pagePosition;
						}
						if (prefstest.screenSize !== "undefined") {
							this.prefsModel.screenSize = prefstest.screenSize;
						}
						if (prefstest.scrollingEffect !== "undefined") {
							this.prefsModel.scrollingEffect = prefstest.scrollingEffect;
						}
						if (prefstest.textsize !== "undefined") {
							this.prefsModel.textsize = prefstest.textsize;
						}
						if (prefstest.wasBookmarkJump !== "undefined") {
							this.prefsModel.wasBookmarkJump = prefstest.wasBookmarkJump;
						}
						if (prefstest.wasChapterJump !== "undefined") {
							this.prefsModel.wasChapterJump = prefstest.wasChapterJump;
						}
						if (prefstest.showScrim !== "undefined") {
							this.prefsModel.showScrim = prefstest.showScrim;
						}
						if (prefstest.isTouchPad !== "undefined") {
							this.prefsModel.isTouchPad = prefstest.isTouchPad;
						}
					}
				}
				prefstest = null;
			}

			Mojo.Log.info(Object.toJSON(this.prefsModel));
			this.prefs.put(this.prefsModel);
		} catch (cookieerror) {
			Mojo.Log.error(">>>>> BooktpAssistant - COOKIE CRUMBLED!", cookieerror);
		}


		////////////////////////////////////////////////////
		// Initial states
		//
		Mojo.Log.info(this.maxScreenHeight, this.maxScreenWidth, this.modelName);
		if ( (this.maxScreenHeight >= 1024) || (this.maxScreenWidth >= 1024) || (this.modelName.indexOf("ouch") > -1) ) {
			this.isTouchPad = true;
			this.prefsModel.isTouchPad = true;
			this.prefs.put(this.prefsModel);
			Mojo.Log.info(this.prefsModel.isTouchPad, this.prefs.isTouchPad);
		}

		/*if ((this.prefsModel.wasBookmarkJump === true) || (this.prefsModel.wasChapterJump === true)) {
			if (this.prefsModel.isFullScreen === true) {
				this.doFullScreen('big');
			} else {
				this.doFullScreen('small');
			}
		} else if (this.prefsModel.screenSize === true) {
			this.doFullScreen('big');
		}*/

		this.myIndex = this.prefsModel.chapterNumber;
		this.pageNumber = this.prefsModel.pageNumber;
		////////////////////////////////////////////////////

		////////////////////////////////////////////////////
		//  Make the chapter list model for the popup
		this.bookMenuModelItems = [];

		for (i = 0; i < SBB.chapterList.length; i++) {
			var bookcmd = i;
			var booklbl = SBB.chapterList[i].label;
			this.bookMenuModelItems.push({
				label: booklbl,
				command: bookcmd
			});
		}
		////////////////////////////////////////////////////

		////////////////////////////////////////////////////
		//  Setup Menus
		Mojo.Event.listen(this.bookmarkMenu, Mojo.Event.tap, this.selectBookmark.bindAsEventListener(this, event));
		Mojo.Event.listen(this.chapMenu, Mojo.Event.tap, this.selectChapter.bindAsEventListener(this, event));
		Mojo.Event.listen(this.pageMenu, Mojo.Event.tap, this.selectPage.bindAsEventListener(this, event));

		this.chapMenu.innerHTML = SBB.chapterList[this.myIndex].label;
		////////////////////////////////////////////////////

		////////////////////////////////////////////////////
		//  Setup for Application Menu
		if (this.DI.platformVersionMajor === 1) {
			this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.myMenuWithQuotesAttr, StageAssistant.myMenuWithQuotesModel);
		} else {
			this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.myMenuAttr, StageAssistant.myMenuModel);
		}
		////////////////////////////////////////////////////

		////////////////////////////////////////////////////
		//  Setup for Command Menu
		this.commandMenuModel = {
			visible: true,
			items: this.commandButtons = [ 
				{ icon: "back", command: "cmd-Previous", disabled: false},
				{ icon: "forward", command: "cmd-Next", disabled: false}
			]
		}; 

// 		this.commandMenuModel = {
// 			items: [{
// 				icon: "search",
// 				command: "full-screen"
// 			},{},
// 				{ items: this.commandButtons = [
// 					{
// 						icon: "back",
// 						command: "previous-item"
// 					},
// 					{
// 						icon: "forward",
// 						command: "next-item",
// 						disabled: true
// 					}]},
// 				{}, {
// 					icon: "info",
// 					command: "info"
// 				}
// 			]
// 		};

		this.controller.setupWidget(Mojo.Menu.commandMenu,
			this.attributes = {
				spacerHeight: 0,
				menuClass: 'no-fade'
			},
			this.commandMenuModel
		);
		////////////////////////////////////////////////////



		////////////////////////////////////////////////////
		//  Get the data via ajax request
		try {
			this.url = "books/" + SBB.chapterList[this.myIndex].file;
			if (this.debugMe === true) {Mojo.Log.info("book url", this.url);}

			//onLoad: (show spinner)

			this.request = new Ajax.Request(this.url, {
				method: "get",
				evalJSON: "force",
				onSuccess: this.getChapterSuccess.bind(this),
				onFailure: this.getChapterFailure.bind(this)
			});

		} catch (ajaxerror) {
			Mojo.Log.error(">>>>> BooktpAssistant - AJAX Error Opening File", ajaxerror);
		}
		////////////////////////////////////////////////////

		////////////////////////////////////////////////////
		//  Capture scroller movement and location
		this.wholeScreenScroller = this.controller.getSceneScroller();
		//this.scrollStartedHandler = this.scrollStarted.bind(this);
		////////////////////////////////////////////////////

		////////////////////////////////////////////////////
		//  Handlers
		this.appClosingHandler = this.appClosingRoutine.bindAsEventListener(this);
		//this.doubleClickHandler = this.doubleClick.bindAsEventListener(this);
		this.resizeHandler = this.handleWindowResize.bindAsEventListener(this);
		this.fadeDeciderHandler = this.fadeDecider.bindAsEventListener(this, this.menuFadingDiv, 25);
		////////////////////////////////////////////////////
	} catch (error) {
		Mojo.Log.error(">>>>> BooktpAssistant - setup ERROR", error);
	}
	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE SETUP @@");}
};

/********************
 *
 * ACTIVATE
 *
 ********************/
BooktpAssistant.prototype.activate = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Activate @@");}

	if (this.controller.stageController.setWindowOrientation) {
		this.controller.stageController.setWindowOrientation("free");
	}

	this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
	this.prefsModel = this.prefs.get();
	this.changeTextSize(this.prefsModel.textsize);

	////////////////////////////////////////////////////
	//  Listeners
	//this.controller.listen(this.wholeScreenScroller, Mojo.Event.scrollStarting, this.scrollStartedHandler);
	this.controller.listen(this.wholeScreenScroller, Mojo.Event.hold, this.fadeDeciderHandler);
	this.controller.window.addEventListener('resize', this.resizeHandler, true);
	//this.controller.document.addEventListener(Mojo.Event.tap, this.doubleClickHandler, true);
	window.document.addEventListener(Mojo.Event.deactivate, this.appClosingHandler, true);
	////////////////////////////////////////////////////

	////////////////////////////////////////////////////
	//  Make the bookmark model for the popup
	this.initialPopulate();
	////////////////////////////////////////////////////

	////////////////////////////////////////////////////
	//  Decide to only load or to do search/highlight too.
	highsearch = false;
	if (searchBook !== false) {
		Mojo.Log.info("SEARCHBOOK:", searchBook, "|", "SEARCHPAGE:", searchPage);
		setTimeout(function () {
			this.jumpToChapter(searchBook);
			searchBook = false;
		}.bind(this), 150);
	} else {
		Mojo.Log.info("SEARCHBOOK:", searchBook, "|", "SEARCHPAGE:", searchPage);
		if (searchPage !== false) {
			setTimeout(function () {
				this.jumpToPage(searchPage);
				searchPage = false;
			}.bind(this), 150);
		}
	}
	////////////////////////////////////////////////////
	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE Activate @@");}
};


/********************
 *
 * DEACTIVATE
 *
 ********************/
BooktpAssistant.prototype.deactivate = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Deactivate @@");

	}
	if (this.controller.window.innerHeight === this.maxScreenHeight) {
		this.prefsModel.isFullScreen = true;
		this.prefs.put(this.prefsModel);
	} else {
		this.prefsModel.isFullScreen = false;
		this.prefs.put(this.prefsModel);
	}

	//this.controller.stopListening(this.wholeScreenScroller, Mojo.Event.scrollStarting, this.scrollStartedHandler);
	//this.controller.document.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);
	//this.bookData.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE Deactivate @@");}
};


/********************
 *
 * CLEANUP
 *this.prefsModel.isTouchPad
 ********************/
BooktpAssistant.prototype.cleanup = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Cleanup @@");}

	//this.prefsModel.showScrim = false;
	//this.prefs.put(this.prefsModel);

	//this.controller.stopListening(this.wholeScreenScroller, Mojo.Event.scrollStarting, this.scrollStartedHandler);
	//this.controller.document.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);
	//this.bookData.removeEventListener(Mojo.Event.tap, this.doubleClickHandler, true);

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE Cleanup @@");}
};


/********************
 *
 * BEFORE APP CLOSE
 *
 ********************/
BooktpAssistant.prototype.appClosingRoutine = function (event) {
	try {
		//if (this.debugMe === true) {
			Mojo.Log.info("~+~+~+~+~+~+~  BLUR  ~+~+~+~+~+~+~");//}
		if (this.debugMe === true) {Mojo.Log.info("@@ APP CLOSING - this.prefsModel.pagePosition", this.prefsModel.pagePosition);}

		if ((this.prefsModel.wasChapterJump === false) && (this.prefsModel.wasBookmarkJump === false)) {
			this.prefsModel.pagePosition = this.ImHere.y;
			this.prefsModel.wasChapterJump = false;
			this.prefsModel.wasBookmarkJump = false;
			this.prefs.put(this.prefsModel);
		}

		if (this.debugMe === true) {Mojo.Log.info("@@ APP CLOSING -", this.ImHere.y, "-- this.prefsModel.pagePosition", this.prefsModel.pagePosition);}

	} catch (appClosingRoutineError) {Mojo.Log.error(">>>>> BooktpAssistant - appClosingRoutine ERROR: ", appClosingRoutineError);}
};


/********************
 *
 * HANDLE COMMAND
 *
 ********************/
BooktpAssistant.prototype.handleCommand = function (event) {
	switch (event.command) {
	case 'cmd-AddBookmarks':
		this.addBookmark(event);
		break;
	case 'cmd-Previous':
		this.jumpToPage(this.previousPage);
		break;
	case 'cmd-Next':
		this.jumpToPage(this.nextPage);
		break;
	}
};


/********************
 * SCROLL POSITION CAPTURING
 * scrollStarted - calls the moved method repeadlly
 * moved - callbackfunction for moved method (gets current position while on the move and stores it when stopped)
 ********************/
/*BooktpAssistant.prototype.scrollStarted = function (event) {
	event.scroller.addListener(this);
};*/

/*BooktpAssistant.prototype.moved = function (scrollEnding, position) {
	if (scrollEnding) {
		this.ImHere = position;
		this.ImThisBig = this.bookData.clientHeight;
		this.percentDown = ((0 - this.ImHere.y) / this.ImThisBig);

		if (this.debugMe === true) {Mojo.Log.info("scrollStarted - this.ImHere", this.ImHere.y, "this.ImThisBig", this.ImThisBig, "this.percentDown:", this.percentDown);}

		this.prefsModel.wasBookmarkJump = false;
		this.prefs.put(this.prefsModel);


		////////////////////////////////////////////////////
		// Figure out what Page is being displayed on the screen.
		// Bottom line: If the line marking a page is about 2/3 
		// up the screen, it's considered the current page.
		this.tableCount = document.getElementsByTagName("table");

		for (i = 0; i < this.tableCount.length; i++) {

			var humanOffset = (this.maxScreenHeight * 0.4);
			var lcId = document.getElementsByTagName("table").item(i).id;
			var shortName = lcId.substring(0, lcId.indexOf("_"));
			var thisPage = (humanOffset - document.getElementsByTagName("table").item(i).offsetTop);
			var prettylabel = "";

			if ((i + 1) < this.tableCount.length) {
				var nextPage = (humanOffset - document.getElementsByTagName("table").item(i + 1).offsetTop);

				if ((this.ImHere.y < thisPage) && (this.ImHere.y > nextPage)) {
					for (c = 0; c < SBB.chapterList.length; c++) {
						if (shortName === SBB.chapterList[c].shortname) {
							prettylabel = SBB.chapterList[c].label;
						}
					}

					if (this.debugMe === true) {Mojo.Log.info("======== IF - You're reading:", lcId, "+", shortName, "+", prettylabel, "-", lcId, this.ImHere.y, "+", this.percentDown);}
					this.pageNumber = lcId;
					this.prefsModel.pageNumber = lcId;
					//UGLY, but works!!
					break;
				}
			} else {
				if (this.debugMe === true) {Mojo.Log.info("======== ELSE - You're reading:", lcId, "+", shortName, "+", prettylabel, "-", lcId, "+", this.ImHere.y, "+", this.percentDown);}

				this.pageNumber = lcId;
				this.prefsModel.pageNumber = lcId;
			}
		}
		////////////////////////////////////////////////////
	}
};*/


/********************
 *
 * HANDLE RESIZE
 *
 ********************/
BooktpAssistant.prototype.handleWindowResize = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER handleWindowResize @@");}

	$('body_wallpaper').style.backgroundSize = this.controller.window.innerWidth + "px " + this.controller.window.innerHeight + "px";
	Mojo.Log.info("this.controller.window.innerHeight:", this.controller.window.innerHeight);
	$('bookPageNumber').style.top = (this.controller.window.innerHeight - 25) + 'px';

	if (this.prefsModel.wasBookmarkJump === false) {
		this.NewThisBig = this.bookData.clientHeight;
		this.wasResized = true;
	}

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE handleWindowResize @@");}
};


/********************
 *
 * HOLD BOOK
 *
 ********************/
BooktpAssistant.prototype.fadeDecider = function (event, element, speed) {

	if (element.style.display === "none") {
		this.groovyTimer = 0;
		this.groovyFadeIn(element, speed);
	}
	else {
		this.groovyTimer = 100;
		this.groovyFadeOut(element, speed);
	}
};



/********************
 *
 * FADE OUT
 *
 ********************/
BooktpAssistant.prototype.groovyFadeOut = function (element, speed) {

	if (this.groovyTimer > 0) {
		element.style.opacity = this.groovyTimer * 0.01;
		this.groovyTimer = this.groovyTimer - 5;
		this.groovyFadeOutTimer = setTimeout(this.groovyFadeOut.bind(this, element, speed));
	}
	else {
		element.style.opacity = "0.0";
		element.style.display = "none";
	}
};


/********************
 *
 * FADE IN
 *
 ********************/
BooktpAssistant.prototype.groovyFadeIn = function (element, speed) {

	element.style.display = "block";

	if (this.groovyTimer < 100) {
		element.style.opacity = this.groovyTimer * 0.01;
		this.groovyTimer = this.groovyTimer + 5;
		this.groovyFadeInTimer = setTimeout(this.groovyFadeIn.bind(this, element, speed));
	}
	else {
		element.style.opacity = "1.0"
		element.style.display = "block";
	}
};


/********************
 *
 * ORIENTATION CHANGE
 *
 ********************/
BooktpAssistant.prototype.orientationChanged = function (orientation) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Orientation Changed @@");}

	this.whichWay = this.controller.stageController.getWindowOrientation();

	if ((this.prefsModel.wasChapterJump === false) && (this.wasResized === true)) {
		//this.goHere = Math.floor((0 - (this.NewThisBig * this.percentDown)));
		//this.controller.getSceneScroller().mojo.scrollTo(0, this.goHere, false, false);
		this.wasResized = false;
	}
	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE Orientation Changed @@");}
};


/********************
 *
 * CHANGE TEXT SIZE
 *
 ********************/
BooktpAssistant.prototype.changeTextSize = function (size) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Change Text Size @@", size);}

	this.bookData.style.fontSize = size;

	////////////////////////////////////////////////////
	//  ****  Set the color theme while I'm here
	switch (this.prefsModel.daynight) {
	case 'day':
		$('body_wallpaper').style.background = "url('images/background-light.png')";
		$('body_wallpaper').style.backgroundSize = this.controller.window.innerWidth + "px " + this.controller.window.innerHeight + "px";

		if (this.prefsModel.isTouchPad === true) {
			this.controller.document.body.style.className = 'main touchpad';
			this.bookData.className = 'book-body-text-touchpad';
		}
		else {
			this.controller.document.body.className = 'main';
			this.bookData.className = 'book-body-text';
		}
		break;
	case 'night':
		$('body_wallpaper').style.background = "url('images/background-dark.png')";
		$('body_wallpaper').style.backgroundSize = this.controller.window.innerWidth + "px " + this.controller.window.innerHeight + "px";

		if (this.prefsModel.isTouchPad === true) {
			this.controller.document.body.className = 'palm-dark touchpad';
			this.bookData.className = 'book-body-text-touchpad';
		}
		else {
			this.controller.document.body.className = 'palm-dark';
			this.bookData.className = 'book-body-text';
		}
		break;
	}
	
	$('bookPageNumber').style.top = (this.controller.window.innerHeight - 25) + 'px';
	$('chapterTitle').style.top = 60 + 'px';
	////////////////////////////////////////////////////

	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Change Text Size @@", size);}
};


/********************
 *
 * SELECT CHAPTER
 *
 ********************/
BooktpAssistant.prototype.selectChapter = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER SELECTBOOK @@");}

	this.controller.popupSubmenu({
		onChoose: this.jumpToChapter.bind(this),
		placeNear: this.chapMenu,
		items: this.bookMenuModelItems
	});

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE SELECTBOOK @@");}
};


/********************
 *
 * JUMP TO CHAPTER
 *
 * Called by selectChapter() to swap the scene to a new book scene with the selected book
 *
 ********************/
BooktpAssistant.prototype.jumpToChapter = function (newindex) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Jump to Book @@");}

	/////////////////////////////////////////////////////////////
	//
	if (newindex) {
		var underscoreCount = 0;
		var lastGoodUC = 0;
		while (underscoreCount < 2) {
			for (i = 0; i < this.pageNumber.length ; i++) {
				if ( (this.pageNumber.charAt(i) === "_") && (underscoreCount < 2) ){
					underscoreCount++;
					lastGoodUC = i;
				}
			}
		//Mojo.Log.info(this.pageNumber = this.pageNumber.substring(0, lastGoodUC));
		this.pageNumber = this.pageNumber.substring(0, lastGoodUC);
		}

		this.myIndex = newindex;
		this.prefsModel.chapterNumber = this.myIndex;
		this.prefsModel.pageNumber = SBB.chapterList[this.myIndex].firstpage;
		this.prefsModel.wasChapterJump = true;
		this.prefs.put(this.prefsModel);

		Mojo.Controller.stageController.swapScene({
			transition: Mojo.Transition.crossFade,
			name: 'booktp'
		});
	}

	if (this.debugMe === true) {Mojo.Log.info("---- BOOK JUMP:", this.pageNumber, "BOOK:", this.myIndex);}//, "CMDSTR:", cmdStr);}
	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE Jump to Book @@");}
};


/********************
 *
 * GET CHAPTER SUCCESS
 *
 ********************/
BooktpAssistant.prototype.getChapterSuccess = function (transport) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER getChapterSuccess @@");}

	this.isFirstPage = false;
	$('tempBookData').innerHTML = transport.transport.responseText;

	if (this.pageNumber.indexOf('_top') > 0) {
		this.isFirstPage = true;
		this.pageNumber = this.pageNumber.replace('_top', '_text');
	}
	if (this.pageNumber.indexOf('_text') <= 0) {
		this.pageNumber = this.pageNumber+ '_text';
	}
// 	else {
// 		//this.pageNumber = this.pageNumber;
// 		//Mojo.Log.error("Can't figure out what page to load.");
// 	}

	////////////////////////////////////////
	// Put the response into the scene
	
	Mojo.Log.info("this.prefsModel.wasChapterJump:", this.prefsModel.wasChapterJump);
	
	
	if (search_string !== false) {
		var temp = transport.transport.responseText;
		this.highlightSearchTerms(search_string, temp);
	} else {
		this.bookData.innerHTML = document.getElementById(this.pageNumber).innerHTML;
		if (this.isFirstPage === true) {
			//Mojo.Log.info("IF this.isFirstPage:", this.isFirstPage);
			$('chapterTitle').style.display = 'block';
			$('chapterTitle').innerHTML = SBB.chapterList[this.myIndex].chapternumberlabel + ": " + SBB.chapterList[this.myIndex].label;
			$('bookdata').style.top = '60px';
		}
		else {
			//Mojo.Log.info("ELSE this.isFirstPage:", this.isFirstPage);
			$('chapterTitle').style.display = 'none';
			$('chapterTitle').innerHTML = "";
			$('bookdata').style.top = '0px';
		}

		//$('bookPageNumber').innerHTML = "&#151; " + this.pageNumber.substring(this.pageNumber.indexOf("_")+2, this.pageNumber.lastIndexOf("_")) + " &#151;";
	}

	//////////////////////////////////
	// Build the pagenumberMenuModel
	this.pagenumberMenuModelItems = [];
	this.tableCount = document.getElementsByTagName("table");

	for (i = 0; i < this.tableCount.length; i++) {
		var lcId = document.getElementsByTagName("table").item(i).id;
		var lcName = lcId.substr(lcId.indexOf("_p") + 2);

		// Filter out "_top" for display in the popup menu.
		if (lcName.indexOf('_top') >= 0) {
			lcName = lcName.replace('_top', '');
		}

		//temp1 = this.pageNumber.substring(0, '_text');
		if (lcId.indexOf('_top') >= 0) {
			lcId = lcId.replace('_top', '');
		}
		//else {
		//	temp2 = lcId;
		//}

		if (this.pageNumber.substring(0, this.pageNumber.indexOf('_text')) === lcId) {
			this.currentPageIndex = i;
			//temp2 = null;
		}

		var labelStr = "Page " + lcName;
		var cmdStr = lcId;
		this.pagenumberMenuModelItems.push({
			label: labelStr,
			command: cmdStr,
			index: i
		});
	}

	//this.buildPageNumbers();

// 	this.previousPage = this.pagenumberMenuModelItems[(this.currentPageIndex - 1)].command;
// 	this.currentPage = this.pagenumberMenuModelItems[(this.currentPageIndex)].command;
// 	this.nextPage = this.pagenumberMenuModelItems[(this.currentPageIndex + 1)].command;
// 	//Mojo.Log.info("You're on page:", this.currentPage, "|", this.previousPage, "|", this.nextPage);


	this.jumpToPage(this.pageNumber);

	this.prefsModel.wasChapterJump = false;
	this.prefs.put(this.prefsModel);

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE getChapterSuccess @@");}
};


/********************
 *
 * GET CHAPTER FAILURE
 *
 ********************/
BooktpAssistant.prototype.getChapterFailure = function (transport) {
	this.bookData.innerHTML = "Problem getting the file!";
};


/********************
 *
 * SELECT PAGE
 *
 ********************/
BooktpAssistant.prototype.selectPage = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Select Chapter @@");}

	this.controller.popupSubmenu({
		onChoose: this.jumpToPage.bind(this),
		placeNear: this.pageMenu,
		items: this.pagenumberMenuModelItems
	});

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE Select Chapter @@");}
};


/********************
 *
 * JUMP TO PAGE
 *
 ********************/
BooktpAssistant.prototype.jumpToPage = function (pgnum) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Jump to Page @@");}
	Mojo.Log.info("@@ ENTER Jump to Page @@");
	//Mojo.Log.info("PGNUM:", pgnum, pgnum.indexOf('_top'));

	if (pgnum) {
		this.isFirstPage = false;
		this.pageNumber = pgnum;
		var jumpto = "";

		if (this.pageNumber.indexOf('_top') > 0) {
			this.isFirstPage = true;
			//this.pageNumber = "avision_p160_text";
			this.pageNumber = this.pageNumber.replace('_top', '_text');
		}
		if (this.pageNumber.indexOf('_text') <= 0) {
			this.pageNumber = this.pageNumber+ '_text';
		}
// 		else {
// 			this.pageNumber = this.pageNumber+ '_text';
// 		}

		////////////////////////////////////////
		// Put the response into the scene
		if (search_string !== false) {
			var temp = transport.transport.responseText;
				this.highlightSearchTerms(search_string, temp);
		}
	}

	if (pgnum) {
		if (highsearch === false) {
			jumpto = pgnum;
			wasHighSearch = false;
		} else {
			jumpto = highsearch;
			highsearch = false;
			wasHighSearch = true;
		}

		this.prefsModel.wasChapterJump = false;
		this.prefsModel.chapterNumber = this.myIndex;
		this.prefsModel.pageNumber = this.pageNumber;
		this.prefs.put(this.prefsModel);
	}

	//if (pgnum) {
	//	this.buildPageNumbers(page);
	//}

	if (pgnum) {
		for (i = 0; i < this.pagenumberMenuModelItems.length; i++) {
			//var lcId = this.pagenumberMenuModelItems[i].command;
			if (this.pagenumberMenuModelItems[i].command.indexOf('_top') >= 0) {
				this.pagenumberMenuModelItems[i].command = this.pagenumberMenuModelItems[i].command.replace('_top', '');
			}
			//else {
			//	this.pagenumberMenuModelItems[i].command = lcId;
			//}

			if (this.pageNumber.substring(0, this.pageNumber.indexOf('_text')) === this.pagenumberMenuModelItems[i].command) {
				this.currentPageIndex = i;
			}
		}


		if (this.currentPageIndex > 0) {
			this.previousPage = this.pagenumberMenuModelItems[(this.currentPageIndex - 1)].command;
			this.commandButtons[0].disabled = false;
			$('chapterTitle').style.display = 'none';
			$('chapterTitle').innerHTML = "";
			$('bookdata').style.top = '0px';
		}
		else {
			this.commandButtons[0].disabled = true;
			this.commandButtons[1].disabled = false;
			$('chapterTitle').style.display = 'block';
			$('chapterTitle').innerHTML = SBB.chapterList[this.myIndex].chapternumberlabel + ": " + SBB.chapterList[this.myIndex].label;
			$('bookdata').style.top = '60px';

		}

		this.currentPage = this.pagenumberMenuModelItems[(this.currentPageIndex)].command;
		//$('bookPageNumber').innerHTML = "&#151; " + this.pageNumber.substring(this.pageNumber.indexOf("_")+2, this.pageNumber.lastIndexOf("_")) + " &#151;";

		if (this.currentPageIndex < (this.pagenumberMenuModelItems.length -1)) {
			this.nextPage = this.pagenumberMenuModelItems[(this.currentPageIndex + 1)].command;
			this.commandButtons[1].disabled = false;
		}
		else {
			this.commandButtons[0].disabled = false;
			this.commandButtons[1].disabled = true;
		}
		//Mojo.Log.info("PAGE currentPage:", this.currentPage, "| previousPage:", this.previousPage, "| nextPage:", this.nextPage, "| pgnum:", pgnum, "| currentPageIndex:", this.currentPageIndex, "| pagenumberMenuModelItems:", this.pagenumberMenuModelItems.length);

		this.controller.modelChanged(this.commandMenuModel, this);

		this.bookData.innerHTML = document.getElementById(this.pageNumber).innerHTML;
		$('bookPageNumber').innerHTML = "&#151; " + this.pageNumber.substring(this.pageNumber.indexOf("_")+2, this.pageNumber.lastIndexOf("_")) + " &#151;";
	}

	if (this.debugMe === true) {Mojo.Log.info("---- CHAPTER:", pgnum, "BOOK:", this.myIndex);}
	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE Jump to Page @@");}
};


/********************
 *
 * INITIAL POPULATE
 *
 ********************/
BooktpAssistant.prototype.initialPopulate = function (transaction, results) {

	this.bookmarkMenuModelItems = [];

	if (!SBB.db) {
		SBB.db = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);
	}

	SBB.db.transaction(

	function (transaction) {
		transaction.executeSql("SELECT * FROM 'SBB_Bookmarks_Table'", [], this.displayList.bind(this), this.createMyTable.bind(this));
	}.bind(this));
};


/********************
 *
 * SELECT BOOKMARK
 *
 ********************/
BooktpAssistant.prototype.selectBookmark = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER selectBookmark");}

	this.controller.popupSubmenu({
		onChoose: this.readBookmark.bind(this),
		placeNear: this.bookmarkMenu,
		items: this.bookmarkMenuModelItems
	});

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE selectBookmark");}
};


/********************
 *
 * READ BOOKMARK
 *
 ********************/
BooktpAssistant.prototype.readBookmark = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER readBookmark");}

	if (event) {
		if (event !== 'addBookmark') {
			this.theBookmark = event;
			var sqlbm = "SELECT * FROM 'SBB_Bookmarks_Table' WHERE ID = " + this.theBookmark;
				SBB.db.transaction(function (transaction) {
					transaction.executeSql(
					sqlbm, [], this.jumpToBookmark.bind(this), this.dbErrorHandler.bind(this));
			}.bind(this));
		}
	}
	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE readBookmark");}
};


/********************
 *
 * JUMP TO BOOKMARK
 *
 ********************/
BooktpAssistant.prototype.jumpToBookmark = function (transaction, results) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER jumpToBookmark");}

	for (i = 0; i < results.rows.length; i++) {
		var row = results.rows.item(i);
		this.bmid = row.id;
		this.bmcn = row.chapterNumber;
		this.bmpn = row.pageNumber;
		this.bmpp = row.pagePosition;
	}

	/////////////////////////////////////////////////////////////
	//Need to KilllClick here or really ugly loop happens
	//this.killlClick();

	this.prefsModel.chapterNumber = this.bmcn;
	this.prefsModel.pageNumber = this.bmpn;
	this.prefsModel.pagePosition = this.bmpp;
	this.prefsModel.wasChapterJump = false;
	this.prefsModel.wasBookmarkJump = true;
	this.prefs.put(this.prefsModel);
	Mojo.Controller.stageController.swapScene({
		transition: Mojo.Transition.crossFade,
		name: 'book'
	});

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE jumpToBookmark");}
};


/********************
 *
 * HIGHLIGHT SEARCH TERMS
 *
 * This is sort of a wrapper function to the doHighlight function.
 * It takes the searchText that you pass, optionally splits it into
 * separate words, and transforms the text on the current web page.
 * Only the "searchText" parameter is required; all other parameters
 * are optional and can be omitted.
 ********************/
BooktpAssistant.prototype.highlightSearchTerms = function (searchText, sentbodyText) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Do Highlight Search Terms @@");}

	/*
	* if the treatAsPhrase parameter is true, then we should search for
	* the entire phrase that was entered; otherwise, we will split the
	* search string so that each word is searched for and highlighted
	* individually
	*/

	var searchArray = "";

	if (isPhrase) {
		searchArray = [searchText];
	} else {
		searchArray = searchText.split(" ");
	}

	var bodyText = sentbodyText;

	for (i = 0; i < searchArray.length; i++) {
		bodyText = this.doHighlight(bodyText, searchArray[i]);
	}

	this.bookData.innerHTML = bodyText;
	search_string = false;
	isPhrase = false;
	highsearch = $('highlight');
	temp = null;

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE Do Highlight Search Terms @@");}

	return true;
};


/********************
 *
 * DO HIGHLIGHT
 *
 ********************/
BooktpAssistant.prototype.doHighlight = function (bodyText, searchTerm) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Do Highlight @@");}

	try {
		var highlightStartTag = "<span id='highlight' class='searchHighlight'>";
		var highlightEndTag = "</span>";

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

		if (this.debugMe === true) {Mojo.Log.info("@@ Leave Do Highlight @@");}

		return newText;

	} catch (doHighlightError) {Mojo.Log.error(">>>>> BooktpAssistant - doHightlight ERROR:", doHighlightError);}
};


/********************
 *
 * DOUBLE CLICK
 *
 ********************/
/*BooktpAssistant.prototype.doubleClick = function (event) {
	//////////////////////////////////
	// Detect single tap vs double tap
	if (this.whichWay === 'up') {
		if (this.click === 1) { //DOUBLE TAP
			//if (this.controller.window.innerHeight !== this.maxScreenHeight) {
			if (this.prefsModel.isFullScreen === false) {
				this.doFullScreen('big');
				this.click = 0;
			} else {
				this.doFullScreen('small');
				this.click = 0;
			}
		} else { //SINGLE TAP
			this.click = 1;
			this.clickInterval = this.controller.window.setInterval(this.killlClick.bind(this), 450);
		}
	}
};*/


/********************
 *
 * KILL CLICK
 *
 ********************/
/*BooktpAssistant.prototype.killlClick = function () {
	//////////////////////////////////
	// Clear if only single tap
	this.click = 0;
	this.controller.window.clearInterval(this.clickInterval);
	this.clickInterval = null;
};*/


/********************
 *
 * DO FULLSCREEN
 *
 ********************/
/*BooktpAssistant.prototype.doFullScreen = function (forceSelection, event) {
	if (forceSelection) {
		switch (forceSelection) {
		case 'big':
			this.controller.enableFullScreenMode(true);
			this.prefsModel.isFullScreen = true;
			this.prefs.put(this.prefsModel);
			forceSelection = null;
			//Mojo.Log.info("BIG:", this.controller.window.innerHeight, this.maxScreenHeight);
			break;
		case 'small':
			this.controller.enableFullScreenMode(false);
			this.prefsModel.isFullScreen = false;
			this.prefs.put(this.prefsModel);
			forceSelection = null;
			//Mojo.Log.info("SMALL:", this.controller.window.innerHeight, this.maxScreenHeight);
			break;
		}
	}
};*/


/********************
 *
 * DISPLAY LIST
 *
 ********************/
BooktpAssistant.prototype.displayList = function (transaction, results) {
	try {

		if (results.rows.length === 0) {
			this.writeDefaults(transaction, results);
		}

		this.bookmarkMenuModelItems = [];

		if (results.rows.length > 0) {
			for (i = 0; i < results.rows.length; i++) {
				try {
					var row = results.rows.item(i);
					var pn = row.pageNumber.substr(row.pageNumber.indexOf("_p") + 2);
					var buildrow = [];

					if (pn.indexOf('_top') >= 0) {
						pn = pn.replace('_top', '');
					}

					var prettylabel = 'p' + pn + ', ' + SBB.chapterList[row.chapterNumber].label;

					if (row.bookmarkName === prettylabel) {
						buildrow = {
							label: prettylabel,
							command: row.id
						};
					} else {
						buildrow = {
							label: row.bookmarkName,
							command: row.id
						};
					}

					this.bookmarkMenuModelItems.push(buildrow);

				} catch (buildrowerror) {Mojo.Log.error(">>>>> BooktpAssistant - results.rows ERROR:", buildrowerror);}
			}
		} else {
			Mojo.Log.warning("--- displayList: ZOOT!");
		}

	} catch (displayListError) {Mojo.Log.error(">>>>> BooktpAssistant - displayList ERROR:", displayListError);}
};


/********************
 *
 * CREATE MY TABLE
 *
 ********************/
BooktpAssistant.prototype.createMyTable = function () {
	try {
		if (this.debugMe === true) {Mojo.Log.info("@@ ENTER createMyTable @@");}

		SBB.db = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);

		SBB.db.transaction(

		function (transaction) {
			transaction.executeSql("CREATE TABLE IF NOT EXISTS 'SBB_Bookmarks_Table' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, bookmarkName TEXT, chapterNumber INTEGER, pageNumber TEXT, pagePosition INTEGER)", [], this.writeDefaults.bind(this), this.dbErrorHandler.bind(this));
		}.bind(this));

		if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE createMyTable @@");}

	} catch (createMyTableError) {Mojo.Log.error("createMyTable ERROR", createMyTableError);}
};


/********************
 *
 * WRITE DEFAULTS
 *
 ********************/
BooktpAssistant.prototype.writeDefaults = function (transaction, results) {
	try {
		if (this.debugMe === true) {Mojo.Log.info("@@ ENTER writeDefaults @@");}

		if (results.rows.length === 0) {

			Mojo.Log.warn("******* BLANK DB!");

			SBB.defaultEntries = [];
			SBB.defaultEntries[0] = {
				bookmarkName: 'The Steps',
				chapterNumber: '6',
				pageNumber: 'howitworks_p59',
				pagePosition: '0.07917297024710035'
			};
			SBB.defaultEntries[1] = {
				bookmarkName: 'The Promises',
				chapterNumber: '7',
				pageNumber: 'intoaction_p83',
				pagePosition: '0.7117332494495124'
			};
			SBB.defaultEntries[2] = {
				bookmarkName: 'Third Step Prayer',
				chapterNumber: '6',
				pageNumber: 'howitworks_p63',
				pagePosition: '0.40202419907160797'
			};
			SBB.defaultEntries[3] = {
				bookmarkName: 'Seventh Step Prayer',
				chapterNumber: '7',
				pageNumber: 'intoaction_p76',
				pagePosition: '0.2467442592010066'
			};
			SBB.defaultEntries[4] = {
				bookmarkName: 'Road of Happy Destiny',
				chapterNumber: '12',
				pageNumber: 'avision_p164',
				pagePosition: '0.9546072134387352'
			};

			SBB.db.transaction(

			function (transaction) {
				for (i = 0; i < SBB.defaultEntries.length; i++) {
					transaction.executeSql("INSERT INTO 'SBB_Bookmarks_Table' (bookmarkName, chapterNumber, pageNumber, pagePosition) VALUES (?, ?, ?, ?)", [SBB.defaultEntries[i].bookmarkName, SBB.defaultEntries[i].chapterNumber, SBB.defaultEntries[i].pageNumber, SBB.defaultEntries[i].pagePosition], this.dbSuccessHandler.bind(this), this.dbErrorHandler.bind(this));
				}
			}.bind(this));
		}

		this.initialPopulate();

		if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE writeDefaults @@");}
	} catch (writeDefaultsError) {Mojo.Log.error(">>>>> BooktpAssistant - writeDefaults ERROR", error);}
};


/********************
 *
 * ADD BOOKMARK
 *
 ********************/
BooktpAssistant.prototype.addBookmark = function (transaction, results) {

	var bmpn = this.pageNumber.substr(this.pageNumber.indexOf('_p') + 2);

	if (bmpn.indexOf('_top') >= 0) {
		bmpn = bmpn.replace('_top', '');
	}

	var bmlabel = 'p' + bmpn + ', ' + SBB.chapterList[this.myIndex].label;

	SBB.db.transaction(

	function (transaction) {
		transaction.executeSql("INSERT INTO 'SBB_Bookmarks_Table' (bookmarkName, chapterNumber, pageNumber, pagePosition) VALUES (?, ?, ?, ?)", [bmlabel, this.myIndex, this.pageNumber, this.percentDown], function (transaction, results) {
			var newBP = this.pageNumber.substr(this.pageNumber.indexOf("_p") + 2);
			if (newBP.indexOf('_top') >= 0) {
				newBP = newBP.replace('_top', '');
			}
			Mojo.Controller.getAppController().showBanner("Added bookmark to page " + newBP, {
				source: 'notification'
			});
			this.initialPopulate();
		}.bind(this), this.dbErrorHandler.bind(this));
	}.bind(this));
};


/********************
 *
 * DB RESPONSES
 *
 ********************/
BooktpAssistant.prototype.dbSuccessHandler = function (transaction, results) {
	if (this.debugMe === true) {Mojo.Log.info(">>>>> BooktpAssistant - dbSuccessHandler", Object.toJSON(transaction), " -", Object.toJSON(results));}
	this.initialPopulate();
};
BooktpAssistant.prototype.dbErrorHandler = function (transaction, errors) {
	Mojo.Log.error(">>>>> BooktpAssistant - dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
	Mojo.Controller.errorDialog("dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
};


/*	this.controller.showAlertDialog({
		onChoose: function(value) {
			if (value === 'ok') {
				this.deleteRows();
			}
		},
		title:$L('Reset Bookmarks'),
		message:$L('Are you sure you want to reset all bookmarks?'),
		cancelable:true,
		choices:[
			{label:$L('Reset Bookmarks'), value:'ok', type:'negative'},
			{label:$L('Cancel'), value:'cancel'}
		]
	});*/
