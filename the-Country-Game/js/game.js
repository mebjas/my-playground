var countries = ["Afghanistan","Akrotiri","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Ashmore and Cartier Islands","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Bassas da India","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burma","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Clipperton Island","Cocos Islands","Colombia","Comoros","Congo, Democratic Republic of the","Congo, Republic of the","Cook Islands","Coral Sea Islands","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dhekelia","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Europa Island","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern and Antarctic Lands","Gabon","Gambia, The","Gaza Strip","Georgia","Germany","Ghana","Gibraltar","Glorioso Islands","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands","Vatican City","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Jan Mayen","Japan","Jersey","Jordan","Juan de Nova Island","Kazakhstan","Kenya","Kiribati","North Korea","South Korea","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldova","Monaco","Mongolia","Montserrat","Morocco","Mozambique","Namibia","Nauru","Navassa Island","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paracel Islands","Paraguay","Peru","Philippines","Pitcairn Islands","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia and Montenegro","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the South Sandwich Islands","Spain","Spratly Islands","Sri Lanka","Sudan","Suriname","Svalbard","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tromelin Island","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Virgin Islands","Wake Island","Wallis and Futuna","West Bank","Western Sahara","Yemen","Zambia","Zimbabwe"];

function getRandom() {
	return parseInt((Math.random()*1000)%countries.length);
}

Array.prototype.has = function(needle) {
  	for(var i = 0; i < this.length; i++) {
    	if(this[i] == needle)
        	return true;
  	}
  	return false;
}

Array.prototype.matching = function(needle) {
	var result = new Array();
	for(var i = 0; i < this.length; i++) {
    	if (this[i].toLowerCase().search(needle.toLowerCase()) == 0) {
    		// match if this has already been selected
    		var flag = false;
    		$(".selected_countries div").each(function() {
    			if ($(this).attr('data') != undefined && parseInt($(this).attr('data')) == i) {
    				flag = true;
    			}
    		});
    		if (!flag) result[result.length] = i;
    	}
  	}
  	return result;
}


var game = function(arr) {
	this.selected = arr;
	this.timer = 0;
	this.level = 1;
	this.score = 0;

	this.currentLeveltime;

	this.t;
}

game.prototype.reset = function() {
	this.timer = 0;
	this.level = 1;
	this.score = 0;
	$(".board .timer").html("0");
	$(".score").html(" 0 XP ");
}

game.prototype.resetTimer = function(){
	clearTimeout(this.t);
	var timer = this.timer;
	this.currentLeveltime = this.timer;
	this.timer = 0;
	return timer;
}

game.prototype.startTimer = function() {
	this.timer++;
	$(".board .timer").html(this.timer);
	if (this.timer == 100) {
		this.closeGame();
		return;
	}
	var $this = this;
	this.t = setTimeout(function() {
		$this.startTimer();
	}, 1000);
}

game.prototype.upgradeLevel = function() {
	this.level++;
	$(".board .timer").html(" Level - " +this.level +" ");
}

game.prototype.closeGame = function() {

}

game.prototype.sc = function() {
	var objs = $(".selected_countries div");
	for(var i = 0; i < objs.length; i++) {
		var $obj = objs.eq(i);

		if ($obj.attr('class') != undefined && $obj.attr('class').indexOf('active') != -1) {
			$obj.fadeOut();
			continue;
		}

		var id = parseInt($obj.attr('data'));
		for(var j = 0 ; j < this.selected.length; j++) {
			if (id == this.selected[j])
				break;
		}
		if (j == this.selected.length) {
			$obj.css("background", "red");
			this.score-=5;
		} else {
			this.score+=10;
			$obj.css("background", "green");
		}
		$(".score").html(" " +this.score +" XP ");
		$(".tryagain").fadeIn();
	}
}