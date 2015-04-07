/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

//Fire up the textarea
(function() {
  // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
  if (!String.prototype.trim) {
    (function() {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function() {
        return this.replace(rtrim, '');
      };
    })();
  }

  [].slice.call( document.querySelectorAll( 'textarea.textarea__field' ) ).forEach( function( inputEl ) {
    // in case the textarea is already filled..
    if( inputEl.value.trim() !== '' ) {
      classie.add( inputEl.parentNode, 'textarea--filled' );
    }

    // events:
    inputEl.addEventListener( 'focus', onInputFocus );
    inputEl.addEventListener( 'blur', onInputBlur );
  } );

  function onInputFocus( ev ) {
    classie.add( ev.target.parentNode, 'textarea--filled' );
  }

  function onInputBlur( ev ) {
    if( ev.target.value.trim() === '' ) {
      classie.remove( ev.target.parentNode, 'textarea--filled' );
    }
  }
})();


//Fire up the text inputs
(function() {
	// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	if (!String.prototype.trim) {
		(function() {
			// Make sure we trim BOM and NBSP
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function() {
				return this.replace(rtrim, '');
			};
		})();
	}

	[].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
		// in case the input is already filled..
		if( inputEl.value.trim() !== '' ) {
			classie.add( inputEl.parentNode, 'input--filled' );
		}

		// events:
		inputEl.addEventListener( 'focus', onInputFocus );
		inputEl.addEventListener( 'blur', onInputBlur );
	} );

	function onInputFocus( ev ) {
		classie.add( ev.target.parentNode, 'input--filled' );
	}

	function onInputBlur( ev ) {
		if( ev.target.value.trim() === '' ) {
			classie.remove( ev.target.parentNode, 'input--filled' );
		}
	}
})();


//Fire up the selects and make them change style when filled.
(function() {
  [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
    new SelectFx(el,{
      onChange: function ( val, selPlaceholder) {
        $(selPlaceholder).parent(".cs-select").addClass("cs-select-filled");
      }
    });
  } );
})();

//Fire up the popovers
$(function () {
  $('[data-toggle="popover"]').popover()
});

$('[data-toggle="popover"]').click( function(event){
  event.preventDefault();
});


//Fire up the Multi-Date change stuff on page two
$("#toggleAllDay").click(function(e) {
	//e.preventDefault();

	var checkbox = $(this).find("input");
	var isChecked = (checkbox.attr("checked") == "checked" || checkbox.attr("checked") == true) ? true : false;

	// Finding this out is a real kerfuffle and even then it is not correct
	isChecked ? checkbox.attr("checked", false) : checkbox.attr("checked", true);

	//$("#toggleAllDay").find(".input__label-content").text(isChecked ? "From" : "Date");
  $("#startDateLabel").html(isChecked ? "Date&nbsp<small>(optional)</small>" : "Start Date");
	$("#toggleTimes").toggleClass("hide");
  $("#toggleEndDate").toggleClass("hide");
});

//Fire up the logic to do with ways to contact customer
(function() {

  $("#emailCheck").click(function(e) {
    //e.preventDefault();
    toggleDateInfoMargin( this, document.getElementById("phoneCheck"), this )
  });

  $("#phoneCheck").click(function(e) {
    //e.preventDefault();
    toggleDateInfoMargin( document.getElementById("emailCheck"), this, this )
  });

  function toggleDateInfoMargin( email, phone, clicked ) {
    var isEmailChecked = (email.checked == "checked" || email.checked == true) ? true : false;
    var isPhoneChecked = (phone.checked == "checked" || phone.checked == true) ? true : false;

    if (isEmailChecked) {
      if (isPhoneChecked) {
        document.getElementById("phoneLabel").innerHTML = "Phone";
        document.getElementById("emailLabel").innerHTML = "Email";
      }
      else {
        document.getElementById("phoneLabel").innerHTML = "Phone&nbsp;<small>(optional)</small>";
        document.getElementById("emailLabel").innerHTML = "Email";
      }
    }
    else {
      if (isPhoneChecked) {
        document.getElementById("phoneLabel").innerHTML = "Phone";
        document.getElementById("emailLabel").innerHTML = "Email&nbsp;<small>(optional)</small>";
      }
      else {
        clicked.checked = true;
      }
    }
  }

})();

