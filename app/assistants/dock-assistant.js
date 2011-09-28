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
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER DockAssistant @@");}

	this.debugMe = false;
	this.prettyPhrase = null;
	this.fullBright = false;
	this.groovyTimer = 0.0;
	this.firstRun = true;
	this.readyForNewPhrase = true;
	rawPhrases = [];
	thisQuote = (Math.floor(Math.random() * 10000));

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE DockAssistant @@");}
}


/********************
 *
 * SETUP
 *
 ********************/
DockAssistant.prototype.setup = function () {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER setup @@");}

	$('body_wallpaper').style.background = "black";

	//  ****  Get the preferences from cookie
	if (! (this.prefs)) {
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
	}

	this.controller.document.body.className = 'dock';
	this.bookPhrases = $('bookPhrases');
	this.ELT = $('EffectLayerTop');
	this.ELB = $('EffectLayerBottom');
	this.bookPhrases.style.display = "none";
	this.bookPhrases.innerHTML = this.getRandomBookPhrases();
	this.phraseDelayTime = this.prefsModel.dockPhraseSpeed;
	//this.phraseDelayTime = 5000;
	$('Container1').style.width = this.controller.window.innerWidth + "px";

	if (this.prefsModel.isTouchPad === true) {$('bookPhrases').addClassName('docktouchpadfix');}

	if (rawPhrases.length <= 0) {this.gatherPhrases();}

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

	//this.bookPhrases.style.display = "none";
	//this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";
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

	this.printWordsTimer = null;
	this.phrasePlace = null;
	this.readyForFading = false;
	clearTimeout(this.phraseTimer);
	clearTimeout(this.printWordsTimer);


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

	this.printWordsTimer = null;
	this.phrasePlace = null;
	this.readyForFading = false;
	clearTimeout(this.phraseTimer);
	clearTimeout(this.printWordsTimer);


	this.fullBright = false;
	this.readyForFading = false;
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

	this.printWordsTimer = null;
	this.phrasePlace = null;
	this.readyForFading = false;
	clearTimeout(this.phraseTimer);
	clearTimeout(this.printWordsTimer);


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
		if (sString) {
			if (sString.indexOf('palm-divider') >= 0) {
				sString = sString.replace(sString.substring(sString.indexOf('<table'), (sString.indexOf('table>') + 6)), '');
			}

			sString = sString.replace(/<.*?>/g,' ');
			sString = sString.replace(/^\s+|\s+$/g,' ').replace(/\s+/g,' ');

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
		}
		else {
			this.getRandomBookPhrases();
		}

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
		//var lcUrl = "books/dockfulltext.txt";
		var lcUrl = "books/fulltext.html";
		new Ajax.Request(lcUrl, {
			method: 'get',
			onComplete: function (transport) {rawPhrases = rawPhrases.concat(transport.transport.responseText.split("."));},
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

			//if ( (! rawPhrases[thisQuote]) || (! rawPhrases) || (rawPhrases[thisQuote].length <= 0) ) {
			//	this.prettyPhrase = null;
			//	clearTimeout(this.doThePhrase);
			//	this.getRandomBookPhrases();
			//}

			if (rawPhrases[thisQuote]) {
				this.prettyPhrase = this.sanitizer(rawPhrases[thisQuote]);
			}
			else {
				this.prettyPhrase = null;
				clearTimeout(this.doThePhrase);
				this.getRandomBookPhrases();
			}

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


		//if ((this.prettyPhrase.length < 12) || (this.prettyPhrase.length > 142)) {
		if (this.prettyPhrase.length > 142) {
			if (this.debugMe === true) {Mojo.Log.info("SECOND BAD SIZE!", this.prettyPhrase.length);}
			this.prettyPhrase = null;
			clearTimeout(this.doThePhrase);
			this.getRandomBookPhrases();
		}
		else {
			this.firstRun = false;
			this.prettyPhrase = this.sanitizer(this.prettyPhrase);
			if (this.debugMe === true) {Mojo.Log.info("------- SEND FINAL:", this.prettyPhrase.length, "+", this.prettyPhrase);}

			//this.groovyFadeDecision(this.bookPhrases, this.prettyPhrase);
			//this.effectDecision(this.bookPhrases, this.prettyPhrase);
			
			this.layerSetup(this.bookPhrases, this.prettyPhrase);
			
			//this.groovyFadeDecision($('Container1'), this.prettyPhrase);
		}
	} catch (doThePhraseError) {Mojo.Log.error(">>>>>>> doThePhrase", doThePhraseError, "thisQuote:", thisQuote, "rawPhrases:", rawPhrases.length, "this.prettyPhrase:", this.prettyPhrase);}
	}.bind(this), 10);
