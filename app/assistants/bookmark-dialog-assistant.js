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
	this.dbDisplayName = "Simple Big Book";
	this.dbSize = 200000;
	this.dbTable = "SBB_Bookmarks_Table";
	this.params = Mojo.Model.decorate(params);
	this.savedUrlReference = false;
	this.actionBtnTitle = $L('Save bookmark');

	var urlReference = this.params.urlReference;
}

BookmarkDialogAssistant.editBookmarkTask = 'task-edit-bookmark';


BookmarkDialogAssistant.prototype.setup = function(widget) {
	
	var controller = this.params.sceneController;
	this.widget = widget;
	
	
	if (!SBB.db) {
		SBB.db = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);
	}

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
	//var title = params.urlReference.name || '';
	var title = "Rename Bookmark";
	
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
	//Mojo.Log.info(">>>>> BookAssistant - dbSuccessHandler", Object.toJSON(transaction), " -", Object.toJSON(results));
	this.initialPopulate();
};
BookmarkDialogAssistant.prototype.dbErrorHandler = function(transaction, errors){
	Mojo.Log.error(">>>>> BookAssistant - dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
	Mojo.Controller.errorDialog("dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
};
