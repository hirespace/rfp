(function () {
	"use strict";

	var getRfpConfig = _.sessionStorage().get("rfpConfig"),
		getRfpForm = _.sessionStorage().get("rfpForm");

	var rfpForm = getRfpForm ? getRfpForm : {};

	var nRFPform = {},
		rfpConfig = getRfpConfig ? getRfpConfig : {
			// When looping through this Object, JS will automatically order the keys alphabetically, thus a little hack is
			// needed. See below.
			steps: {
				"event-type": "Event Type",
				"details": "Details",
				"extras": "Extras",
				"contact-info": "Contact Info"
			},
			activeStep: 0,
			validationDebounce: 250
		},
		stepsKeys = _.keys(rfpConfig.steps),
		activeStep = rfpConfig.activeStep,
		section = {
			active: stepActive,
			next: stepNext,
			prev: stepPrev
		};

	assignActive();

	$(".categorytile, .next").click(function () {
		return checkForm() ? section.next() : false;
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
		datetime = $(".rfpFormDateTime"),
		checkbox = $(".rfpFormCheckbox"),
		radio = $(".rfpFormRadio");

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

	radio.click(function (e) {
		var updateData = _.inputToggle().radio(e.target);

		if (updateData) {
			updateForm(updateData.target, updateData.newValue);
		}
	});

	checkbox.click(function (e) {
		var updateData = _.inputToggle().checkbox(e.target);

		if (updateData) {
			updateForm(updateData.target, updateData.newValue);
		}
	});

	datetime.change(function (e) {
		var target = $(e.target),
			id = target.attr("id"),
			value = target.val();

		updateForm(id, value);
	});

	[].slice.call(document.querySelectorAll("select.cs-select")).forEach(function (el) {
		var id = $(el).attr("id");

		new SelectFx(el, {
			onChange: function (val, selPlaceholder) {
				var value = $(selPlaceholder).find(".cs-placeholder-content").html();

				updateForm(id, value);

				$(selPlaceholder).parent(".cs-select").addClass("cs-select-filled");
			}
		});
	});

	function initFormElements() {
		var holders = $("#" + section.active() + " .radio-holder, #" + section.active() + " .checkbox-holder");

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

		var rfpInputs = $("#" + section.active() + " .rfpFormInput, #" + section.active() + " .rfpFormSelect");

		_.forEach(rfpInputs, function (k) {
			var ele = $(k),
				id = ele.attr("id"),
				value = ele.val(),
				rules = ele.attr("rules"),
				type = ele.hasClass("rfpFormInput") ? "input" : "select";

			if (id && rules) {
				var wasSet = nRFPform[id];

				if (wasSet) {
					value = wasSet.value;

					if (value.length > 0) {
						ele.val(value);
						ele.parent().addClass("input--filled");
					}

					// @TODO absolute and utter cruft :(
					if (type == "select") {
						_.forEach(ele.find("option"), function (option) {
							if ($(option).html() == value) {
								$(option).attr("selected", true);
							}
						});
					}
				} else {
					value = type == "select" ? "" : value;
				}

				rules = JSON.parse(rules);

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

		return true;
	}

	function stepPrev() {
		if (activeStep < 1) {
			return false;
		}

		activeStep = activeStep - 1;
		assignActive();

		return true;
	}

	function assignActive() {
		rfpConfig.activeStep = activeStep;
		_.sessionStorage().set("rfpConfig", rfpConfig);

		var vProgress = $("#vProgress"),
			children = vProgress.children();

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

		if (!getRfpForm) {
			_.forEach(stepsKeys, function (a) {
				rfpForm[a] = {};
			});
		}

		nRFPform = rfpForm[section.active()];

		initFormElements();
	}

	function updateForm(id, value) {
		var intermediary = nRFPform[id];

		intermediary.value = value;
		intermediary.valid = _.form().validate(value, intermediary.rules);

		checkObject(id);
	}

	function checkForm() {
		var err = [];

		_.forEach(nRFPform, function (data, id) {
			if (!checkObject(id)) {
				err.push(id);
			}
		});

		_.sessionStorage().set("rfpForm", rfpForm);

		return err.length == 0 ? true : false;
	}

	function checkObject(id) {
		var intermediary = nRFPform[id],
			valid = intermediary.valid,
			parent = $("#" + id).parent();

		if (!valid) {
			parent.addClass("input-error");
			return false;
		} else {
			parent.removeClass("input-error");
			return true;
		}
	}

	_.forEach(rfpForm, function (section, k) {
		$("#summary").append("<li><strong>" + rfpConfig.steps[k] + "</strong></li>");
		_.forEach(section, function (d, k) {
			$("#summary").append("<li>" + k + ": " + d.value + "</li>");
		});
	});

})();