if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE getRandomBookPhrases @@");}
} catch (error) {Mojo.Log.error("ALL PAGES", error);}
};












/********************
 *
 * LAYER SETUP
 *
 ********************/
DockAssistant.prototype.layerSetup = function (element, phrase) {

//phrase = "This is a two line phrase, OK?"

// 	this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";
// 	this.ELT.style.background = "url('images/EffectScrims/LinearLeftClear.png') center center no-repeat";
// 	this.ELT.style.position = "absolute";
// 	this.ELT.style.top = "0px";
// 	this.ELT.style.left = "0px";
// 	this.ELT.style.opacity = "1.0"
// 	this.ELT.innerHTML = phrase;
// 	this.ELT.style.color = "rgba(250, 250, 250, 1.0)"
// 	this.ELT.style.backgroundSize = "100% 100%";
// 	this.ELT.style.display = "block";
	this.ELT.style.zIndex = "1";
// 	Mojo.Log.info("EffectLayerTop:", this.ELT.style.offsetWidth, this.ELT.style.offsetHeight);

// 	this.ELB.style.background = "url('images/EffectScrims/RadialCenterLight.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/LinearLeftClear.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/SpiralCW.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/CircleWave.png') center center no-repeat";
// 	this.ELB.style.position = "absolute";
// 	this.ELB.style.top = "0px";
// 	this.ELB.style.left = "0px";
// 	this.ELB.style.opacity = "1.0"
// 	this.ELB.innerHTML = phrase;
// 	this.ELB.style.color = "rgba(250, 250, 250, 1.0)"
// 	this.ELB.style.backgroundSize = "100% 100%";
// 	this.ELB.style.display = "block";
	this.ELB.style.zIndex = "-1";
// 	Mojo.Log.info("EffectLayerBottom:", this.ELB.style.offsetWidth, this.ELB.style.offsetHeight);

// 	element.innerHTML = "Really short phrase.";
// 	element.style.position = "absolute";
// 	element.style.top = "0px";
// 	element.style.left = "0px";
	//element.innerHTML = phrase;
	element.style.color = "rgba(250, 250, 250, 1.0)"
	element.style.display = "block";
	element.style.zIndex = "-2";
// 	element.style.width = (this.controller.window.innerWidth - 20)+ "px";
// 	Mojo.Log.info("bookPhrases:", element.style.width, element.style.offsetHeight);

// 	Mojo.Log.info(element.style.top);

//////////////////////////////////////////
// 	this.layerFadeCounter = 0;

// 	this.ELT.innerHTML = phrase;
// 	this.ELB.innerHTML = phrase;
// 	element.innerHTML = phrase;
// 	this.layerFadeCounter = 100;
// 	this.layerOpacityAdjustment = 20;
// 	this.ELT.style.backgroundSize = "100% 100%";
// 	this.ELB.style.backgroundSize = "100% 100%";
// 	this.doLayerFadeDown(element, phrase);
//////////////////////////////////////////



// 	this.ELT.style.background = "url('images/EffectScrims/DiamondInLeft.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/DiamondInRight.png') center center no-repeat";

// 	this.layerMoveCounter = 0;
// 	this.layerMoveCounter = this.controller.window.innerWidth
// 	this.ELT.style.opacity = "1"
// 	Mojo.Log.info("this.layerMoveCounter:", this.layerMoveCounter);
	//this.doLayerMoveRight(element, phrase, "DiamondInLeft", "DiamondInRight");


	this.effectDecision(element, phrase);
};

DockAssistant.prototype.effectDecision = function (element, phrase) {

	if (this.readyForNewPhrase === true) {
		//Mojo.Log.info("DECIDE IF -");
		this.ELT.innerHTML = phrase;
		this.ELB.innerHTML = phrase;
		element.innerHTML = phrase;
		this.ELT.style.backgroundSize = "100% 100%";
		this.ELB.style.backgroundSize = "100% 100%";
		this.layerMoveCounter = 0;
		this.doLayerMoveRight(element, phrase);
	}
	else {
		//Mojo.Log.info("DECIDE ELSE -");
		this.layerMoveCounter = this.controller.window.innerWidth;
		this.ELT.style.backgroundSize = "100% 100%";
		this.ELB.style.backgroundSize = "100% 100%";
		this.doLayerMoveLeft(element, phrase);
	}
}


