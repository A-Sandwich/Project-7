;(function($, window) {
	$(document).ready(function(){
		var currentProject = null;
		var clock = $('.clock').FlipClock(3600);
		var timeCardDeleteNum;
	
		//var jQT;
		var counter = 0;
		var addedProjects = 0;
		var cat = new localStorageDB("catalog", localStorage);
		
		
		var $arrayOfProjects = new Array();
		var $arrayOfDescriptions = new Array();
		var $arrayOfElapsedTimes = new Array();
		var str = "<ul id = 'projectsList' class = 'page'>";
		
		setTimeCardDeleteNum = function(num){
			timeCardDeleteNum = num;
		}
		
		//var str = "";
		updateHome = function(){
			if(counter != addedProjects || addedProjects == 0){
				
				if(!cat.tableExists('projects')) {	//If a table does not exist then:		
							cat.createTable("projects", ["title", "rate", "description","timeStart", "elapsedTime", "timeCardDescription"]);
							cat.commit();
							document.getElementById("listOfProjects").innerHTML = "<h1>No projects have been started.</h1>";
							temp = '<a href="#newProject"><button type="button">Start a New Project!</button></a>';
							$('#listOfProjects').append(temp);
				}else{
					counter = 0;
					addedProjects =0;
					str = "<ul id = 'projectsList' class = 'page'>";
					//var str = "";
					document.getElementById("listOfProjects").innerHTML = "";//clear out old list frome home.
					cat.query("projects", function(row){
						var name = row.title;
						HTML_Line = '<li class="listElement"><a class="listElement" onclick="changeProjectPage('+counter+')" href="#project">'+name+'</a></li>';
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
		
		getDays = function(timeInSeconds){
			
			var days = Math.floor(timeInSeconds/86400);
			var remainder = ((timeInSeconds/86400) - days);
			var formattedDate = "";
			
			if((days > 1 || days < 1) && days != 0){
				formattedDate = days+" days "+getHours(remainder);
			}else if(days == 1){
				formattedDate = days+" day "+getHours(remainder);
			}else if(days <= 0){
				formattedDate = getHours(remainder);
			}
			
			
			return formattedDate;
		}
		
		getHours = function(timeInDays){
			var hours = Math.floor(timeInDays*24);
			var remainder = ((timeInDays*24)-hours);
			var formattedDate = "";
			
			if((hours > 1 || hours < 1) && hours != 0){
					formattedDate = hours+" hours "+getMinutes(remainder);
			}else if(hours == 1){
				formattedDate = hours+" hour "+getMinutes(remainder);
			}else if(hours <= 0){
				formattedDate = getMinutes(remainder);
			}
			return formattedDate;
		}
		
		getMinutes = function(timeInHours){
			var minutes = Math.floor(timeInHours*60);
			var remainder = ((timeInHours*60)-minutes);
			var formattedDate = "";
			
			if((minutes > 1 || minutes < 1) && minutes != 0){
				formattedDate = minutes+" minutes "+getSeconds(remainder);
			}else if(minutes == 1){
				formattedDate = minute+" minute "+getSeconds(remainder);
			}else if(minutes <= 0){
				formattedDate = getSeconds(remainder);
			}
			
			return formattedDate;
		}
		
		getSeconds = function(timeInHours){	
			var seconds = Math.floor(timeInHours*60);
			var formattedDate = "";
			if(seconds != 1){
				formattedDate = seconds+" seconds";
			}else{
				formattedDate = seconds+" second";
			}
			
			return formattedDate;
		}
		
		changeProjectPage = function(rowNumber){
			tempCounter = 0;
			currentProject = rowNumber;
			var HTML_Str;
			var HTML_Code;
			var tempDescription = [];
			var tempElapsedTime = [];
			var i;
			var tempRate;
			var date;
			i=0;
			tempCounter = 0;
			HTML_Str = "";
			//alert(rowNumber);
			
			
			cat.query("projects", function(row){
				if(tempCounter==rowNumber){
					tempName = row.title;
					tempDescription = row.timeCardDescription;
					tempElapsedTime = row.elapsedTime;
					tempRate = row.rate;
					//alert('temp'+row.timeCardDescription[0]);
					//alert(tempDescription.length);
					tempRate = tempRate/3600;//rate i $ per second.
					
					for(i=0;i<=(tempDescription.length);i++){
						
						if(tempDescription[i] != undefined && tempElapsedTime[i] != 0){
							date = getDays(tempElapsedTime[i]);
							HTML_Code = '<div class="blackPage"><h3>Time Worked: '+date+'. Earned: $'+(Math.round((tempRate*tempElapsedTime[i]*100))/100)+'</h3><i class="icon-edit t-card edit"></i><a href="#deleteTimecard"><i class="icon-trash t-card trash" onclick="setTimeCardDeleteNum('+i+')"></i></a><br><br><h5>Description: </h5><p>'+tempDescription[i]+'</p></div>';
							HTML_Str += HTML_Code;
						}
						
						//alert(tempDescription[i]);
					}
				}
				tempCounter++;
			});//end query
			document.getElementById("timecards").innerHTML ="";
			//alert('here');
			//alert(HTML_Str);
			
			$('#timecards').append(HTML_Str);
			document.getElementById("projectTitle").innerHTML = tempName;
			
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
			
			if(cat.query("projects", {title: $projectName.val()}) != ""){
				alert('There is already a project with this name. Please delete that project or rename this one!');
				tf = false;
			}
			
			
		
			e.preventDefault();
			if(tf == true){
				
				cat.insert("projects", {title: $projectName.val(), rate: $projectRate.val(), description: $projectDescription.val(), timeStart: 0, elapsedTime: $arrayOfElapsedTimes, timeCardDescription: $arrayOfDescriptions});
				cat.commit();
				counter++;
				$('#name').val('');
				$('#rate').val('');
				$('#description').val('');
				updateHome();
				jQT.goTo('#home', 'slideup');
			}
		});
		
		$('#timeStartStop').click(function(e){
			buttonText = document.getElementById("timeStartStop").innerHTML;
			
			if(buttonText == "Start"){
				document.getElementById("timeStartStop").innerHTML = "Stop";
				var seconds = new Date().getTime() / 1000;
				var elapsedTime;
				var timeStart;
				var arrayPosition;
				var $tempArray = [];
				
				cat.update("projects",
					function(row) {
						if(row.ID == (currentProject+1)){
							return true;
						}else{
							return false;
						}
					},
					function(row){
						row.timeStart = seconds;
						return row;
					}
				);
				
			}else{
				$(".page.timecard").slideToggle("slow");
				
			
				document.getElementById("timeStartStop").innerHTML = "Start";
			}
			
		});
		
		$('#saveTimecard').submit(function(e){
			var $thisTimecard     		= $(this);
			var $timecardDescription	= $thisTimecard.find('#timecardDescription');
			var elapsedTime;
			var $tempElapsedArray		= new Array();
			var $tempDescriptionArray	= new Array();
			var tempDescription;
			
			
			cat.query("projects", function(row){
					if(row.ID == (currentProject+1)){
						timeStart = row.timeStart;
						$tempElapsedArray = [];//ensures array is empty
						$tempDescriptionArray = [];
						$tempElapsedArray = row.elapsedTime;
						$tempDescriptionArray = row.timeCardDescription;
					}//end if
			});//end query Sets function variables = to row being edited;
			var seconds = new Date().getTime() / 1000;
			
			elapsedTime = seconds-timeStart;
			$tempElapsedArray.push(elapsedTime);
			$tempDescriptionArray.push($timecardDescription.val());
			
			cat.update("projects",
				function(row) {
					if(row.ID == (currentProject+1)){
						return true;
					}else{
						return false;
					}//end if else
				},//end function(finds row to edit);
				function(row){
					//row.elapsedTime += elapsedTime;
					row.timeStart = 0;
					row.elapsedTime = $tempElapsedArray;
					row.timeCardDescription = $tempDescriptionArray;
					return row;
				}//end function (Makes changes);		
			);//end update
			cat.commit();
			clearTimecard();
			changeProjectPage(currentProject+1);//not sure about this +1
		});
		
		$('.x').click(function(){//Person discards timecard without saving;
			clearTimecard();
		});
		
		$('.deleteTimecard').click(function(){
			//alert(timeCardDeleteNum);
			cat.update("projects",
				function(row) {
					if(row.ID == (timeCardDeleteNum+1)){
						return true;
					}else{
						return false;
					}//end if else
				},//end function(finds row to edit);
				function(row){
					//row.elapsedTime += elapsedTime;
					//row.timeStart = 0;
					row.elapsedTime[timeCardDeleteNum] = 0
					row.timeCardDescription[timeCardDeleteNum] = "";
					return row;
				}//end function (Makes changes);		
			);//end update
			cat.commit();
			changeProjectPage(timeCardDeleteNum);
		});
		
		clearTimecard = function(){
			$(".page.timecard").slideToggle("slow");//hide menu
			$('#timecardDescription').val('');//clears timecard
		};
		
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
		
		updateHome();
	});
}(jQuery, this));