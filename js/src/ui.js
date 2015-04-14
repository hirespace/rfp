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
		activeStep = 1; // @TODO change back to 0 -> TEMP for testing

	var section = {
		active: stepActive,
		next: stepNext,
		prev: stepPrev
	};

	assignActive();

	function assignActive() {
		//sessionStorage.set(activeStep);

		var vProgress = $("#vProgress");
		var children = vProgress.children();

		_.forEach(children, function (ele) {
			var toggleSection = $(ele).attr("toggle-section");

			if (toggleSection == section.active()) {
				$(ele).find("span").addClass("active");
				$("section #" + toggleSection).removeClass("hide");
			} else {
				$(ele).find("span").removeClass("active");
				$("section #" + toggleSection).addClass("hide");
			}
		});
	}

	$(".categorytile, .next").click(function () {
		section.next();
	});

	$(".prev").click(function () {
		section.prev();
	});

	function stepActive() {
		return stepsKeys[activeStep];
	}

	function stepNext() {
		// Ok so this will be 1 in the end, as we also have the confirmation page in place. It is somewhat confusing
		// though so possibly makes sense to document it or keep this comment here.
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

	// So there should be a watcher set on every input / select that will evaluate whether or not the user input is
	// valid. The rules should be set for individual inputs and there should be a well-defined set of rules somewhere.
	// On evaluation, we will filter the valid values and update an object with form data (this should also be saved to
	// session storage once it"s been validated). On changing the URL / State / Page refresh, the object should loop
	// through inputs / selects and set the values accordingly (cache).
	// The object with form data should include input ID or any other unique identifier to enable back-tracking.

	var input = $(".input__field");

	Rx.Observable.fromEvent(input, "keyup")
		.map(function (e) {
			var target = $(e.target),
				value = target.val(),
				rules = JSON.parse(target.attr("rules"));

			return {
				value: value,
				rules: rules
			};
		})
		.filter(function (data) {
			return data.value.length > 2;
		})
		//.map(function(data){
		//	return data.value;
		//})
		//@TODO use magicVars
		.debounce(250)
		//@TODO implement this
		.distinctUntilChanged()
		.subscribe(function (a) {
			console.log(a);
		});

})();