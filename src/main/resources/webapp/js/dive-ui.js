
var DiveGui = new function() {
	var self = this;
	
	this.showAlert = function(message, severity) {
		$(window).trigger('diveui-notification',
				{
					type     : 'alert',
					severity : severity,
					message  : message
				}
		);
	};

	this.showWarningAlert = function(message) { this.showAlert(message, 'warning'); };
	this.showErrorAlert = function(message) { this.showAlert(message, 'error'); };
	this.showSuccessAlert = function(message) { this.showAlert(message, 'success'); };
	this.showInfoAlert = function(message) { this.showAlert(message, 'info'); };

	this.showBlockAlert = function(message, actions, severity) {
		$(window).trigger('diveui-notification',
				{
					type     : 'block-alert',
					severity : severity,
					message  : message,
					actions  : actions
				}
		);
	};
	this.showWarningBlockAlert = function(message, actions) { this.showBlockAlert(message, actions, 'warning'); };
	this.showErrorBlockAlert = function(message, actions) { this.showBlockAlert(message, actions, 'error'); };
	this.showSuccessBlockAlert = function(message, actions) { this.showBlockAlert(message, actions, 'success'); };
	this.showInfoBlockAlert = function(message, actions) { this.showBlockAlert(message, actions, 'info'); };	
	
	this.showAjaxError = function(jqXHR, textStatus, errorThrown) {
		var message = $('<h2>Error while loading data!</h2>'
				+ '<h3>jqXHR</h3>'
				+ '<pre>'+JSON.stringify(jqXHR, null, '  ')+'</pre>'
				+ '<h3>textStatus</h3>'
				+ '<pre>'+textStatus+'</pre>'
				+ '<h3>errorThrown</h3>'
				+ '<pre>'+errorThrown+'</pre>');
		self.showErrorBlockAlert(message);
	};
	

};	
	

/**
 * ---------------------------------------------------------------------------------------- 
 * Evaluation Dialog
 * ---------------------------------------------------------------------------------------- 
 */
var DiveGuiDialog = function(module) {

	this.module = module;
	this.dialogId = CryptoJS.SHA1("DiveDialog" + this.module.name).toString();
	
	this.view = $('<div id="DiveGui'+ this.dialogId+'" class="modal hide"></div>');
	
	$(document.body).append(this.view);

	this.okButton = null;
	this.cancelButton = null;
	this.formData = null;

	var self = this;
	self.buildView(module);
};


DiveGuiDialog.prototype.updateLoginDataFromForm = function() {
	this.formData = {
			key 	: $("#auth-"+this.dialogId)[0].value,
			good 	: $("#good-"+this.dialogId)[0].value,
			bad 	: $("#bad-"+this.dialogId)[0].value,
	};
	
};

DiveGuiDialog.prototype.submit = function() {
	var self = this;
	
	self.updateLoginDataFromForm();
	
	var encrypted = CryptoJS.AES.encrypt(JSON.stringify(self.formData, null, '  '), self.formData.key);

	var evaluationSubmission = {
			moduleId 			: self.module.name,
			lecture				: self.module.lecture,
			md5OfUserKey 		: btoa(CryptoJS.MD5(self.formData.key).toString()),
			encryptedEvaluation : btoa(encrypted)
	};
	
	var callbackError = function(jqXHR, textStatus, errorThrown) {
		
			if (jqXHR.status == 403) { 
				alert("Submit failed. Maybe you got the wrong key?"); 
			} else { 
				console.log(jqXHR); 
				DiveGui.showAjaxError(jqXHR, textStatus, errorThrown); 
			} 
	};
 
	var callbackDone = function() { 
		alert("Thank you for your feedback!");
		window.setTimeout(function() {self.hide()}, 500);
	};
 
	
	Dive.submitEvaluation(evaluationSubmission, callbackDone, callbackError);
};

DiveGuiDialog.prototype.hide = function() {
	this.view.hide();
};

DiveGuiDialog.prototype.show = function() {
	this.view.show();
};



