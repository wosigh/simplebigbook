Mojo.Log.info("=======================  START BOOKMARKS  =======================");
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


function BookmarksAssistant() {
	this.debugMe = false;

	this.dbName = "SBB_Bookmarks";
	this.dbVersion = "0.1";
	this.dbDisplayName = "Simple Big Book Bookmarks";
	this.dbSize = 200000;
}


/********************
 *
 * SETUP
 *
 ********************/
BookmarksAssistant.prototype.setup = function () {
try{
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER SETUP @@");}

	/*if (! (this.prefs)) {
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
	}*/

	////////////////////////////////////////////////////
	//  Make the bookmark model for the popup

	this.initialPopulate();
	////////////////////////////////////////////////////

	////////////////////////////////////////////////////
	// Setup widgets
	this.controller.setupWidget('Bookmarks_List', {
		itemTemplate: 'bookmarks/itemTemplate',
		swipeToDelete: true,
		reorderable: false,
		emptyTemplate: 'bookmarks/emptyTemplate'
		}, this.listModel);

	this.controller.setupWidget('deleteRows', {}, {label: 'Reset ALL Bookmarks'});
	////////////////////////////////////////////////////

	////////////////////////////////////////////////////
	// **** Setup for Application Menu
	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);
	////////////////////////////////////////////////////

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE SETUP @@");}
} catch (error) {Mojo.Log.error("BOOKMARKS ASSISTANT SETUP ERROR", error);}
};


/********************
 *
 * ACTIVATE
 *
 ********************/
BookmarksAssistant.prototype.activate = function (event) {
try {
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Activate @@");}

	this.controller.listen(this.controller.get('Bookmarks_List'), Mojo.Event.listDelete, this.bookmarkDelete.bind(this));
	//this.controller.listen(this.controller.get('Bookmarks_List'), Mojo.Event.listReorder, this.bookmarkReorder.bind(this));

	this.controller.listen('deleteRows', Mojo.Event.tap, this.deleteRows.bind(this));

	} catch (error) {Mojo.Log.error("ACTIVE ERROR", error);}
if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Activate @@");}
};


/********************
 *
 * DEACTIVATE
 *
 ********************/
BookmarksAssistant.prototype.deactivate = function (event) {
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Deactivate @@");}

	this.controller.stopListening('Bookmarks_List', Mojo.Event.listDelete, this.bookmarkDelete);
	//this.controller.stopListening('Bookmarks_List', Mojo.Event.listReorder, this.bookmarkReorder);
	//this.controller.stopListening('Bookmarks_List', Mojo.Event.listReorder, this.bookmarkReorder);

	this.controller.stopListening('deleteRows', Mojo.Event.tap, this.deleteRows);

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Deactivate @@");}
};


/********************
 *
 * CLEANUP
 *
 ********************/
BookmarksAssistant.prototype.cleanup = function (event) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Cleanup @@");}

	this.controller.stopListening('Bookmarks_List', Mojo.Event.listDelete, this.bookmarkDelete);

	this.controller.stopListening('deleteRows', Mojo.Event.tap, this.deleteRows);

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Cleanup @@");}
};


/********************
 *
 * INITIAL POPULATE
 *
 ********************/
BookmarksAssistant.prototype.initialPopulate = function(transaction, results){

	this.listModel = {showAddItem:true, items:[]};

	if (!SBB.db) {
		SBB.db = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);
	}

	SBB.db.transaction(
		function (transaction) {
			transaction.executeSql(
				"SELECT * FROM 'SBB_Bookmarks_Table'",
				[],
				this.displayList.bind(this),
				this.dbErrorHandler.bind(this)
			);
		}.bind(this)
	);
};


/********************
 *
 * DISPLAY LIST
 *
 ********************/
BookmarksAssistant.prototype.displayList = function (transaction, results) {
try{
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER displayList @@");}
	listItems = [];

	if (results.rows.length > 0) {
		for (i = 0; i < results.rows.length; i++) {
			row = results.rows.item(i);

			lcName = row.pageNumber.substr(row.pageNumber.indexOf("_p") + 2);

			// Filter out "_top" for display in the popup menu.
			if (lcName.indexOf('_top') >= 0) {lcName = lcName.replace('_top', '');}

			if (row.chapterNumber) {
				//var prettylabel = SBB.chapterList[row.chapterNumber].label + ', Page ' + lcName;
				//var prettylabel = 'Page ' + lcName + '<br>' + SBB.chapterList[row.chapterNumber].label;
				var prettylabel = 'Page ' + lcName + ', ' + SBB.chapterList[row.chapterNumber].label;
			}

			buildrow = {
				id: row.id,
				name: prettylabel,
				chapNum: row.chapterNumber,
				pageNum: row.pageNumber,
				pagePos: row.pagePosition
			};
			listItems[i] = buildrow;
		}
		this.listModel.items = listItems;
	}
	else {
		Mojo.Log.error(">>>>> displayList EMPTY!");
	}
	
	this.controller.modelChanged(this.listModel, this);

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE displayList @@");}
} catch (displayListError) {Mojo.Log.error("displayList ERROR", displayListError);}
};


