(function () {
	"use strict";

	function inputToggleFactory() {
		return {
			radio: toggleRadio,
			checkbox: toggleCheckbox
		};
	}

	_.mixin({
		inputToggle: inputToggleFactory
	});

	// @TODO needs hell of a lot testing
	function toggleCheckbox(checkbox) {
		var intermediary = $(checkbox),
			target = intermediary.attr("data-for"),
			targetDOM = $("#" + target),
			value = intermediary.val(),
			originalValue = $("#" + target).val(),
			newValue;

		if (!target) {
			return false;
		}

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

		targetDOM.val(JSON.stringify(newValue));

		// We are returning these so that we can update the form
		return {
			target: target,
			newValue: newValue
		};
	}

	// @TODO needs hell of a lot testing
	function toggleRadio(radio) {
		var intermediary = $(radio),
			target = intermediary.attr("data-for"),
			targetDOM = $("#" + target),
			value = intermediary.val();

		if (!target) {
			return false;
		}

		targetDOM.val(value);

		// We are returning these so that we can update the form
		return {
			target: target,
			newValue: value
		};
	}
})();