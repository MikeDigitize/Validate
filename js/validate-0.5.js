var Validate = (function() {

	"use strict";

	// regex for each type of input
	var regex = {
		email : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		name : /^[a-zA-Z-\s]+$/,
		password : /^[ A-Za-z0-9_@.<>\/#=&+*^;:\$£"!\?()%{}-]+$/,
		textarea : /^[ A-Za-z0-9_@.<>\/#=&+*^;:\$£"\?!()%{}-]+$/,
		url : /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
	};

	// regex for replacing tags and special characters
	var tagsRegex = /(<([^>]+)>)/gi;
	var scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script(\s+)?>/gi;

	// globals
	var isFormValid;
	var state;
	var onValidCallback;
	var onInValidCallback;
	var onValidSubmit;
	var testmode;

	function init(settings) {

		settings = settings || {};

		onValidCallback = settings.onValid || function(){};
		onInValidCallback = settings.onInValid || function(){};
		onValidSubmit = settings.onSubmit || function(){ this.submit(); };
		testmode = settings.testmode || false;

		isFormValid = false;
		state = {};		

		var formSelector = settings.formSelector || "form";		
		var forms = document.querySelectorAll(formSelector);

		// for each form specified give it a class, store it and find its inputs
		for(var i = 0; i < forms.length; i++) {

			addEventHandler.call(forms[i], forms[i], "submit", onFormSubmit);

			var className = "Validate" + i;
			forms[i].className = forms[i].className === "" ? className : forms[i].className + " " + className;

			state[className] = {
				form : forms[i]
			};

			findInputs.call(forms[i], className);

		}

	}

	function findInputs(cls) {

		state[cls].inputs = {};

		var selectors = ["input", "select", "textarea"];
		
		for(var i = 0, len = selectors.length, inputs = []; i < len; i++) {
			Array.prototype.push.apply(inputs, this.querySelectorAll(selectors[i]));
		}	
		
		for(i = 0, len = inputs.length; i < len; i++) {

			var type = inputs[i].type; 

			// if the inputs are supported store them
			if(type !== "hidden" && type !== "button" && type !== "submit" && type !== "radio" && type !== "checkbox") {
				storeInputs.call(inputs[i], cls, i);				
			}

		}

	}

	function storeInputs(cls, i) {

		// pull all data attributes, store them and listen for blur, keyup / change events
		var length = this.getAttribute("data-validate-length");
		length = length ? length.split(",") : [0,50];

		var value = this.type === "select-one" ? this[this.selectedIndex].value : this.value;
		var className = cls + "-" + i;

		this.className = this.className === "" ? className : this.className + " " + className;

		state[cls].inputs[className] = {
			input : this,
			minlength : length[0],
			maxlength : length[1],
			type : this.getAttribute("data-validate-type"),
			required : this.getAttribute("data-validate-required") || false,
			valid : false,
			value : this.value
		}

		var type = this.type === "select-one" ? "change" : "keyup";

		addEventHandler.call(this, this, type, onChange);
		addEventHandler.call(this, this, "blur", onChange);

	}


	function addEventHandler(el, evt, fn) {

		var bind = function() {
			return fn.apply(el, arguments);	
		}			

		el.addEventListener ? el.addEventListener(evt, bind, false) : el.attachEvent("on" + evt, bind);

	}

	function onFormSubmit(evt) {

		if(!isFormValid) {
			evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
		}

		var cls = this.className.match(/Validate\d+/);
		var inputs = state[cls].inputs;	
		isFormValid = true;

		// check each input stored to see if it's valid
		for(var i in inputs) {

			if(inputs[i].valid !== true) {

				if(inputs[i].required) {
					isFormValid = false;	
				}
				
				showHideMessage.call(inputs[i].input, "block");

			}
			else {
				showHideMessage.call(inputs[i].input, "none");
			}

		}
		
		// if all is valid remove all validation error messages, remove script tags and html if necessary, then submit
		if(isFormValid) {

			for(i in inputs) {

				showHideMessage.call(inputs[i].input, "none");
				inputs[i].input.value = inputs[i].value = inputs[i].input.value.replace(scriptRegex, "");
				
				if(inputs[i].input.getAttribute("data-validate-remove-html") !== "false") {
					inputs[i].input.value = inputs[i].value = inputs[i].input.value.replace(tagsRegex, "");
				}					

			}

			onValidSubmit.call(this, evt);

		} 

		isFormValid = false;
	
	}

	function showHideMessage(display) {
		
		var id = this.getAttribute("id");
		document.querySelector("span[data-validate='" + id + "']").style.display = display;

	}

	function onChange(evt) {
	
		var value = this.type === "select" ? this[this.selectedIndex].value : this.value;
		returnInput.call(this).input.value = value;
		validate.call(this, evt);

	}

	function validate(evt) {
		
		var input = returnInput.call(this).input;
		var type = input.type;
		var minlength = input.minlength;	
		var maxlength = input.maxlength;
		var length = this.value.length;

		input.valid = type === "select" ?
			this[this.selectedIndex].getAttribute("data-validate-select") === "true" ? true : false :
			regex[type].test(input.value) && length >= minlength && length <= maxlength ? true : false;
			
		input.valid ? isInputValid.call(this, evt, true) : isInputValid.call(this, evt, false);
		
	}

	function isInputValid(evt, valid) {

		if(valid){

			if(!/validated/.test(this.className)) {
				this.className += " validated";
			}
			
			showHideMessage.call(this, "none");
			onValidCallback.call(this, evt);

		}
		else {			

			this.className = this.className.replace(" validated", "");
			onInValidCallback.call(this, evt);

		}
	}

	function returnInput() {

		var classReg = /Validate\d+\-\d+/;
		var indexReg = /\d+\-\d+/
		var inputKey = this.className.match(classReg);
		var indexes = inputKey[0].match(indexReg);
		var formKey = "Validate" + indexes[0].split("-")[0];

		return {
			input : state[formKey].inputs[inputKey[0]]
		}

	}

	return function() {

		if(testmode) {
			
			return {
				init : init,
				regex : regex,
				tagsRegex : tagsRegex,
				scriptRegex : scriptRegex,
				onValidCallback : onValidCallback,
				onValidSubmit : onValidSubmit,
				state : state,
				returnInput : returnInput,
				showHideMessage : showHideMessage,
				isInputValid : isInputValid,
				isFormValid : isFormValid,
				validate : validate,
				findInputs : findInputs,
				storeInputs : storeInputs,
				addEventHandler : addEventHandler,
				onChange : onChange,
				onFormSubmit : onFormSubmit
			};

		}

		else {

			return {
				init : init	
			};
			
		}		
					
	}

})();