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
// @todo - this can be done in O(1) time
// by using a variable to point to starting index ...
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
// @todo - this can be done in O(1) time
// by using a variable to point to starting index ...
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

		} else {
			var obj = $("." +this.c +" ul li[did='" +i +"']");
			this.top -= ((this.totalHeight - this.initHeight) / this.atBack);
			obj.css("opacity", this.baseOpacity);
			obj.css("z-index", "1");
			obj.css("top", this.top +"px");
			obj.css("font-size", "10pt");
			obj.css("color", "white");
		}
	}
}


// Create the object and attach listeners to
// keys like up, down, w & s
$(document).ready(function() {
	var obj = new menu3d('threedmenu');
	$(document).on('keydown', function(e){
		if (e.which == 38) {
			obj.Up();
			obj.Draw();
		} else if (e.which == 40) {
			obj.Down();
			obj.Draw();
		} else if (e.which == 87) {
			obj.sizingfactor++;
			obj.Draw();
		} else if (e.which == 83) {
			obj.sizingfactor--;
			obj.Draw();
        }
	});
});