DiveGuiDialog.prototype.buildView = function(module) {
	var that = this;

	var dialogHeader = $('<div class="modal-header"><h3>Feeback for module "' + module.name + ' (lecture: '+ module.lecture +')"</h3></div>');

	var dialogBody = $('<div class="modal-body">'
			+ '		<form id="DiveGuiDialogForm-'+that.dialogId+'">'
			
			/* ----------------------------------------------------------- */
			+ '		<h4>Authentication</h4>'	
			/* ----------------------------------------------------------- */
			+ '		<table>'
			+ '		<tbody>'
			
			+ '			<tr>'
			+ '				<td>'
			+ '						Key'
			+ '				</td>'
			+ '				<td>'
			+ '						<input class="input-xlarge" id="auth-'+that.dialogId+'" type="text" placeholder="The participation key for this module">'
			+ '				</td>'
			+ '			</tr>'
			
			+ '		</tbody>'
			+ '		</table>'
			
			
			/* ----------------------------------------------------------- */
			+ '		<h4>Contents</h4>'	
			/* ----------------------------------------------------------- */
			+ '		<table>'
			+ '		<tbody>'
			
			
			+ '		</tbody>'
			+ '		</table>'
			
			/* ----------------------------------------------------------- */
			+ '		<h4>Presentation</h4>'	
			/* ----------------------------------------------------------- */
			+ '		<table>'
			+ '		<tbody>'
			
			
			+ '		</tbody>'
			+ '		</table>'
			
			
			
			
			/* ----------------------------------------------------------- */
			+ '		<h4>Comments</h4>'	
			/* ----------------------------------------------------------- */
			+ '		<table>'
			+ '		<tbody>'
			
			+ '			<tr>'
			+ '				<td>'
			+ '						Good things'
			+ '				</td>'
			+ '				<td>'
			+ '						<textarea class="input-xlarge goodthings" id="good-'+that.dialogId+'" rows="2" placeholder="Please enter anything that you liked about this spmodule"></textarea>'
			+ '				</td>'
			+ '			</tr>'
			
			+ '			<tr>'
			+ '				<td>'
			+ '						Criticism'
			+ '				</td>'
			+ '				<td>'
			+ '						<textarea class="input-xlarge badthings" id="bad-'+that.dialogId+'" rows="2" placeholder="Please enter anything that you DID NOT like about this specific module"></textarea>'
			+ '				</td>'
			+ '			</tr>'
			
			+ '		</tbody>'
			+ '		</table>'
			
			
			
			+ '		</form>'
			+ '	</div>');


	this.okButton = $('<input class="btn primary" value="OK" style="width:25px;text-align:center;">');
	this.cancelButton = $('<input class="btn secondary" value="Cancel" style="width:45px;text-align:center;">');

	this.okButton.bind('click', this, function(e) {
		that.submit();
	});

	this.cancelButton.bind('click', this, function(e) {
		e.data.hide();
	});

	var dialogFooter = $('<div class="modal-footer"/>');
	dialogFooter.append(this.cancelButton, this.okButton);
	this.view.append(dialogHeader, dialogBody, dialogFooter);
};










/**
 * ---------------------------------------------------------------------------------------- 
 * Create module Admin Dialog
 * ---------------------------------------------------------------------------------------- 
 */


var DiveGuiCreateModuleDialog = function() {
	this.id = CryptoJS.SHA1("DiveDialog" + Math.random()).toString();
	
	this.view = $('<div id="DiveGuiCreateModuleDialog'+ this.id+'" class="modal hide"></div>');
	
	$(document.body).append(this.view);

	this.okButton = null;
	this.cancelButton = null;
	this.formData = null;

	var self = this;
	self.buildView();
};


DiveGuiCreateModuleDialog.prototype.updateLoginDataFromForm = function() {
	this.formData = {
			name 	 		: btoa($("#name-"+this.id)[0].value),
			md5OfUserKey  	: btoa(CryptoJS.MD5($("#userkey-"+this.id)[0].value).toString()),
			md5OfAdminKey 	: btoa(CryptoJS.MD5($("#adminkey-"+this.id)[0].value).toString()),
	};
	
};

