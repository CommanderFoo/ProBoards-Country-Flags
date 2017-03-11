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

								})
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