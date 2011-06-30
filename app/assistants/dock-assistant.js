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
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER DocAssistant @@");}

	this.debugMe = true;
	this.prettyPhrase = null;
	this.fullBright = false;
	this.groovyTimer = 0.0;
	this.firstRun = true;
	rawPhrases = [];
	thisQuote = (Math.floor(Math.random() * 10000));

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE DocAssistant @@");}
}


/********************
 *
 * SETUP
 *
 ********************/
DockAssistant.prototype.setup = function () {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER setup @@");}

	//  ****  Get the preferences from cookie
	if (! (this.prefs)) {
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
	}
	//  ****  End of getting Preferences from cookie

	if (rawPhrases.length <= 0) {
		this.gatherPhrases();
	}

	//  ****  Setup for Application Menu
	//if (! this.prefsModel.launchParams.dockMode) {
	//	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);
	//}

	this.controller.document.body.className = 'dock';
	this.bookPhrases = this.controller.get('bookPhrases');
	this.bookPhrases.innerHTML = this.getRandomBookPhrases();


if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE setup @@");}
};


/********************
 *
 * ACTIVATE
 *
 ********************/
DockAssistant.prototype.activate = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER activate @@");}


	//if (this.controller.stageController.setWindowOrientation) {
	//	this.controller.stageController.setWindowOrientation("free");
	//}

	//this.screenTapHandler = this.getRandomBookPhrases.bindAsEventListener(this);
	//this.controller.document.addEventListener(Mojo.Event.tap, this.screenTapHandler, true);

	this.stageDeactivateHandler = this.stageDeactivate.bindAsEventListener(this);
	this.controller.document.addEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

	//this.stageActivateHandler = this.stageActivate.bindAsEventListener(this);
	//this.controller.document.addEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE activate @@");}
};


/********************
 *
 * DEACTIVATE
 *
 ********************/
DockAssistant.prototype.deactivate = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER deactivate @@");}

	this.bookPhrases.style.display = "none";
	this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";
	this.bookPhrases.innerHTML = "";

	rawPhrases = [];

	clearTimeout(this.groovyFadeInTimer);
	clearTimeout(this.groovyFadeOutTimer);
	clearTimeout(this.doThePhrase);
	//clearInterval(this.phraseTimer);
	clearTimeout(this.phraseTimer);
	this.phraseTimer = null;
	this.groovyFadeInTimer = null;
	this.groovyFadeInTimer = null;
	this.groovyTimer = null;

	this.doThePhrase = null;

	this.fullBright = false;
	this.prettyPhrase = null;
	//this.controller.document.removeEventListener(Mojo.Event.tap, this.screenTapHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE deactivate @@");}
};


/********************
 *
 * CLEANUP
 *
 ********************/
DockAssistant.prototype.cleanup = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER cleanup @@");}

	this.bookPhrases.innerHTML = "";
	this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";

	rawPhrases = [];

	clearTimeout(this.groovyFadeInTimer);
	clearTimeout(this.groovyFadeOutTimer);
	clearTimeout(this.doThePhrase);
	//clearInterval(this.phraseTimer);
	clearTimeout(this.phraseTimer);
	this.phraseTimer = null;
	this.groovyFadeInTimer = null;
	this.groovyFadeOutTimer = null;
	this.doThePhrase = null;

	this.fullBright = false;
	this.prettyPhrase = null;
	this.groovyTimer = 0.0;
	//this.controller.document.removeEventListener(Mojo.Event.tap, this.screenTapHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE cleanup @@");}
};


DockAssistant.prototype.handleCommand = function(event) {};


/********************
 *
 * STAGE DEACTIVATE
 *
 ********************/
DockAssistant.prototype.stageDeactivate = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER stageDeactivate @@");}

	this.bookPhrases.style.display = "none";
	this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";
	this.bookPhrases.innerHTML = "";

	rawPhrases = [];

	clearTimeout(this.groovyFadeInTimer);
	clearTimeout(this.groovyFadeOutTimer);
	clearTimeout(this.doThePhrase);
	//clearInterval(this.phraseTimer);
	clearTimeout(this.phraseTimer);
	this.phraseTimer = null;
	this.groovyFadeInTimer = null;
	this.groovyFadeOutTimer = null;
	this.groovyTimer = 0.0;
	this.doThePhrase = null;
	this.prettyPhrase = null;
	this.fullBright = false;

	this.controller.document.removeEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

	this.stageActivateHandler = this.stageActivate.bindAsEventListener(this);
	this.controller.document.addEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);