DiveGuiCreateModuleDialog.prototype.submit = function() {
	var self = this;
	
	var callbackError = function(jqXHR, textStatus, errorThrown) {
		
			if (jqXHR.status == 403) { 
				alert("Submit failed."); 
			} else { 
				console.log(jqXHR); 
				DiveGui.showAjaxError(jqXHR, textStatus, errorThrown); 
			} 
	};
 
	var callbackDone = function() { 
		alert("Thank you, the module has been created.");
		window.setTimeout(function() {self.hide()}, 500);
	};
 
	self.updateLoginDataFromForm();
	Dive.createModule(self.formData, callbackDone, callbackError);
};



DiveGuiCreateModuleDialog.prototype.hide = function() {
	this.view.hide();
};

DiveGuiCreateModuleDialog.prototype.show = function() {
	this.view.show();
};



DiveGuiCreateModuleDialog.prototype.buildView = function() {
	var that = this;

	var dialogHeader = $('<div class="modal-header"><h3>Create new module</h3></div>');

	var dialogBody = $('<div class="modal-body">'
			+ '		<form id="DiveGuiDialogForm-'+that.id+'">'
			
			+ '		<table>'
			+ '		<tbody>'
			
			+ '			<tr>'
			+ '				<td>Name</td>'
			+ '				<td><input class="input-xlarge" id="name-'+that.id+'" type="text" placeholder="Name of the module (e.g., Security SS12)"></td>'
			+ '			</tr>'
			
			+ '			<tr>'
			+ '				<td>User Key</td>'
			+ '				<td><input class="input-xlarge" id="userkey-'+that.id+'" type="text" placeholder="Key for the users to add evaluations"></td>'
			+ '			</tr>'

			+ '			<tr>'
			+ '				<td>Admin Key</td>'
			+ '				<td><input class="input-xlarge" id="adminkey-'+that.id+'" type="text" placeholder="Key for the admin to see evaluations"></td>'
			+ '			</tr>'
			
			+ '		</tbody>'
			+ '		</table>'
			
			+ '		</form>'
			+ '	</div>');


	this.okButton = $('<input class="btn primary" value="OK" style="width:25px;text-align:center;">');
	this.cancelButton = $('<input class="btn secondary" value="Cancel" style="width:45px;text-align:center;">');

	this.okButton.bind('click', this, function(e) {
		that.submit();
	});

	this.cancelButton.bind('click', this, function(e) {
		e.data.hide();
	});

	var dialogFooter = $('<div class="modal-footer"/>');
	dialogFooter.append(this.cancelButton, this.okButton);
	this.view.append(dialogHeader, dialogBody, dialogFooter);
};




/**
 * ---------------------------------------------------------------------------------------- 
 * View module Admin Dialog
 * ---------------------------------------------------------------------------------------- 
 */


var DiveGuiViewModuleDialog = function(module) {
	this.id = CryptoJS.SHA1("DiveGuiViewModuleDialog" + Math.random()).toString();
	this.view = $('<div id="DiveGuiViewModuleDialog'+ this.id+'" class="modal hide"></div>');

	this.module = module;
	this.okButton = null;
	$(document.body).append(this.view);
	var self = this;
	self.buildView();
};


DiveGuiViewModuleDialog.prototype.hide = function() {
	this.view.hide();
};

DiveGuiViewModuleDialog.prototype.show = function() {
	this.view.show();
};



