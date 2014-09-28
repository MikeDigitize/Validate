Validate
========

Dependency free, tiny, non-intrusive form validation plugin for IE8+

<code>Validate</code> is a tiny, unobtrusive plugin to validate form text based inputs (text, email, password, url and textareas) and select menus for one or multiple forms on a web page. Radio buttons and checkboxes by nature don't need validation so have been excluded.

Just include it on the page above the closing body tag and start things off by calling the init method. If no object is passed in <code>Validate</code> will validate all text inputs / select menus as expected and allow the form to submit when each required input has been suitably completed.

```html
<script src="path-to-validate/validate.js"></script>
<script>
```
```javascript
	AOValidate().init({
		testmode : true,	
		formSelector : "#form1", 
		onValid : function(e) {	
			console.log("Input is valid!!", this);
		},
		onInValid : function(e) {	
			console.log("Input is invalid!!", this);
		},
		onSubmit : function(e) {
			console.log("Submit!!", this);
			// ajax or just this.submit()
		}
	});
```
```html
</script>
```

The settings object takes five properties / methods - 

<h3>Form(s) Selector</h3>
An ID or class for the form element(s).

```javascript
// if not specified all forms on the page will be targetted
formSelector : string 
```
<h3>On Valid Method</h3>
User specified function that fires every time an input is successfully validated. 

```javascript
// `this` is mapped to the valid input. The event object is passed in too.
onValid : method 
```
<h3>On Invalid Method</h3>
User specified function that fires every time an input is invalidated. 

```javascript
// `this` is mapped to the invalid input. The event object is passed in too.
onInValid : method 
```

<h3>On Submit Method</h3>
User specified function that fires after all required form inputs are validated.

```javascript
// `this` is mapped to the validated form. The event object is passed in too.
// by default form.submit() is fired if not specified
onSubmit : method 
```
<h3>Test Mode</h3>
Expose all internal methods and properties for test purposes. 

```javascript
// set to false by default
testmode : boolean 
```

<code>Validate</code> will only show actual validation errors upon submit. Before that point the <code>Validated</code> class will be added to any validated input. Target this with CSS to display to the user a subtle indicator of validation. If you want anything further to happen you can specifiy it in the <code>onValid</code> callback (don't forget <code>this</code> is mapped to the input in the callback).

<h3>Data Attributes</h3>
To hook up <code>Validate</code> to your form inputs use data attributes.

<h3>Type</h3>
<code>Validate</code> will validate against a number of predefined regular expressions for different input types.
```html
data-validate-type="name"
data-validate-type="password"
data-validate-type="email"
data-validate-type="textarea"
data-validate-type="url"
data-validate-type="select"
```

Name is uppercase, lowercase letters, hyphen and whitespace.
Email covers a broad range of email types.
Password allows uppercase, lowercase and special characters.
Textarea allows uppercase, lowercase and special characters.
URL accepts URLs beginning with www, ftp, http etc.
Select is for select menus and thus has no regex to test against.

<h3>Required</h3>
Specify an input is required to be completed before the form can be submitted.
```html
data-validate-required="true"
```

<h3>Length</h3>
Specify the min and max length of an input. If not specified min length of 1 and max length of 50 is set.
```html
data-validate-length="3,20" // min 3, max 20
```

<h3>Removing HTML Tags</h3>
By default any script tags will be removed from input. Likewise, unless specified, all HTML tags will be removed. Override this by specifiying on the input to allow HTML.
```html
data-validate-remove-html="false"
```

<h3>Examples</h3>

Text input required and between 3 and 30 characters in length.
```html
<input type="text" id="name" placeholder="Enter name" 
	data-validate-length="3,30" 
	data-validate-type="name" 
	data-validate-required="true">
```

Textarea that allows HTML tags.
```html
<textarea rows="3" id="textarea"
	data-validate-required="true" 
	data-validate-length="5,400" 
	data-validate-type="textarea" 
	data-validate-remove-html="false"></textarea>
```

Select menu - note that acceptable select options are specified using the <code>data-validate-select="true"</code> property.
```html
<select id="select1" data-validate-type="select">
	<option>Choose an option</option>
	<option data-validate-select="true">0</option>
	<option data-validate-select="true">1</option>
</select>
```

<h3>Validation Messages</h3>

Upon submission of the form(s), if one or more inputs are invalid a message for each invalid element is displayed. <code>Validate</code> connects input to it's validation error message through a data attribute. Set this data attribute to match the ID of the form input. As soon as the input becomes valid the message is hidden.
```html
<input type="url" id="url" placeholder="URL" 
	data-validate-length="5,40" 
	data-validate-type="url" 
	data-validate-required="true">
<span class="help-block" data-validate="url">Please enter a valid website address</span>
```

<h3>Licence</h3>

MIT License - use this in any way, shape or form you see fit. Extend it easily by adding extra regex for different input types such as numbers etc. Take a look at the demo file to see it in action.