// 	if (this.fullBright === true) {
// 		this.groovyTimer = 100;
// 		this.groovyFadeOut(element, phrase);
// 	}
// 	else {
// 		this.groovyTimer = 0;
// 		element.innerHTML = phrase;
// 		this.groovyFadeIn(element, phrase);
// 	}




/********************
 *
 * DO LAYER FADE DOWN
 *
 ********************/
DockAssistant.prototype.doLayerFadeDown = function (element, phrase) {
	this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";
	this.ELB.style.background = "url('images/EffectScrims/RadialCenterLight.png') center center no-repeat";
	this.ELT.style.backgroundSize = "100% 100%";
	this.ELB.style.backgroundSize = "100% 100%";

	if ( (this.ELT.style.opacity > 0) || (this.ELB.style.opacity > 0) ) {
		//Mojo.Log.info("WORKING DOWN:", this.ELT.style.opacity, this.ELB.style.opacity);
		//this.ELT.style.opacity = (this.layerFadeCounter - 20 ) * 0.01;
		this.ELT.style.opacity = (this.layerFadeCounter + this.layerOpacityAdjustment) * 0.01;
		this.ELB.style.opacity = this.layerFadeCounter * 0.01;
		this.layerFadeCounter--;
		this.doLayerFadeTimer = setTimeout(this.doLayerFadeDown.bind(this, element, phrase), 25);
	}
	else {
		Mojo.Log.info("DONE DOWN - Top:", this.ELT.style.opacity, "Bottom:", this.ELB.style.opacity);
		this.layerFadeCounter = 0;
		this.doLayerFadeUp(element, phrase);
	}
};


/********************
 *
 * DO LAYER FADE UP
 *
 ********************/
DockAssistant.prototype.doLayerFadeUp = function (element, phrase) {

	//if ((this.layerFadeCounter - this.layerOpacityAdjustment) <= 100) {
	if ( (this.ELT.style.opacity < 1) || (this.ELB.style.opacity < 1) ) {
		//Mojo.Log.info("WORKING UP:", this.ELT.style.opacity, this.ELB.style.opacity);
		//this.ELT.style.opacity = (this.layerFadeCounter - 20 ) * 0.01;
		this.ELT.style.opacity = this.layerFadeCounter * 0.01;
		this.ELB.style.opacity = (this.layerFadeCounter - this.layerOpacityAdjustment) * 0.01;
		this.layerFadeCounter++;
		this.doLayerFadeTimer = setTimeout(this.doLayerFadeUp.bind(this, element, phrase), 25);
	}
	else {
		Mojo.Log.info("DONE UP - Top:", this.ELT.style.opacity, "Bottom:", this.ELB.style.opacity);
		this.layerFadeCounter = 100;
		this.doLayerFadeDown(element, phrase);
	}
};


/********************
 *
 * TEXT IN
 *
 ********************/
DockAssistant.prototype.doLayerMoveRight = function (element, phrase) {

// 	this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/LinearLeftClear.png') center center no-repeat";

// 	this.ELT.style.background = "url('images/EffectScrims/DiamondOutRight.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/DiamondOutLeft.png') center center no-repeat";

	this.ELT.style.background = "url('images/EffectScrims/DiamondInLeft.png') center center no-repeat";
	this.ELB.style.background = "url('images/EffectScrims/DiamondInRight.png') center center no-repeat";

// 	this.ELT.style.background = "url('images/EffectScrims/'" + elt + "'.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/'" + elb + "'.png') center center no-repeat";

	if (this.ELB.style.left.replace('px', '') < this.controller.window.innerWidth) {
		//Mojo.Log.info("WORKING Move Right:", this.ELB.style.left, this.ELT.style.opacity)
		//Mojo.Log.info("WORKING Move Right:", this.ELB.style.left, this.ELT.style.left)

		//this.ELB.style.opacity = "0";
		//this.ELT.style.left = this.layerMoveCounter + "px";
		//this.layerMoveCounter = this.layerMoveCounter + 5;

		this.ELB.style.left = this.layerMoveCounter + "px";
		this.ELT.style.left = (0 - this.layerMoveCounter) + "px";
		this.layerMoveCounter = this.layerMoveCounter + 5;

		//this.ELT.style.opacity = (this.layerFadeCounter + this.layerOpacityAdjustment) * 0.01;
		//this.ELB.style.opacity = this.layerFadeCounter * 0.01;
		//this.layerFadeCounter--;

// 		if (this.ELT.style.opacity > 0.0) {
// 			this.ELT.style.opacity = this.layerFadeCounter * 0.01;
// 			this.layerFadeCounter = this.layerFadeCounter - 2;
// 		}

		this.doLayerMoveTimer = setTimeout(this.doLayerMoveRight.bind(this, element, phrase), 50);
	}
	else {
		//Mojo.Log.info("DONE Move Right:", this.ELT.style.left, this.ELB.style.left);
		this.readyForNewPhrase = false;
		this.layerMoveCounter = this.controller.window.innerWidth;
		//this.doLayerMoveLeft(element, phrase);

		if (! this.phraseTimer) {
			this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.phraseDelayTime);
		}
	}
};


