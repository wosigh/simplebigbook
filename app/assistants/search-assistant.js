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

function SearchAssistant() {
	this.debugMe = false;
}

/********************
 *
 * SETUP
 *
 ********************/
SearchAssistant.prototype.setup = function () {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER SEARCH SETUP @@");}

	this.prefsModel = new Mojo.Model.Cookie("SimpleBigBookv2");
	this.prefsModel.get();

	item = [
		["01_foreword.html", "books/", "Foreword", "foreword"],
		["02_drsopinion.html", "books/", "The Doctor's Opinion", "drsopinion"],
		["03_billsstory.html", "books/", "Bill's Story", "bill"],
		["04_thereis.html", "books/", "There is a Solution", "thereis"],
		["05_moreabout.html", "books/", "More About Alcoholism", "moreabout"],
		["06_weagnostics.html", "books/", "We Agnostics", "weagnostics"],
		["07_howitworks.html", "books/", "How It Works", "howitworks"],
		["08_intoaction.html", "books/", "Into Action", "intoaction"],
		["09_workingwithothers.html", "books/", "Working With Others", "working"],
		["10_towives.html", "books/", "To Wives", "towives"],
		["11_thefamily.html", "books/", "The Family Afterward", "thefamily"],
		["12_toemployers.html", "books/", "To Employers", "toemployers"],
		["13_avisionforyou.html", "books/", "A Vision for You", "avision"],
		["14_drsnightmare.html", "books/", "The Doctor's Nightmare", "drsnightmare"],
		["15_spiritual.html", "books/", "Spiritual Experience", "spiritual"]
	];

	this.linklistAttributes = {
		renderLimit: 20,
		lookahead: 15,
		listTemplate: 'search/listcontainer',
		itemTemplate: 'search/listItem'
	};

	this.linklistModel = {
		listTitle: $L("Search Results"),
		items: [{
			listdata: ''
		}]
	};

	this.controller.setupWidget('linklist', this.linklistAttributes, this.linklistModel);

	this.radioAttributes = {
		choices: [{
			label: 'Any',
			value: 1
		},{
			label: 'All',
			value: 2
		},{
			label: 'Phrase',
			value: 3
		}]
	};

	this.radioModel = {
		value: 1,
		disabled: false
	};
	this.controller.setupWidget('srchtype', this.radioAttributes, this.radioModel);

	this.textfieldAttributes = {
		hintText: ' ',
		multiline: false,
		enterSubmits: true,
		focus: true
	};
	this.textfieledModel = {
		value: '',
		disabled: false
	};
	this.controller.setupWidget('srchval', this.textfieldAttributes, this.textfieldModel);

	this.controller.setupWidget('search', {}, {
		label: 'Search'
	});

	//  ****  Setup for Application Menu
	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);

if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE SEARCH SETUP @@");}
};


/********************
 *
 * ACTIVATE
 *
 ********************/
SearchAssistant.prototype.activate = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER SEARCH ACTIVATE @@");}

	//Needs to be in ACTIVATE not SETUP. Setup gets ran twice (dunno why)
	//which makes allPages.length == 2 times the real length thus double hits in search!
	page = "";
	content = "";
	srchval = "";
	getLocalInfo();
	allPages = [];
	allPageUrl = [];
	radioValue = 1;
	holdlist = 0;

	this.controller.listen('search', Mojo.Event.tap, this.gosearch.bind(this));
	this.controller.listen('srchtype', Mojo.Event.propertyChange, this.radioCallback.bind(this));

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE SEARCH ACTIVATE @@");}
};


/********************
 *
 * DEACTIVATE
 *
 ********************/
SearchAssistant.prototype.deactivate = function (event) {
	this.controller.stopListening('search', Mojo.Event.tap, this.gosearch.bind(this));
	this.controller.stopListening('srchtype', Mojo.Event.propertyChange, this.radioCallback.bind(this));
};


/********************
 *
 * CLEANUP
 *
 ********************/
SearchAssistant.prototype.cleanup = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER SEARCH CLEANUP @@");}

	this.controller.stopListening('search', Mojo.Event.tap, this.gosearch.bind(this));
	this.controller.stopListening('srchtype', Mojo.Event.propertyChange, this.radioCallback.bind(this));

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE SEARCH CLEANUP @@");}
};


/********************
 *
 * RADIO CALLBACK
 *
 ********************/
SearchAssistant.prototype.radioCallback = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER SEARCH RADIO CALLBACK @@");}

	this.radioValue = event.value.toString();

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE SEARCH RADIO CALLBACK @@");}
};


/********************
 *
 * GET LOCAL INFO
 *
 ********************/
getLocalInfo = function () {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER SEARCH GET LOCAL INFO @@");}

	var lcUrl = "books/fulltext.html";
	new Ajax.Request(lcUrl, {
		method: 'get',
		onComplete: {},
		onSuccess: function (transport) {
			var content = "";
			content = transport.transport.responseText;
			allPages = allPages.concat(content.split("table id="));
		},
		onFailure: function (failure) {}
	});

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE SEARCH GET LOCAL INFO @@");}
};


/********************
 *
 * GO SEARCH
 * 
 * The HTML is quoted now (id="somepage_12") which 
 * cut out a TON of variable mangling.
 *
 ********************/
