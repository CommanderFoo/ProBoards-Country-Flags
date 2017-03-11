/**
* @license
* The MIT License (MIT)
*
* Copyright (c) 2016 pixeldepth.net - http://support.proboards.com/user/2671
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Country_Flags = function () {
	function Country_Flags() {
		_classCallCheck(this, Country_Flags);
	}

	_createClass(Country_Flags, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "pd_country_flags";
			this.PLUGIN_KEY = "pd_country_flags";

			this.images = {};
			this.settings = {};

			//this.api.init();
			this.setup();

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {
			if (pb.data("route").name == "user" || pb.data("route").name == "current_user") {
				if (pb.data("user").is_logged_in && pb.data("user").id == pb.data("page").member.id) {
					new Country_Flags_Button();
				}

				new Country_Flags_Profile();
			}

			var location_check = pb.data("route").name == "search_results" || pb.data("route").name == "conversation" || pb.data("route").name == "list_messages" || pb.data("route").name == "thread" || pb.data("route").name == "list_posts" || pb.data("route").name == "permalink" || pb.data("route").name == "all_recent_posts" || pb.data("route").name == "recent_posts" || pb.data("route").name == "posts_by_ip";

			if (location_check) {
				new Country_Flags_Mini_Profile();
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.PLUGIN_ID);

			if (plugin && plugin.settings) {
				this.settings = plugin.settings;
				this.images = plugin.images;
			}
		}
	}]);

	return Country_Flags;
}();

var Country_Flags_Button = function () {
	function Country_Flags_Button() {
		_classCallCheck(this, Country_Flags_Button);

		this.selected = null;
		this.flag_dialog = null;
		this.create_button();
	}

	_createClass(Country_Flags_Button, [{
		key: "create_button",
		value: function create_button() {
			var $button = $("<a class='button' id='country-flags-button' href='#' role='button'>Edit Country Flag</a>");
			var $conversation_button = $(".controls a.button[href^='/conversation/new/']");

			if ($conversation_button.length) {
				$button.insertBefore($conversation_button);
			}

			// Look for button as it may have manually been added to template

			$("#country-flags-button").on("click", this.show_flag_dialog.bind(this));
		}
	}, {
		key: "show_flag_dialog",
		value: function show_flag_dialog() {
			var _this = this;

			if (!this.flag_dialog) {
				var flags = this.build_flag_list();

				this.flag_dialog = $("<div></div>").html(flags).dialog({

					title: "Select Country Flag",
					resizable: true,
					draggable: true,
					modal: true,
					width: 680,
					height: 500,
					autoOpen: false,
					dialogClass: "country-flags-dialog",
					buttons: [{

						text: "Select Country Flag",
						click: function click() {
							if (parseInt(_this.selected.id, 10) >= 0 && parseInt(_this.selected.id, 10) < 250) {
								pb.plugin.key(Country_Flags.PLUGIN_KEY).set({

									value: parseInt(_this.selected.id, 10),
									object_id: pb.data("user").id

								});
							}

							_this.flag_dialog.dialog("close");
						}

					}, {

						text: "Close",
						click: function click() {
							return _this.flag_dialog.dialog("close");
						}

					}]

				});
			}

			$(".country-flags-dialog").find("span.country-flags-item").on("click", this.select_item.bind(this));

			this.flag_dialog.dialog("open");

			return false;
		}
	}, {
		key: "build_flag_list",
		value: function build_flag_list() {
			var list = "";
			var data = pb.plugin.key(Country_Flags.PLUGIN_KEY).get(pb.data("user").id);
			var selected_id = -1;

			if (data && data.length) {
				if (parseInt(data, 10) >= 0 && parseInt(data, 10) < 250) {
					selected_id = parseInt(data, 10);
				}
			}

			for (var y = 0; y < 250; y++) {
				var id = y;
				var y_offset = y * 64;
				var klass = id == selected_id ? " country-flags-item-selected" : "";

				list += "<span data-country-flag-id='" + id + "' class='country-flags-item" + klass + "' style='background-image: url(\"" + Country_Flags.images.flags + "\"); background-position: 0px -" + y_offset + "px;'> </span>";
			}

			return list;
		}
	}, {
		key: "select_item",
		value: function select_item(evt) {
			var $span = $(evt.currentTarget);

			if (this.selected) {
				this.selected.span.removeClass("country-flags-item-selected");
			}

			$span.addClass("country-flags-item-selected");

			this.selected = {

				id: $span.attr("data-country-flag-id"),
				span: $span

			};
		}
	}]);

	return Country_Flags_Button;
}();

var Country_Flags_Mini_Profile = function () {
	function Country_Flags_Mini_Profile() {
		_classCallCheck(this, Country_Flags_Mini_Profile);

		this.add_flag_to_mini_profile();

		pb.events.on("afterSearch", this.add_flag_to_mini_profile.bind(this));
	}

	_createClass(Country_Flags_Mini_Profile, [{
		key: "add_flag_to_mini_profile",
		value: function add_flag_to_mini_profile() {
			var $mini_profiles = $(".item .mini-profile");

			if (!$mini_profiles.length) {
				return;
			}

			$mini_profiles.each(function (index, item) {
				var $mini_profile = $(item);
				var $elem = $mini_profile.find(".country-flags-mini-profile");
				var $user_link = $mini_profile.find("a.user-link[href*='user/']");
				var $info = $mini_profile.find(".info");

				if (!$elem.length && !$info.length) {
					console.warn("Country Flag Mini Profile: No info element found.");
					return;
				}

				if ($user_link.length) {
					var user_id_match = $user_link.attr("href").match(/\/user\/(\d+)\/?/i);

					if (!user_id_match || !parseInt(user_id_match[1], 10)) {
						console.warn("Country Flag Mini Profile: Could not match user link.");
						return;
					}

					var user_id = parseInt(user_id_match[1], 10);
					var using_info = false;
					var data = pb.plugin.key(Country_Flags.PLUGIN_KEY).get(user_id);
					var selected_id = -1;

					if (data && data.length) {
						if (parseInt(data, 10) >= 0 && parseInt(data, 10) < 250) {
							selected_id = parseInt(data, 10);
						}
					}

					if (selected_id == -1) {
						return;
					}

					if (!$elem.length) {
						using_info = true;
						$elem = $("<div class='country-flags-mini-profile'></div>");
					}

					var html = "";

					html += "<span style='background-image: url(\"" + Country_Flags.images.flags + "\"); background-position: 0px -" + selected_id * 64 + "px;'> </span>";

					$elem.html(html);

					if (using_info) {
						$info.append($elem);
					}

					$elem.show();
				} else {
					console.warn("Country Flags Mini Profile: Could not find user link.");
				}
			});
		}
	}]);

	return Country_Flags_Mini_Profile;
}();

;

var Country_Flags_Profile = function () {
	function Country_Flags_Profile() {
		_classCallCheck(this, Country_Flags_Profile);

		this.add_flag_to_profile();
	}

	_createClass(Country_Flags_Profile, [{
		key: "add_flag_to_profile",
		value: function add_flag_to_profile() {
			var user_id = pb.data("page").member.id;
			var data = pb.plugin.key(Country_Flags.PLUGIN_KEY).get(user_id);
			var selected_id = -1;

			if (data && data.length) {
				if (parseInt(data, 10) >= 0 && parseInt(data, 10) < 250) {
					selected_id = parseInt(data, 10);
				}
			}

			if (selected_id == -1) {
				return;
			}

			var html = "";

			html += "<span style='background-image: url(\"" + Country_Flags.images.flags + "\"); background-position: 0px -" + selected_id * 64 + "px;'> </span>";

			var using_custom = true;
			var $elem = $(".country-flags-profile");

			if (!$elem.length) {
				$elem = $("<div class='country-flags-profile float-right'></div>");
				using_custom = false;
			}

			$elem.html(html);

			if (!using_custom) {
				$elem.insertBefore($(".name_and_group"));
			}
		}
	}]);

	return Country_Flags_Profile;
}();


Country_Flags.init();