/********************
 *
 * TEXT OUT
 *
 ********************/
DockAssistant.prototype.doLayerMoveLeft = function (element, phrase) {
// 	this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/LinearLeftClear.png') center center no-repeat";

// 	this.ELT.style.background = "url('images/EffectScrims/DiamondOutRight.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/DiamondOutLeft.png') center center no-repeat";

// 	this.ELT.style.background = "url('images/EffectScrims/DiamondInLeft.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/DiamondInRight.png') center center no-repeat";

// 	this.ELT.style.background = "url('images/EffectScrims/'" + elt + "'.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/'" + elb + "'.png') center center no-repeat";

	if (this.ELB.style.left.replace('px', '') > 0) {
		//Mojo.Log.info("WORKING Move Left:", this.ELB.style.left, this.ELT.style.opacity)

		//this.ELB.style.opacity = "0";
		//this.ELT.style.left = this.layerMoveCounter + "px";
		//this.layerMoveCounter = this.layerMoveCounter - 5;

		this.ELB.style.left = this.layerMoveCounter + "px";
		this.ELT.style.left = (0 - this.layerMoveCounter) + "px";
		this.layerMoveCounter = this.layerMoveCounter - 5;

		//this.ELT.style.opacity = this.layerFadeCounter * 0.01;
		//this.ELB.style.opacity = (this.layerFadeCounter + this.layerOpacityAdjustment) * 0.01;
		//this.layerFadeCounter++;

// 		if (this.ELT.style.opacity < 1) {
// 			this.ELT.style.opacity = this.layerFadeCounter * 0.01;
// 			this.layerFadeCounter = this.layerFadeCounter + 2;
// 		}

		this.doLayerMoveTimer = setTimeout(this.doLayerMoveLeft.bind(this, element, phrase), 50);
	}
	else {
		//Mojo.Log.info("DONE Move Left:", this.ELT.style.left, this.ELB.style.left, this.ELT.style.backgroundWidth);
		this.readyForNewPhrase = true;
		//this.layerMoveCounter = 0;
		//this.layerFadeCounter = 0;
		//this.doLayerMoveRight(element, phrase);

		clearTimeout(this.phraseTimer);
		this.phraseTimer = null;
		this.effectDecision(element, phrase);
	}
};



















/////////////////////////////////////////////////////////////////////
//
// Fade in/out entire phrase
//
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
		element.innerHTML = phrase;
		this.groovyFadeIn(element, phrase);
	}
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
		element.style.display = "none";
		this.fullBright = false;
		this.groovyFadeDecision(element, phrase);
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

	element.style.display = "block";

	if (this.groovyTimer < 100) {
		element.style.color = "rgba(250, 250, 250, " + (this.groovyTimer * 0.01) + ")";
		this.groovyTimer++;
		this.groovyFadeInTimer = setTimeout(this.groovyFadeIn.bind(this, element, phrase), 16);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ FINISH FADE IN @@");}
		this.fullBright = true;

		if (! this.phraseTimer) {
			this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.phraseDelayTime);
		}
	}
};
/////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
//
// Fade in/out each letter of the phrase
//
// Out not working
//
/********************
 *
 * EFFECT DECISION
 *
 ********************/
