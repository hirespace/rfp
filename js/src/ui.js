(function () {
	"use strict";

	var getRfpConfig = _.sessionStorage().get("rfpConfig"),
		getRfpForm = _.sessionStorage().get("rfpForm");

	var nRFPform = getRfpForm ? getRfpForm : {},
		rfpConfig = getRfpConfig ? getRfpConfig : {
			// When looping through this Object, JS will automatically order the keys alphabetically, thus a little hack is
			// needed. See below.
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
		activeStep = rfpConfig.activeStep,
		section = {
			active: stepActive,
			next: stepNext,
			prev: stepPrev
		};

	initFormElements();
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
				id = target.attr("id");

			return {
				value: target.val(),
				id: id
			};
		})
		.debounce(rfpConfig.validationDebounce)
		.distinctUntilChanged()
		.subscribe(function (data) {
			updateForm(data.id, data.value);
		});

	$(".rfpFormRadio").click(function (e) {
		var updateData = _.inputToggle().radio(e.target);

		if (updateData) {
			updateForm(updateData.target, updateData.newValue);
		}
	});

	$(".rfpFormCheckbox").click(function (e) {
		var updateData = _.inputToggle().checkbox(e.target);

		if (updateData) {
			updateForm(updateData.target, updateData.newValue);
		}
	});

	$(".rfpFormDateTime").change(function (e) {
		var target = $(e.target),
			id = target.attr("id"),
			value = target.val();

		updateForm(id, value);
	});

	// Fire up the selects and make them change style when filled.
	[].slice.call(document.querySelectorAll("select.cs-select")).forEach(function (el) {
		new SelectFx(el, {
			onChange: function (val, selPlaceholder) {
				var id = $(el).attr("id"),
					value = $(selPlaceholder).find(".cs-placeholder-content").html();

				updateForm(id, value);

				$(selPlaceholder).parent(".cs-select").addClass("cs-select-filled");
			}
		});
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

		var rfpInputs = $(".rfpFormInput, .rfpFormSelect");

		_.forEach(rfpInputs, function (k) {
			var ele = $(k);

			var id = ele.attr("id"),
				value = ele.val(),
				rules = ele.attr("rules"),
				type = ele.hasClass("rfpFormInput") ? "input" : "select";

			if (id && rules) {
				rules = JSON.parse(rules);
				value = type == "select" ? "" : value;

				var valid = _.form().validate(value, rules);

				nRFPform[id] = {
					type: type,
					rules: rules,
					value: value,
					valid: valid
				};
			}
		});
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

	function updateForm(id, value) {
		var intermediary = nRFPform[id];

		intermediary.value = value;
		intermediary.valid = _.form().validate(value, intermediary.rules);

		checkObject(id);
		console.log("Value Updated:");
		console.log(intermediary);
	}

	//function checkForm() {
	//	_.forEach(nRFPform, function (data, id) {
	//		checkObject(id);
	//	});
	//}
	//checkForm();

	function checkObject(id) {
		var intermediary = nRFPform[id],
			valid = intermediary.valid,
			parent = $("#" + id).parent();

		if (!valid) {
			parent.addClass("input-error");
		}
	}

})();