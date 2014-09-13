var errorT;
function showError(mesg) {
	clearTimeout(errorT);
	$(".error").html(mesg);
	$(".error").slideDown();
	errorT = setTimeout(function() {
		$(".error").slideUp();
	}, 2000);
}


var menu3d = function(c) {
	this.c = c;
	this.main = $("." +c +" ul li");
	this.n = $("." +c +" ul li").length;
	this.inFront = (parseInt(this.n/3)%2==1)?parseInt(this.n/3):parseInt(this.n/3)+1;
	this.atBack = this.n - this.inFront;
	
	this.middleElement = parseInt(this.inFront/2);

	this.baseFontSize = 12;
	this.basePadding = 10;
	this.baseOpacity = 0.3;
	this.top = 0;
	this.totalHeight = 0;

	this.sizingfactor = 3;
	this.initHeight = 20;

	// -- init it
	this.t;
	this.freq = 200;
	this.Init();
	this.Draw();
};

// Initialising function, distribtes
// did to each element -- O(n) time
menu3d.prototype.Init = function() {
	for(var i = 0 ; i < this.n; i++) {
		this.main.eq(i).attr("did", i);
	}
};

// Rotates dids' in O(n) time DOWN
menu3d.prototype.Down = function() {
	for(var i = 0 ; i < this.n; i++) {
		var o = $("." +this.c +" ul li[did='" +i +"']");
		var id = parseInt(o.attr("did"));
		o.attr("didtmp", (id+1)%this.n);
	}
	for(var i = 0 ; i < this.n; i++) {
		var o = $("." +this.c +" ul li[didtmp='" +i +"']");
		o.attr("did", o.attr("didtmp"));
	}
}

// Rotates dids' in O(n) time UP
menu3d.prototype.Up = function() {
	for(var i = 0 ; i < this.n; i++) {
		var o = $("." +this.c +" ul li[did='" +i +"']");
		var id = parseInt(o.attr('did'));
		o.attr('didtmp', (id-1 >= 0)?(id-1):(this.n+(id-1)));
	}
	for(var i = 0 ; i < this.n; i++) {
		var o = $("." +this.c +" ul li[didtmp='" +i +"']");
		o.attr('did', o.attr('didtmp'));
	}
}

// Main drawing function
// Time complexity O(n)
menu3d.prototype.Draw = function() {
	this.top = this.initHeight;
	for(var i = 0; i < this.n; i++) {
		if (i < this.inFront) {
			var obj = $("." +this.c +" ul li[did='" +i +"']");
			obj.css("top", this.top +"px");
			obj.css("z-index", "2");

			if (i <= this.middleElement) {
				obj.css("font-size", this.baseFontSize + i*this.sizingfactor + 1 +"pt");

				//opacity
				obj.css("opacity", this.baseOpacity + (1-this.baseOpacity)*(i/this.middleElement));
				obj.css("padding", this.basePadding + i*this.sizingfactor +"px");
			} else {
				obj.css("font-size", this.baseFontSize + (this.inFront - i -1)*this.sizingfactor + 1 +"pt");
				obj.css("padding", this.basePadding + (this.inFront - i -1)*this.sizingfactor +"px");

				// opacity
				obj.css("opacity", this.baseOpacity + (1 - this.baseOpacity)*((this.inFront - i -1)/this.middleElement));
			}
			this.top += parseInt(obj.outerHeight());
			if (i == this.inFront - 1) {
				this.totalHeight = this.top;
			}
			
			obj.css("color", "rgb(11, 167, 36)");
            obj.css("-webkit-transform", "rotateX(0deg)");
		} else {
			var obj = $("." +this.c +" ul li[did='" +i +"']");
			this.top -= ((this.totalHeight - this.initHeight) / this.atBack);
			obj.css("opacity", this.baseOpacity);
			obj.css("z-index", "1");
			obj.css("top", this.top +"px");
			obj.css("font-size", "10pt");
			obj.css("color", "white");
            obj.css("-webkit-transform", "rotateX(180deg)");
		}
	}
	var $this = this;
	this.t = setTimeout(function() {
		$this.Up();
		$this.Draw();
	}, this.freq);
}

