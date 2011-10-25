Mojo.Log.info("=======================  START DOCK =======================");

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

function DockAssistant() {
	this.debugMe = true;
	this.fullBright = false;
	this.firstRun = true;
	thisQuote = (Math.floor(Math.random() * 10000));
	rawPhrases = [];
}


/********************
 *
 * SETUP
 *
 ********************/
DockAssistant.prototype.setup = function () {
	//  ****  Get the preferences from cookie
	if (! (this.prefs)) {
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
	}

	if(this.prefsModel.isTouchPad === true) {
		this.controller.get('bookPhrases').addClassName('docktouchpadfix');
	}

	this.gatherPhrases();

	$('body_wallpaper').style.background = "black";
	this.controller.document.body.className = 'dock';
	this.bookPhrases = this.controller.get('bookPhrases');
	this.bookPhrases.innerHTML = this.getRandomBookPhrases("SETUP");
};


/********************
 *
 * ACTIVATE
 *
 ********************/
DockAssistant.prototype.activate = function (event) {
	if (this.controller.stageController.setWindowOrientation) {
		this.controller.stageController.setWindowOrientation("up");
	}

	//this.screenTapHandler = this.getRandomBookPhrases.bindAsEventListener(this);
	//this.controller.document.addEventListener(Mojo.Event.tap, this.screenTapHandler, true);

	this.stageDeactivateHandler = this.stageDeactivate.bindAsEventListener(this);
	this.controller.document.addEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

	this.stageActivateHandler = this.stageActivate.bindAsEventListener(this);
	this.controller.document.addEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);
};


/********************
 *
 * DEACTIVATE
 *
 ********************/
DockAssistant.prototype.deactivate = function (event) {

	this.bookPhrases.style.display = "none";
	this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";
	this.bookPhrases.innerHTML = "";
	this.fullBright = false;
	this.prettyPhrase = null;

	this.resetClocks();

	rawPhrases = [];

	//this.controller.document.removeEventListener(Mojo.Event.tap, this.screenTapHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);
};


/********************
 *
 * CLEANUP
 *
 ********************/
DockAssistant.prototype.cleanup = function (event) {

	this.bookPhrases.innerHTML = "";
	this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";
	this.fullBright = false;
	this.prettyPhrase = null;

	this.resetClocks();
	rawPhrases = [];

	//this.controller.document.removeEventListener(Mojo.Event.tap, this.screenTapHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);
};


DockAssistant.prototype.handleCommand = function(event) {};


/********************
 *
 * STAGE DEACTIVATE
 *
 ********************/
DockAssistant.prototype.stageDeactivate = function (event) {
	this.bookPhrases.style.display = "none";
	this.prettyPhrase = null;
	this.fullBright = false;
	this.resetClocks();
	rawPhrases = [];
};


/********************
 *
 * STAGE ACTIVATE
 *
 ********************/
DockAssistant.prototype.stageActivate = function (event) {
	if (rawPhrases.length <= 0) {
		this.gatherPhrases();
	}

	if (this.firstRun === false) {
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
		this.bookPhrases.innerHTML = this.getRandomBookPhrases();
	}
};



/********************
 *
 * KILL TIMERS
 *
 ********************/
DockAssistant.prototype.resetClocks = function () {
	this.doThePhrase = null;

	for (i in this) {
		if (i.indexOf('Timer') >= 0) {
			//Mojo.Log.info("Timer Reset:", i, "|", this[i], "|");
			clearTimeout(this[i]);
			//this[i] = null;
		}
	}
	return;
}


/********************
 *
 * GATHER PHRASES
 *
 ********************/
DockAssistant.prototype.gatherPhrases = function () {
	if (rawPhrases.length <= 0) {
		rawPhrases = []
		gatherCount = 0;

		//var lcUrl = "junk/bustedphrases.html";
		//var lcUrl = "books/dockfulltext.txt";
		var lcUrl = "books/fulltext.html";
		new Ajax.Request(lcUrl, {
			method: 'get',
			onComplete: function (transport) {
				rawPhrases = rawPhrases.concat(transport.responseText.split("."));
				this.getRandomBookPhrases("FROM GATHER");
				return rawPhrases;
			},
			onSuccess: function (transport) {if (this.debugMe === true) {Mojo.Log.info("FINISHED PARSING TEXT");}},
			onFailure: function (transport) {Mojo.Log.error("FAILURE READING books/fulltext.html");}
		});
	}
};


