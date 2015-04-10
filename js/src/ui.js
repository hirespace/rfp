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

	debug.info(stepsKeys);

})();