DockAssistant.prototype.effectLetterFadeDecision = function (element, phrase) {

	//this.groovyFadeDecision(element, phrase);

	//this.printWords(element, phrase);
	//this.groovyWordTimer = 0;
	if (this.fullBright === false) {
		Mojo.Log.info("DECIDE FADE IN");
		this.groovyWordTimer = [];
		this.phrasePlace = 0;
		element.innerHTML = "";
		this.printWords(element, phrase, phrase.length);
	}
	else {
		Mojo.Log.info("DECIDE FADE OUT");
		this.fullBright = false;
		this.effectLetterFadeDecision(element, phrase);
		//this.controlPrintWordsFade(0, phrase.length, element, phrase);
	}
};


/********************
 *
 * PRINT WORDS
 *
 ********************/
DockAssistant.prototype.printWords = function (element, phrase) {
	if (this.phrasePlace <= phrase.length) {
		element.innerHTML = element.innerHTML + "<span id='quoteSpan" + this.phrasePlace + "' style='color:rgba(250, 250, 250, 0);'>" + phrase.charAt(this.phrasePlace) + "</span>";
		this.groovyWordTimer[this.phrasePlace] = 0;
		this.phrasePlace++;
		this.printWordsTimer = setTimeout(this.printWords.bind(this, element, phrase), 0);
	}
	else {
		Mojo.Log.info("DONE WRITING");
		clearTimeout(this.phraseTimer);
		clearTimeout(this.printWordsTimer);
		this.phraseTimer = null;
		this.printWordsTimer = null;
		this.readyForFading = true;
		element.style.display = "block";
		this.phrasePlace = null;
		this.controlPrintWordsFade(0, phrase.length, element, phrase);
	}
};


/********************
 *
 * FADE CONTROLLER
 *
 ********************/
DockAssistant.prototype.controlPrintWordsFade = function (letter, length, element, phrase) {
	if (this.readyForFading === true) {
		if (letter <= length) {
			this.printWordsFadeIn(letter, length);
			letter++;
			this.controlPrintWordsFadeTimer = setTimeout(this.controlPrintWordsFade.bind(this, letter, length), 12);
		}
	}
	else {
		if (letter <= length) {
			//Mojo.Log.info("CONTROL FADE OUT", letter, length, Object.toString(element));
			this.groovyWordTimer[letter] = 100;
			try {
			this.printWordsFadeOut(letter, length, element, phrase);
			} catch (ControlOutError) {Mojo.Log.error(">>>>>>> ControlOutError", ControlOutError, "|", letter, length, element);}
			letter++;
			this.controlPrintWordsFadeTimer = setTimeout(this.controlPrintWordsFade.bind(this, letter, length, element, phrase), 12);
		}
	}
};


/********************
 *
 * PRINT WORDS FADE IN
 *
 ********************/
DockAssistant.prototype.printWordsFadeIn = function (letter, length) {
	if (this.groovyWordTimer[letter] < 100) {
		$('quoteSpan' + letter).style.color = "rgba(250, 250, 250, " + this.groovyWordTimer[letter] * 0.01 + ")";
		this.groovyWordTimer[letter]++;
		this.groovyFadeInTimer = setTimeout(this.printWordsFadeIn.bind(this, letter, length), 5);
	}
	else {
		clearTimeout(this.groovyFadeInTimer[letter]);
		this.groovyFadeInTimer[letter] = null;

		if (letter >= length) {
			Mojo.Log.info("DONE FADE IN");
			this.readyForFading = false;
			if (! this.phraseTimer) {
				this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.phraseDelayTime);
			}
			this.groovyFadeInTimer = null;
			this.fullBright = true;
		}
	}
};


/********************
 *
 * PRINT WORDS FADE OUT
 *
 ********************/
DockAssistant.prototype.printWordsFadeOut = function (letter, length, element, phrase) {
	if (this.groovyWordTimer[letter] > 0) {
			try {
		$('quoteSpan' + letter).style.color = "rgba(250, 250, 250, " + this.groovyWordTimer[letter] * 0.01 + ")";
			} catch (printWordsFadeOut) {Mojo.Log.error(">>>>>>> printWordsFadeOut", printWordsFadeOut, letter, length, element);}
		this.groovyWordTimer[letter]--;
		this.groovyFadeOutTimer = setTimeout(this.groovyFadeOutTimer.bind(this, letter, length), 12);
	}
	else {
		clearTimeout(this.groovyFadeOutTimer[letter]);
		this.groovyFadeOutTimer[letter] = null;

		if (letter >= length) {
			Mojo.Log.info("DONE FADE OUT");
			this.readyForFading = true;
			this.groovyFadeOutTimer = null;
			this.printWords(element, phrase);
		}
	}
};
/////////////////////////////////////////////////////////////////////