/********************
 *
 * SANITIZER
 *
 ********************/
DockAssistant.prototype.sanitizer = function (sString) {
	try {
	if (sString.length > 0) {
		if (sString.indexOf('palm-divider') >= 0) {
			sString = sString.replace(sString.substring(sString.indexOf('<table'), (sString.indexOf('table>') + 6)), '');
		}

		sString = sString.replace(/<.*?>/g, '');
		sString = sString.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');

		if ( (sString.length < 12) || (sString.length > 142) ) {
			Mojo.Log.info("BAD LENGTH");
			this.resetClocks();
			this.getRandomBookPhrases("BadLength");
		}

		if (thisQuote >= 1) {
			//ends with
			if ((sString.indexOf('Dr') === (sString.length - 2)) || (sString.indexOf('Mr') === (sString.length - 2))) {
// 				sString = sString + "." + rawPhrases[(thisQuote + 1)];
				this.resetClocks();
				//this.phraseTimer = null;
				this.getRandomBookPhrases("DR1");
			}
			//starts with
			if ((sString.indexOf('Dr') === 0) || (sString.indexOf('Mr') === 0) ) {
// 				sString = rawPhrases[(thisQuote - 1)] + sString + "." + rawPhrases[(thisQuote + 1)];
				this.resetClocks();
				//this.phraseTimer = null;
				this.getRandomBookPhrases("DR2");
			}
			//previous ends with
// 			if ( (rawPhrases[(thisQuote - 1)].indexOf('Dr') === (rawPhrases[(thisQuote - 1)].length - 2)) || (rawPhrases[(thisQuote - 1)].indexOf('Mr') === (rawPhrases[(thisQuote - 1)].length - 2)) ){
// // 				sString = rawPhrases[(thisQuote - 2)] + "." + rawPhrases[(thisQuote - 1)] + "." + sString + "." + rawPhrases[(thisQuote + 1)];
// 				this.resetClocks();
// 				//this.phraseTimer = null;
// 				this.getRandomBookPhrases("DR3");
// 			}
		}

		if (thisQuote >= 1) {
			//ends with
			if (sString.indexOf('A') === (sString.length - 1)) {
// 				sString = sString + "." + rawPhrases[(thisQuote + 1)];
				this.resetClocks();
				//this.phraseTimer = null;
				this.getRandomBookPhrases("A1");
			}
			//starts with
// 			if ((sString.indexOf('A') === 0) || (sString.indexOf('A') === 0) ) {
// // 				sString = rawPhrases[(thisQuote - 1)] + sString + "." + rawPhrases[(thisQuote + 1)];
// 				this.resetClocks();
// 				this.getRandomBookPhrases("A2");
// 			}
			//previous ends with
			if ( (rawPhrases[(thisQuote - 1)].indexOf('A') === (rawPhrases[(thisQuote - 1)].length - 2)) || (rawPhrases[(thisQuote - 1)].indexOf('A') === (rawPhrases[(thisQuote - 1)].length - 2)) ){
// 				sString = rawPhrases[(thisQuote - 2)] + "." + rawPhrases[(thisQuote - 1)] + "." + sString + "." + rawPhrases[(thisQuote + 1)];
				this.resetClocks();
				//this.phraseTimer = null;
				this.getRandomBookPhrases("A3");
			}
		}

		if (sString.indexOf('?') > 0) {
			// Just end at "?"
			sString = sString.substring(0, (sString.indexOf('?') + 1));
		}
		else if (sString.indexOf('!') > 0) {
			// Just end at "!"
			sString = sString.substring(0, (sString.indexOf('!') + 1));
		}
		else {
			//Otherwise put the "." back in.
			//Mojo.Log.info("PERIOD:", sString.lastIndexOf("."))
			if (sString.lastIndexOf(".") < 0) {
				sString = sString + ".";
			}
		}

		while (sString.indexOf('"') >= 0) {sString = sString.replace('"', '');}
		while (sString.indexOf('[') >= 0) {sString = sString.replace('[', '');}
		while (sString.indexOf(']') >= 0) {sString = sString.replace(']', '');}
		while (sString.indexOf('- ') >= 0) {sString = sString.replace('- ', '');}
		while (sString.indexOf(' -') >= 0) {sString = sString.replace(' -', '');}
		while (sString.indexOf('*') >= 0) {sString = sString.replace('*', '');}

		return sString;
	}
	else {
		this.resetClocks();
		sString = null
		//this.phraseTimer = null;
		this.getRandomBookPhrases("SANITIZER EMPTY");
		//return null;
	}

	} catch (sanitizerError) {/*Mojo.Log.error(">>>>>>> THE SANITIZER", sanitizerError, "+", sString);*/}
};


