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
	this.firstRun = true;
	this.fromSleep = false;
	this.prettyPhrase = null;
	this.fullBright = false;
	this.readyForNewPhrase = true;
	this.quoteLengthMax = 142;
	this.quoteLengthMin = 12;
	rawPhrases = null;
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

	//  ****  Get the preferences from cookie
	if (! (this.prefs)) {
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
	}

	this.controller.document.body.className = 'dock';
	this.wallpaper = $('body_wallpaper')
	this.bookPhrases = $('bookPhrases');
	this.ELT = $('EffectLayerTop');
	this.ELB = $('EffectLayerBottom');
	this.bookPhrases.style.display = "none";
	//this.bookPhrases.innerHTML = this.getRandomBookPhrases();
	//this.phraseDelayTime = this.prefsModel.dockPhraseSpeed;
	//this.phraseDelayTime = 5000;

	$('body_wallpaper').style.background = "black";

	if ( (this.maxScreenHeight >= 1024) || (this.maxScreenWidth >= 1024) || (this.modelName.indexOf("ouch") >= 0) ) {
	//if (this.prefsModel.isTouchPad === true) {
		this.bookPhrases.addClassName('docktouchpadfix');
		this.ELB.addClassName('docktouchpadfix');
		this.ELT.addClassName('docktouchpadfix');
	}

	//if (rawPhrases.length <= 0) {this.gatherPhrases();}
// 	if ( (this.firstRun === true) || (this.fromSleep === true) ){
// 		this.gatherPhrases();
// 		this.firstRun = false;
// 		this.fromSleep = false;
// 	}


	this.layerMoveCounter = 0;
	this.groovyTextFadeCounter = 0;
	this.ELB.style.left = "0px";
	this.ELT.style.left = "0px";
	this.radialLayerFadeCounter = 100;
	this.simpleLayerFadeCounter = 100;

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE setup @@");}
};


/********************
 *
 * ACTIVATE
 *
 ********************/
DockAssistant.prototype.activate = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER activate @@");}
	//this.screenTapHandler = this.tapMe.bindAsEventListener(this);
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

	rawPhrases = null;

	this.controller.document.removeEventListener(Mojo.Event.tap, this.screenTapHandler, true);
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

	rawPhrases = null;

	this.controller.document.removeEventListener(Mojo.Event.tap, this.screenTapHandler, true);
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

	this.layerMoveCounter = 0;
	this.groovyTextFadeCounter = 0;
	this.ELB.style.left = "0px";
	this.ELT.style.left = "0px";
	this.radialLayerFadeCounter = 100;
	this.simpleLayerFadeCounter = 100;


	//this.bookPhrases.style.color = "rgba(250, 250, 250, 0.0)";
	//this.bookPhrases.innerHTML = "";

	for (i in this) {
		//if ( (i.indexOf('Timer') >= 0) || (i.indexOf('Counter') >= 0) ) {
		if (i.indexOf('Timer') >= 0) {
			//Mojo.Log.info("Timer Reset:", i);
			clearTimeout(this[i]);
			//this[i] = null;
		}
// 		else if ( (i.indexOf('Move') >= 0) || (i.indexOf('TextFade') >= 0) ) {
// 			str = "this." + i;
// 			Mojo.Log.info("Setting ZERO:", this[i], "|", str);
// 			//this[i] = 0;
// 			str = 0;
// 			Mojo.Log.info("layerMoveCounter:", this.layerMoveCounter);
// 			Mojo.Log.info("groovyTextFadeCounter:", this.groovyTextFadeCounter);
// 		}
// 		else if (i.indexOf('LayerFade') >= 0) {
// 			str = "this." + i;
// 			Mojo.Log.info("Setting 100:", this[i], "|", str);
// 			//this[i] = 100;
// 			str = 100;
// 			Mojo.Log.info("simpleLayerFadeCounter:", this.simpleLayerFadeCounter);
// 			Mojo.Log.info("radialLayerFadeCounter:", this.radialLayerFadeCounter);
// 		}
	}

	this.readyForNewPhrase = true;
	this.fromSleep = true;
	rawPhrases = null;

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE stageDeactivate @@");}
};


/********************
 *
 * STAGE ACTIVATE
 *
 ********************/
