(function() {
	var React = require('react')
	var ReactDOM = require('react-dom');
	
	var Main = require('./pages/Main.jsx');

	//Needed for React Developer Tools
	window.React = React;

	// Render the main app react component into the document body.
	ReactDOM.render(<Main/>, document.getElementById('App'));

})();
