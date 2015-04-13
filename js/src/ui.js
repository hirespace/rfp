(function () {
	"use strict";

	// When looping through this Object, JS will automatically order the keys alphabetically, thus a little hack is
	// needed. See below.
	var steps = {
			"event-type": "Event Type",
			"details": "Details",
			"extras": "Extras",
			"contact-info": "Contact Info"
		},
		stepsKeys = _.keys(steps),
		activeStep = 0;

	var section = {
		active: stepActive,
		next: stepNext,
		prev: stepPrev
	};

	assignActive();

	function assignActive() {
		var vProgress = $("#vProgress");
		var children = vProgress.children();

		_.forEach(children, function(ele) {
			console.log(section.active());
			var toggleSection = $(ele).attr("toggle-section");
			toggleSection == section.active() ? $(ele).find("a").addClass("active") : "";
		});
	}

	$(".categorytile").click(function() {
		section.next();
		console.log(activeStep);
		//alert("ok");
	});

	function stepActive() {
		return stepsKeys[activeStep];
	}

	function stepNext() {
		// @TODO document why 2 rather than 1!
		if (activeStep > (stepsKeys.length - 2)) {
			return false;
		}

		activeStep = activeStep + 1;
		assignActive();
	}

	function stepPrev() {
		if (activeStep < 1) {
			return false;
		}

		activeStep = activeStep - 1;
		assignActive();
	}

})();