//Fire up the flexi and repeat day stuff on page two
(function() {

  $("#repeatCheckbox").click(function(e) {
    //e.preventDefault();
    toggleDateInfoMargin( this, document.getElementById("flexiCheckbox") )
    $("#repeatInput").toggleClass("hide");
  });

  $("#flexiCheckbox").click(function(e) {
    //e.preventDefault();
    toggleDateInfoMargin( document.getElementById("repeatCheckbox"), this )
    $("#flexiInput").toggleClass("hide");
  });

  function toggleDateInfoMargin( repeat, flexi ) {
    var isRepeatChecked = (repeat.checked == "checked" || repeat.checked == true) ? true : false;
    var isFlexiChecked = (flexi.checked == "checked" || flexi.checked == true) ? true : false;

    if (isRepeatChecked && isFlexiChecked) {
      $("#repeatInput").removeClass("top-med-margin").addClass("top-tiny-margin");
      $("#flexiInput").removeClass("top-lg-margin").addClass("top-tiny-margin");
    }
    else {
      $("#repeatInput").removeClass("top-tiny-margin").addClass("top-med-margin");
      $("#flexiInput").removeClass("top-tiny-margin").addClass("top-lg-margin");
    }
  }

})();

//For sections where some radios need to show a field for more info
$(".showRadioWithMoreInfo").click(function(e) {
  //e.preventDefault();
  var parentJquery = $(this.parentNode);
  parentJquery.removeClass("col-md-12").addClass("col-md-3");
  parentJquery.find(".radio-text").each(function (e) {
    this.innerText = $(this).data("short-text");
  });
  parentJquery.next().find('.moreInfo').removeClass("hide");
});

$(".hideRadioWithMoreInfo").click(function(e) {
  //e.preventDefault();
  var parentJquery = $(this.parentNode);
  parentJquery.addClass("col-md-12").removeClass("col-md-3");
  parentJquery.find(".radio-text").each(function (e) {
    this.innerText = $(this).data("long-text");
  });
  parentJquery.next().find('.moreInfo').addClass("hide");
});

$(".showMoreInfoMultiOptions").click(function(e) {
  //e.preventDefault();
  var self = this;
  var parentJquery = $(this.parentNode.parentNode);
  parentJquery.addClass("hide");
  parentJquery.next().removeClass("hide").find(".input__label-content").each(function (e) {
    this.innerText = $(self).data("long-text");
  });
});

$(".change-more").click(function(e) {
  //e.preventDefault();
  var self = this;
  var parentJquery = $(this.parentNode);
  parentJquery.addClass("hide").prev().removeClass("hide");
});

var contactPreferenceUpdateSelector = $("#contactPreference .cs-options").find("li");

contactPreferenceUpdateSelector.click(function() {
	var value = $(this).find("span").text();

	$("#contactPreferenceValue").removeClass("hide").find(".input__label-content").text(value);
});






if (!Modernizr.touch || !Modernizr.inputtypes.date) {

  $('input[type="date"]')
  .prop('type','text')
  .pickadate({
    selectYears: true,
    selectMonths: true,
    onRender: function() {
      var self = this;
      self.$node.next(".picker").prependTo(self.$node.parent().parent());
    },
    onOpen: function () {
      this.$node.parent().addClass("input--filled");
    },
    onSet: function(context) {
      if (context.select) {
        this.$node.parent().addClass("input--filled");
        this.$node.val(moment(new Date(context.select)).format("DD MMM YY"));
      }
      else {
        this.$node.parent().removeClass("input--filled");
        this.$node.val("");
      }
    }
  });

  $('input[type="time"]')
  .prop('type','text')
  .pickatime({
    onRender: function() {
      var self = this;
      self.$node.next(".picker").prependTo(self.$node.parent().parent());
    },
    onOpen: function () {
      this.$node.parent().addClass("input--filled");
    },
    onSet: function(context) {
      if (context.select) {
        this.$node.parent().addClass("input--filled");
        this.$node.val(moment(parseInt(context.select/60)+":"+context.select%60,"HH:mm").format("hh:mm aa"));
      }
      else {
        this.$node.parent().removeClass("input--filled");
        this.$node.val("");
      }
    }
  });

}

/*http://stackoverflow.com/questions/11320615/disable-native-datepicker-in-google-chrome

//Make it a textfield on pageload and then find a cool datepicker in a modal and use bootstrap. Maybe just the one from the BS?

If you have misused <input type="date" /> you can probably use:

$('input[type="date"]').prop('type','text');
after they have loaded to turn them into text inputs. You'll need to attach your custom datepicker first:

$('input[type="date"]').datepicker().prop('type','text');
Or you could give them a class:

$('input[type="date"]').addClass('date').prop('type','text');*/