DockAssistant.prototype.stageActivate = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER stageActivate @@");}

	this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
	this.prefsModel = this.prefs.get();

	//if ( (this.firstRun === true) || (this.fromSleep === true) ){
	if (! rawPhrases) {
		this.gatherPhrases();
		this.firstRun = false;
		this.fromSleep = false;
	}

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE stageActivate @@");}
};


/********************
 *
 * TAP ME
 *
 ********************/
DockAssistant.prototype.tapMe = function (event) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER tapME @@");}

	if (this.wallpaper.style.background === "black") {
		this.wallpaper.style.background = "url('images/background-dock.png')";
		this.wallpaper.style.backgroundSize = this.controller.window.innerWidth + "px " + this.controller.window.innerHeight + "px";
	}
	else {
		this.wallpaper.style.background = "black";
	}

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE tapME @@");}
};


/********************
 *
 * KILL EVERYTHING
 *
 ********************/
DockAssistant.prototype.killEverything = function (killinfo) {
if (killinfo) {
	Mojo.Log.info("<+>+<+>  KILL INFO:", killinfo, "<+>+<+>");
	killinfo = null;
}
	for (i in this) {
		if ( (i.indexOf('Timer') >= 0) || (i.indexOf('Counter') >= 0) ) {
			//Mojo.Log.error(this[i]);
			clearTimeout(this[i]);
			this[i] = null;
		}
	}
	//rawPhrases = null;
	this.emergencyReset = setTimeout(this.getRandomBookPhrases("killEverything"), 500);
	return null;
}

/********************
 *
 * GATHER PHRASES
 *
 ********************/
// 			onSuccess: function (transport) {
// 				Mojo.Log.info("ONSUCCESS");
// 				return true;},
// 			onComplete: function (trnasport) {
// 				Mojo.Log.info("ONCOMPLETE");
// 				return true;},
DockAssistant.prototype.gatherPhrases = function () {
try {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER gatherPhrases @@");}

	//if (rawPhrases.length <= 0) {
	if (! rawPhrases) {
		rawPhrases = [];

		//var lcUrl = "junk/bustedphrases.html";
		//var lcUrl = "books/dockfulltext.txt";
		var lcUrl = "books/fulltext.html";
		new Ajax.Request(lcUrl, {
			method: 'get',
			onSuccess: function (transport) {
				rawPhrases = rawPhrases.concat(transport.responseText.split("."));
				this.getRandomBookPhrases("ONSUCCESS");
				return true;},
			onComplete: this.getRandomBookPhrases("ONCOMPLETE"),
			onFailure: function (transport) {Mojo.Log.error("AJAX FAILURE");}
		});
	}

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE gatherPhrases @@")};
} catch (error) {Mojo.Log.error("ALL PAGES", error);}
};



/********************
 *
 * SANITIZER
 *
 ********************/
DockAssistant.prototype.sanitizer = function (sString) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER Sanitizer @@");}
	try {
		if (sString) {
			if (sString.indexOf('palm-divider') >= 0) {
				sString = sString.replace(sString.substring(sString.indexOf('<table'), (sString.indexOf('table>') + 6)), '');
			}

			sString = sString.replace(/<.*?>/g,' ');
			sString = sString.replace(/^\s+|\s+$/g,' ').replace(/\s+/g,' ');

			if ( (sString.length < this.quoteLengthMin) || (sString.length > this.quoteLengthMax) ) {
				if (this.debugMe === true) {Mojo.Log.info("SANITIZER BAD LENGTH!", sString.length);}
					this.killEverything("killEverything - SANITIZER BAD LENGTH");
					return;
			}

			/////////////////////////////////////////
			// A
// 			if (sString.indexOf('A') === 0) {
// 				if (rawPhrases[thisQuote].indexOf('A') === (rawPhrases[(thisQuote - 1)].length - 1)) {
// 					Mojo.Log.info(sString);
// 					clearTimeout(this.doThePhraseTimer);
// 					this.getRandomBookPhrases("SANI PREVIOUS ENDS THIS STARTS WITH A");
// 					return;
// 				}
// 			}
			if (sString.indexOf('A') === (sString.length - 1)) {
				if (rawPhrases[thisQuote + 1].indexOf('A') === (rawPhrases[(thisQuote + 1)].length - 1)) {
					Mojo.Log.info(sString, "|", rawPhrases[thisQuote + 1]);
					this.killEverything("FIRST A");
					return;
				}
			}
			if (rawPhrases[thisQuote - 1]) {
				if (rawPhrases[thisQuote - 1].indexOf('A') === (rawPhrases[(thisQuote - 1)].length - 1)) {
					Mojo.Log.info(sString, "|", rawPhrases[thisQuote - 1]);
					this.killEverything("SECOND A");
					return;
				}
			}

			if (sString) {
				if ( (sString.indexOf('Dr') >= 0) || (sString.indexOf('Mr') >= 0) ) {
					this.killEverything("DR. MR");
					return;
				}
			}

			//Mojo.Log.info("SANITIZER:", sString.length, "|", sString);

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

			return sString;
		}
		else {
			this.killEverything("sString null");
			return;
		}

	} catch (sanitizerError) {Mojo.Log.error(">>>>>>> THE SANITIZER", sanitizerError, "+", sString);}