var selected = new Array();
// Create the object and attach listeners to
// keys like up, down, w & s
$(document).ready(function() {
	// -- pick up 25 random countries from the array;
	var x = 0;
	while(x < 25) {
		var needle = getRandom();
		if (!selected.has(needle)) {
			selected[selected.length] = needle;
			$(".threedmenu ul").append("<li>"+countries[selected[selected.length-1]]+"</li>");
			x++;
		}
	}
	


	var gobj = new game(selected);
	gobj.startTimer();

	var obj = new menu3d('threedmenu');
	$(document).live('keydown', function(e){
		// console.log(e);
		if (e.which == 32) {
			$(".threedmenu").fadeOut();
			clearTimeout(obj.t);
			var time = gobj.resetTimer();
			$(".enterCountries").fadeIn();

		} else if (e.which == 78 && e.shiftKey == true) {
			if ($(".selected_countries div").length < 2) {
				showError('Select atleast one country');
				return;
			}

			$(".countries_dropdown").hide();
			$(".threedmenu").fadeOut();
			var time = gobj.resetTimer();
			$(".enterCountries").fadeIn();
			clearTimeout(obj.t);

			$("#countries, #submit").slideUp();

			gobj.sc();
			e.preventDefault();
		}
	});

	$('#submit').live('click', function(e) {
		if ($(".selected_countries div").length < 2) {
			showError('Select atleast one country');
			return;
		}

		$(".countries_dropdown").hide();
		$(".threedmenu").fadeOut();
		var time = gobj.resetTimer();
		$(".enterCountries").fadeIn();
		clearTimeout(obj.t);
		$("#countries, #submit").slideUp();

		gobj.sc();
		e.preventDefault();
	});

	$('#countries').live('keyup', function() {
		var val = $(this).val();
		if (val.length == 0) {
			$(".countries_dropdown").slideUp();
			return;
		}
		var arr = countries.matching(val);
		$(".countries_dropdown").html("");
		for(var i = 0 ; i < arr.length; i++) {
			$(".countries_dropdown").append("<div data='" +arr[i] +"'>" +countries[arr[i]]+"</div>");
		}
		$(".countries_dropdown").slideDown();
	});

	$(".countries_dropdown div").live('click', function() {
		$(".countries_dropdown").slideUp();
		$('#countries').val("");
		var id = parseInt($(this).attr('data'));
		$(".selected_countries").prepend("<div data='" +id +"'>"+countries[id]+"</div>");
		var left = parseInt($(".selected_countries div.active").attr("left"));
		left--;
		$(".selected_countries div.active").html("& " +left +" left");
		$(".selected_countries div.active").attr("left",left);

		$('#countries').focus();

		if (left == 0) {
			$("#countries, #submit").slideUp();
			gobj.sc();
		}

	});
	$(".selected_countries div").live('click', function() {
		if ($(this).attr('class') != undefined && $(this).attr('class').indexOf('active')!=-1)
			return;

		$(this).remove();
		var left = parseInt($(".selected_countries div.active").attr("left"));
		left++;
		$(".selected_countries div.active").html("& " +left +" left");
		$(".selected_countries div.active").attr("left",left);

	});
	$(".tryagain").live('click', function() {
		$(this).fadeOut();
		gobj.reset();
		selected = [];
		$(".threedmenu ul").html("");
		var x = 0;
		while(x < 25) {
			var needle = getRandom();
			if (!selected.has(needle)) {
				selected[selected.length] = needle;
				$(".threedmenu ul").append("<li>"+countries[selected[selected.length-1]]+"</li>");
				x++;
			}
		}
		$(".enterCountries").fadeOut();
		$("#countries, #submit").fadeIn();

		$(".selected_countries div").each(function() {
			if ($(this).attr('class') != undefined && $(this).attr('class').indexOf('active') != -1) {}
			else $(this).remove();
		});
		$(".selected_countries div.active").html("& 25 Left");
		$(".selected_countries div.active").attr("left", "25");
		$(".selected_countries div.active").fadeIn();


		$(".threedmenu").fadeIn();

		gobj.selected = selected;
		obj = new menu3d('threedmenu');		
		gobj.startTimer();


	});

});