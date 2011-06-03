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
	this.dbDisplayName = "Simple Big Book";
	this.dbSize = 200000;
	this.dbTable = "SBB_Bookmarks_Table";

	this.wasDeactivated = 0;
}


/********************
 *
 * SETUP
 *
 ********************/
BookmarksAssistant.prototype.setup = function () {
try{
	if (this.debugMe===true) {Mojo.Log.info("@@ ENTER SETUP @@");}

	if (! (this.prefs)) {
		this.prefs = new Mojo.Model.Cookie("SimpleBigBookv2");
		this.prefsModel = this.prefs.get();
	}

	////////////////////////////////////////////////////
	//  Make the bookmark model for the popup
	this.listModel = {items:[]};

	this.initialPopulate();
	////////////////////////////////////////////////////

	////////////////////////////////////////////////////
	// Setup widgets
	//this.controller.setupWidget('Bookmarks_List', {
	this.controller.setupWidget('Bookmarks_List', {
		itemTemplate: 'bookmarks/itemTemplate',
		swipeToDelete: true,
		reorderable: false,
		emptyTemplate: 'bookmarks/emptyTemplate'
		}, this.listModel);
	this.BookmarksListWidget = this.controller.get('Bookmarks_List');

	this.controller.setupWidget('deleteRows', {}, {label: 'Reset ALL Bookmarks'});
	this.deleteRowsWidget = this.controller.get('deleteRows')
	////////////////////////////////////////////////////

	////////////////////////////////////////////////////
	// **** Setup for Application Menu
	this.controller.setupWidget(Mojo.Menu.appMenu, StageAssistant.mySimpleMenuAttr, StageAssistant.mySimpleMenuModel);
	////////////////////////////////////////////////////

	this.bookmarkDeleteHandler = this.bookmarkDelete.bind(this);
	this.bookmarkRenameDialogHandler = this.bookmarkRenameDialog.bind(this);
	this.clearBookmarksHandler = this.clearBookmarks.bind(this);

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

	this.controller.listen(this.BookmarksListWidget, Mojo.Event.listDelete, this.bookmarkDelete.bind(this));
	this.controller.listen(this.BookmarksListWidget, Mojo.Event.listTap, this.bookmarkRenameDialog.bind(this));
	//this.controller.listen(this.BookmarksListWidget, Mojo.Event.listReorder, this.bookmarkReorder.bind(this));
	//this.controller.listen(this.deleteRowsWidget, Mojo.Event.tap, this.deleteRows.bind(this));
	this.controller.listen(this.deleteRowsWidget, Mojo.Event.tap, this.clearBookmarks.bind(this));

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

	this.controller.stopListening(this.BookmarksListWidget, Mojo.Event.listDelete, this.bookmarkDeleteHandler);
	this.controller.stopListening(this.BookmarksListWidget, Mojo.Event.listTap, this.bookmarkRenameDialogHandler);
	//this.controller.stopListening(this.BookmarksListWidget, Mojo.Event.listReorder, this.bookmarkReorder);
	//this.controller.stopListening(this.deleteRowsWidget, Mojo.Event.tap, this.deleteRows);
	this.controller.stopListening(this.deleteRowsWidget, Mojo.Event.tap, this.clearBookmarksHandler);

	if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Deactivate @@");}
};


/********************
 *
 * CLEANUP
 *
 ********************/
BookmarksAssistant.prototype.cleanup = function (event) {
if (this.debugMe===true) {Mojo.Log.info("@@ ENTER Cleanup @@");}

	this.controller.stopListening(this.BookmarksListWidget, Mojo.Event.listDelete, this.bookmarkDeleteHandler);
	this.controller.stopListening(this.BookmarksListWidget, Mojo.Event.listTap, this.bookmarkRenameDialogHandler);
	//this.controller.stopListening(this.BookmarksListWidget, Mojo.Event.listReorder, this.bookmarkReorder);
	//this.controller.stopListening(this.deleteRowsWidget, Mojo.Event.tap, this.deleteRows);
	this.controller.stopListening(this.deleteRowsWidget, Mojo.Event.tap, this.clearBookmarksHandler);

if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE Cleanup @@");}
};


/********************
 *
 * INITIAL POPULATE
 *
 ********************/
BookmarksAssistant.prototype.initialPopulate = function(transaction, results) {

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
	this.listModel.items = [];

	if (results.rows.length > 0) {
		for (i = 0; i < results.rows.length; i++) {
			row = results.rows.item(i);

			lcName = row.pageNumber.substr(row.pageNumber.indexOf("_p") + 2);

			// Filter out "_top".
			if (lcName.indexOf('_top') >= 0) {lcName = lcName.replace('_top', '');}

			if (row.chapterNumber) {
				var prettyLabel = 'Page ' + lcName + ', ' + SBB.chapterList[row.chapterNumber].label;
			}

			buildrow = {
				id: row.id,
				name: row.bookmarkName,
				chapNum: row.chapterNumber,
				pageNum: row.pageNumber,
				pagePos: row.pagePosition
			};
			this.listModel.items.push(buildrow)
			buildrow = null;
			row = null;
			lcName = null;
			prettyLabel = null;
		}
		this.controller.modelChanged(this.listModel);
	}
	else {
		Mojo.Log.error(">>>>> displayList EMPTY!");
	}

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
 * BOOKMARK RENAME
 *
 ********************/
BookmarksAssistant.prototype.bookmarkRenameDialog = function (event) {
try {
	var urlRef = event.item;
	var onClose = function(saved) {
		if (saved) {
			//Mojo.Log.info("onClose = function(saved)");
			this.controller.modelChanged(this.listModel);
		}
	}.bind(this);

	var params = {
		task: BookmarkDialogAssistant.editBookmarkTask,
		urlReference: urlRef,
		sceneController: this.controller,
		onClose: onClose
	};
	BookmarkDialogAssistant.showDialog(params);

} catch (bookmarkRenameDialogError) {Mojo.Log.error("bookmarkRenameDialog ERROR", bookmarkRenameDialogError);}
};


/********************
 *
 * BOOKMARK RESET POPUP
 *
 ********************/
BookmarksAssistant.prototype.clearBookmarks = function() {

	var self = this;
	this.controller.showAlertDialog({
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
	});
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
				function(transaction, results) {Mojo.Log.info("Successfully RESET");},
				function(transaction, error) {Mojo.Log.info("FAILED TO RESET");}
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

	SBB.defaultEntries = [];
	SBB.defaultEntries[0] = {bookmarkName: 'The Steps', chapterNumber: '6', pageNumber: 'howitworks_p59', pagePosition:'0.07917297024710035'};
	SBB.defaultEntries[1] = {bookmarkName: 'Third Step Prayer', chapterNumber: '6', pageNumber: 'howitworks_p63',  pagePosition:'0.3975037821482602'};
	SBB.defaultEntries[2] = {bookmarkName: 'Seventh Step Prayer', chapterNumber: '7', pageNumber: 'intoaction_p76',  pagePosition:'0.24976506212801503'};
	SBB.defaultEntries[3] = {bookmarkName: 'Road of Happy Destiny', chapterNumber: '12', pageNumber: 'avision_p164',  pagePosition:'0.9546072134387352'};

				//"INSERT INTO 'SBB_Bookmarks_Table' (bookmarkName, chapterNumber, pageNumber, pagePosition) VALUES (?, ?, ?, ?)",
	SBB.db.transaction(
		function(transaction) {
			for (i = 0; i < SBB.defaultEntries.length; i++) {
				transaction.executeSql(
				"INSERT INTO " + this.dbTable + " (bookmarkName, chapterNumber, pageNumber, pagePosition) VALUES (?, ?, ?, ?)",
				[SBB.defaultEntries[i].bookmarkName, SBB.defaultEntries[i].chapterNumber, SBB.defaultEntries[i].pageNumber, SBB.defaultEntries[i].pagePosition],
				this.dbSuccessHandler.bind(this),
				this.dbErrorHandler.bind(this)
				);
			}
		}.bind(this)
	);

	Mojo.Controller.getAppController().showBanner("Reset all bookmarks to defaults.",{source: 'notification'});

	this.listModel.items = [];
	this.controller.modelChanged(this.listModel, this);
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
	Mojo.Log.info(">>>>> BookAssistant - dbSuccessHandler", Object.toJSON(transaction), " -", Object.toJSON(results));
};
BookmarksAssistant.prototype.dbErrorHandler = function(transaction, errors){
	Mojo.Log.error(">>>>> BookAssistant - dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
	Mojo.Controller.errorDialog("dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
};