SearchAssistant.prototype.gosearch = function (event) {
	if (this.debugMe === true) {Mojo.Log.info("@@ ENTER SEARCH GO SEARCH @@");}

	items = [];
	var lcSrch = this.controller.get('srchval').mojo.getValue();
	lcSrch = trimAll(lcSrch);
	txt = lcSrch.split(" ");

	for (k = 0; k < txt.length; k++) {
		if (txt[k].length < 4) {
			$('linklist').style.display = "block";
			lcLine = "All words submitted must be at least 4 characters long.";
			items.push({
				listdata: lcLine
			});
			this.linklistModel.items = items;
			this.controller.modelChanged(this.linklistModel);
			return;
		}
	}
	if (this.radioValue === undefined) {
		this.radioValue = 1;
	}

	if (this.radioValue !== 1) {
		if (this.radioValue !== 2) {
			//txt = new Array();
			txt = [];
			txt[0] = trimAll(lcSrch);
			isPhrase = true;
		}
	}

	if (this.debugMe === true) {Mojo.Log.info("** radioValue", this.radioValue);}

	//fnd = new Array();
	fnd = [];
	total = 0;
	time = 0;
	var whichchap = "";
	var chaplink = "";

	for (i = 0; i < allPages.length; i++) {
		thisPage = allPages[i];
		rawdata = thisPage.substr(thisPage.indexOf('"') + 1, thisPage.indexOf(' ') - 2);

		if (this.debugMe === true) {Mojo.Log.info(rawdata.length);}

		underscore = rawdata.indexOf("_");
		chapname = trimAll(rawdata.substr(0, underscore));
		rawpage = (rawdata.substring(underscore + 2));

		if (rawpage.indexOf("_") === -1) {
			pagetxt_top = false;
			pagetxt = rawpage;
			if (this.debugMe === true) {Mojo.Log.info("+++ NOT FIRST PAGE:", pagetxt_top, pagetxt);}
		} else {
			//if a first page
			pagetxt_top = (trimAll(rawpage).substring(0, rawpage.indexOf("_"))) + "_top";
			pagetxt = (trimAll(rawpage).substring(0, rawpage.indexOf("_")));
			if (this.debugMe === true) {Mojo.Log.info("+++ IS FIRST PAGE:", pagetxt_top, pagetxt);}
		}

		whichchap = '';

		for (q = 0; q < item.length; q++) {
			if (this.debugMe === true) {Mojo.Log.info("** QQQQ", q, item.length, whichchap, chapname);}

			thischap = trimAll(item[q][3]);
			if (thischap === chapname) {
				whichchap = item[q][2];
				lnNum = q;
				chaplink = lnNum + "," + item[q][3];
				break;
			}
		}

		lnCntr = 0;
		lcHtml = "<font size='2'>";

		for (k = 0; k < txt.length; k++) {
			if (this.debugMe === true) {Mojo.Log.info("** KKKK", k, txt.length);}

			lcLower = thisPage.toLowerCase();
			lnAt = lcLower.indexOf(txt[k].toLowerCase());
			if (lnAt > -1 && txt[k] !== "") {
				lnCntr = lnCntr + 1;
				lcLine = thisPage.substr(lnAt - 26, ((lnAt + 26) - (lnAt - 26)));
				lnSpace = lcLine.indexOf(" ");
				lcLine = lcLine.substr(lnSpace + 1);
				lnLSpace = lcLine.lastIndexOf(" ");
				lcLine = lcLine.substr(0, lnLSpace);
				lcLine = lcLine.replace(txt[k].toLowerCase(), "<b>" + txt[k].toLowerCase() + "</b>");
				lcHtml += "... " + lcLine + " ...<br>";
				search_string = lcSrch;
				//if (this.debugMe === true) {Mojo.Log.info("** KKKK222", k, txt.length, lnCntr, lcLine, search_string);}
			}
		}
		lcHtml += "</font>";

		//Mojo.Log.info("```````` lnCntr", lnCntr);
		
		
		if ((this.radioValue === 2 && lnCntr === txt.length) || (this.radioValue !== 2 && lnCntr > 0)) {
			
			
			
			
			$('linklist').style.display = "block";
			
			if (('_p' + pagetxt[0] + '_top') === ('_p' + pagetxt_top)) {
				lcBut = '<div class="palm-row center"><div class="palm-button primary" id="' + chaplink + '_p' + pagetxt + '_top" onClick="jumptopage(this.id)"><font size="4">' + whichchap + ", page: " + pagetxt + '</font></div></div>';
			} else {
				lcBut = '<div class="palm-row center"><div class="palm-button primary" id="' + chaplink + '_p' + pagetxt + '" onClick="jumptopage(this.id)"><font size="4">' + whichchap + ", page: " + pagetxt + '</font></div></div>';
			}

			
			
			lcLine = lcBut + lcHtml + "<hr width=75%>";
			items.push({
				listdata: lcLine
			});
			if (this.debugMe === true) {Mojo.Log.info("** LAST", this.radioValue, lnCntr, lcBut, lcHtml, pagetxt, pagetxt[0]);}
		}
	}

	if (items.length === 0) {
		items.push({
			listdata: "No matches found"
		});
	}
	$('linklist').style.display = "block";
	this.linklistModel.items = items;
	this.controller.modelChanged(this.linklistModel);

	if (this.debugMe === true) {Mojo.Log.info("@@ LEAVE SEARCH GO SEARCH @@");}
};

/********************
 *
 * JUMP TO PAGE
 *
 ********************/

function jumptopage(pnID) {
	pagesplit = pnID.split(",");
	searchBook = pagesplit[0];
	searchPage = pagesplit[1];
	Mojo.Controller.stageController.popScene(this);
}


/********************
 *
 * TRIM ALL
 *
 ********************/

function trimAll(sString) {
	while (sString.substring(0, 1) === ' ') {
		sString = sString.substring(1, sString.length);
	}
	while (sString.substring(sString.length - 1, sString.length) === ' ') {
		sString = sString.substring(0, sString.length - 1);
	}
	return sString;
}