/********************
 *
 * Random Book Phrases
 *
 ********************/
DockAssistant.prototype.getRandomBookPhrases = function (passedinfo) {
try {
	if ( (passedinfo) && (this.debugMe === true) ) {Mojo.Log.info("<+>+<+>  PASSED INFO:", passedinfo, "<+>+<+>");passedinfo = null;}

	thisQuote = Math.floor(Math.random() * 10000);

	this.doThePhrase = setTimeout(function () {
	try {
		if (rawPhrases.length > 0) {
			while (thisQuote >= (rawPhrases.length)) {
				thisQuote = Math.floor(Math.random() * 10000);
			}
		}
		else {
			rawPhrases = this.gatherPhrases();
			return rawPhrases;
		}

		try{
			if (this.debugMe === true) {Mojo.Log.info("------- BEFORE STRIP:", rawPhrases[thisQuote].length, "+", thisQuote, "+", rawPhrases[thisQuote]);}

			if ( (! rawPhrases[thisQuote]) || (! rawPhrases) || (rawPhrases[thisQuote].length <= 0) || (this.prettyPhrase <= 0) ) {
				this.prettyPhrase = null;
				clearTimeout(this.doThePhrase);
				this.getRandomBookPhrases();
			}

			this.prettyPhrase = this.sanitizer(rawPhrases[thisQuote]);

		} catch (SendToSanitizerError) {/*Mojo.Log.error(">>>>>>> Send To Sanitizer", SendToSanitizerError, "thisQuote:", thisQuote, "rawPhrases:", rawPhrases.length);*/}

		this.firstRun = false;
		//this.prettyPhrase = this.sanitizer(this.prettyPhrase);
		this.prettyPhrase = "<span class='serifFont'>" + this.prettyPhrase.charAt(0) + "</span>" + this.prettyPhrase.substring(1, this.prettyPhrase.length);

		if (this.debugMe === true) {Mojo.Log.info("------- SEND FINAL:", this.prettyPhrase.length, "+", this.prettyPhrase);}

		this.groovyFadeDecision(this.bookPhrases, this.prettyPhrase);

	} catch (doThePhraseError) {Mojo.Log.error(">>>>>>> doThePhrase", doThePhraseError, "thisQuote:", thisQuote, "rawPhrases:", rawPhrases.length, "this.prettyPhrase:", this.prettyPhrase);}
	}.bind(this), 10);
} catch (error) {/*Mojo.Log.error("ALL PAGES", error);*/}
};


/********************
 *
 * FADE DECISION
 *
 ********************/
DockAssistant.prototype.groovyFadeDecision = function (element, phrase) {

	if (this.fullBright === false) {
		this.groovyCounter = 0;
		element.innerHTML = phrase;
		this.bookPhrases.style.display = "block";
		this.groovyFadeIn(element, phrase);
	}
	else {
		this.groovyCounter = 100;
		this.groovyFadeOut(element, phrase);
	}
};


/********************
 *
 * FADE OUT
 *
 ********************/
DockAssistant.prototype.groovyFadeOut = function (element, phrase) {
	if (this.groovyCounter >= 0) {
		element.style.color = "rgba(250, 250, 250, " + (this.groovyCounter * 0.01) + ")";
		this.groovyCounter--;
		this.groovyFadeOutTimer = setTimeout(this.groovyFadeOut.bind(this, element, phrase), 24);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ FINISH FADE OUT @@", element.style.color);}
		this.fullBright = false;
		this.resetClocks();
		element.innerHTML = phrase;
		this.groovyFadeIn(element, phrase);
	}
};


/********************
 *
 * FADE IN
 *
 ********************/
DockAssistant.prototype.groovyFadeIn = function (element, phrase) {

	if (this.groovyCounter <= 100) {
		element.style.color = "rgba(250, 250, 250, " + (this.groovyCounter * 0.01) + ")";
		this.groovyCounter++;
		this.groovyFadeInTimer = setTimeout(this.groovyFadeIn.bind(this, element, phrase), 24);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ FINISH FADE IN @@", element.style.color);}
		this.fullBright = true;
		this.resetClocks();
		this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.prefsModel.dockPhraseSpeed);
	}
};