DiveGuiViewModuleDialog.prototype.buildView = function() {
	var that = this;

	var dialogHeader = $('<div class="modal-header"><h3>View module evaluation ('+that.module.name +' / '+ that.module.lecture +')</h3></div>');

	var keyInput = $('');
	var loadButton = $('');
	
	var dialogBody = $('<div class="modal-body">'
			+ '		<form id="DiveGuiDialogForm-'+that.id+'">'
			
			+ '		<table>'
			+ '		<tbody>'
			
			+ '			<tr>'
			+ '				<td>User Key</td>'
			+ '				<td><input class="input userKeyInput" type="text" placeholder=""></td>'
			+ '				<td></td>'
			+ '			</tr>'
			
			+ '			<tr>'
			+ '				<td>Admin Key</td>'
			+ '				<td><input class="input adminKeyInput" type="text" placeholder=""></td>'
			+ '				<td><input class="btn loadButton" value="Load" style="width:30px;text-align:center;"></td>'
			+ '			</tr>'
			
			+ '		</tbody>'
			+ '		</table>'
			
			+ '		</form>'
			+ '	</div>');

	var adminKeyInput = dialogBody.find('input.adminKeyInput').first();
	var userKeyInput = dialogBody.find('input.userKeyInput').first();
	var loadButton = dialogBody.find('input.loadButton').first();

	var self = this;
	loadButton.bind('click', this, function(e) {
		var keyValue = adminKeyInput[0].value;
		var request = {
				moduleName : btoa(self.module.name),
				md5OfAdminKey : btoa(CryptoJS.MD5(keyValue).toString())
		};
		
		var callbackError = function(jqXHR, textStatus, errorThrown) {
			
			if (jqXHR.status == 403) { 
				alert("Key not valid."); 
			} else if (jqXHR.status == 404) { 
					alert("Module not found."); 
			} else {  
				console.log(jqXHR); 
				DiveGui.showAjaxError(jqXHR, textStatus, errorThrown); 
			} 
		};
 
		var callbackDone = function(data) { 
			alert(data); //TODO: Hier gehts weiter!
		};
 
		Dive.getEvaluation(request, callbackDone, callbackError);
	});
	
	this.okButton = $('<input class="btn primary" value="Close" style="width:25px;text-align:center;">');

	this.okButton.bind('click', this, function(e) {
		that.hide();
	});

	var dialogFooter = $('<div class="modal-footer"/>');
	dialogFooter.append(this.cancelButton, this.okButton);
	this.view.append(dialogHeader, dialogBody, dialogFooter);
};


























/**
 * #################################################################
 * DiveGuiNotificationsViewer
 * #################################################################
 *
 * Consumes events of type 'diveui-notification' and displays them in a
 * notification area. A 'diveui-notification' event has to carry data of the
 * following type:
 *  { type : "alert"|"block-alert" severity : "warning"|"error"|"success"|"info"
 * message : "Oh snap! Change this and that and try again." actions : an array
 * of buttons (only for block-alerts) }
 *
 */

var WiseGuiNotificationsViewer = function() {

	this.view = null;
	this.buildView();

	var self = this;
	$(window).bind('diveui-notification', function(e, data) {
		self.showNotification(data);
	});
};

WiseGuiNotificationsViewer.prototype.showNotification = function(notification) {
	if (notification.type == 'alert') {
		this.showAlert(notification);
	} else if (notification.type == 'block-alert') {
		this.showBlockAlert(notification);
	}
};

WiseGuiNotificationsViewer.prototype.showAlert = function(alert) {
	var alertDiv = $('<div class="alert-message '+alert.severity+'">'
			+ '<a class="close" href="#">&times;</a>'
			+ '<p/>'
			+ '</div>');
	alertDiv.find('p').append(alert.message);
	this.view.append(alertDiv);
	alertDiv.alert();
};

WiseGuiNotificationsViewer.prototype.showBlockAlert = function(alert) {
	var blockAlertDiv = $('<div class="alert-message block-message '+alert.severity+'">'
			+ '	<a class="close" href="#">&times;</a>'
			+ '	<p></p>'
			+ '	<div class="alert-actions">'
			+ '	</div>'
			+ '</div>');
	if (alert.message instanceof Array) {
		for (var i=0; i<alert.message.length; i++) {
			blockAlertDiv.find('p').append(alert.message[i]);
		}
	} else {
		blockAlertDiv.find('p').append(alert.message);
	}
	var actionsDiv = blockAlertDiv.find('.alert-actions');
	if (alert.actions) {
		for (var i=0; i<alert.actions.length; i++) {
			actionsDiv.append(alert.actions[i]);
			actionsDiv.append(' ');
		}
	}
	this.view.append(blockAlertDiv);
	blockAlertDiv.alert();
};

WiseGuiNotificationsViewer.prototype.buildView = function() {
	this.view = $('<div class="WiseGuiNotificationsContainer"></div>');
};


var notificationsViewer  = new WiseGuiNotificationsViewer();

$(function () {
	$('body').append(notificationsViewer.view);
});