if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE Sanitizer @@");}
};




/********************
 *
 * Random Book Phrases
 *
 ********************/
DockAssistant.prototype.getRandomBookPhrases = function (passedinfo) {
if (this.debugMe === true) {Mojo.Log.info("@@ ENTER getRandomBookPhrases @@");}
try {

if (passedinfo) {Mojo.Log.info("<+>+<+>  PASSED INFO:", passedinfo, "<+>+<+>");passedinfo = null;}

if (rawPhrases) {
	thisQuote = Math.floor(Math.random() * 10000);

	this.doThePhraseTimer = setTimeout(function () {
	try {
		if (rawPhrases) {//.length > 0) {
			while (thisQuote > (rawPhrases.length - 1)) {
				thisQuote = Math.floor(Math.random() * 10000);
			}
		}
		else {
			//Mojo.Log.error("  +++++++  MAJOR DEAD  +++++++");

			//for (i in this) {
			//	if ( (i.indexOf('Timer') >= 0) || (i.indexOf('Counter') >= 0) ) {
			//	Mojo.Log.error(this[i]);
			//	clearTimeout(this[i]);
			//	this[i] = null;
			//	}
			//}
			rawPhrases = null;
			//this.emergencyReset = setTimeout(this.gatherPhrases(), 500);
			//return;
			this.killEverything("MAJOR DEAD");
		}

		if (this.debugMe === true) {Mojo.Log.info("START - rawPhrases:", rawPhrases.length, "thisQuote:", thisQuote);}

		try{
			//if (this.debugMe === true) {Mojo.Log.info("------- BEFORE STRIP:", rawPhrases[thisQuote].length, "+", thisQuote, "+", rawPhrases[thisQuote]);}

			if (rawPhrases[thisQuote]) {
				this.prettyPhrase = this.sanitizer(rawPhrases[thisQuote]);
			}
			else {
				//this.prettyPhrase = null;
				//clearTimeout(this.doThePhraseTimer);
				//Mojo.Log.error("  +++++++  SendToSanitizerError RESET  +++++++");
				//this.emergencyReset = setTimeout(this.gatherPhrases(), 500);
				this.killEverything("SendToSanitizerError RESET");
			}

		} catch (SendToSanitizerError) {Mojo.Log.error(">>>>>>> Send To Sanitizer", SendToSanitizerError, "thisQuote:", thisQuote, "rawPhrases:", rawPhrases.length);}
		

		if (this.prettyPhrase) {
			this.prettyPhrase = "<span class='serifFont'>" + this.prettyPhrase.charAt(1) + "</span>" + this.prettyPhrase.substring(2, this.prettyPhrase.length);

			if (this.debugMe === true) {Mojo.Log.info("------- SEND FINAL:", this.prettyPhrase.length, "+", this.prettyPhrase);}

			//WORKS
			this.effectDecision(this.bookPhrases, this.prettyPhrase);
			//this.simpleFadeDecision(this.bookPhrases, this.prettyPhrase);
			//this.radialFadeLightDecision(this.bookPhrases, this.prettyPhrase);
			//this.radialFadeDarkDecision(this.bookPhrases, this.prettyPhrase);
			//this.separateDecision(this.bookPhrases, this.prettyPhrase);

			//WONK
			//this.effectLetterFadeDecision(this.bookPhrases, this.prettyPhrase);
		}
	} catch (doThePhraseError) {Mojo.Log.error(">>>>>>> doThePhrase", doThePhraseError, "thisQuote:", thisQuote, "this.prettyPhrase:", this.prettyPhrase);}

	}.bind(this), 10);

}
else {
	rawPhrases = null;
	this.killEverything("getRandomBookPhrases RESET");
	//this.emergencyReset = setTimeout(this.gatherPhrases(), 1000);
	//return null;
}
} catch (error) {Mojo.Log.error("ALL PAGES", error);}
if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE getRandomBookPhrases @@");}
};