/********************
 *
 * BOOKMARK REORDER
 *
 ********************/
BookmarksAssistant.prototype.bookmarkReorder = function (event) {
try {
	Mojo.Log.info("bookmarkReorder:", JSON.stringify(event.item));
	Mojo.Log.info("bookmarkReorder:", event.item.id, "+", event.item.name, "+", event.item.toIndex, "+", event.item.fromIndex);

	/*var idToDelete = event.item.id.toString();

	SBB.db.transaction(
		function (transaction) {
			transaction.executeSql(
				"DELETE FROM 'SBB_Bookmarks_Table' WHERE ID = ?",
				[idToDelete],
				function(transaction, results) {Mojo.Log.info("Successfully DELETED");},
				function(transaction, error) {Mojo.Log.info("FAILED TO DELETE");}
			);
		}
	);*/
} catch (bookmarkReorderError) {Mojo.Log.error("bookmarkReorder ERROR", bookmarkReorderError);}
};


/********************
 *
 * BOOKMARK DELETE
 *
 ********************/
BookmarksAssistant.prototype.bookmarkDelete = function (event) {
try {
	var idToDelete = event.item.id.toString();

	SBB.db.transaction(
		function (transaction) {
			transaction.executeSql(
				"DELETE FROM 'SBB_Bookmarks_Table' WHERE ID = ?",
				[idToDelete],
				function(transaction, results) {Mojo.Log.info("Successfully DELETED");},
				function(transaction, error) {Mojo.Log.info("FAILED TO DELETE");}
			);
		}
	);
} catch (bookmarkDeleteError) {Mojo.Log.error("bookmarkDelete ERROR", bookmarkDeleteError);}
};


/********************
 *
 * DELETE ALL ROWS
 *
 ********************/
BookmarksAssistant.prototype.deleteRows = function(event) {
try {
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER deleteRows @@");}

	SBB.db.transaction(
		function (transaction) {
			transaction.executeSql(
				"DELETE FROM 'SBB_Bookmarks_Table' WHERE ID > -1",
				[],
				function(transaction, results) {Mojo.Log.info("Successfully DELETED");},
				function(transaction, error) {Mojo.Log.info("FAILED TO DELETE");}
			);
		}
	);

	this.writeDefaults();

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE deleteRows @@");}
} catch (deleteRowsError) {Mojo.Log.error("deleteRows ERROR", deleteRowsError);}
};


/********************
 *
 * WRITE DEFAULTS
 *
 ********************/
BookmarksAssistant.prototype.writeDefaults = function(event) {
try {
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER writeDefaults @@");}

//0.07853283616163154
	SBB.defaultEntries = [];
	//SBB.defaultEntries[0] = {chapterNumber: '6', pageNumber: 'howitworks_p59', pagePosition:'-1026'};
	//SBB.defaultEntries[1] = {chapterNumber: '12', pageNumber: 'avision_p164',  pagePosition:'-12890'};
	//SBB.defaultEntries[1] = {chapterNumber: '9', pageNumber: 'towives_p112',  pagePosition:'-8227'};
	SBB.defaultEntries[0] = {chapterNumber: '6', pageNumber: 'howitworks_p59', pagePosition:'0.07917297024710035'};
	SBB.defaultEntries[1] = {chapterNumber: '12', pageNumber: 'avision_p164',  pagePosition:'0.9546072134387352'};

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

	this.initialPopulate();

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE writeDefaults @@");}
} catch (error) {Mojo.Log.error("writeDefaults ERROR", error);}
};


/********************
 *
 * DB RESPONSES
 *
 ********************/
BookmarksAssistant.prototype.dbSuccessHandler = function(transaction, results){
	Mojo.Log.info(">>>>> BookmarksAssistant - dbSuccessHandler", Object.toJSON(transaction), "-", Object.toJSON(results));
};

BookmarksAssistant.prototype.dbErrorHandler = function(transaction, errors){
	Mojo.Log.error(">>>>> BookmarksAssistant - dbErrorHandler", Object.toJSON(transaction), "-", Object.toJSON(errors));
};

