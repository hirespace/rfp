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
			value = intermediary.val(),
			originalValue = $("#" + target).val(),
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

	// @TODO needs hell of a lot testing
	function toggleRadio(radio) {
		var intermediary = $(radio),
			target = intermediary.attr("data-for");

		if (target) {
			var value = intermediary.val();

			$("#" + target).val(value);
		}
	}
})();