
if( typeof diveBaseUrl === 'undefined' )
	var diveBaseUrl = "";



var Dive = new function() {
	
	this.createModule = function(module, callbackDone, callbackError) {

		$.ajax({
			url			:	diveBaseUrl + "/rest/modules/add",
			type		:	"POST",
			data		:	JSON.stringify(module, null, '  '),
			contentType	:	"application/json; charset=utf-8",
			dataType	:	"json",
			success		: 	function(data) {callbackDone(data);},
			error		: 	callbackError,
			xhrFields	: 	{ withCredentials: true }
		});
	};
	
	this.submitEvaluation = function(evaluationSubmission, callbackDone, callbackError) {

		$.ajax({
			url			:	diveBaseUrl + "/rest/evaluation/submit",
			type		:	"POST",
			data		:	JSON.stringify(evaluationSubmission, null, '  '),
			contentType	:	"application/json; charset=utf-8",
			dataType	:	"json",
			success		: 	function(data) {callbackDone(data);},
			error		: 	callbackError,
			xhrFields	: 	{ withCredentials: true }
		});
	};
	
	this.getEvaluation = function(request, callbackDone, callbackError) {

		$.ajax({
			url			:	diveBaseUrl + "/rest/evaluation",
			type		:	"POST",
			data		:	JSON.stringify(request, null, '  '),
			contentType	:	"application/json; charset=utf-8",
			dataType	:	"json",
			success		: 	function(data) {callbackDone(data);},
			error		: 	callbackError,
			xhrFields	: 	{ withCredentials: true }
		});
	};
	
	
};
