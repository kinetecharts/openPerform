module.exports = {
	"root": true,
	"extends": "fbjs",
	"env": {
		"es6": true,
	},
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true,
			"modules":true
		},
		"impliedStrict": true
	},
	"rules":{
		"indent": ["warn", "tab"],
		"comma-dangle": ["warn", "never"],
		"semi": "off",
		"no-bitwise": "off"
	},
	"globals":{
		"_":true,
		"$":true,
		"dataStore":true
	},
	"plugins": [
        "html",
        "react",
        "jsx"
    ]
}