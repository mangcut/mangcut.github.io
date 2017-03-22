(function($, _, global){
	
	"use strict";
	
	var names = {};
	names.r11_elements = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];
	names.r11_yingyang = ["Dương", "Âm"];
	names.r11_genders = ["Nam", "Nữ"];
	names.r11_stems = 
										["Giáp", "Ất", "Bính", "Đinh", "Mậu",
										"Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
	names.r11_branches = 
										["Tý", "Sửu", "Dần",
										"Mão", "Thìn", "Tị",
										"Ngọ", "Mùi", "Thân",
										"Dậu", "Tuất", "Hợi"];
	names.r11_chamber =
										["Phối", "Bào", "Mệnh",
										"Phụ", "Phúc", "Điền",
										"Quan", "Nô", "Di",
										"Giải", "Tài", "Tử"];
	names.r01_chamber =
										["Phối", "Bào", "Thân",
										"Phụ", "Phúc", "Điền",
										"Quan", "Nô", "Di",
										"Giải", "Tài", "Tử"];
	names.r11_day12 = 
										["(Đối Liêm Trinh)", "Thiên Cơ", "Tử Vi",
										"(Đối Thiên Đồng)", "(Đối Vũ Khúc)", "(Đối Thái Dương)",
										"Liêm Trinh", "(Đối Thiên Cơ)", "(Đối Tử Vi)",
										"Thiên Đồng", "Vũ Khúc", "Thái Dương"];
	names.r01_day12 =
										["Phá Quân", "(Đối Thiên Lương)", "Thiên Phủ",
										"Thái Âm", "Tham Lang",	"Cự Môn",
										"Thiên Tướng", "Thiên Lương",	"Thất Sát",
										"(Đối Thái Âm)", "(Đối Tham Lang)",	"(Đối Cự Môn)"];
	names.r11_yb =
										["Thái Tuế", "Thiên Không", "Tang Môn",
										"Thiếu Âm", "Long Trì", "Nguyệt Đức",
										"Thiên Hư", "Long Đức", "Bạch Hổ",
										"Thiên Đức", "Điếu Khách", "Trực Phù"];
	names.r01_yb =
										["", "", "",
										"Hồng Loan", "", "",
										"Thiên Khốc", "", "",
										"Thiên Hỷ", "Phượng Các", ""];
	names.r01_yb1 =
										["Tướng Tinh", "Phan Án", "Thiên Mã",
										"Tức Thần", "Hoa Cái", "Kiếp Sát",
										"Tai Sát", "Thiên Sát", "Chỉ Bối",
										"Đào Hoa", "Nguyệt Sát", "Vong Thần"];
	names.r11_yb1 =
										["", "", "",
										"", "", "",
										"", "", "",
										"", "", ""];
	names.r11_ys =
										["", "Đà La", "Lộc Tồn",
										"Kình Dương", "", "LN Văn Tinh",
										"", "Đường Phù", "",
										"", "Quốc Ấn", ""];
	names.r10_ys =
										["", "", "",
										"", "", "",
										"", "", "",
										"", "", ""];
	names.r12_yb =
										["Bác Sỹ", "Lực Sỹ", "Thanh Long",
										"Tiểu Hao","Tướng Quân", "Tấu Thư",
										"Phi Liêm","Hỷ Thần", "Bệnh Phù",
										"Đại Hao", "Phục Binh", "Quan Phủ"];
	names.rx2_cuc =
										["Sinh", "Dục", "Đới",
										"Quan","Vượng", "Suy",
										"Bệnh","Tử", "Mộ",
										"Tuyệt", "Thai", "Dưỡng"];
	names.r11_m =
										["", "Diêu Y", "",
										"", "Tả Phù", "",
										"", "Địa Giải", "Thiên Giải",
										"Thiên Hình", "", ""];
	names.r01_m =
										["", "", "",
										"", "", "",
										"", "", "",
										"", "Hữu Bật", ""];
	names.r11_h =
										["", "", "Phong Cáo",
										"", "Văn Khúc", "",
										"Thai Phụ", "", "",
										"", "", "Địa Kiếp"];
	names.r01_h=
										["", "", "",
										"", "", "",
										"", "", "",
										"", "Văn Xương", "Địa Không"];
	
	names.zones = {
		invisible: 0,
		top_left: 1,
		top_center: 2,
		top_center_ex: 3,
		top_right: 4,
		high_above: 5,
		high_below: 6,
		middle_left: 7,
		middle_right: 8,
		bottom_left: 9,
		bottom_center: 10,
		bottom_right: 11
	}
	names.zones.max = names.zones.bottom_right;
	
	var model = {};
	
	model.Data = Backbone.Model.extend({
		defaults: {
			ys: 0,
			yb: 6,
			m: 0,
			d: 5,
			h: 0,
			w: false // woman
		},
		ys: function(){
			return this.get("ys");
		},
		ysText: function(){
			return names.r11_stems[this.ys()];
		},
		yb: function(){
			return this.get("yb");
		},
		ybText: function(){
			return names.r11_branches[this.yb()];
		},
		m: function(){
			return this.get("m");
		},
		displayMonth: function(){
			return this.m()+1;
		},
		d: function(){
			return this.get("d");
		},
		displayDay: function(){
			return this.d()+1;
		},
		h: function(){
			return this.get("h");
		},
		shift: function(what, delta, max){
			var newValue = this.get(what) + delta;
			if (max) {
				if (newValue > max) newValue = 0;
				if (newValue < 0) newValue = max;
			}
			this.set(what, newValue);
		},
		hText: function(){
			return names.r11_branches[this.h()];
		},
		w: function(){
			return this.get("w");
		},
		wText: function(){
			return names.r11_genders[this.w()?1:0];
		},
		menhText: function(){
			return names.r11_elements[this.menhElement - 2];
		},
		cucText: function(){
			return names.r11_elements[this.cucElement - 2];
		},
		yinyangText: function(){
			return names.r11_yingyang[this.ys() % 2];
		},
		toHash: function(){
			var text = "name=<%= name %>&ys=<%= ys %>&yb=<%= yb %>&m=<%= m %>&d=<%= d %>&h=<%= h %>&w=<%= w %>";
			var tpl  = _.template(text);
			return tpl(this.attributes);
		}
	});
	
	model.Star = Backbone.Model.extend({
		defaults: {
			name: "",
			otherName: "",
			origin: -1,
			factor: null,	// y, ys, yb, m, d, d12, h
			clockwise: 0,
			zone: names.zones.invisible
		},
		name: function(){
			var n = this.get("name");
			return n; //?n:"-";
		},
		codeName: function(o){
			o = (o || this.get("origin"));
			var f = (this.get("factor") || "nf");
			var c = this.get("clockwise");
			if (c === -1){
				c = "-";
			} else if (c===1){
				c = "+";
			} else {
				c="_nc_";
			}
			
			return "" + o + c + f;
		},
		tooltip: function(){
		
			var o = this.get("origin");
			var oText = "";
			if (o < 0 || o === null || typeof o === "undefined"){
				oText = "x";
			} else {
				oText = names.r11_branches[o].toLowerCase();
			}
			
			return this.codeName(oText);
		},
		displayName: function(){
			return this.name() || this.tooltip();
		},
		safeName: function(){
			var n = this.name();
			if (!n) return this.codeName();
			
			return n.toLowerCase()
				.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a")
				.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e")
				.replace(/ì|í|ị|ỉ|ĩ/g,"i")
				.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o")
				.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u")
				.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y")
				.replace("đ","d")
				.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g,"-");
		},
		realOrigin: function(){
			var o = this.get("origin");
			if (o < 0 || o === null || typeof o === "undefined"){
				return -1;
			}
			if (this.get("factor") === "yb"){
				return util.mod(o + 6);
			}
			
			return o;
		}
	});
	
	model.Stars = Backbone.Collection.extend({
		model: model.Star
	});
	
	model.Chamber = Backbone.Model.extend({
		initialize : function() {
			this.stars = new model.Stars;
		}
	});
	
	model.Chambers = Backbone.Collection.extend({
		model: model.Chamber
	});
	
	model.Leaf = Backbone.Model.extend({
		initialize : function() {
			this.chambers = new model.Chambers;
			for (var i = 0; i < 12; i++){
				this.chambers.add(new model.Chamber);
			}
		},
	});
	
	var view = {};
	view.ClientInfo = Backbone.View.extend({
		el: '#client_info',
		template: _.template($('#client-info-template').html()),

		render: function() {
			this.$el.html(this.template({
				name: this.model.get("name") || "Không tên",
				yinyang: this.model.yinyangText(),
				gender: this.model.wText(),
				hour: this.model.hText(),
				day: this.model.displayDay(),
				month: this.model.displayMonth(),
				stem: this.model.ysText(),
				branch: this.model.ybText(),
				menhElement: this.model.menhText(),
				cucElement: this.model.cucText()
			}));

			return this;
		}

	});
	
	view.RegularStar = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#regular-star-template').html()),

		render: function() {
			this.$el.html(this.template({
				className: util.makeClass(this.model),
				name: this.model.displayName(),
				tooltip: this.model.tooltip()
			}));
			return this;
		}

	});
	
	view.Chamber = Backbone.View.extend({
		
		initialize: function(){
			this.$el.html($('#chamber-template').html());
			this.zones = [];
			for (var i = 0; i <= names.zones.max; i++){
				this.zones.push(
					this.$el.find(".zone-" + i).empty());
			
			}
		},
		
		render: function() {
			
			this.model.stars.each(function(m) {
				var factor = m.get("factor");
				if (factor === "m-h" || factor === "m+h"){
					this.$el.addClass("chamber-" + m.safeName());
				}
				
				var z = m.get("zone");
				if (z === names.zones.invisible) {
					// do nothing
				} else if (z === names.zones.middle_left ||
									z === names.zones.middle_right){
					var star = new view.RegularStar({
						model: m
					});
					this.zones[z].append(star.render().el);
				} else {
					this.zones[z].text(m.displayName()).addClass(util.makeClass(m));
				}
			}.bind(this));

			return this;
		}

	});
	
	view.Leaf = Backbone.View.extend({
		el: '#leaf_table',
		events: {
				'click .btn-highlight': 'highlight',
				'click .btn-toggle': 'toggle',
				'click .btn-shift': 'shift',
				'click .btn-shiftGender': 'shiftGender',
				'click .btn-shiftYear': 'shiftYear'
		},
		render: function() {
			var chamberArray = util.resort(this.$el.find(".chamber"));
			for (var i = 0; i < chamberArray.length; i++){
				var chamber = new view.Chamber({
					model: this.model.chambers.at(i),
					el: chamberArray[i].eq(0)
				});
				
				chamber.render();
			}
			
			return this;
		},
		
		highlight: function(e) {
			e.preventDefault();
			util.highlight($(e.currentTarget).data("highlight"));			
		},
		
		toggle: function(e) {
			e.preventDefault();
			this.$el.toggleClass($(e.currentTarget).data("toggle"));
		},
		
		shift: function(e) {
			e.preventDefault();
			var $t = $(e.currentTarget);
			app.data.shift($t.data("shift"), $t.data("delta"), $t.data("max"));
			util.refresh(true);
		},
		
		shiftGender: function(e) {
			e.preventDefault();
			var $t = $(e.currentTarget);
			app.data.set("w", !app.data.w());			
			util.refresh(true);
		},
		
		shiftYear: function(e) {
			e.preventDefault();
			var delta = $(e.currentTarget).data("delta");
			app.data.shift("ys", delta, 9);
			app.data.shift("yb", delta, 11);
			util.refresh(true);
		}

	});
	
	var util = {};
	util.mod = function(value){
		return (value + 120) % 12;
	}
	util.resort = function(el){
		var $el = $(el);
		return [
			$el.eq(10), // 0
			$el.eq(9), // 1
			$el.eq(8), // 2
			$el.eq(6), // 3
			$el.eq(4), // 4
			$el.eq(0), // 5
			$el.eq(1), // 6
			$el.eq(2), // 7
			$el.eq(3), // 8
			$el.eq(5), // 9
			$el.eq(7), // 10
			$el.eq(11) // 11
		]
	}

	util.setSingle = function(
					chambers,
					starName,
					pos,
					factor,
					zone,
					origin,
					clockwise) {
						
			var options = {
				name: "" + starName,
				origin: util.mod(origin)
			};
			factor && (options.factor = factor);
			zone && (options.zone = zone);
			clockwise && (options.clockwise = clockwise);
			var star = new model.Star(options);
			var chamber = chambers.at(util.mod(pos));
			chamber.stars.add(star);
	}
	
	util.setSingleM = function(
					chambers,
					starName,
					dataValue,
					posArray,
					factor,
					zone,
					origin,
					clockwise) {
						
			util.setSingle(
					chambers,
					starName,
					posArray[dataValue],
					factor,
					zone,
					origin,
					clockwise);
	}
	
	util.setRound = function(
					chambers,
					nameArray,
					leaderPos,
					factor,
					zone,
					clockwise,
					clockwise1,
					leaderOrigin) {
						
		for (var i = 0; i < nameArray.length; i++){
			var starName = "" + nameArray[i];
			var options = {
				name: starName,
				origin: util.mod(i + (leaderOrigin || 0))
			};
			factor && (options.factor = factor);
			zone && (options.zone = zone);
			clockwise && (options.clockwise = clockwise);
			var star = new model.Star(options);
			var chamber = chambers.at(util.mod(leaderPos + (clockwise1 || 1)*i));
			chamber.stars.add(star);
		}
	}
	
	// set round based on counting
	util.setRoundC = function(
					chambers,
					nameArray,
					dataValue,
					factor,
					zone,
					clockwise,
					clockwise1,
					step,
					leaderOrigin) {
						
		var leaderPos = (leaderOrigin || 0) + (clockwise || 1) * dataValue * (step || 1);
		
		util.setRound(
			chambers,
			nameArray,
			leaderPos,
			factor,
			zone,
			clockwise,
			clockwise1,
			leaderOrigin
		);
		
	}
	
	// set round based on mapping (posArray)
	util.setRoundM = function(
					chambers,
					nameArray,
					dataValue,
					posArray,
					factor,
					zone,
					clockwise,
					clockwise1,
					step,
					leaderOrigin) {
						
		util.setRound(
			chambers,
			nameArray,
			posArray[dataValue],
			factor,
			zone,
			clockwise,
			clockwise1,
			leaderOrigin
		);
	}
	
	util.makeClass = function(m){
		// extra class specified by star
		var extraClass = m.get("extraClass");
		extraClass = extraClass?(" " + extraClass):"";
		if (!m.name()) extraClass += " star-noname";
		
		// origin
		var originText = m.realOrigin();
		if (originText !== null && typeof originText !== "undefined"){
			originText = " star-ro-" + originText;
		} else {
			originText = "";
		}
		
		// factor
		var factorText = m.get("factor");
		if (factorText){
			factorText = " star-factor-" + factorText;
		} else {
			factorText = "";
		}
		
		// clockwise
		var cwText = m.get("clockwise");
		if (cwText){
			cwText = " star-cw-" + cwText;
		} else {
			cwText = "";
		}
		
		// code name, like "4-minus-ys"
		var codeName = m.codeName();
		if (codeName){
			codeName = " c_" + 
				codeName.replace("-", "-minus-")
				.replace("+", "-plus-");
		} else {
			codeName = "";
		}
		
		// safe name, like hoa-tinh
		var safeName = m.safeName();
		if ($.isNumeric(safeName)){
			safeName = " s_" + safeName;
		} else {
			safeName = " " + safeName;
		}
		
		return "star" + extraClass + originText + factorText + cwText
						+ codeName + safeName;
	}
	
	util.query = function(name) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.hash.substring(1);

    var urlParams = {};
    while (match = search.exec(query)){
			var name = decode(match[1]).toLowerCase();
			var value = decode(match[2]);
			if (name === "w"){
				value = (value === "true");
			} else if ($.isNumeric(value)) {
				value = parseFloat(value);
			}
      urlParams[name] = value;
		}
		return urlParams;
}
	
	util.calculate = function(leaf, data, refresh){
		
		if (refresh){
			leaf.chambers.each(function(chamber){
				chamber.stars.reset();
			});
		}
		
		// some variables
		
		var chambers = leaf.chambers;
		var menhPos = util.mod(2 + data.m() - data.h());
		var positive = ((!data.w() && (data.ys() % 2 == 0)) ||
			(data.w() && (data.ys() % 2 == 1))?1:-1);
		var pzone = function(p){
			p || (p = positive);
			return ((p === 1) ? names.zones.middle_left : names.zones.middle_right);
		}
		
		var menhElement = data.menhElement = (function(yb, ys) {
			var hanhArray = [
				[4, 6, 3, 5, 4],
				[2, 5, 6, 3, 2],
				[6, 2, 5, 4, 3],
			]
			var c = (yb - ys + 60) % 6;
			return hanhArray[c/2][Math.floor(ys/2)];
		})(data.yb(), data.ys());

		var cucElement = data.cucElement = (function(menhPos, ys) {
			var cucArray = [4, 2, 6, 5, 3];
			var menh2cuc = [1, 1, 2, 2, 4, 4, 3, 3, 5, 5, 2, 2];
			return cucArray[(menh2cuc[menhPos] + ys) % 5];
		})(menhPos, data.ys());

		var d12 = data.get("d12") || (function(d, cucElement) {
			var y1 = (d + 1) % cucElement;
			var y2 = Math.floor((d + 1) / cucElement);
			if (y1 === 0) {
				y1 = cucElement;
				y2--;
			}
			var direction = (cucElement - y1) % 2;
			if (direction == 0) {
				return util.mod(y2 + (cucElement - y1));
			} else {
				return util.mod(y2 - (cucElement - y1));
			}
		})(data.d(), cucElement);
		
		// cung co dinh
		util.setRoundC(chambers, names.r11_branches, 0);
		
		// vong menh
		util.setRoundC(chambers, names.r11_chamber, data.m() - data.h(),
			"m-h", names.zones.top_center, 1);
		
		// vong than
		util.setRoundC(chambers, names.r01_chamber, data.m() + data.h(),
			"m+h", names.zones.top_center_ex, 1);
		
		// vong tu vi
		util.setRoundC(chambers, names.r11_day12, d12, 
			"d12", names.zones.high_above, 1);
		
		// vong thien phu
		util.setRoundC(chambers, names.r01_day12, d12, 
			"d12", names.zones.high_below, -1);
		
		// tu hoa
		util.setSingleM(chambers, "Hóa Lộc", data.ys(),
			[d12+6,d12+1,d12+9,3-d12,4-d12,d12+10,d12+11,5-d12,7-d12,-d12],
			"ys", names.zones.middle_left, 2, 1);
		util.setSingleM(chambers, "Hóa Quyền", data.ys(),
			[-d12,7-d12,d12+1,d12+9,3-d12,4-d12,d12+10,d12+11,d12+6,5-d12],
			"ys", names.zones.middle_left, 6, 1);
		util.setSingleM(chambers, "Hóa Khoa", data.ys(),
			[d12+10,2-d12,10-data.h(),d12+1,10-data.m(),7-d12,d12+9,4+data.h(),4+data.m(),4-d12],
			"ys", names.zones.middle_left, 10, 1);
		util.setSingleM(chambers, "Hóa Kỵ", data.ys(),
			[d12+11,3-d12,d12+6,5-d12,d12+1,4+data.h(),3-d12,10-data.h(),d12+10,4-d12],
			"ys", names.zones.middle_left, 11, 1);
		
		// vong thai tue
		util.setRoundC(chambers, names.r11_yb, data.yb(), 
			"yb", names.zones.middle_left, 1);
		
		// vong tue nghich
		util.setRoundC(chambers, names.r01_yb, data.yb(), 
			"yb", names.zones.middle_right, -1);
		
		// vong tuong tinh
		util.setRoundC(chambers, names.r01_yb1, data.yb(), 
			"yb", names.zones.middle_right, -1, 1, 3);
			
		// vong tuong tinh xuoi
		//util.setRoundC(chambers, names.r11_yb1, data.yb(), 
		//	"yb", names.zones.middle_left, 1, 1, 3);
			
		// vong loc ton xuoi
		util.setRoundM(chambers, names.r11_ys, data.ys(),
			[0,1,3,4,3,4,6,7,9,10],
			"ys", names.zones.middle_left, 1);
		
		// vong loc ton nguoc
		//
		
		// vong bac sy
		util.setRoundM(chambers, names.r12_yb, data.ys(),
			[2,3,5,6,5,6,8,9,11,0],
			"ys", pzone(),
			1, positive, 1, 2);

		// vong trang sinh
		util.setRoundM(chambers, names.rx2_cuc, cucElement - 2,
			[8,11,5,8,2],
			"cuc", names.zones.bottom_center,
			0, positive, 1, 2);

		// vong trang sinh thuan/nghich
		
		// khoi viet
		util.setSingleM(chambers, "Thiên Khôi", data.ys(),
			[1,0,11,9,7,8,7,6,5,3],
			"ys", names.zones.middle_right, 6, -1);
		util.setSingleM(chambers, "Thiên Việt", data.ys(),
			[7,8,9,11,1,0,1,2,3,5],
			"ys", names.zones.middle_left, 2, 1);
	
		// vong thang thuan (ta phu, thien hinh, dieu y)
		util.setRoundC(chambers, names.r11_m, data.m(), 
			"m", names.zones.middle_left, 1);
		
		// vong thang nguoc (huu bat)
		util.setRoundC(chambers, names.r01_m, data.m(), 
			"m", names.zones.middle_right, -1);
		
		// vong gio thuan (dia kiep, van khuc, thai phu, phong cao)
		util.setRoundC(chambers, names.r11_h, data.h(), 
			"h", names.zones.middle_left, 1);

		// vong gio nghich (van xuong, dia khong)
		util.setRoundC(chambers, names.r01_h, data.h(), 
			"h", names.zones.middle_right, -1);
		
		// hoa linh
		(function(){
			var hoaOrigin = [2,3,1,9,2,3,1,9,2,3,1,9][data.yb()];
			util.setSingle(chambers, "Hỏa Tinh",
				hoaOrigin + positive * data.h(),
				"h", pzone(), hoaOrigin, positive);
			
			var linhOrigin = [10,10,3,10,10,10,3,10,10,10,3,10][data.yb()];
			util.setSingle(chambers, "Linh Tinh",
				linhOrigin - positive * data.h(),
				"h", pzone(-positive), linhOrigin, -positive);
				
		})();
		
		// co qua
		(function(){
			var cothanPos = [2,2,5,5,5,8,8,8,11,11,11,2][data.yb()];
			util.setSingle(chambers, "Cô Thần", cothanPos, "yb", names.zones.middle_left, 2, 1);
			util.setSingle(chambers, "Quả Tú", cothanPos + 8, "yb", names.zones.middle_left, 10, 1);
		})();
		
		// pha toai
		util.setSingleM(chambers, "Phá Toái", data.yb(),
			[5,1,9,5,1,9,5,1,9,5,1,9],
			"yb", names.zones.middle_right, 5, -1);
		
		// thai toa
		util.setSingle(chambers, "Tam Thai", 4 + data.m() + data.d(),
			"m+d", names.zones.middle_left, 4, 1);
		util.setSingle(chambers, "Bát Tọa", 10 - (data.m() + data.d()),
			"m+d", names.zones.middle_right, 10, -1);
		
		// quang quy
		util.setSingle(chambers, "Ân Quang", 9 + data.d() - data.h(),
			"d-h", names.zones.middle_left, 9, 1);
		util.setSingle(chambers, "Thiên Quý", 5 - (data.d() - data.h()),
			"d-h", names.zones.middle_right, 5, -1);
		
		// tai, tho, dau
		util.setSingle(chambers, "Thiên Tài", 2 + data.yb() + data.m() - data.h(),
			"yb+m-h", names.zones.middle_left, 2);
		util.setSingle(chambers, "Thiên Thọ", 2 + data.yb() + data.m() + data.h(),
			"yb+m+h", names.zones.middle_left, 2);
		util.setSingle(chambers, "Đẩu Quân", data.yb() - (data.m() - data.h()),
			"yb-m-h", names.zones.middle_left, 0);
		
		// quan, phuc, ha, tru
		util.setSingleM(chambers, "Thiên Quan", data.ys(),
			[7,4,5,2,3,9,11,9,10,6],
			"ys", names.zones.middle_right, 6, -1);
		util.setSingleM(chambers, "Thiên Phúc", data.ys(),
			[9,8,0,11,3,2,6,5,6,5],
			"ys", names.zones.middle_left, 9, 1);
		util.setSingleM(chambers, "Lưu Hà", data.ys(),
			[9,10,7,8,5,6,3,4,11,2],
			"ys", names.zones.middle_right, 10, -1);
		util.setSingleM(chambers, "Thiên Trù", data.ys(),
			[5,6,0,5,6,8,2,6,9,10],
			"ys", names.zones.middle_left, 5, 1);
		
		// la vong thuong su
		// no need
		
		// tuan triet
		util.setSingle(chambers, "Tuần", 10 + data.yb() - data.ys(),
			"yb-ys", names.zones.middle_right, 10, -1);
		util.setSingle(chambers, "Tuần", 11 + data.yb() - data.ys(),
			"yb-ys", names.zones.middle_right, 11, -1);
		util.setSingle(chambers, "Triệt", (4 - data.ys() % 5) * 2,
			"ys", names.zones.middle_right, 8, -1);
		util.setSingle(chambers, "Triệt", (4 - data.ys() % 5) * 2 + 1,
			"ys", names.zones.middle_right, 9, -1);
		
		// dai van
		(function(){
			var dhArray = [];
			for (var i = 0; i < 12; i++){
				dhArray.push(i*10 + cucElement);
			}
			util.setRoundC(chambers, dhArray, menhPos, null, names.zones.top_right, 0, positive);
		})();
		
		// tieu van
		util.setRoundC(chambers, names.r11_branches, data.yb(), 
			null, names.zones.bottom_right, -1, data.w()?-1:1, 3,
			10 - (data.w()?-1:1)*data.yb());
			
		// phi tinh
	}
	
	util.highlight = function(c){
		// get all stars from leaf
		app.leaf.chambers.each(function(chamber){
			chamber.stars.each(function(star){
				var o = star.realOrigin();
				var f = star.get("factor");
				if (c >= 0 && f &&
											(o === util.mod(c) 		||
											 o === util.mod(c+3)	||
											 o === util.mod(c+6)	||
											 o === util.mod(c+9))){
						star.set("extraClass","hi-back hi-back" + util.mod(o-c)/3);
				} else {
					star.unset("extraClass");
				}
			});
		});
		
		app.leafView.render();
	}
	
	util.refresh = function(updateHash){
		util.calculate(app.leaf, app.data, true);
		app.leafView.render();
		app.client.render();
		if (updateHash) {
			window.location.hash = app.data.toHash();
		}
	}
	
	util.findStar = function(chamber, personName){
		chamber.stars.each(function(star){
				var starName = star.safeName;
				personNameList = global[starName];
				if (!!personNameList){
					if (personNameList.indexOf(personName) >= 0) return star;
				}
		});
		
		return null;
	}
	
	var app = {};
	app.run = function(){
		this.data = new model.Data;
		this.data.set(util.query());
		this.client = new view.ClientInfo({
			model: this.data
		});
		
		this.leaf = new model.Leaf;
		this.leafView = new view.Leaf({
			model: this.leaf
		});
		
		util.refresh();
	}

	// run the app
	app.run();
	
})(jQuery, _, this);