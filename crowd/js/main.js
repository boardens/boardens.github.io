/* settings */
let amount = 1500;
const char_casual = [
	"deliveryman_0","postman","reading",
	"running","sweating","walking_paper",
	"walking_0","walking_1","walking_2",
	"walking_3","walking_4","standing_0",
	"standing_1","standing_2","deliveryman_2",
	"walking_5","walking_6"
];
const char_special = [
	"deliveryman_1","crying","dancing_0",
	"dancing_1","dancing_2","friends_0",
	"friends_1"
];
const char_tofind = [
	"ninja","hiking","tennisman_0",
	"tennisman_1","friends_2","injuried",
	"fisherman","reading_sitted","loris",
	"golfer","painter","basketter",
	"jazzman","student","footballer"
];

/* init surface */
$(function() {
	var scrollElScroll = document.querySelector(".map .inner");
	var scr = new ScrollBooster({
		viewport: document.querySelector(".map"),
		emulateScroll: true,
		bounce: false, // Pour éviter l'effet élastique
		//friction: 0.2, // Pour régler la friction du déplacement
		onUpdate: function(data) {
			scrollElScroll.style.transform =
				"translate(" + -data.position.x + "px, " + -data.position.y + "px)";
		},
	});

	scr.setPosition({
		x: 3000,
		y: 3000
	});

	$(document).ready(function(){
		$('body').mousedown(function(){
			$('body').css('cursor', 'url("images/cursor_grabbing.png") 25 25, grabbing');
		});
		$('body').mouseup(function(){
			$('body').css('cursor', 'url("images/cursor_grab.png") 25 25, grab');
		});
	});
});

/* init images */
$(function() {
	function goIndex(){
		let table = [];
		$(".hotspot").each(function(i) {
			let cp = parseInt($(this).css("top"));
			let cn = $(this).attr('id');
			table.push([cn, cp]);
		});

		table.sort(function(a, b) {
			return a[1] - b[1];
		});

		//console.log(table);

		for (let i = table.length - 1; i >= 0; i--) {
			$("#"+table[i][0]).css({"z-index": (table[i][1]).toString()});
			//console.log("#"+table[i][0])

			r = Math.floor(Math.random() * 2) + 1;
			if(r==1){
				$("#"+table[i][0]).addClass("flip");
				//console.log("rotated #"+table[i][0])
			}
		}
	}

	function getRandomPosition(element) {
		var x = document.getElementById("inner").offsetHeight-element.clientHeight;
		var y = document.getElementById("inner").offsetWidth-element.clientWidth;
		var randomX = Math.floor(Math.random()*x);
		var randomY = Math.floor(Math.random()*y);
		return [randomX, randomY];
	}

	function goRandom(id) {
		for(i=0; i <= amount+char_tofind.length; i++){
			var img = document.getElementById(id+i);
			var xy = getRandomPosition(img);
			img.style.top = xy[0] + 'px';
			img.style.left = xy[1] + 'px';
		}
	}

	/* begin */
	for (var i = amount; i >= 0; i--) {
		char_type = Math.floor(Math.random() * 10) + 1;
		let random_char;

		if (char_type != 1){
			random_char = char_casual[Math.floor(Math.random() * char_casual.length)];

		} else {
			random_char = char_special[Math.floor(Math.random() * char_special.length)];
		}

		$(".inner").append('<div class="hotspot std" id="hotspot'+i+'"></div>');

		$("#hotspot"+i).css({background: "url(images/"+random_char+".svg) no-repeat"});
	}

	for (var i = char_tofind.length - 1; i >= 0; i--) {
		$(".inner").append('<div onclick="found('+(amount+i+1)+')" class="hotspot tf noflip" id="hotspot'+(amount+i+1)+'" data-id="'+char_tofind[i]+'"></div>');

		$("#hotspot"+(amount+i+1)).css({background: "url(images/"+char_tofind[i]+".svg) no-repeat"});
	}

	//console.log($('.hotspot').length)

	goRandom("hotspot");
	goIndex();

	/* init score */
	$('#score').html('0/'+char_tofind.length);
});

/* image onclick */
let score = 0;
let found_items = [];
function found(id) {
	/*console.log("Found item #"+id);*/

	/* prevent multiple clicks and hide item */
	$("#hotspot"+id).prop("onclick", null).off("click");
	$("#hotspot"+id).fadeOut("slow");

	/* update score */
	score += 1;
	$('#score').html(score+'/'+char_tofind.length);

	/* update found items in collection */
	let item = $("#hotspot"+id).attr("data-id");
	//console.log(item);
	$("#"+item).css({filter: "none"});
	let item_name = $("#"+item).next("br").next("br").next("span").attr("data-id");
	$("#"+item).next("br").next("br").next("span").text(item_name);

	if (score >= char_tofind.length){
		$(".success").fadeIn().css({display:"flex"});
	}
}

/* hotspot blink hovering */
$(document).ready(function(){
	let current;
	$(".tf").each(function(i) {
		current = "#hotspot"+(amount+i+1);

		//console.log(current)
		$(document).on({
			mouseenter: function() {
				$(this).addClass("blink");
				$('.map').css('transform', 'scale(1.03)');
			},
			mouseleave: function() {
				$(this).removeClass("blink");
				$('.map').css('transform', 'scale(1)');
			}
		}, current);
	});
});

/* toggle collection menu */
$(document).ready(function(){
	if (window.matchMedia("(min-width: 600px)").matches) {
		$(".top-right #collection").click(function(){
			$(".top-right").toggleClass("is-open");
		});
		$(".map").click(function(){
			$(".top-right").removeClass("is-open");
		});
	} else {
		$(".top-right #collection").click(function(){
			$(".top-right .content").toggleClass("is-unfolded");
		});
		$(".map").click(function(){
			$(".top-right .content").removeClass("is-unfolded");
		});
		
	}
});

/* loading screen */
$(document).ready(function(){
	setTimeout(function() {
		$(".loading").fadeOut();
	}, 3000);
});

/* hover box */
$(document).ready(function(){
	$(".top-right .content img").each(function() {

		let e = this.id;
		$("#"+e).mouseover(function() {
			$("#"+e+"-box").css({display: "block"});
			$(document).on('mousemove', function(a){
				$("#"+e+"-box").css({
					left: a.pageX - 180,
					top: a.pageY
				});
			});
		}).mouseout(function() {
			$("#"+e+"-box").css({display: "none"});
			
		});
	});
});

/* debug */
function debug(){
	console.warn("You're into debug mode.");
	$(".tf").addClass("debug");
}