if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE stageDeactivate @@");}
};


/********************
 *
 * STAGE ACTIVATE
 *
 ********************/
DockAssistant.prototype.stageActivate = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER stageActivate @@");}

	if (rawPhrases.length <= 0) {
		this.gatherPhrases();
	}

	if (this.firstRun === false) {

		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
		this.bookPhrases.innerHTML = this.getRandomBookPhrases();

		this.controller.document.removeEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);

		this.stageDeactivateHandler = this.stageDeactivate.bindAsEventListener(this);
		this.controller.document.addEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);
	}

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE stageActivate @@");}
};



/********************
 *
 * SANITIZER
 *
 ********************/
DockAssistant.prototype.sanitizer = function (sString) {
	try {
		if (sString.indexOf('palm-divider') >= 0) {
			sString = sString.replace(sString.substring(sString.indexOf('<table'), (sString.indexOf('table>') + 6)), '');
		}

		sString = sString.replace(/<.*?>/g, '');

		sString = sString.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');

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

		if (sString.length < 12) {
			if (this.debugMe === true) {Mojo.Log.info("FIRST BAD LENGTH!", sString.length);}
				//this.prettyPhrase = null;
				clearTimeout(this.doThePhrase);
				this.getRandomBookPhrases();
		}

	return sString;
	
	} catch (sanitizerError) {Mojo.Log.error(">>>>>>> THE SANITIZER", sanitizerError, "+", sString);}
	return sString;
};


/********************
 *
 * GATHER PHRASES
 *
 ********************/
DockAssistant.prototype.gatherPhrases = function () {
try {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER gatherPhrases @@", rawPhrases.length);}

	if (rawPhrases.length <= 0) {
		if (this.debugMe === true) {Mojo.Log.info("BEFORE rawPhrases:", rawPhrases.length);}

		//var lcUrl = "bustedphrases.html";
		var lcUrl = "books/fulltext.html";
		new Ajax.Request(lcUrl, {
			method: 'get',
			onComplete: function (transport) {
				rawPhrases = rawPhrases.concat(transport.transport.responseText.split("."));
			},
			onSuccess: function (transport) {if (this.debugMe === true) {Mojo.Log.info("FINISHED PARSING TEXT");}},
			onFailure: function (transport) {Mojo.Log.error("FAILURE:");}
		});
	}

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE gatherPhrases @@", rawPhrases.length);}
} catch (error) {Mojo.Log.error("ALL PAGES", error);}
};


/********************
 *
 * Random Book Phrases
 *
 ********************/
