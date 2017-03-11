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