class Country_Flags_Mini_Profile {

	constructor(){
		this.using_custom = false;
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

				if($elem.length){
					this.using_custom = true;
				} else {
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