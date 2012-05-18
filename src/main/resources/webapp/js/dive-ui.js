/*
 * Copyright (c) 2012, Dennis Pfisterer, University of Luebeck
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 *
 * 	- Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 * 	  disclaimer.
 * 	- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 * 	  following disclaimer in the documentation and/or other materials provided with the distribution.
 * 	- Neither the name of the University of Luebeck nor the names of its contributors may be used to endorse or promote
 * 	  products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function valueToGradeText(value) {
		 if( value == 1) 	return { color : "#32CD32", text : "Sehr gut (very good, 1)" }; 
	else if( value == 2) 	return { color : "#32CD32", text : "Gut (good, 2)" }; 
	else if( value == 3) 	return { color : "#006400", text : "Befriedigend (satisfactory, 3)" }; 
	else if( value == 4) 	return { color : "#B8860B", text : "Ausreichend (sufficient, 4)" }; 
	else if( value == 5) 	return { color : "#DC143C", text : "Mangelhaft (poor, 5)" }; 
	else if( value == 6) 	return { color : "#B22222", text : "Ungenügend (deficient, 6)" }; 
	else 					return { color : "#808080", text : "No selection" }; 
}

function valueToContentRating(value) {
		 if( value == 1) 	return { color : "#32CD32", text : "Perfect Balance" };
	else if( value == 2) 	return { color : "#B8860B", text : "Could've been a bit more" };
	else if( value == 3) 	return { color : "#B8860B", text : "Could've been a bit less" };
	else if( value == 4) 	return { color : "#DC143C", text : "Too few stuff for one lecture" };
	else if( value == 5) 	return { color : "#DC143C", text : "Way too much" };
	else 					return { color : "#808080", text : "No selection" };
}



function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


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
	
//	this.view = $('<div id="DiveGui'+ this.dialogId+'" class="modal hide"></div>');
	this.view = $('<div id="DiveGui'+ this.dialogId+'" class=""></div>');
	
	$(document.body).append(this.view);

	this.okButton = null;
	this.cancelButton = null;
	
	this.formData =	{
			version 			: 0,
			key 				: "",
			good 				: "",
			bad 				: "",
			contentsGrade 		: 0,
			timeContentRatio 	: 0,
	}; 
		
	var self = this;
	self.buildView(module);
};


DiveGuiDialog.prototype.updateLoginDataFromForm = function() {
	this.formData.version 	= 1;
	this.formData.key 		= Dive.escapeForHTML($("#auth-"+this.dialogId)[0].value);
	this.formData.good 		= Dive.escapeForHTML($("#good-"+this.dialogId)[0].value);
	this.formData.bad 		= Dive.escapeForHTML($("#bad-"+this.dialogId)[0].value);
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
			
			+ '			<tr>'
			+ '				<td>'
			+ '					<div class="contentsSlider"></div>'
			+ '				</td>'
			+ '				<td width="50%">'
			+ '					<div class="contentsSliderText" style="font-weight:bold; color: "+ valueToGradeText(0).color +";">' + valueToGradeText(0).text+ '</div>'
			+ '				</td>'
			+ '			</tr>'
			
			+ '		</tbody>'
			+ '		</table>'
			
			/* ----------------------------------------------------------- */
			+ '		<h4>Time/Content Ratio</h4>'	
			/* ----------------------------------------------------------- */
			+ '		<table>'
			+ '		<tbody>'
			
			+ '			<tr>'
			+ '				<td>'
			+ '					<div class="timeContentsRatio"></div>'
			+ '				</td>'
			+ '				<td width="50%">'
			+ '					<div class="timeContentsRatioText" style="font-weight:bold; color: "+ valueToContentRating(0).color +";">' + valueToContentRating(0).text+ '</div>'
			+ '				</td>'
			+ '			</tr>'
			
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
			+ '						<textarea class="input-xlarge goodthings" id="good-'+that.dialogId+'" rows="2" placeholder="Please enter anything that you liked."></textarea>'
			+ '				</td>'
			+ '			</tr>'
			
			+ '			<tr>'
			+ '				<td>'
			+ '						Criticism'
			+ '				</td>'
			+ '				<td>'
			+ '						<textarea class="input-xlarge badthings" id="bad-'+that.dialogId+'" rows="2" placeholder="Please enter anything that you DID NOT like."></textarea>'
			+ '				</td>'
			+ '			</tr>'
			
			+ '		</tbody>'
			+ '		</table>'
			
			
			
			+ '		</form>'
			+ '	</div>');


			var contentsSliderDiv 	= $(dialogBody.find('div.contentsSlider').first()[0]);
			var contentsSliderText	= $(dialogBody.find('div.contentsSliderText').first()[0]);
			contentsSliderDiv.slider(
					{	value: 0, 
						min: 0, 
						max: 6, 
						step: 1, 
						slide: function( event, ui ) {
							contentsSliderText.empty();
							contentsSliderText.append(valueToGradeText(ui.value).text);
							contentsSliderText.css("color", valueToGradeText(ui.value).color);
							that.formData.contentsGrade = ui.value;
						}
					}
				);
			
			var timeContentsRatioDiv 	= $(dialogBody.find('div.timeContentsRatio').first()[0]);
			var timeContentsRatioText	= $(dialogBody.find('div.timeContentsRatioText').first()[0]);
			timeContentsRatioDiv.slider(
					{	value: 0, 
						min: 0, 
						max: 5, 
						step: 1, 
						slide: function( event, ui ) {
							timeContentsRatioText.empty();
							timeContentsRatioText.append(valueToContentRating(ui.value).text);
							timeContentsRatioText.css("color", valueToContentRating(ui.value).color);
							that.formData.timeContentRatio = ui.value;
						}
					}
				);
	
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
			
			+ '		<div class="evaluationDiv"></div>'
			
			+ '	</div>');

	var adminKeyInput 	= dialogBody.find('input.adminKeyInput').first();
	var userKeyInput 	= dialogBody.find('input.userKeyInput').first();
	var loadButton 		= dialogBody.find('input.loadButton').first();
	var evaluationDiv	= dialogBody.find('div.evaluationDiv').first();

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
 
		var callbackDone = function(evaluations) { 
			self.displayEvaluations($(evaluationDiv[0]), evaluations.evaluations, userKeyInput[0].value);
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



DiveGuiViewModuleDialog.prototype.displayEvaluations = function(div, evaluations, userKey) {
	var table = 
		$('<table>'
			+ '	<thead>'
			+ '		<tr>'
			+ '			<td>Lecture</td>'
			+ '			<td>Contents</td>'
			+ '			<td>Time/Content Ratio</td>'
			+ '			<td>Good</td>'
			+ '			<td>Bad</td>'
			+ '		</tr>'
			+ '	<thead>'
			+ '<tbody>' 
			+ '</tbody>' 
			+ '</table>');

	div.empty();
	div.append(table);
	
	var tbody = $(table.find('tbody').first()[0]);
	
	for (var i = 0; i < evaluations.length; i++) {
		var evaluation = evaluations[i];
		var decrypted = CryptoJS.AES.decrypt(evaluation.encryptedContent, userKey).toString(CryptoJS.enc.Utf8);
		
		var row = $('	<tr colspan="5">Unable to decrypt</tr>');
		
		if(isJsonString(decrypted)) {
			
			var data = eval('(' + decrypted + ')');
			
			row = $('	<tr>'

					+ '		<td>' + evaluation.lecture + '</td>'
					+ '		<td>' + (data.contentsGrade ? data.contentsGrade : "") + '</td>'
					+ '		<td>' + (data.timeContentRatio ? data.timeContentRatio : "") + '</td>'
					+ '		<td>' + (data.good ? data.good : "") + '</td>'
					+ '		<td>' + (data.bad ? data.bad : "") + '</td>'
					
					+ '	</tr>');
			
		}
		
		tbody.append(row);
	}
	
};























/**
 * #################################################################
 * DiveGuiNotificationsViewer
 * #################################################################
 * 
 * Consumes events of type 'diveui-notification' and displays them in a
 * notification area. A 'diveui-notification' event has to carry data of the
 * following type: { type : "alert"|"block-alert" severity :
 * "warning"|"error"|"success"|"info" message : "Oh snap! Change this and that
 * and try again." actions : an array of buttons (only for block-alerts) }
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

