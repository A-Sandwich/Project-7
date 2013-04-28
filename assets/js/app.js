;(function($, window) {
	$(document).ready(function(){
		//var jQT;
		var counter = 0;
		var addedProjects = 0;
		var cat = new localStorageDB("catalog", localStorage);
		
		
		var $arrayOfProjects = new Array();
		var str = "<ul class = 'page'>"
		
		updateHome = function(){
			//console.log(counter);
			//console.log(addedProjects);
			if(counter != addedProjects || addedProjects == 0){
				
				if(!cat.tableExists('projects')) {	//If a table does not exist then:		
							cat.createTable("projects", ["title", "rate", "description"]);
							cat.commit();
							//alert('here');
							document.getElementById("listOfProjects").innerHTML = "<h1>No projects have been started.</h1>";
							temp = '<a href="#newProject"><button type="button">Start a New Project!</button></a>';
							$('#listOfProjects').append(temp);
				}else{
					counter = 0;
					addedProjects =0;
					str = "<ul class = 'page'>"
					document.getElementById("listOfProjects").innerHTML = "";//clear out old list frome home.
					cat.query("projects", function(row){
						var name = row.title;
						//console.log(name);
						HTML_Line = '<li><a href="#project'+counter+'">'+name+'</a></li>';
						str += HTML_Line;
						addedProjects++;
						counter++;
					});//end query
					
					if(counter==0){
						document.getElementById("listOfProjects").innerHTML = "<h1>No projects have been started.</h1>";
						temp = '<a href="#newProject"><button type="button">Start a New Project!</button></a>';
						$('#listOfProjects').append(temp);
					}else{
						str += '</ul>';
						$('#listOfProjects').append(str);
					}//end if else
				}//end if else
			}//end if
		
		}
		
		
		
		
		$('#settings').submit(function(e){
			var tf = true;
			var $thisProject     = $(this);
			var $projectName   = $thisProject.find('#name');
			var $projectRate = $thisProject.find('#rate');
			var $projectDescription = $thisProject.find('#description');
		
			if($projectRate.val() == ""){
				$projectRate.val(0);
			}
			if($projectName.val() == ""){
				alert('You must name your project!');
				tf = false;
			}
			console.log(cat.query("projects", {title: $projectName.val()}));
			//console.log($projectRate.val());
			
		
			e.preventDefault();
			if(tf == true){

				cat.insert("projects", {title: $projectName.val(), rate: $projectRate.val(), description: $projectDescription.val()});
				cat.commit();
				counter++;
				$('#name').val('');
				$('#rate').val('');
				$('#description').val('');
				updateHome();
				jQT.goTo('#home', 'slideup');
			}
		});
		
		var tf = true;
		
		$(function(){
		
			jQT = new $.jQTouch({
				statusBar: 'black-translucent',
				preloadImages: []
			});

		});
		//Delete later - for testing
		$('#drop').click(function(e) {
			cat.drop();
			alert('database has been purged. Please refresh');
		});
		/*
		$('#home').bind('pageAnimationEnd', function(event, info) {
			if (info.direction == 'in') {
				$("#map").show();
				
				google.maps.event.trigger(map.map, 'resize');
				
				map.map.setZoom(map.mapOptions.zoom);
				map.map.fitBounds(map.bounds);
						
			}
			return false;
		});

		var map = $('#map').MobileMap({
			mapOptions: {
				center: new google.maps.LatLng(39.76, -86.15)//Coordinates = Indianapolis
			},
			callback: {
				newMarker: function(marker, lat, lng, id) {
					google.maps.event.addListener(marker, 'click', function() {
						
						map.editIndex = id;
						
						var row     = map.db.query('markers', function(row) {
							console.log(row.ID+' == '+(id));
							if(row.ID == id) {
								return true;
							}
							return false;
						});
						
						row = row[0];
						var $name   = $('#editLoc').find('#locationName');
						var $street = $('#editLoc').find('#streetAddress');
						var $city   = $('#editLoc').find('#city');
						var $state  = $('#editLoc').find('#state');
						var $zip    = $('#editLoc').find('#zipCode');
										
						$name.val(row.name);
						$street.val(row.street);
						$city.val(row.city);
						$state.val(row.state);	
						$zip.val(row.zipcode);
						
						jQT.goTo('#updateLocation', 'slideup');		
						
					});
				}
			}
		});
		
		$('#editSettings').submit(function(e) {
			
			var $thisSetting      = $(this);
			var $icon   = $thisSetting.find('#iconUrl');
			var $sizeX = $thisSetting.find('#iconSizeWidth');
			var $sizeY = $thisSetting.find('#iconSizeHeight');
			var $type = $thisSetting.find('#mapType');
			var $color = $thisSetting.find('#color')
			
			var settings = [
				$icon.val(),
				$sizeX.val(),
				$sizeY.val(),
				$type.val(),
				$color.val()
			];
			
			
			var object = {
				icon: $icon.val(),
				iconSizeX: $sizeX.val(),
				iconSizeY: $sizeY.val(),
				mapType: $type.val(),
				color: $color.val()
			}
			//Send information to mobileMap to be used
			map.editSettings($icon.val(), $sizeX.val(), $sizeY.val(), $type.val(), $color.val());
			
			e.preventDefault();
		});
		
		$('#search').submit(function(e) {
			var $thisLocation      = $(this);
			var $street   = $thisLocation.find('#search');
			var $miles = $thisLocation.find('#distance');
			var address = [
				$street.val()
			];
			
			
			var object = {
				street: $street.val()
			}
			
			//Send information to mobileMap to be used
			map.search($street.val(), $miles.val()	 ,function() {
				$street.val('');
			});
			
			$('#clear').removeClass('hidden');
			
			e.preventDefault();
		});
		
		//Delete later - for testing
		$('#drop').click(function(e) {
			map.drop();
		});
		
		$('#clear').click(function(e) {
			map.removeCircle();
			
			$('#clear').addClass('hidden');
		});
		
		$('#delete-location').submit(function(e) {
			
			tf = false;
			
			var id = map.editIndex;
			
			map.deleteMarker(id);
			
			window.location = "#home";
			
			return false;
		});
		
		$('#newLoc').submit(function(e) {
			var $thisLocation      = $(this);
			var $name   = $thisLocation.find('#locationName');
			var $street = $thisLocation.find('#streetAddress');
			var $city   = $thisLocation.find('#city');
			var $state  = $thisLocation.find('#state');
			var $zip    = $thisLocation.find('#zipCode');
			
			var address = [
				$street.val(),
				$city.val(),
				$state.val(),
				$zip.val()
			];
			
			var object = {
				name: $name.val(),
				address: address.join(' '),
				street: $street.val(),
				city: $city.val(),
				state: $state.val(),
				zipcode: $zip.val()
			}
			
			//Send information to mobileMap to be used
			map.addMarker(object, function() {
				map.home();
				$name.val('');
				$street.val('');
				$city.val('');
				$state.val('');
				$zip.val('');
			});
			
			e.preventDefault();
			
			
			return false;
		});
		
		$('#editLoc').submit(function(e) {
			
			var $thisLocation      = $(this);
			var $name   = $thisLocation.find('#locationName');
			var $street = $thisLocation.find('#streetAddress');
			var $city   = $thisLocation.find('#city');
			var $state  = $thisLocation.find('#state');
			var $zip    = $thisLocation.find('#zipCode');
			
			var address = [
				$street.val(),
				$city.val(),
				$state.val(),
				$zip.val()
			];
			
			var object = {
				name: $name.val(),
				address: address.join(' '),
				street: $street.val(),
				city: $city.val(),
				state: $state.val(),
				zipcode: $zip.val()
			}
			
			map.editMarker(object, function() {
				map.home();
				$name.val('');
				$street.val('');
				$city.val('');
				$state.val('');
				$zip.val('');
			});
			
			e.preventDefault();
		
			window.location = "#home";
			
			return false;
		});*/
		updateHome();
	});
}(jQuery, this));