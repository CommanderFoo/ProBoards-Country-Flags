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

class Country_Flags {

	static init(){
		this.PLUGIN_ID = "pd_country_flags";
		this.PLUGIN_KEY = "pd_country_flags";

		this.images = {};
		this.settings = {};

		//this.api.init();
		this.setup();

		$(this.ready.bind(this));
	}

	static ready(){
		if(pb.data("route").name == "user" || pb.data("route").name == "current_user"){
			if(pb.data("user").is_logged_in && pb.data("user").id == pb.data("page").member.id){
				new Country_Flags_Button();
			}

			new Country_Flags_Profile();
		}

		let location_check = (

			pb.data("route").name == "search_results" ||
			pb.data("route").name == "conversation" ||
			pb.data("route").name == "list_messages" ||
			pb.data("route").name == "thread" ||
			pb.data("route").name == "list_posts" ||
			pb.data("route").name == "permalink" ||
			pb.data("route").name == "all_recent_posts" ||
			pb.data("route").name == "recent_posts" ||
			pb.data("route").name == "posts_by_ip"	

		);

		if(location_check){
			new Country_Flags_Mini_Profile();
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			this.settings = plugin.settings;
			this.images = plugin.images;
		}
	}

}

class Country_Flags_Button {

	constructor(){
		this.selected = null;
		this.flag_dialog = null;
		this.create_button();
	}

	create_button(){
		let $button = $("<a class='button' id='country-flags-button' href='#' role='button'>Edit Country Flag</a>");
		let $conversation_button = $(".controls a.button[href^='/conversation/new/']");

		if($conversation_button.length){
			$button.insertBefore($conversation_button);
		}

		// Look for button as it may have manually been added to template

		$("#country-flags-button").on("click", this.show_flag_dialog.bind(this));
	}

	show_flag_dialog(){
		if(!this.flag_dialog){
			let flags = this.build_flag_list();

			this.flag_dialog = $("<div></div>").html(flags).dialog({

				title: "Select Country Flag",
				resizable: true,
				draggable: true,
				modal: true,
				width: 680,
				height: 500,
				autoOpen: false,
				dialogClass: "country-flags-dialog",
				buttons: [

					{

						text: "Select Country Flag",
						click: () => {
							if(parseInt(this.selected.id, 10) >= 0 && parseInt(this.selected.id, 10) < 250){
								pb.plugin.key(Country_Flags.PLUGIN_KEY).set({

									value: parseInt(this.selected.id, 10),
									object_id: pb.data("user").id

								});

								let $div = $(".country-flags-profile");

								if($div.length && $div.find("span").length == 1){
									$div.find("span").css("background-position-y", -(parseInt(this.selected.id, 10) * 64) + "px");
								}
							}

							this.flag_dialog.dialog("close");
						}

					},

					{

						text: "Close",
						click: () => this.flag_dialog.dialog("close")

					}

				]


			});
		}

		$(".country-flags-dialog").find("span.country-flags-item").on("click", this.select_item.bind(this));

		this.flag_dialog.dialog("open");

		return false;
	}

	build_flag_list(){
		let list = "";
		let data = pb.plugin.key(Country_Flags.PLUGIN_KEY).get(pb.data("user").id);
		let selected_id = -1;

		if(data && data.length){
			if(parseInt(data, 10) >= 0 && parseInt(data, 10) < 250){
				selected_id = parseInt(data, 10);
			}
		}

		for(let y = 0; y < 250; y ++){
			let id = y;
			let y_offset = y * 64;
			let klass = (id == selected_id)? " country-flags-item-selected" : "";

			list += "<span data-country-flag-id='" + id + "' class='country-flags-item" + klass + "' style='background-image: url(\"" + Country_Flags.images.flags + "\"); background-position: 0px -" + y_offset + "px;'> </span>";
		}

		return list;
	}

	select_item(evt){
		let $span = $(evt.currentTarget);

		if(this.selected){
			this.selected.span.removeClass("country-flags-item-selected");
		}

		$span.addClass("country-flags-item-selected");

		this.selected = {

			id: $span.attr("data-country-flag-id"),
			span: $span

		}
	}

}

class Country_Flags_Mini_Profile {

	constructor(){
		this.add_flag_to_mini_profile();

		pb.events.on("afterSearch", this.add_flag_to_mini_profile.bind(this));
	}

	add_flag_to_mini_profile(){
		let $mini_profiles = $(".item .mini-profile");

		if(!$mini_profiles.length){
			return;
		}

		$mini_profiles.each((index, item) => {
			let $mini_profile = $(item);
			let $elem = $mini_profile.find(".country-flags-mini-profile");
			let $user_link = $mini_profile.find("a.user-link[href*='user/']");
			let $info = $mini_profile.find(".info");

			if(!$elem.length && !$info.length){
				console.warn("Country Flag Mini Profile: No info element found.");
				return;
			}

			if($user_link.length){
				let user_id_match = $user_link.attr("href").match(/\/user\/(\d+)\/?/i);

				if(!user_id_match || !parseInt(user_id_match[1], 10)){
					console.warn("Country Flag Mini Profile: Could not match user link.");
					return;
				}

				let user_id = parseInt(user_id_match[1], 10);
				let using_info = false;
				let data = pb.plugin.key(Country_Flags.PLUGIN_KEY).get(user_id);
				let selected_id = -1;

				if(data && data.length){
					if(parseInt(data, 10) >= 0 && parseInt(data, 10) < 250){
						selected_id = parseInt(data, 10);
					}
				}

				if(selected_id == -1){
					return;
				}

				if(!$elem.length){
					using_info = true;
					$elem = $("<div class='country-flags-mini-profile'></div>");
				}

				let html = "";

				html += "<span style='background-image: url(\"" + Country_Flags.images.flags + "\"); background-position: 0px -" + (selected_id * 64) + "px;'> </span>";

				$elem.html(html);

				if(using_info){
					$info.append($elem);
				}

				$elem.show();
			} else {
				console.warn("Country Flags Mini Profile: Could not find user link.");
			}

		});
	}

};

class Country_Flags_Profile {

	constructor(){
		this.add_flag_to_profile();
	}

	add_flag_to_profile(){
		let user_id = pb.data("page").member.id;
		let data = pb.plugin.key(Country_Flags.PLUGIN_KEY).get(user_id);
		let selected_id = -1;

		if(data && data.length){
			if(parseInt(data, 10) >= 0 && parseInt(data, 10) < 250){
				selected_id = parseInt(data, 10);
			}
		}

		if(selected_id == -1){
			return;
		}

		let html = "";

		html += "<span style='background-image: url(\"" + Country_Flags.images.flags + "\"); background-position: 0px -" + (selected_id * 64) + "px;'> </span>";

		let using_custom = true;
		let $elem = $(".country-flags-profile");

		if(!$elem.length){
			$elem = $("<div class='country-flags-profile float-right'></div>");
			using_custom = false;
		}

		$elem.html(html);

		if(!using_custom){
			$elem.insertBefore($(".name_and_group"));
		}
	}

}

Country_Flags.init();