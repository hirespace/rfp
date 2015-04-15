(function () {
	"use strict";

	initFormElements();

	var getRfpConfig = _.sessionStorage().get("rfpConfig");
	var getRfpForm = _.sessionStorage().get("rfpForm");

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
		//rfpForm = getRfpForm ? getRfpForm : initFormElements(),
		stepsKeys = _.keys(rfpConfig.steps),
		activeStep = rfpConfig.activeStep,
		section = {
			active: stepActive,
			next: stepNext,
			prev: stepPrev
		};

	assignActive();

	$(".categorytile, .next").click(function () {
		section.next();
	});

	$(".prev").click(function () {
		section.prev();
	});


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
				id = target.attr("id"),
				intermediary = nRFPform[id];

			return {
				value: {
					new: target.val(),
					old: intermediary.value
				},
				rules: intermediary.rules,
				valid: intermediary.valid,
				id: id
			};
		})
		.debounce(rfpConfig.validationDebounce)
		.map(function (data) {
			var value = data.value.new,
				rules = data.rules,
				valid = _.form().validate(value, rules);

			return {
				id: data.id,
				value: value,
				valid: valid
			};
		})
		.filter(function (d) {
			var intermediary = nRFPform[d.id];

			intermediary.value = d.value;
			intermediary.valid = d.valid;

			return d.valid;
		})
		.subscribe(function () {
			var intermediary = nRFPform;
			console.log(intermediary);
			//$(".next").removeClass("disabled");
			//_.sessionStorage().set("rfpForm", nRFPform);

			// Just for notification purposes until we've got tests
			//console.log("rfpForm saved to sessionStorage: " + JSON.stringify(_.sessionStorage().get("nRFPform").data));
		});

	$(".rfpFormRadio").click(function (e) {
		_.inputToggle().radio(e.target);
	});

	$(".rfpFormCheckbox").click(function (e) {
		_.inputToggle().checkbox(e.target);
	});

	function initFormElements() {
		var holders = $(".radio-holder, .checkbox-holder");

		_.forEach(holders, function (holder) {

			var type = $(holder).hasClass("radio-holder") ? "radio" : "checkbox";

			var collector = $(holder).find("." + type + "-collector"),
				inputs = $(holder).find("." + type + " input");

			_.forEach(inputs, function (input) {
				var isChecked = $(input).attr("checked") ? true : false;

				if (isChecked) {
					_.inputToggle()[type](input);
				}
			});
		});

		var rfpInputs = $(".rfpFormInput, .rfpFormSelect"),
			nRFPform = {};

		_.forEach(rfpInputs, function (k) {
			var ele = $(k);

			var id = ele.attr("id"),
				value = ele.val(),
				rules = ele.attr("rules"),
				type = ele.hasClass("rfpFormInput") ? "input" : "select";

			if (id && rules) {
				rules = JSON.parse(rules);

				nRFPform[id] = {
					type: type,
					rules: rules,
					value: value,
					valid: _.form().validate(value, rules)
				};
			}
		});

		console.log(nRFPform);
	}

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

})();