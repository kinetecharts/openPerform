(function() {
	var React = require('react')
	var ReactDOM = require('react-dom');
	
	var LoginForm = require('./components/LoginForm.jsx');

	//Needed for React Developer Tools
	window.React = React;

	// Render the main app react component into the document body.
	ReactDOM.render(<LoginForm/>, document.getElementById('main-continer'));

})();
