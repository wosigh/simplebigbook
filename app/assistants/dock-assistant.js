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

	this.debugMe = false;
	this.prettyPhrase = 'undefined';
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

	this.gatherPhrases();

	//  ****  Setup for Application Menu
	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);

	this.isVisible = true;
	this.controller.document.body.className = 'dock';
	this.bookPhrases = this.controller.get('bookPhrases');
	this.bookPhrases.innerHTML = this.getRandomBookPhrases();

	//  ****  Get the preferences from cookie
	if (! (this.prefs)) {
		//Mojo.Log.info("********* NO COOKIE LOADED!");
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
	}
	//  ****  End of getting Preferences from cookie

	//Mojo.Log.info("+++ SETUP - this.phraseTimer:", this.phraseTimer);


if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE setup @@");}
};


/********************
 *
 * ACTIVATE
 *
 ********************/
DockAssistant.prototype.activate = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER activate @@");}


	if (this.controller.stageController.setWindowOrientation) {
		this.controller.stageController.setWindowOrientation("free");
	}

	/*this.screenTapHandler = this.getRandomBookPhrases.bindAsEventListener(this);
	this.controller.document.addEventListener(Mojo.Event.tap, this.screenTapHandler, true);*/

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

	clearTimeout(this.groovyFadeInTimer);
	clearTimeout(this.groovyFadeOutTimer);
	clearTimeout(this.doThePhrase);
	clearInterval(this.phraseTimer);
	this.phraseTimer = '';
	this.groovyFadeInTimer = '';
	this.groovyFadeInTimer = '';
	this.doThePhrase = '';

	this.fullBright = false;
	this.prettyPhrase = '';
	this.groovyTimer = 0.0;
	this.bookPhrases.innerHTML = "";
	this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";
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

	clearTimeout(this.groovyFadeInTimer);
	clearTimeout(this.groovyFadeOutTimer);
	clearTimeout(this.doThePhrase);
	clearInterval(this.phraseTimer);
	this.phraseTimer = '';
	this.groovyFadeInTimer = '';
	this.groovyFadeInTimer = '';
	this.doThePhrase = '';

	this.fullBright = false;
	this.prettyPhrase = '';
	this.groovyTimer = 0.0;
	this.bookPhrases.innerHTML = "";
	this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";
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

	clearTimeout(this.groovyFadeInTimer);
	clearTimeout(this.groovyFadeOutTimer);
	clearTimeout(this.doThePhrase);
	clearInterval(this.phraseTimer);
	this.phraseTimer = '';
	this.groovyFadeInTimer = '';
	this.groovyFadeInTimer = '';
	this.doThePhrase = '';
	this.prettyPhrase = '';

	this.fullBright = false;
	this.groovyTimer = 0.0;
	this.bookPhrases.innerHTML = "";
	this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";


	//this.controller.document.removeEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);
	this.controller.document.removeEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

	//this.stageDeactivateHandler = this.stageDeactivate.bindAsEventListener(this);
	//this.controller.document.addEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

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

	if (this.firstRun === false) {
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
		this.bookPhrases.innerHTML = this.getRandomBookPhrases();

		//this.controller.document.removeEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);
		this.controller.document.removeEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

		this.stageDeactivateHandler = this.stageDeactivate.bindAsEventListener(this);
		this.controller.document.addEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

		//this.stageActivateHandler = this.stageActivate.bindAsEventListener(this);
		//this.controller.document.addEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);
	}

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE stageActivate @@");}
};



/********************
 *
 * GATHER PHRASES
 *
 ********************/
