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
	//this.groovyTimer = 0.0;
	//this.firstRun = true;
	this.readyForNewPhrase = true;
	rawPhrases = [];
	thisQuote = (Math.floor(Math.random() * 10000));
	this.quoteLengthMax = 142;
	this.quoteLengthMin = 12;

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
	//this.bookPhrases.innerHTML = this.getRandomBookPhrases();
	this.phraseDelayTime = this.prefsModel.dockPhraseSpeed;
	//this.phraseDelayTime = 5000;

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
	//this.screenTapHandler = this.getRandomBookPhrases.bindAsEventListener(this);
	//this.controller.document.addEventListener(Mojo.Event.tap, this.screenTapHandler, true);

	this.stageDeactivateHandler = this.stageDeactivate.bindAsEventListener(this);
	this.controller.document.addEventListener(Mojo.Event.stageDeactivate, this.stageDeactivateHandler, true);

	this.stageActivateHandler = this.stageActivate.bindAsEventListener(this);
	this.controller.document.addEventListener(Mojo.Event.stageActivate, this.stageActivateHandler, true);

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE activate @@");}
};


/********************
 *
 * DEACTIVATE
 *
 ********************/
DockAssistant.prototype.deactivate = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER deactivate @@");}

	for (i in this) {
		if (i.indexOf('Timer') >= 0) {
			clearTimeout(this[i]);
		}
	}

	rawPhrases = [];

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

	for (i in this) {
		if (i.indexOf('Timer') >= 0) {
			clearTimeout(this[i]);
		}
	}

	rawPhrases = [];

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

	for (i in this) {
		if (i.indexOf('Timer') >= 0) {
			clearTimeout(this[i]);
		}
	}

	this.bookPhrases.style.display = "none";
	this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";
	this.bookPhrases.innerHTML = "";
	rawPhrases = [];

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE stageDeactivate @@");}
};


/********************
 *
 * STAGE ACTIVATE
 *
 ********************/