/********************
 *
 * MASTER EFFECT DECISION
 *
 ********************/
DockAssistant.prototype.effectDecision = function (element, phrase) {
//if (this.debugMe === true) {Mojo.Log.info("@@ ENTER effectDecision @@", element, phrase);}
	var effectList = new Array(
		"simpleFadeDecision",
		"radialFadeLightDecision",
		"radialFadeDarkDecision",
		"separateDecision"
	);

	var useEffect = (Math.floor(Math.random() * 10));
	if (useEffect >= effectList.length) {
		this.effectDecision(element, phrase);
	}
	else {
		switch (effectList[useEffect]) {
			case 'simpleFadeDecision' :
				//Mojo.Log.info("USE EFFECT:", useEffect, "|", effectList[useEffect]);
				this.simpleFadeDecision(this.bookPhrases, this.prettyPhrase);
				break;
			case 'radialFadeLightDecision' :
				//Mojo.Log.info("USE EFFECT:", useEffect, "|", effectList[useEffect]);
				//this.ELB.style.background = "url('images/EffectScrims/RadialCenterLight.png') center center no-repeat";
				//this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";
				//Mojo.Log.info("effectDecision", elbbg, "|", eltbg);
				this.radialFadeLightDecision(this.bookPhrases, this.prettyPhrase);
				break;
			case 'radialFadeDarkDecision' :
				//Mojo.Log.info("USE EFFECT:", useEffect, "|", effectList[useEffect]);
				this.radialFadeDarkDecision(this.bookPhrases, this.prettyPhrase);
				break;
			case 'separateDecision' :
				//Mojo.Log.info("USE EFFECT:", useEffect, "|", effectList[useEffect]);
				this.separateDecision(this.bookPhrases, this.prettyPhrase);
				break;
		}
	}
//if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE effectDecision @@");}
};


/////////////////////////////////////////////////////////////////////
//
// Effect Layers Separate/Join
//
/********************
 * SEPARATE DECISION
 ********************/
DockAssistant.prototype.separateDecision = function (element, phrase) {
	if (this.debugMe === true) {Mojo.Log.info("@@ Enter separateDecision @@", element, phrase);}
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
		this.groovyTextFadeCounter = 0;
		this.doLayerSeparate(element, phrase);
	}
	else {
		this.layerMoveCounter = this.controller.window.innerWidth;
		//this.ELT.style.backgroundSize = "100% 100%";
		//this.ELB.style.backgroundSize = "100% 100%";
		this.doLayerJoin(element, phrase);
	}
};
/********************
 * SEPARATE LAYERS
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

		if (this.groovyTextFadeCounter <= 100) {
			element.style.color = "rgba(250, 250, 250, " + (this.groovyTextFadeCounter * 0.01) + ")";
			this.groovyTextFadeCounter = this.groovyTextFadeCounter + 4;
		}

		this.doLayerSeparateTimer = setTimeout(this.doLayerSeparate.bind(this, element, phrase), 52);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ Finish doLayerSeparate @@", this.ELB.style.opacity, this.ELT.style.opacity, element.style.opacity);}
		this.readyForNewPhrase = false;
		this.layerMoveCounter = this.controller.window.innerWidth;
		this.groovyTextFadeCounter = 100;

		//this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.prefsModel.dockPhraseSpeed);
		this.phraseTimer = setTimeout(this.doLayerJoin.bind(this, element, phrase), this.prefsModel.dockPhraseSpeed);
	}
};
/********************
 * JOIN LAYERS
 ********************/
