/*
 * Copyright 2008-2009 Palm, Inc. All rights reserved.
 */
/*jslint laxbreak: true */
/*global Mojo,_,$L
*/
/**
 * Constructor.
 * 
 * If this is a new UrlReference then the tmpIconFile* images will be set and the iconFile* images will not.
 * Conversely if the iconFile* images are set and the tmpIconFile* are not then this is an existing bookmark
 * that will be edited.
 * 
 * <ul>
 * <li>sceneController - Instance of Mojo.Controller.SceneController.</li>
 * <li>bookmarkStore - Instance of BookmarkStore.</li>
 * <li>urlReference - Instance of UrlReference.</li>
 * <li>task - String (BookmarkDialogAssistant.createBookmarkTask, BookmarkDialogAssistant.editBookmarkTask,
 *                   or BookmarkDialogAssistant.createLaunchpointTask.</li>
 * <li>deleteImage - function to call to delete an image.</li>
 * <li>onClose - function to call when closing the bookmark dialog.</li>
 * </ul>
 * 
 * @param {Object} The assistant parameters. 
 */
function BookmarkDialogAssistant(params) {
	this.dbName = "SBB_Bookmarks";
	this.dbVersion = "0.1";
	this.dbDisplayName = "Simple Big Book Bookmarks";
	this.dbSize = 200000;
	this.dbTable = "SBB_Bookmarks_Table";

	this.params = Mojo.Model.decorate(params);
	//Mojo.assert(params.deleteImage, "Must provide image delete func.");
	
	//Mojo.Log.info("BookmarkDialogAssistant", params.urlReference.id);
	
	this.savedUrlReference = false;

	this.actionBtnTitle = $L('Save bookmark');

	var urlReference = this.params.urlReference;
	//Mojo.Log.info(JSON.stringify(urlReference));
}

BookmarkDialogAssistant.editBookmarkTask = 'task-edit-bookmark';


BookmarkDialogAssistant.prototype.setup = function(widget) {
	
	var controller = this.params.sceneController;
	this.widget = widget;
	
	
	if (!SBB.db) {
		Mojo.Log.info("OPENING DB!", this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);
		SBB.db = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);
	}
	//else {
	//	Mojo.Log.info("DB ALREADY OPEN!", this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);
	//}

	// A change to the default behaviour of textfields means
	// we have to set the changeOnKeyPress attribute to 'true'
	// to guarantee we have the model updated with the textfield
	// entry on each keypress.
	var titleFieldAttributes = { 
		modelProperty: 'name',
		changeOnKeyPress: true,
		focusMode: Mojo.Widget.focusSelectMode  
	};
	controller.setupWidget('titleField', titleFieldAttributes, this.params.urlReference);

	controller.get('actionButton').addEventListener(Mojo.Event.tap, this._onAddBookmarkButtonTap.bind(this));
	controller.get('cancelBookmarkButton').addEventListener(Mojo.Event.tap, this._onCancelButtonTap.bind(this));
};


BookmarkDialogAssistant.prototype._onAddBookmarkButtonTap = function() {
	
	/*Mojo.Log.info("ID:", this.params.urlReference.id);
	Mojo.Log.info("Name:", this.params.urlReference.name);
	Mojo.Log.info("chapNum:", this.params.urlReference.chapNum);
	Mojo.Log.info("pageNum:", this.params.urlReference.pageNum);
	Mojo.Log.info("pagePos:", this.params.urlReference.pagePos);*/
	
	
	if (this.params.urlReference.name !== "") {
		this.savedUrlReference = true;

		var newBMName = "'" + this.params.urlReference.name + "'";
		
		SBB.db.transaction(
			function (transaction) {
				transaction.executeSql(
					"UPDATE " + this.dbTable + " SET bookmarkName = " + newBMName + " WHERE id = " +this.params.urlReference.id+"",
					[],
					this.doClose.bind(this),
					this.dbErrorHandler.bind(this)
				);
			}.bind(this)
		);


	}
	else {
		Mojo.Log.warn("Must supply a name.");
		Mojo.Controller.errorDialog("Must supply a name.");
	}
};

BookmarkDialogAssistant.prototype.doClose = function () {
	if (this.params.onClose) {
		this.params.onClose(this.savedUrlReference);
		delete this.params.onClose;
	}
	this.widget.mojo.close();
	//BookmarksAssistant.initialPopulate();
};

BookmarkDialogAssistant.prototype._onCancelButtonTap = function() {
	if (this.params.task !== BookmarkDialogAssistant.editBookmarkTask) {
		this.params.deleteImage(this.params.urlReference.thumbnailFile);
	}

	if (this.params.onClose) {
		this.params.onClose(this.savedUrlReference);
		delete this.params.onClose;
	}
	this.widget.mojo.close();
};

BookmarkDialogAssistant.prototype.cleanup = function() {
	// If the callback hasn't been called then call it. This
	// was probably due to a back.
	if (this.params.onClose) {
		this.params.onClose(false);
	}	
};

/**
 * Display the bookmark dialog.
 *
 * @param {Object} An object containing parameters for this function. See BookmarkDialogAssistant constructor.
 */
BookmarkDialogAssistant.showDialog = function(params) {

	var assistant = new BookmarkDialogAssistant(params);
	var title = params.urlReference.name || '';	
	
	return params.sceneController.showDialog({
		template: 'bookmarks/bookmark-dialog',
		assistant: assistant,
		title: title,
		// We do this flag for the moment to give the user
		// the expect behaviour of dropping back to the
		// bookmark/launcher dialog after using the customize
		// icon feature.
		preventCancel: true,
		actionBtnTitle: assistant.actionBtnTitle
	});
};


/********************
 *
 * DB RESPONSES
 *
 ********************/
BookmarkDialogAssistant.prototype.dbSuccessHandler = function(transaction, results){
	Mojo.Log.info(">>>>> BookAssistant - dbSuccessHandler", Object.toJSON(transaction), " -", Object.toJSON(results));
	//Mojo.Controller.errorDialog("dbErrorHandler", JSON.stringify(transaction), " -", JSON.stringify(errors));
	this.initialPopulate();
};
BookmarkDialogAssistant.prototype.dbErrorHandler = function(transaction, errors){
	Mojo.Log.error(">>>>> BookAssistant - dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
	Mojo.Controller.errorDialog("dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
};
