class Country_Flags {

	static init(){
		this.PLUGIN_ID = "pd_country_flags";
		this.PLUGIN_KEY = "pd_country_flags";

		this.images = {};
		this.settings = {};

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