DockAssistant.prototype.gatherPhrases = function () {
try {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER gatherPhrases @@", rawPhrases.length);}

	if (! rawPhrases.length > 0) {
		if (this.debugMe === true) {Mojo.Log.info("BEFORE rawPhrases:", rawPhrases.length);}

		//var lcUrl = "bustedphrases.html";
		var lcUrl = "books/fulltext.html";
		new Ajax.Request(lcUrl, {
			method: 'get',
			onComplete: {},
			onSuccess: function (transport) {
				rawPhrases = rawPhrases.concat(transport.transport.responseText.split("."));
			},
			onFailure: function (transport) {
				Mojo.Log.info("FAILURE:");
			}
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

	if (rawPhrases) {if (this.debugMe === true) {Mojo.Log.info("START rawPhrases:", rawPhrases.length);}}

	thisQuote = Math.floor(Math.random() * 10000);
	//this.prettyPhrase = null;

	this.doThePhrase = setTimeout(function () {
	try { 
		if (rawPhrases) {
			while (thisQuote > rawPhrases.length) {
				//if (this.debugMe === true) {Mojo.Log.info("BAD QUOTE NUMBER rawPhrases:", rawPhrases.length, " - thisQuote:", thisQuote);}
				thisQuote = Math.floor(Math.random() * 10000);
			}
		}
		
		try{ 
		if (rawPhrases[thisQuote].length < 12) {
			if (this.debugMe === true) {Mojo.Log.info("FIRST BAD LENGTH!", rawPhrases[thisQuote].length);}
			this.getRandomBookPhrases();
		}
		else if (rawPhrases[thisQuote].indexOf('footnote-ignore') >= 0) {
			this.getRandomBookPhrases();
		}
		else {
			this.prettyPhrase = rawPhrases[thisQuote];
		}
		} catch (error) {Mojo.Log.error("THE BIG DECISION", error);}
		
		
		if (this.debugMe === true) {Mojo.Log.info("PHRASE TO USE:", thisQuote, " -", this.prettyPhrase);}

		/////////////////////////////////////////////////////
		// Ends in "A", Starts with "A", Previous ends in "A"
		// Farm it out.
		//
		if (thisQuote > 0) {
			if ( (this.prettyPhrase.indexOf('A') === (this.prettyPhrase.length - 1)) || (this.prettyPhrase.indexOf('A') === 0) || (rawPhrases[(thisQuote - 1)].indexOf('A') === (rawPhrases[(thisQuote - 1)].length - 1)) ) {
				this.prettyPhrase = this.AAFixer(this.prettyPhrase);
			}
		}
		/////////////////////////////////////////////////////


		/////////////////////////////////////////////////////
		//"Mr." and "Dr." get cut too.  
		// Farm it out.
		//
		
		// ends with 
		if (thisQuote > 0) {
			if ((this.prettyPhrase.indexOf('Dr') === (this.prettyPhrase.length - 2)) || (this.prettyPhrase.indexOf('Mr') === (this.prettyPhrase.length - 2))) {
				Mojo.Log.info("ENDS DOCTOR -", rawPhrases[(thisQuote - 1)]);
				this.prettyPhrase = this.MrDrFixer(this.prettyPhrase, 'ends');
			}
		}
		//starts with
		if ((this.prettyPhrase.indexOf('Dr') === 0) || (this.prettyPhrase.indexOf('Mr') === 0) ) {
			Mojo.Log.info("STARTS DOCTOR -", rawPhrases[(thisQuote - 1)]);
			this.prettyPhrase = this.MrDrFixer(this.prettyPhrase, 'starts');
		}
		//previous ends with
		if (thisQuote > 0) {
			if ( (rawPhrases[(thisQuote - 1)].indexOf('Dr') === (rawPhrases[(thisQuote - 1)].length - 2)) || (rawPhrases[(thisQuote - 1)].indexOf('Mr') === (rawPhrases[(thisQuote - 1)].length - 2)) ){
				Mojo.Log.info("PREVIOUS DOCTOR -", rawPhrases[(thisQuote - 1)]);
				this.prettyPhrase = this.MrDrFixer(this.prettyPhrase, 'previous');
			}
		}
		/////////////////////////////////////////////////////


		////////////////////////////////////////////
		//  Strip HTML nd make prettyPhrase PRETTY!
		
		try {
		//Flat-out nuke the page headers
		while (this.prettyPhrase.indexOf('palm-divider labeled') >= 0) {
			this.prettyPhrase = this.prettyPhrase.replace(this.prettyPhrase.substring(this.prettyPhrase.indexOf('<table'), (this.prettyPhrase.indexOf('table>') + 6)), '');
			//Mojo.Log.info("TABLE:", this.prettyPhrase);
		}

		// strip all remining HTML markup
		while (this.prettyPhrase.indexOf('<') >= 0) {
			this.prettyPhrase = this.prettyPhrase.replace(this.prettyPhrase.substring(this.prettyPhrase.indexOf('<'), (this.prettyPhrase.indexOf('>') + 1)), '');
			//Mojo.Log.info("HTML:", this.prettyPhrase);
		}

		// Just end at "?"
		if (this.prettyPhrase.indexOf('?') > 0) {
			this.prettyPhrase = this.prettyPhrase.substring(0, (this.prettyPhrase.indexOf('?') + 1));
			if (this.debugMe === true) {Mojo.Log.info("NEW PHRASE - ? -", this.prettyPhrase);}
		}
		
		// Just end at "!"
		if (this.prettyPhrase.indexOf('!') > 0) {
			this.prettyPhrase = this.prettyPhrase.substring(0, (this.prettyPhrase.indexOf('!') + 1));
			if (this.debugMe === true) {Mojo.Log.info("NEW PHRASE - ! -", this.prettyPhrase);}
		}

		// DON'T add a period back to phrases that end in "?" or "!"
		if ((this.prettyPhrase.indexOf('?') < 0) && (this.prettyPhrase.indexOf('!') < 0)) {
			this.prettyPhrase = this.prettyPhrase + ".";
		}
		/*if ((this.prettyPhrase.indexOf('?') > 0) || (this.prettyPhrase.indexOf('!') > 0)) {
			//Mojo.Log.info("DONT PERIOD!", this.prettyPhrase.indexOf('!'), this.prettyPhrase.indexOf('?'));
			//this.prettyPhrase = this.prettyPhrase;
		}
		else {
			//Mojo.Log.info("ADD PERIOD!", this.prettyPhrase.indexOf('!'), this.prettyPhrase.indexOf('?'));
			this.prettyPhrase = this.prettyPhrase + ".";
		}*/

		if (this.debugMe === true) {Mojo.Log.info(this.prettyPhrase);}

		while (this.prettyPhrase.indexOf('"') >= 0) {
			this.prettyPhrase = this.prettyPhrase.replace('"', '');
			//this.prettyPhrase = this.prettyPhrase + '"';
		}
		while (this.prettyPhrase.indexOf('[') >= 0) {
			this.prettyPhrase = this.prettyPhrase.replace('[', '');
		}
		while (this.prettyPhrase.indexOf(']') >= 0) {
			this.prettyPhrase = this.prettyPhrase.replace(']', '');
		}
		while (this.prettyPhrase.indexOf('- ') >= 0) {
			this.prettyPhrase = this.prettyPhrase.replace('- ', '');
		}
		while (this.prettyPhrase.indexOf('*') >= 0) {
			this.prettyPhrase = this.prettyPhrase.replace('*', '');
		}
		} catch (error) {Mojo.Log.error("THE STRIPER", error);}

		if (this.debugMe === true) {Mojo.Log.info("this.prettyPhrase:", this.prettyPhrase.length, "-", this.prettyPhrase.indexOf('!'), "-", this.prettyPhrase);}

		if ((this.prettyPhrase.length < 12) || (this.prettyPhrase.length > 142)) {
			if (this.debugMe === true) {Mojo.Log.info("SECOND BAD SIZE!", this.prettyPhrase.length);}
			this.getRandomBookPhrases();
		}
		else {
			this.firstRun = false;
			if (! this.phraseTimer) {
				this.phraseTimer = setInterval(this.getRandomBookPhrases.bind(this), this.prefsModel.dockPhraseSpeed);
				//this.phraseTimer = setInterval(this.getRandomBookPhrases.bind(this), 8000);
			}
			//Mojo.Log.info("SEND:", this.prettyPhrase);
			this.groovyFadeDecision(this.bookPhrases, this.prettyPhrase);
		}
	} catch (error) {Mojo.Log.error("THE CLEANER", error);}
	}.bind(this), 10);
if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE getRandomBookPhrases @@");}
} catch (error) {Mojo.Log.error("ALL PAGES", error);}
};



/********************
 *
 * "A.A." Fixer
 *
 ********************/
DockAssistant.prototype.AAFixer = function (phrase) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER A.A. FIXER @@");}

	///////////////////////////////////////////////////////////////
	// If you're here, one of these is true:
	// 1) Current phrase starts with "A"
	// 2) Current phrase ends with "A"
	// 3) Previous phrase ended with "A"
	//
	// No need for further checking.
	//

	// Previous phrase ends in "A"
	if (rawPhrases[(thisQuote - 1)].indexOf('A') === (rawPhrases[(thisQuote - 1)].length - 1)) {
		Mojo.Log.info("++ PREVIOUS ENDS WITH A");
		//phrase = rawPhrases[(thisQuote - 2)] + "." + rawPhrases[(thisQuote - 1)] + "." + phrase + "." + rawPhrases[(thisQuote + 1)];
		phrase = rawPhrases[(thisQuote - 1)] + "." + phrase + "." + rawPhrases[(thisQuote + 1)];
		Mojo.Log.info(phrase);
		//return phrase;
	}
	
	// Next phrase starts with "A"
	if (rawPhrases[(thisQuote + 1)].indexOf('A') === 0) {
		Mojo.Log.info("++ NEXT STARTS WITH A");
		Mojo.Log.info("FIRST - IF");
		//phrase = rawPhrases[(thisQuote - 1)] + "." + phrase + "." + rawPhrases[(thisQuote + 1)] + "." + rawPhrases[(thisQuote + 2)];
		phrase = rawPhrases[(thisQuote - 1)] + "." + phrase + "." + rawPhrases[(thisQuote + 1)] + "." + rawPhrases[(thisQuote + 2)];
		Mojo.Log.info(phrase);
		//return phrase;
	}

	/*if (this.prettyPhrase.indexOf('A') === 0) {
		if (rawPhrases[(thisQuote - 1)].indexOf('A') === rawPhrases[(thisQuote - 1)].indexOf('A') - 1) {
			Mojo.Log.info("SECOND - IF");
			this.prettyPhrase = rawPhrases[(thisQuote - 1)] + rawPhrases[(thisQuote - 1)] + "." + this.prettyPhrase + "." + rawPhrases[(thisQuote + 1)] + "." + rawPhrases[(thisQuote + 2)];
			//return phrase;
		}
	}*/

	// Just send it back for some reason?!?
	return phrase;

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE A.A. FIXER @@");}
};


/********************
 *
 * "Mr" & "Dr" Fixer
 *
 ********************/
DockAssistant.prototype.MrDrFixer = function (phrase, where) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Mr Dr FIXER @@");}

	///////////////////////////////////////////////////////////////
	// If you're here, one of these is true:
	// 1) Current phrase starts with "Mr" or "Dr"
	// 2) Current phrase ends with "Mr" or "Dr"
	// 3) Previous phrase ended with "Mr" or "Dr"
	//
	// No need for further checking.
	//

	switch (where) {
		case 'previous':
			Mojo.Log.info("++ PREVIOUS ENDS WITH Mr or Dr");
			phrase = rawPhrases[(thisQuote - 2)] + "." + rawPhrases[(thisQuote - 1)] + "." + phrase + "." + rawPhrases[(thisQuote + 1)] + "." + rawPhrases[(thisQuote + 2)];
			Mojo.Log.info(phrase);
			return phrase;
			break;
		case 'starts':
			Mojo.Log.info("++ THIS STARTS WITH Mr or Dr");
			phrase = rawPhrases[(thisQuote - 1)] + phrase + "." + rawPhrases[(thisQuote + 1)];
			Mojo.Log.info(phrase);
			return phrase;
			break;
		case 'ends':
			Mojo.Log.info("++ THIS PHRASE ENDED WITH Mr or Dr");
			phrase = phrase + "." + rawPhrases[(thisQuote + 1)] + "." + rawPhrases[(thisQuote + 2)];
			return phrase;
			break;
	}

	// Just send it back for some reason?!?
	return phrase;

//if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE A.A. FIXER @@");}
};


/********************
 *
 * FADE DECISION
 *
 ********************/
DockAssistant.prototype.groovyFadeDecision = function (element, phrase) {
try {
	if (this.fullBright === true) {
		this.groovyTimer = 100;
		this.groovyFadeOut(element, phrase);
	}
	else {
		this.groovyTimer = 0;
		this.setThePhrase(element, phrase);
	}
} catch (error) {Mojo.Log.error("GROOVY FADE DECISION", error);}
};


/********************
 *
 * FADE OUT
 *
 ********************/
DockAssistant.prototype.groovyFadeOut = function (element, phrase) {
try {
	if (this.groovyTimer > 0) {
		element.style.color = "rgba(250, 250, 250, " + (this.groovyTimer * 0.01) + ")";
		this.groovyTimer--;
		this.groovyFadeOutTimer = setTimeout(this.groovyFadeOut.bind(this, element, phrase), 16);
	}
	else {
		element.style.color = "rgba(250, 250, 250, 0.0)";
		this.fullBright = false;
		this.setThePhrase(element, phrase);
	}
} catch (error) {Mojo.Log.error("GROOVY FADE OUT", error);}
};


/********************
 *
 * SET THE PHRASE
 *
 ********************/
DockAssistant.prototype.setThePhrase = function (element, phrase) {
	element.innerHTML = phrase;
	this.bookPhrases.style.display = "block";
	this.groovyFadeIn(element, phrase);
};


/********************
 *
 * FADE IN
 *
 ********************/
DockAssistant.prototype.groovyFadeIn = function (element, phrase) {
try {
	if (this.groovyTimer < 100) {
		element.style.color = "rgba(250, 250, 250, " + (this.groovyTimer * 0.01) + ")";
		this.groovyTimer++;
		this.groovyFadeInTimer = setTimeout(this.groovyFadeIn.bind(this, element, phrase), 16);
	}
	else {
		this.fullBright = true;
	}
} catch (error) {Mojo.Log.error("GROOVY FADE IN", error);}
};
