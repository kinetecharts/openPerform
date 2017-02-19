import _ from 'lodash'

class ScriptLoader {
	constructor(scene) {
	}
	appendArray(scripts) {
		var scope = this;
		_.forEach(scripts, function(script) {
			scope.appendOne(script);
		});
	}
	appendOne(script) {
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = script;
		$('body').append(s);
	}
}

export default ScriptLoader;