DockAssistant.prototype.getRandomBookPhrases = function () {
try {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER getRandomBookPhrases @@");}

	thisQuote = Math.floor(Math.random() * 10000);

	this.doThePhrase = setTimeout(function () {
	try {
		if (this.debugMe === true) {Mojo.Log.info("START - rawPhrases:", rawPhrases.length, "thisQuote:", thisQuote);}
		if (rawPhrases.length > 0) {
			while (thisQuote > (rawPhrases.length - 1)) {
				thisQuote = Math.floor(Math.random() * 10000);
			}
		}
		else {
			this.gatherPhrases();
		}

		if (this.debugMe === true) {Mojo.Log.info("START - rawPhrases:", rawPhrases.length, "thisQuote:", thisQuote);}

		try{
			if (this.debugMe === true) {Mojo.Log.info("------- BEFORE STRIP:", rawPhrases[thisQuote].length, "+", thisQuote, "+", rawPhrases[thisQuote]);}

			if ( (! rawPhrases[thisQuote]) || (! rawPhrases) || (rawPhrases[thisQuote].length <= 0) ) {
				this.prettyPhrase = null;
				clearTimeout(this.doThePhrase);
				this.getRandomBookPhrases();
			}

			this.prettyPhrase = this.sanitizer(rawPhrases[thisQuote]);

			//testPhrase = this.prettyPhrase.concat(this.prettyPhrase.split(" "));
			//testPhrase = this.prettyPhrase.split(" ");
			//Mojo.Log.info("testPhrase:", testPhrase.length);
			//for (i = 0; i < testPhrase.length; i++) {
			//	Mojo.Log.info("testPhrase:", testPhrase[i]);
			//}

		} catch (SendToSanitizerError) {Mojo.Log.error(">>>>>>> Send To Sanitizer", SendToSanitizerError, "thisQuote:", thisQuote, "rawPhrases:", rawPhrases.length);}

		/////////////////////////////////////////////////////
		// Ends in "A", Starts with "A", Previous ends in "A"
		
		//This starts, previous ends
		/*if (thisQuote > 0) {
			if (this.prettyPhrase.indexOf('A') === 0) {
				if (rawPhrases[thisQuote].indexOf('A') === (rawPhrases[(thisQuote -1)].length -1)) {
					//Mojo.Log.info("++ PREVIOUS ENDS WITH A");
					if (rawPhrases[(thisQuote - 2)]) {
						this.prettyPhrase = rawPhrases[(thisQuote - 2)] + rawPhrases[(thisQuote - 1)] + "." + this.prettyPhrase + "." + rawPhrases[(thisQuote + 1)];
					}
					else {
						this.prettyPhrase = rawPhrases[(thisQuote - 1)] + "." + this.prettyPhrase + "." + rawPhrases[(thisQuote + 1)];
					}
				}
			}
		}*/
		//This ends, next starts
try {		if (thisQuote > 0) {
			if (this.prettyPhrase.indexOf('A') === this.prettyPhrase.length -1) {
				Mojo.Log.error("MEGA-BUSTED:", this.prettyPhrase);
				this.prettyPhrase = null;
				clearTimeout(this.doThePhrase);
				this.getRandomBookPhrases();
				/*if (rawPhrases[(thisQuote + 1)].indexOf('A') === 0) {
					//Mojo.Log.info("++ NEXT STARTS WITH A");
					if (rawPhrases[(thisQuote + 2)]) {
						this.prettyPhrase = this.prettyPhrase + "." + rawPhrases[(thisQuote + 1)] + "." + rawPhrases[(thisQuote + 2)];
					}
					else {
						this.prettyPhrase = this.prettyPhrase + "." + rawPhrases[(thisQuote + 1)];
					}
				}*/
			}
		}
		/////////////////////////////////////////////////////
		} catch (rawPhrasesError) {Mojo.Log.error(">>>>>>> rawPhrasesError", rawPhrasesError, "thisQuote:", thisQuote, "rawPhrases:", rawPhrases.length, this.prettyPhrase);}


		/////////////////////////////////////////////////////
		//"Mr." and "Dr." get cut too.  
		// Farm it out.
		//
		
		// ends with 
		if (thisQuote > 0) {
			if ((this.prettyPhrase.indexOf('Dr') === (this.prettyPhrase.length - 2)) || (this.prettyPhrase.indexOf('Mr') === (this.prettyPhrase.length - 2))) {
				this.prettyPhrase = this.prettyPhrase + "." + rawPhrases[(thisQuote + 1)];
			}
		}
		//starts with
		else if ((this.prettyPhrase.indexOf('Dr') === 0) || (this.prettyPhrase.indexOf('Mr') === 0) ) {
			this.prettyPhrase = rawPhrases[(thisQuote - 1)] + this.prettyPhrase + "." + rawPhrases[(thisQuote + 1)];
		}
		//previous ends with
		else if (thisQuote > 0) {
			if ( (rawPhrases[(thisQuote - 1)].indexOf('Dr') === (rawPhrases[(thisQuote - 1)].length - 2)) || (rawPhrases[(thisQuote - 1)].indexOf('Mr') === (rawPhrases[(thisQuote - 1)].length - 2)) ){
				this.prettyPhrase = rawPhrases[(thisQuote - 2)] + "." + rawPhrases[(thisQuote - 1)] + "." + this.prettyPhrase + "." + rawPhrases[(thisQuote + 1)];
			}
		}
		/////////////////////////////////////////////////////


		if ((this.prettyPhrase.length < 12) || (this.prettyPhrase.length > 142)) {
			if (this.debugMe === true) {Mojo.Log.info("SECOND BAD SIZE!", this.prettyPhrase.length);}
			this.prettyPhrase = null;
			clearTimeout(this.doThePhrase);
			this.getRandomBookPhrases();
		}
		else {
			this.firstRun = false;
			this.prettyPhrase = this.sanitizer(this.prettyPhrase);
			if (this.debugMe === true) {Mojo.Log.info("------- SEND FINAL:", this.prettyPhrase.length, "+", this.prettyPhrase);}

			this.groovyFadeDecision(this.bookPhrases, this.prettyPhrase);
		}
	} catch (doThePhraseError) {Mojo.Log.error(">>>>>>> doThePhrase", doThePhraseError, "thisQuote:", thisQuote, "rawPhrases:", rawPhrases.length, "this.prettyPhrase:", this.prettyPhrase);}
	}.bind(this), 10);
if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE getRandomBookPhrases @@");}
} catch (error) {Mojo.Log.error("ALL PAGES", error);}
};