DockAssistant.prototype.stageActivate = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER stageActivate @@");}

	if (rawPhrases.length <= 0) {this.gatherPhrases();}

	//if (this.firstRun === false) {
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
	//}

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

			if ( (sString.length < this.quoteLengthMin) || (sString.length > this.quoteLengthMax) ) {
				if (this.debugMe === true) {Mojo.Log.info("SANITIZER BAD LENGTH!", sString.length);}
					//this.prettyPhrase = null;
					clearTimeout(this.doThePhraseTimer);
					this.doThePhraseTimer = null;
					this.getRandomBookPhrases();
					return;
			}

			//Mojo.Log.info("SANITIZER:", sString.length, "|", sString);

			return sString;
		}

	} catch (sanitizerError) {Mojo.Log.error(">>>>>>> THE SANITIZER", sanitizerError, "+", sString);}
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
			onSuccess: function (transport) {
				rawPhrases = rawPhrases.concat(transport.responseText.split("."));
				return true;},
			onComplete: this.getRandomBookPhrases(),
			onFailure: function (transport) {Mojo.Log.error("AJAX FAILURE");}
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

	this.doThePhraseTimer = setTimeout(function () {
	try {
		if (rawPhrases.length > 0) {
			while (thisQuote > (rawPhrases.length - 1)) {
				thisQuote = Math.floor(Math.random() * 10000);
			}
		}
		else {
			for (i in this) {
					if (i.indexOf('Timer') >= 0) {
						clearTimeout(this[i]);
					}
			}
			Mojo.Log.error("  +++++++  QUOTE DEAD  +++++++");
			return;
		}

		if (this.debugMe === true) {Mojo.Log.info("START - rawPhrases:", rawPhrases.length, "thisQuote:", thisQuote);}

		try{
			if (this.debugMe === true) {Mojo.Log.info("------- BEFORE STRIP:", rawPhrases[thisQuote].length, "+", thisQuote, "+", rawPhrases[thisQuote]);}

			if (rawPhrases[thisQuote]) {
				this.prettyPhrase = this.sanitizer(rawPhrases[thisQuote]);
			}
			else {
				this.prettyPhrase = null;
				clearTimeout(this.doThePhraseTimer);
				this.doThePhraseTimer = null;
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

		try {
			//if (thisQuote > 0) {
			if ( (thisQuote) && (rawPhrases.length > 0) ) {
				if (this.prettyPhrase.indexOf('A') === this.prettyPhrase.length -1) {
					Mojo.Log.error("MEGA-BUSTED:", this.prettyPhrase);
					this.prettyPhrase = null;
					clearTimeout(this.doThePhraseTimer);
					this.doThePhraseTimer = null;
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
		} catch (rawPhrasesError) {Mojo.Log.error(">>>>>>> rawPhrasesError", rawPhrasesError, "thisQuote:", thisQuote, "rawPhrases:", rawPhrases.length, this.prettyPhrase);}
		/////////////////////////////////////////////////////


		/////////////////////////////////////////////////////
		//"Mr." and "Dr." get cut too.  
		// Farm it out.
		//
		try {
			// ends with
			if (thisQuote > 0) {
				try {
					if ((this.prettyPhrase.indexOf('Dr') === (this.prettyPhrase.length - 2)) || (this.prettyPhrase.indexOf('Mr') === (this.prettyPhrase.length - 2))) {
						this.prettyPhrase = this.prettyPhrase + "." + rawPhrases[(thisQuote + 1)];
					}
				}catch  (indexOf2) {Mojo.Log.error(">>>>>>> indexOf2", indexOf2);}
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
		} catch (MrDrError) {Mojo.Log.error(">>>>>>> MrDrError:", MrDrError, "this.prettyPhrase:", this.prettyPhrase, "rawPhrases[thisQuote]:", rawPhrases[thisQuote], "thisQuote:", thisQuote);}
		/////////////////////////////////////////////////////


		//this.firstRun = false;

		this.prettyPhrase = "<span class='serifFont'>" + this.prettyPhrase.charAt(1) + "</span>" + this.prettyPhrase.substring(2, this.prettyPhrase.length);

		if (this.debugMe === true) {Mojo.Log.info("------- SEND FINAL:", this.prettyPhrase.length, "+", this.prettyPhrase);}


		// WORKS - ORIGINAL
		//this.groovyFadeDecision(this.bookPhrases, this.prettyPhrase);

		//WORKS
		//this.simpleFadeDecision(this.bookPhrases, this.prettyPhrase);

		//WORKS
		this.radialFadeDecision(this.bookPhrases, this.prettyPhrase);

		//WORKS
		//this.separateDecision(this.bookPhrases, this.prettyPhrase);

		//this.effectDecision(this.bookPhrases, this.prettyPhrase);
	} catch (doThePhraseError) {Mojo.Log.error(">>>>>>> doThePhrase", doThePhraseError, "thisQuote:", thisQuote, "this.prettyPhrase:", this.prettyPhrase);}

	}.bind(this), 10);

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE getRandomBookPhrases @@");}
} catch (error) {Mojo.Log.error("ALL PAGES", error);}
};



/********************
 *
 * MASTER EFFECT DECISION
 *
 ********************/
DockAssistant.prototype.effectDecision = function (element, phrase) {
	var effectList = new Array(
		"simpleFadeDecision",
		"radialFadeDecision",
		"separateDecision"
	);

	var useEffect = (Math.floor(Math.random() * 10));
	if (useEffect >= effectList.length) {
		this.effectDecision(element, phrase);
	}
	else {
		switch (effectList[useEffect]) {
			case 'simpleFadeDecision' :
				Mojo.Log.info("USE EFFECT:", useEffect, "|", effectList[useEffect]);
				this.simpleFadeDecision(this.bookPhrases, this.prettyPhrase);
				break;
			case 'radialFadeDecision' :
				Mojo.Log.info("USE EFFECT:", useEffect, "|", effectList[useEffect]);
				this.radialFadeDecision(this.bookPhrases, this.prettyPhrase);
				break;
			case 'separateDecision' :
				Mojo.Log.info("USE EFFECT:", useEffect, "|", effectList[useEffect]);
				this.separateDecision(this.bookPhrases, this.prettyPhrase);
				break;
		}
	}
};


/////////////////////////////////////////////////////////////////////
//
// Effect Layers Separate/Join
//
/********************
 *
 * SEPARATE DECISION
 *
 ********************/
DockAssistant.prototype.separateDecision = function (element, phrase) {
	if (this.readyForNewPhrase === true) {
		this.ELT.style.zIndex = "1";
		this.ELB.style.zIndex = "-1";
		element.style.zIndex = "-2";
		this.ELT.innerHTML = phrase;
		this.ELB.innerHTML = phrase;
		element.innerHTML = phrase;
		this.ELT.style.display = "block";
		this.ELB.style.display = "block";
		element.style.display = "block";
		this.ELT.style.background = "url('images/EffectScrims/DiamondOutRight.png') center center no-repeat";
		this.ELB.style.background = "url('images/EffectScrims/DiamondOutLeft.png') center center no-repeat";
		this.ELT.style.backgroundSize = "100% 100%";
		this.ELB.style.backgroundSize = "100% 100%";
		this.layerMoveCounter = 0;
		this.groovyFadeCounter = 0;
		this.doLayerSeparate(element, phrase);
	}
	else {
		this.layerMoveCounter = this.controller.window.innerWidth;
		this.ELT.style.backgroundSize = "100% 100%";
		this.ELB.style.backgroundSize = "100% 100%";
		this.doLayerJoin(element, phrase);
	}
};


/********************
 *
 * SEPARATE LAYERS
 *
 ********************/
DockAssistant.prototype.doLayerSeparate = function (element, phrase) {

// 	this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/LinearLeftClear.png') center center no-repeat";

// 	this.ELT.style.background = "url('images/EffectScrims/DiamondInLeft.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/DiamondInRight.png') center center no-repeat";

// 	this.ELT.style.background = "url('images/EffectScrims/'" + elt + "'.png') center center no-repeat";
// 	this.ELB.style.background = "url('images/EffectScrims/'" + elb + "'.png') center center no-repeat";

	if (this.ELB.style.left.replace('px', '') < this.controller.window.innerWidth) {
		this.ELB.style.left = this.layerMoveCounter + "px";
		this.ELT.style.left = (0 - this.layerMoveCounter) + "px";
		this.layerMoveCounter = this.layerMoveCounter + 10;

		if (this.groovyFadeCounter <= 100) {
			element.style.color = "rgba(250, 250, 250, " + (this.groovyFadeCounter * 0.01) + ")";
			this.groovyFadeCounter = this.groovyFadeCounter + 4;
		}

		this.doLayerSeparateTimer = setTimeout(this.doLayerSeparate.bind(this, element, phrase), 50);
	}
	else {
		this.readyForNewPhrase = false;
		this.layerMoveCounter = this.controller.window.innerWidth;
		this.groovyFadeCounter = 100;

		this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.phraseDelayTime);
	}
};



/********************
 *
 * JOIN LAYERS
 *
 ********************/
DockAssistant.prototype.doLayerJoin = function (element, phrase) {
	if (this.ELB.style.left.replace('px', '') > 0) {
		this.ELB.style.left = this.layerMoveCounter + "px";
		this.ELT.style.left = (0 - this.layerMoveCounter) + "px";
		this.layerMoveCounter = this.layerMoveCounter - 10;

		if (this.groovyFadeCounter >= 0) {
			element.style.color = "rgba(250, 250, 250, " + (this.groovyFadeCounter * 0.01) + ")";
			this.groovyFadeCounter = this.groovyFadeCounter - 5;
		}

		this.doLayerJoinTimer = setTimeout(this.doLayerJoin.bind(this, element, phrase), 50);
	}
	else {
		this.readyForNewPhrase = true;
		this.separateDecision(element, phrase);
	}
};
/////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////
//
// Radial Fade in/out entire phrase
//
/********************
 *
 * RADIAL FADE DECISION
 *
 ********************/
DockAssistant.prototype.radialFadeDecision = function (element, phrase) {
	if (this.readyForNewPhrase === true) {
		element.innerHTML = phrase;
		element.style.color = "rgba(250, 250, 250, 1.0)";
		element.style.display = "block";
		element.style.zIndex = "-2";
		this.ELB.innerHTML = phrase;
		//this.ELB.style.background = "url('images/EffectScrims/RadialCenterLight.png') center center no-repeat";
		this.ELB.style.background = "url('images/EffectScrims/LinearLeftClear.png') center center no-repeat";
		this.ELB.style.backgroundSize = "100% 100%";
		this.ELB.style.display = "block";
		this.ELB.style.zIndex = "-1";
		this.ELT.innerHTML = phrase;
		this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";
		this.ELT.style.backgroundSize = "100% 100%";
		this.ELT.style.display = "block";
		this.ELT.style.opacity = "1.0";
		this.ELT.style.zIndex = "1";
		this.layerOpacityAdjustment = 20;
		this.radialFadeCounter = 100;
		this.radialFadeIn(element, phrase);
	}
	else {
		this.radialFadeCounter = 0;
		this.radialFadeOut(element, phrase);
	}
};


/********************
 *
 * RADIAL FADE OUT
 *
 ********************/
DockAssistant.prototype.radialFadeOut = function (element, phrase) {
	if (this.radialFadeCounter < 100) {
		this.ELT.style.opacity = (this.radialFadeCounter + this.layerOpacityAdjustment) * 0.01;
		this.ELB.style.opacity = this.radialFadeCounter * 0.01;
		this.radialFadeCounter++;
		this.radialFadeOutTimer = setTimeout(this.radialFadeOut.bind(this, element, phrase), 24);
	}
	else {
		clearTimeout(this.radialFadeOutTimer);
		this.radialFadeOutTimer = null;
		//clearTimeout(this.phraseTimer);
		//this.phraseTimer = null;
		this.readyForNewPhrase = true;
		this.radialFadeDecision(element, phrase);
	}
};


/********************
 *
 * RADIAL FADE IN
 *
 ********************/
DockAssistant.prototype.radialFadeIn = function (element, phrase) {
	if (this.radialFadeCounter > 0) {
		this.ELT.style.opacity = this.radialFadeCounter * 0.01;
		this.ELB.style.opacity = (this.radialFadeCounter - this.layerOpacityAdjustment) * 0.01;
		this.radialFadeCounter--;
		this.radialFadeInTimer = setTimeout(this.radialFadeIn.bind(this, element, phrase), 24);
	}
	else {
		this.readyForNewPhrase = false;
		this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.phraseDelayTime);
	}
};
/////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////
//
// Simple Fade in/out entire phrase
//
/********************
 *
 * SIMPLE FADE DECISION
 *
 ********************/
DockAssistant.prototype.simpleFadeDecision = function (element, phrase) {
	if (this.readyForNewPhrase === true) {
		element.innerHTML = phrase;
		element.style.color = "rgba(250, 250, 250, 1.0)";
		element.style.display = "block";
		element.style.zIndex = "-2";
		this.ELB.style.display = "none";
		this.ELB.style.zIndex = "-1";
		this.ELT.innerHTML = phrase;
		this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";
		this.ELT.style.backgroundSize = "100% 100%";
		this.ELT.style.display = "block";
		this.ELT.style.opacity = "1.0";
		this.ELT.style.zIndex = "1";
		this.simpleFadeTimer = 100;
		this.simpleFadeIn(element, phrase);
	}
	else {
		this.simpleFadeTimer = 0;
		this.simpleFadeOut(element, phrase);
	}
};


/********************
 *
 * SIMPLE FADE OUT
 *
 ********************/
DockAssistant.prototype.simpleFadeOut = function (element, phrase) {
	this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";

	if (this.simpleFadeTimer < 100) {
		this.ELT.style.opacity = this.simpleFadeTimer * 0.01;
		this.simpleFadeTimer++;
		this.simpleFadeOutTimer = setTimeout(this.simpleFadeOut.bind(this, element, phrase), 24);
	}
	else {
		this.readyForNewPhrase = true;
		clearTimeout(this.simpleFadeOutTimer);
		this.simpleFadeOutTimer = null;
		//clearTimeout(this.phraseTimer);
		//this.phraseTimer = null;
		this.simpleFadeDecision(element, phrase);
	}
};


/********************
 *
 * SIMPLE FADE IN
 *
 ********************/
DockAssistant.prototype.simpleFadeIn = function (element, phrase) {

	if (this.simpleFadeTimer > 0) {
		this.ELT.style.opacity = this.simpleFadeTimer * 0.01;
		this.simpleFadeTimer--;
		this.simpleFadeInTimer = setTimeout(this.simpleFadeIn.bind(this, element, phrase), 24);
	}
	else {
		Mojo.Log.info("@@ FINISH SIMPLE FADE IN @@", this.ELT.style.opacity, "|", this.simpleFadeTimer);
		this.readyForNewPhrase = false;

		//if (! this.phraseTimer) {
			this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.phraseDelayTime);
		//}
	}
};
/////////////////////////////////////////////////////////////////////




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
		//clearTimeout(this.phraseTimer);
		//this.phraseTimer = null;
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

		//if (! this.phraseTimer) {
			this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.phraseDelayTime);
		//}
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
		//clearTimeout(this.phraseTimer);
		clearTimeout(this.printWordsTimer);
		//this.phraseTimer = null;
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
			//if (! this.phraseTimer) {
				this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.phraseDelayTime);
			//}
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
