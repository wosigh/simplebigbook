/*
 * The purpose of the Help scene is to give users a consistent place within
 * webOS apps to find publisher information, support contact information and 
 * help resources.
 * 
 * We intend to provide framework-level support for the Help scene in a future
 * SDK release. For now, you'll need to manually add the Help scene and hook it
 * up to your app's Help menu item.
 * 
 * The contents of the Help scene are determined by the fields provided in this
 * file. Required fields are noted below. For most fields, UI labels are
 * automatically generated; the Help Resources are the exception to this rule.
 * 
 * Help resources may take various forms (help topics, FAQs, tips, rules,
 * tutorials, etc.). As far as the Help scene is concerned, a help resource is
 * defined by a UI label describing the resource and either a scene name (if the
 * resource is included as a scene in the app itself) or a URL (if the resource
 * is to be viewed in the webOS browser). You may provide any number of help
 * resources, or none at all. Make sure to replace the icon32x32.png with a 32x32 
 * version of your app's icon.
 */

// Required
_APP_Name = 'Simple Big Book';
_APP_VersionNumber = Mojo.appInfo.version;
_APP_PublisherName = 'Rick B and John K';
_APP_Copyright = '&copy; Copyright 2009 TBC Software.';

// At least one of these three is required
_APP_Support_URL = 'http://forums.precentral.net/showthread.php?p=1883868#post1883868';
_APP_Support_Email = {
	address: 'SimpleBigBook@vocshop.com',
	subject: 'Support for Simple Big Book'
}; // label = “Send Email”
_APP_Support_Phone = '';

// Optional
_APP_Publisher_URL = 'http://www.precentral.net/homebrew-apps/simple-big-book';
_APP_Artist_URL = 'http://sinacism.com/';
_APP_Help_Resource = [{
	type: 'scene',
	label: 'Using Simple Big Book',
	sceneName: 'using',
}, {
	type: 'scene',
	label: 'About Simple Big Book',
	sceneName: 'about',
}, {
	type: 'scene',
	label: 'Recovery Calculator',
	sceneName: 'calc'
}];
_APP_Support_Extra = [{
	type: 'web',
	label: 'Wikipedia 12 Step article',
	url: 'http://en.wikipedia.org/wiki/Twelve-step_program'
}];