DockAssistant.prototype.doLayerJoin = function (element, phrase) {
	if (this.ELB.style.left.replace('px', '') > 0) {
		this.ELB.style.left = this.layerMoveCounter + "px";
		this.ELT.style.left = (0 - this.layerMoveCounter) + "px";
		this.layerMoveCounter = this.layerMoveCounter - 10;

		if (this.groovyTextFadeCounter >= 0) {
			element.style.color = "rgba(250, 250, 250, " + (this.groovyTextFadeCounter * 0.01) + ")";
			this.groovyTextFadeCounter = this.groovyTextFadeCounter - 5;
		}

		this.doLayerJoinTimer = setTimeout(this.doLayerJoin.bind(this, element, phrase), 52);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ Finish doLayerJoin @@", this.ELB.style.opacity, this.ELT.style.opacity, element.style.opacity);}
		this.readyForNewPhrase = true;
		//this.separateDecision(element, phrase);
		this.getRandomBookPhrases("JOIN LAYERS");
	}
};
/////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
//
// Radial Fade in/out entire phrase
//
/********************
 * RADIAL FADE LIGHT DECISION
 ********************/
DockAssistant.prototype.radialFadeLightDecision = function (element, phrase) {
	if (this.debugMe === true) {Mojo.Log.info("@@ Enter radialFadeLightDecision @@", element, phrase);}
	if (this.readyForNewPhrase === true) {
		element.innerHTML = phrase;
		//element.style.color = "rgba(250, 250, 250, 1.0)";
		element.style.display = "block";
		element.style.zIndex = "-2";
		this.ELB.innerHTML = phrase;
		this.ELB.style.background = "url('images/EffectScrims/RadialCenterLight.png') center center no-repeat";
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
		this.radialLayerFadeCounter = 100;
		this.radialFadeIn(element, phrase);
	}
	else {
		//Mojo.Log.info("radialFadeLightDecision - FadeOut");
		this.radialLayerFadeCounter = 0;
		this.radialFadeOut(element, phrase);
	}
};
/********************
 * RADIAL FADE DARK DECISION
 ********************/
DockAssistant.prototype.radialFadeDarkDecision = function (element, phrase) {
	if (this.debugMe === true) {Mojo.Log.info("@@ Enter radialFadeDarkDecision @@", element, phrase);}
	if (this.readyForNewPhrase === true) {
		element.innerHTML = phrase;
		//element.style.color = "rgba(250, 250, 250, 1.0)";
		element.style.display = "block";
		element.style.zIndex = "-2";
		this.ELB.innerHTML = phrase;
		this.ELB.style.background = "url('images/EffectScrims/RadialCenterDark.png') center center no-repeat";
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
		this.radialLayerFadeCounter = 100;
		this.radialFadeIn(element, phrase);
	}
	else {
		//Mojo.Log.info("radialFadeDarkDecision - FadeOut");
		this.radialLayerFadeCounter = 0;
		this.radialFadeOut(element, phrase);
	}
};
/********************
 * RADIAL FADE IN
 ********************/
DockAssistant.prototype.radialFadeIn = function (element, phrase) {
	if (this.radialLayerFadeCounter > 0) {
		//Mojo.Log.info("WORKING FadeIn:", this.ELT.style.opacity, this.ELB.style.opacity);
		this.ELT.style.opacity = this.radialLayerFadeCounter * 0.01;
		this.ELB.style.opacity = this.radialLayerFadeCounter * 0.01;
		//this.ELB.style.opacity = (this.radialLayerFadeCounter - this.layerOpacityAdjustment) * 0.01;
		this.radialLayerFadeCounter--;
		this.radialFadeInTimer = setTimeout(this.radialFadeIn.bind(this, element, phrase), 52);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ Finish radialFadeIn @@", this.ELB.style.opacity, this.ELT.style.opacity, element.style.opacity);}
		this.readyForNewPhrase = false;
		this.phraseTimer = setTimeout(this.radialFadeOut.bind(this, element, phrase), this.prefsModel.dockPhraseSpeed);
	}
};
/********************
 * RADIAL FADE OUT
 ********************/
