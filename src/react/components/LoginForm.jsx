import React from 'react'
import $ from 'jquery'
var _ = require('lodash').mixin(require('lodash-keyarrange'));

var LoginForm = React.createClass({
	getInitialState() {
		return ({});
	},

	sendRequst(request_url, data, func) {
		var requestType = arguments[3] ? arguments[3] : "POST";
		var needCache = arguments[4] ? arguments[4] : true;

		if (requestType == "POST") {
			//must be json object
			if ((typeof str == 'string') && data.constructor == String) {
				data = JSON.parse(data);
			}
			data = JSON.stringify(data);
		}

		$.ajax({
			type: requestType,
			url: request_url,
			data: data, //must be json string
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			cache: needCache,
			success: function(responseData) {
				func(responseData);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				if (errorThrown === 'Not Found') {
					func({}, new Error('Request path error, error path : ' + request_url));
				} else {
					func({}, new Error("Requset fail, please open firebug or develop tool, then check console & feedback, thanks."));
				}
			}

		});
	},

	getRedirect() {
		var r = window.location.search;
		if (r && r.length > 1) {
			r = r.substr(1);
		} else {
			r = null;
		}
		return r;
	},

	submitPassword() {
		var userInfo = {};
		userInfo.password = $('input[name=password]').val();
		userInfo.password = userInfo.password;

		if (this.getRedirect("redirect")) {
			userInfo.redirect = this.getRedirect("redirect");
		}
	
		this.sendRequst(
			'/user/login',
			userInfo,
			function(responseData) {
				if (responseData.status !== 0) {
					alert(responseData.message);
				} else if (responseData.content && responseData.content.redirect) {
					window.location.href = responseData.content.redirect;
				} else if (userInfo.redirect) {
					if (userInfo.redirect.indexOf("/") == 0) {
						window.location.href = userInfo.redirect;
					} else {
						window.location.href = "/?" + userInfo.redirect;
					}
				} else {
					window.location.href = "/";
				}
			}
		);
	},

	render() {
		return (
			<div className="container-fluid" id="page">
				<div className="form-panel" id="login">
					<img id="logo" width="100%;" height="auto" alt="Brand" src="./images/ringcentral_logo.png" />
					<div>
						<div className="form-group ">
							<input type="password" name="password" className="form-control" placeholder="Password" />
						</div>
						<div className="form-group">
							<button className="btn btn-lg btn-primary login-in" onClick={this.submitPassword}>
								LOG IN
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = LoginForm;