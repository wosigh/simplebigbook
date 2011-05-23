//DatabaseWork = Class.create({
var DatabaseWork = {
	initialize: function() {
		this.debug = false;
		//this.listModel = {items:[]};
		this.dbName = "SBB_Bookmarks";
		this.dbVersion = "0.1";
		this.dbDisplayName = "0.1";
		this.dbSize = 200000;
	},
//});


/********************
 *
 * INITIAL POPULATE
 *
 ********************/
	initialPopulate: function(transaction, results) {

		this.listModel = {showAddItem:true, items:[]};

		if (!SBB.db) {
			SBB.db = openDatabase(SBB.dbName, SBB.dbVersion, SBB.dbDisplayName, SBB.dbSize);
			//SBB.db = openDatabase("SBB_Bookmarks", "0.1", "0.1", 200000);
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
	},


/********************
 *
 * DISPLAY LIST
 *
 ********************/
	displayList: function(element, transaction, results) {
	try{
		//Mojo.Log.info("--- DatabaseWork - Element:", element, "Transaction:", transaction, "Results:", results);
		//this.listModel = this.controller.get(element);
		//this.flabber = this.controller.getStageController(this)
		//Mojo.log.info ("--- DatabaseWork FLABBER:", this.flabber);

		listItems = [];

		//Mojo.Log.info("--- DatabaseWork - results.rows.length: ", results.rows.length);

		if (results.rows.length > 0) {
			for (i = 0; i < results.rows.length; i++) {
				row = results.rows.item(i);
				buildrow = {
					name: row.pageNumber,
					position: row.pagePosition,
					data: row.chapterNumber
				};
				listItems[i] = buildrow;
				//Mojo.Log.info("--- DatabaseWork - BUILD listModel.items", row.id, Object.toJSON(buildrow));
			}
			//this.listModel.items = listItems;
			element.items = listItems;
		}
		else {
			this.listModel.items = [
			{name: 'FLIP', position: 'FLOP', data: 'FLAP'}, 
			{name: 'TICK', position: 'TOCK', data: 'TACK'}
			];
		}

		this.controller.modelChanged(this.listModel, this);

		//Mojo.Log.info("--- DatabaseWork - FINAL listModel.items:", Object.toJSON(this.listModel.items));
		//Mojo.Log.info("--- DatabaseWork - this.listModel.items.length", this.listModel.items.length);
	} catch (error) {Mojo.Log.error(">>>>> DatabaseWork - displayList", error);}
},



/********************
 *
 * CREATE MY TABLE
 *
 ********************/
	createMyTable: function(){ 
	try { 
		if (this.debugMe===true) {Mojo.Log.info("@@ ENTER createMyTable @@");}

		SBB.db = openDatabase(SBB.dbName, SBB.dbVersion, SBB.dbDisplayName, SBB.dbSize);

		SBB.db.transaction(
			function (transaction) {
				transaction.executeSql(
					"CREATE TABLE IF NOT EXISTS 'SBB_Bookmarks_Table' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, chapterNumber INTEGER, pageNumber TEXT, pagePosition INTEGER)",
					[],
					this.writeDefaults.bind(this),
					this.dbErrorHandler.bind(this)
				);
			}.bind(this)
		);

		if (this.debugMe===true) {Mojo.Log.info("@@ LEAVE createMyTable @@");}
	} catch (error) {Mojo.Log.error(">>>>> DatabaseWork - createMyTable ERROR", error);}
},


/********************
 *
 * DELETE ROWS
 *
 ********************/
	deleteRows: function(event) {
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
	} catch (deleteRowsError) {Mojo.Log.error(">>>>> DatabaseWork - deleteRows ERROR", deleteRowsError);}
},


/********************
 *
 * WRITE DEFAULTS
 *
 ********************/
	writeDefaults: function(event) {
	try {
		if (this.debugMe===true) {Mojo.Log.info("@@ ENTER writeDefaults @@");}

		SBB.defaultEntries = [];
		SBB.defaultEntries[0] = {chapterNumber: '6', pageNumber: 'howitworks_p59', pagePosition:'-1026'};
		SBB.defaultEntries[1] = {chapterNumber: '12', pageNumber: 'avision_p164',  pagePosition:'-12890'};
		//SBB.defaultEntries[1] = {chapterNumber: '9', pageNumber: 'towives_p112',  pagePosition:'-8227'};

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
},


/********************
 *
 * DB CATCHER
 *
 ********************/
	dbSuccessHandler: function(transaction, results){
		Mojo.Log.info(">>>>> DatabaseWork - dbSuccessHandler", Object.toJSON(transaction), " -", Object.toJSON(results));
	},

	dbErrorHandler: function(transaction, errors){
		Mojo.Log.info(">>>>> DatabaseWork - dbErrorHandler", Object.toJSON(transaction), " -", Object.toJSON(errors));
	}

//});
};