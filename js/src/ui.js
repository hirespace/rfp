(function () {
	"use strict";

	var getRfpConfig = _.sessionStorage().get("rfpConfig");

	// When looping through this Object, JS will automatically order the keys alphabetically, thus a little hack is
	// needed. See below.
	var rfpConfig = getRfpConfig ? getRfpConfig : {
			steps: {
				"event-type": "Event Type",
				"details": "Details",
				"extras": "Extras",
				"contact-info": "Contact Info"
			},
			activeStep: 1,
			validationDebounce: 250
		},
		stepsKeys = _.keys(rfpConfig.steps),
		activeStep = rfpConfig.activeStep;

	var section = {
		active: stepActive,
		next: stepNext,
		prev: stepPrev
	};

	assignActive();

	function assignActive() {
		rfpConfig.activeStep = activeStep;
		_.sessionStorage().set("rfpConfig", rfpConfig);

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

	var input = $(".rfpFormInput"),
		rfpForm = _.sessionStorage().get("rfpForm") ? _.sessionStorage().get("rfpForm") : {
			valid: false,
			data: {}
		};

	Rx.Observable.fromEvent(input, "keyup")
		.map(function (e) {
			var target = $(e.target),
				value = target.val(),
				rules = JSON.parse(target.attr("rules")),
				id = target.attr("id");

			return {
				value: value,
				rules: rules,
				id: id
			};
		})
		//@TODO use magicVars
		.debounce(rfpConfig.validationDebounce)
		.distinctUntilChanged()
		.map(function (data) {
			var value = data.value,
				rules = data.rules,
				valid = _.form().validate(value, rules);

			return {
				id: data.id,
				value: data.value,
				valid: valid
			};
		})
		.filter(function (d) {
			rfpForm.valid = d.valid;
			rfpForm.data[d.id] = d.value;

			if (!d.valid) {
				$(".next").addClass("disabled");
			}

			return d.valid;
		})
		.subscribe(function () {
			$(".next").removeClass("disabled");
			_.sessionStorage().set("rfpForm", rfpForm);

			// Just for notification purposes until we've got tests
			console.log("rfpForm saved to sessionStorage: " + JSON.stringify(_.sessionStorage().get("rfpForm").data));
		});

	// @TODO needs hell of a lot testing
	$(".rfpFormRadio").click(function (e) {
		var intermediary = $(e.target),
			target = intermediary.attr("data-for");

		if (target) {
			var value = intermediary.val();

			$("#" + target).val(value);
		}
	});

	// @TODO needs hell of a lot testing
	$(".rfpFormCheckbox").click(function (e) {
		var intermediary = $(e.target),
			target = intermediary.attr("data-for");

		if (target) {
			var value = intermediary.val();

			var originalValue = $("#" + target).val(),
				newValue;

			if (!originalValue) {
				newValue = [value];
			} else {
				originalValue = JSON.parse(originalValue);

				if (_.includes(originalValue, value)) {
					var index = _.indexOf(originalValue, value);
					originalValue.splice(index, 1);

					newValue = originalValue;
				} else {
					originalValue.push(value);
					newValue = originalValue;
				}
			}

			$("#" + target).val(JSON.stringify(newValue));
		}
	});

	var rfpInputs = $(".rfpFormInput");
	_.forEach(rfpInputs, function(k) {
		var ele = $(k);

		var id = ele.attr("id"),
			rules = ele.attr("rules");

		console.log(k);
		console.log("has an id: " + id + " and following rules: " + rules);
	});

})();