/********************
 *
 * FADE DECISION
 *
 ********************/
DockAssistant.prototype.groovyFadeDecision = function (element, phrase) {
	if (this.fullBright === true) {
		this.groovyTimer = 100;
		this.groovyFadeOut(element, phrase);
	}
	else {
		this.groovyTimer = 0;
		this.setThePhrase(element, phrase);
	}
};


/********************
 *
 * SET THE PHRASE
 *
 ********************/
DockAssistant.prototype.setThePhrase = function (element, phrase) {
	element.innerHTML = phrase;
	this.groovyFadeIn(element, phrase);
	//this.testerThing(element, phrase);
};


/********************
 *
 * FADE OUT
 *
 ********************/
DockAssistant.prototype.groovyFadeOut = function (element, phrase) {
	if (this.groovyTimer > 0) {
		element.style.color = "rgba(250, 250, 250, " + (this.groovyTimer * 0.01) + ")";
		this.groovyTimer--;
		this.groovyFadeOutTimer = setTimeout(this.groovyFadeOut.bind(this, element, phrase), 16);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ FINISH FADE OUT @@");}
		this.bookPhrases.style.display = "none";
		element.style.color = "rgba(250, 250, 250, 0.0)";
		this.fullBright = false;
		this.setThePhrase(element, phrase);
		//clearInterval(this.phraseTimer);
		clearTimeout(this.phraseTimer);
		this.phraseTimer = null;
	}
};


/********************
 *
 * FADE IN
 *
 ********************/
DockAssistant.prototype.groovyFadeIn = function (element, phrase) {

	this.bookPhrases.style.display = "block";

	if (this.groovyTimer < 100) {
		element.style.color = "rgba(250, 250, 250, " + (this.groovyTimer * 0.01) + ")";
		this.groovyTimer++;
		this.groovyFadeInTimer = setTimeout(this.groovyFadeIn.bind(this, element, phrase), 16);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ FINISH FADE IN @@");}
		this.fullBright = true;

		if (! this.phraseTimer) {
			//this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.prefsModel.dockPhraseSpeed);
			this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), 1000);
		}
	}
};


/********************
 *
 * PRINT WORDS FADE IN
 *
 ********************/
DockAssistant.prototype.printWordsFadeIn = function (element, word, wordNumber) {

	this.bookPhrases.style.display = "block";
	//element.style.color = "rgba(250, 250, 250, 1";

	if (this.groovyTimer < 100) {
		element.style.color = "rgba(250, 250, 250, " + (this.groovyTimer * 0.01) + ")";
		this.groovyTimer++;
		this.groovyFadeInTimer = setTimeout(this.groovyFadeIn.bind(this, element, word), 16);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ FINISH FADE IN @@");}
		this.fullBright = true;

		if (! this.wordPrintTimer) {
			//this.phraseTimer = setInterval(this.getRandomBookPhrases.bind(this), this.prefsModel.dockPhraseSpeed);
			//this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.prefsModel.dockPhraseSpeed);
			wordNumber++;
			this.wordPrintTimer = setTimeout(this.testerThing(element, word, wordNumber), 1000);
		}
	}
};


DockAssistant.prototype.testerThing = function (element, phrase, wordNumber) {
	testPhrase = phrase.split(" ");
	//innerSplit = element.innerHTML.split(" ");
	//Mojo.Log.info("testPhrase:", testPhrase.length);
	//Mojo.Log.info("innerSplit:", innerSplit.length);

	if (wordNumber) {
		if (wordNumber <= phrase.length)
		{
			this.printWordsFadeIn(element, testPhrase[wordNumber], wordNumber);
		}
	}
	else {
		wordNumber = 0;
		//for (i = 0; i < testPhrase.length; i++) {
		//Mojo.Log.info("testPhrase:", testPhrase[i]);
		//this.testTimer = setTimeout(this.testerThing(element, testPhrase[i]), 1000);
		this.printWordsFadeIn(element, testPhrase[wordNumber], wordNumber);
	}

	wordNumber = null;
	this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), 3000);

	//Mojo.Log.info("testerThing:", word);
	//element.innerHTML = element.innerHTML + word;
	//clearTimeout(this.testTimer);
	//this.testTimer = null;
};