DockAssistant.prototype.radialFadeOut = function (element, phrase) {
	if (this.radialLayerFadeCounter < 100) {
		//Mojo.Log.info("WORKING FadeOut:", this.ELT.style.opacity, this.ELB.style.opacity);
		//this.ELT.style.opacity = (this.radialLayerFadeCounter + this.layerOpacityAdjustment) * 0.01;
		this.ELT.style.opacity = this.radialLayerFadeCounter * 0.01;
		this.ELB.style.opacity = this.radialLayerFadeCounter * 0.01;
		this.radialLayerFadeCounter++;
		this.radialFadeOutTimer = setTimeout(this.radialFadeOut.bind(this, element, phrase), 52);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ Finish radialFadeOut @@", this.ELB.style.opacity, this.ELT.style.opacity, element.style.opacity);}
		clearTimeout(this.radialFadeOutTimer);
		this.radialFadeOutTimer = null;
		this.readyForNewPhrase = true;
		this.getRandomBookPhrases("RADIAL FADE OUT");
	}
};
/////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////
//
// Simple Fade in/out entire phrase
//
/********************
 * SIMPLE FADE DECISION
 ********************/
DockAssistant.prototype.simpleFadeDecision = function (element, phrase) {
	if (this.debugMe === true) {Mojo.Log.info("@@ Enter simpleFadeDecision @@", element, phrase);}
	if (this.readyForNewPhrase === true) {
		element.innerHTML = phrase;
		//element.style.color = "rgba(250, 250, 250, 1.0)";
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
		this.simpleLayerFadeCounter = 100;
		this.simpleFadeIn(element, phrase);
	}
	else {
		this.simpleLayerFadeCounter = 0;
		this.simpleFadeOut(element, phrase);
	}
};
/********************
 * SIMPLE FADE IN
 ********************/
DockAssistant.prototype.simpleFadeIn = function (element, phrase) {

	if (this.simpleLayerFadeCounter > 0) {
		this.ELT.style.opacity = this.simpleLayerFadeCounter * 0.01;
		this.simpleLayerFadeCounter--;
		this.simpleFadeInTimer = setTimeout(this.simpleFadeIn.bind(this, element, phrase), 52);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ Finish simpleFadeIn @@", this.ELB.style.opacity, this.ELT.style.opacity, element.style.opacity);}
		this.readyForNewPhrase = false;
		//this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.prefsModel.dockPhraseSpeed);
		this.phraseTimer = setTimeout(this.simpleFadeOut.bind(this, element, phrase), this.prefsModel.dockPhraseSpeed);
	}
};
/********************
 * SIMPLE FADE OUT
 ********************/
DockAssistant.prototype.simpleFadeOut = function (element, phrase) {
	this.ELT.style.background = "url('images/EffectScrims/FullBlack.png') center center no-repeat";

	if (this.simpleLayerFadeCounter < 100) {
		this.ELT.style.opacity = this.simpleLayerFadeCounter * 0.01;
		this.simpleLayerFadeCounter++;
		this.simpleFadeOutTimer = setTimeout(this.simpleFadeOut.bind(this, element, phrase), 52);
	}
	else {
		if (this.debugMe === true) {Mojo.Log.info("@@ Finish simpleFadeOut @@", this.ELB.style.opacity, this.ELT.style.opacity, element.style.opacity);}
		this.readyForNewPhrase = true;
		clearTimeout(this.simpleFadeOutTimer);
		//this.simpleFadeDecision(element, phrase);
		this.getRandomBookPhrases("SIMPLE FADE OUT");
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
 * EFFECT DECISION
 ********************/
DockAssistant.prototype.effectLetterFadeDecision = function (element, phrase) {

	//this.groovyFadeDecision(element, phrase);

	//this.printLetters(element, phrase);
	//this.groovyLetterCounter = 0;
	if (this.fullBright === false) {
		Mojo.Log.info("DECIDE FADE IN");
		this.groovyLetterCounter = [];
		this.phrasePlace = 0;
		element.innerHTML = "";
		this.printLetters(element, phrase, phrase.length);
	}
	else {
		this.fullBright = false;
		this.effectLetterFadeDecision(element, phrase);
	}
};
/********************
 * PRINT LETTERS
 ********************/
DockAssistant.prototype.printLetters = function (element, phrase) {
	if (this.phrasePlace <= phrase.length) {
		element.innerHTML = element.innerHTML + "<span id='quoteSpan" + this.phrasePlace + "' style='color:rgba(250, 250, 250, 0);'>" + phrase.charAt(this.phrasePlace) + "</span>";
		this.groovyLetterCounter[this.phrasePlace] = 0;
		this.phrasePlace++;
		this.printLettersTimer = setTimeout(this.printLetters.bind(this, element, phrase), 0);
	}
	else {
		Mojo.Log.info("DONE WRITING");
		//clearTimeout(this.phraseTimer);
		clearTimeout(this.printLettersTimer);
		//this.phraseTimer = null;
		this.printLettersTimer = null;
		this.readyForFading = true;
		element.style.display = "block";
		this.phrasePlace = null;
		this.controlprintLettersFade(0, phrase.length, element, phrase);
	}
};
/********************
 * FADE CONTROLLER
 ********************/
DockAssistant.prototype.controlprintLettersFade = function (letter, length, element, phrase) {
	if (this.readyForFading === true) {
		if (letter <= length) {
			this.printLettersFadeIn(letter, length);
			letter++;
			this.controlprintLettersFadeTimer = setTimeout(this.controlprintLettersFade.bind(this, letter, length), 12);
		}
	}
	else {
		if (letter <= length) {
			//Mojo.Log.info("CONTROL FADE OUT", letter, length, Object.toString(element));
			this.groovyLetterCounter[letter] = 100;
			try {
			this.printLettersFadeOut(letter, length, element, phrase);
			} catch (ControlOutError) {Mojo.Log.error(">>>>>>> ControlOutError", ControlOutError, "|", letter, length, element);}
			letter++;
			this.controlprintLettersFadeTimer = setTimeout(this.controlprintLettersFade.bind(this, letter, length, element, phrase), 12);
		}
	}
};
/********************
 * PRINT LETTERS FADE IN
 ********************/
DockAssistant.prototype.printLettersFadeIn = function (letter, length) {
	if (this.groovyLetterCounter[letter] < 100) {
		$('quoteSpan' + letter).style.color = "rgba(250, 250, 250, " + this.groovyLetterCounter[letter] * 0.01 + ")";
		this.groovyLetterCounter[letter]++;
		this.groovyLetterFadeInTimer = setTimeout(this.printLettersFadeIn.bind(this, letter, length), 5);
	}
	else {
		clearTimeout(this.groovyLetterFadeInTimer[letter]);
		this.groovyLetterFadeInTimer[letter] = null;

		if (letter >= length) {
			Mojo.Log.info("DONE FADE IN");
			this.readyForFading = false;
			//if (! this.phraseTimer) {
				this.phraseTimer = setTimeout(this.getRandomBookPhrases.bind(this), this.prefsModel.dockPhraseSpeed);
			//}
			this.groovyLetterFadeInTimer = null;
			this.fullBright = true;
		}
	}
};
/********************
 * PRINT LETTERS FADE OUT
 ********************/
DockAssistant.prototype.printLettersFadeOut = function (letter, length, element, phrase) {
	if (this.groovyLetterCounter[letter] > 0) {
			try {
		$('quoteSpan' + letter).style.color = "rgba(250, 250, 250, " + this.groovyLetterCounter[letter] * 0.01 + ")";
			} catch (printLettersFadeOut) {Mojo.Log.error(">>>>>>> printLettersFadeOut", printLettersFadeOut, letter, length, element);}
		this.groovyLetterCounter[letter]--;
		this.groovyLetterFadeOutTimer = setTimeout(this.groovyLetterFadeOutTimer.bind(this, letter, length), 12);
	}
	else {
		clearTimeout(this.groovyLetterFadeOutTimer[letter]);
		this.groovyLetterFadeOutTimer[letter] = null;

		if (letter >= length) {
			Mojo.Log.info("DONE FADE OUT");
			this.readyForFading = true;
			this.groovyLetterFadeOutTimer = null;
			this.printLetters(element, phrase);
		}
	}
};
/////////////////////////////////////////////////////////////////////
