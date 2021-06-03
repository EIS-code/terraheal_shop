// custom-select
$(document).ready(function() {
  $(document).on("click", "ul.prod-gram .init", function() {
    $(this).parent().find('li:not(.init)').toggle();
  });
  var allOptions = $("ul.prod-gram").children('li:not(.init)');
  $("ul.prod-gram").on("click", "li:not(.init)", function() {
    allOptions.removeClass('selected');
    $(this).addClass('selected');
    $(this).parent().children('.init').html($(this).html());
    $(this).parent().find('li:not(.init)').toggle();
  });
});


// timer 
function clock() {// We create a new Date object and assign it to a variable called "time".
var time = new Date(),
    
    // Access the "getHours" method on the Date object with the dot accessor.
    hours = time.getHours(),
    
    // Access the "getMinutes" method with the dot accessor.
    minutes = time.getMinutes(),
    
    
    seconds = time.getSeconds();

document.querySelectorAll('.clock')[0].innerHTML = harold(hours) + ":" + harold(minutes);
  
  function harold(standIn) {
    if (standIn < 10) {
      standIn = '0' + standIn
    }
    return standIn;
  }
}
setInterval(clock, 1000);

function empty(variable)
{
    return !(variable != "" && variable != null);
}

function includeJs(file, callback, args)
{
    $.getScript(file, function(){
        if (callback) {
            callback(args);
        }
    });
}

// Helper to pad single digits
function padSingleZero(number)
{
    return ('0' + number).slice(-2);
}

function currentUTCTimestamps()
{
    return +new Date();
}

function showError(errorMsg)
{
    $('.alert-danger').removeClass('d-none').html(errorMsg);

    $('#alert').modal('show');
}

function showSuccess(successMsg)
{
    $('.alert-success').removeClass('d-none').html(successMsg);

    $('#alert').modal('show');
}

function showConfirm(message, element)
{
    var message = (message != '' && message != null) ? message : "Are you sure ?";

    $(document).find("#confirm").find(".modal-header").find('.label').html(message);

    element.data("default", !(element.is(':checked')));

    $('#confirm').data("element", element);

    $('#confirm').modal('show');
}

function checkBookingForm(tab)
{
    if (tab == 2) {
        let value = $("input:checkbox[name='therapist[]']:checked");

        if (value.length <= 0) {
            showError("Please select therapist first.");

            return false;
        }
    } else if (tab == 3) {
        let therapy = $("input:checkbox[name='therapy_prising_id[]']:checked"),
            massage = $("input:checkbox[name='massage_prising_id[]']:checked");

        if (therapy.length <= 0 && massage.length <= 0) {
            showError("Please select service.");

            return false;
        }
    } else if (tab == 4) {
        let focusArea          = $("input:radio[name='focus_preference']:checked"),
            sessionType        = $("input:radio[name='session_type']:checked"),
            pressurePreference = $("input:radio[name='pressure_preference']:checked");

        if (focusArea.length <= 0) {
            showError("Please select focus area.");

            return false;
        }

        if (sessionType.length <= 0) {
            showError("Please select session type.");

            return false;
        }

        if (pressurePreference.length <= 0) {
            showError("Please select pressure preference.");

            return false;
        }
    } else if (tab == 5) {
        let clientId = $("#client_id").val();

        if (typeof clientId === typeof undefined || clientId == '' || clientId == null) {
            showError("Please select user or add guest.");

            return false;
        }
    }

    return true;
}

function confirm(message, callback, args, element)
{
    if (typeof callback == "function") {
        showConfirm(message, element);

        $(document).find('.confirmed').unbind().on("click", function() {
            callback.apply(this, args);
        });
    }
}

function showBody()
{
    setTimeout(function() {
        $("body").fadeIn(1000);
    }, 500);
}

function autoComplete(value, data, callback, args)
{
    if (!data || data.length <= 0) { return false; }

    $(".autocomplete-items").empty();

    $.each(data, function(k, v) {
        let b = "<div class='item-" + k + "'><strong>" + v.substr(0, value.length) + "</strong>" + v.substr(value.length) + "<input class='autocomplete-input d-none' value='" + k + "' data-value='" + v + "' /></div>";

        $(".autocomplete-items").append(b);
    });

    $(".autocomplete-items").find("div").unbind().on("click", function() {
        let input = $(this).find("input");

        $("#autocomplete").val(input.data('value'));

        $('#client_id').val(input.val());

        closeAllLists();

        callback(args);
    });
}

function closeAllLists(elmnt) {
    let items = $(".autocomplete-items").find("div");

    items.each(function(k, item) {
        item.remove();
    });
}

function getTime(unix_timestamp)
{
    var date = new Date(unix_timestamp);

    // Hours part from the timestamp
    var hours = date.getHours();

    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();

    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    var formattedTime = hours + ':' + minutes.substr(-2);

    return formattedTime;
}

function getDate(unixTimestamp)
{
    return moment.unix(unixTimestamp / 1000).format("DD/MM/YYYY");;
}

function isEmpty(variable)
{
    return (variable == '' || variable == null);
}

function getEnvVariable(variable)
{
    return localStorage.getItem("ENV_" + variable);
}

function isLive()
{
    let appEnv = getEnvVariable('APP_ENV');

    return (appEnv === 'prod' || appEnv === 'production');
}

function getLocalShopStorage()
{
    let dummyData = !isLive() ? JSON.stringify({"id": 5, "api_key": "shop5"}) : {},
        shopData  = localStorage.getItem("shopData") || dummyData;

    return (shopData) ? JSON.parse(shopData) : {};
}

function clearLocalStorage(key)
{
    localStorage.removeItem(key);
}

function getCurrentUrlFile()
{
    let url = window.location.href;

    return url ? url.split('/').pop().split('#').shift().split('?').shift().split('.').shift() : null;
}

function loggedIn()
{
    let shopData = getLocalShopStorage();

    if (Object.keys(shopData).length <= 0) {
        doLogin();
    }
}

function doLogin()
{
    window.location.href = "index.html";
}

function doLogout()
{
    clearLocalStorage('shopData');

    doLogin();
}

//booking next prev steps

$(function() {

	var $tabs = $('#tabs').tabs();
	
	$(".ui-tabs-panel").each(function(i){
	
	  var totalSize = $(".ui-tabs-panel").length - 1;
	
	  if (i != totalSize) {
	      next = i + 2;
   		  $(this).append("<a href='#' class='next-tab mover' rel='" + next + "'><i class='far fa-save'></i> Save</a>");
	  }
	  
	  if (i != 0) {
	      prev = i;
   		  $(this).append("<a href='#' class='prev-tab mover' rel='" + prev + "'>&#8592; Back</a>");
	  }

    if (i == 0) {
      $(this).append("<a href='home-screen.html' class='prev-tab mover home-screen'>&#8592; Back</a>");
    }
   		
	});
	
    $('.next-tab, .prev-tab').click(function() { 
        let rel = $(this).attr("rel");

        if (checkBookingForm(rel)) {
            $tabs.tabs('select', rel);
        }

        return false;
   });

});

$(document).ready(function(){
	$(".mover").click(function() {
		$('html,body').animate({                                                         
			scrollTop: $("#tabs").offset().top},
			'slow');
	});

  $(".home-screen").click(function() {
    window.location = 'home-screen.html'
  });
});


// custom select

$('#pressure li').on('click', function() {
$(this).addClass('selected').siblings().removeClass('selected');
  var getValue = $(this).text();
  $('#pLabel').text(getValue);
});

$('#session li').on('click', function() {
$(this).addClass('selected').siblings().removeClass('selected');
  var getValue = $(this).text();
  $('#dLabel').text(getValue);
});

$('#session li').on('click', function() {
$(this).addClass('selected').siblings().removeClass('selected');
  var getValue = $(this).text();
  $('#tLabel').text(getValue);
});

$('#payment li').on('click', function() {
$(this).addClass('selected').siblings().removeClass('selected');
  var getValue = $(this).text();
  $('#pay').text(getValue);
});

$('.dropDownMenu li.has-children > a').click(function() {
  $(this).parent().siblings().find('ul').slideUp(300);
  $(this).parent('.has-children').toggleClass('act')
  $(this).next('ul').stop(true, false, true).slideToggle(300);
  return false;
});


// dropdown menu

$('.myMenu ul li').hover(function() {
	$(this).children('ul').stop(true, false, true).slideToggle(300);
});

$('.table-content').scroll(function(){
    if ($(this).scrollTop() >= 10) {
       $('thead').addClass('fixed-header');
    }
    else {
       $('thead').removeClass('fixed-header');
    }
});

$(function () {
  $("#datepicker").datepicker({ 
        autoclose: true, 
        todayHighlight: true
  }).datepicker('update', new Date());
});
$(function () {
  $("#datepicker1").datepicker({ 
        autoclose: true, 
        todayHighlight: true
  }).datepicker('update', new Date());
});



$(document).ready(function(){
    $(document).find('.backlink').click(function(){
        parent.history.back();

        // return false;
    });

    // Alerts
    $(document).find('#alert').on('hidden.bs.modal', function () {
        $('.alert-primary').html('').addClass('d-none');
        $('.alert-secondary').html('').addClass('d-none');
        $('.alert-success').html('').addClass('d-none');
        $('.alert-danger').html('').addClass('d-none');
        $('.alert-warning').html('').addClass('d-none');
        $('.alert-info').html('').addClass('d-none');
        $('.alert-light').html('').addClass('d-none');
        $('.alert-dark').html('').addClass('d-none');
    });

    // Confirms
    var triggeredElement = null;
    $(document).on('shown.bs.modal', '#confirm', function (event) {
         triggeredElement = $(event.relatedTarget);
    });

    $(document).find(".unconfirmed").on("click", function() {
        triggeredElement = $(this).parents('#confirm').data('element');

        triggeredElement.prop("checked", triggeredElement.data('default'));
    });
});

// timepicker

var input = $('#input-a');
input.clockpicker({
    autoclose: true
});

var input = $('#input-b');
input.clockpicker({
    autoclose: true
});

var input = $('#input-c');
input.clockpicker({
    autoclose: true
});

var input = $('#input-d');
input.clockpicker({
    autoclose: true
});

var $select1 = $( '#select1' ),
		$select2 = $( '#select2' ),
    $options = $select2.find( 'div' );
    
$select1.on( 'change', function() {
	$select2.html( $options.filter( '[value="' + this.value + '"]' ) );
} ).trigger( 'change' );


// fixed header
$(window).scroll(function(){

    if ($(this).scrollTop() > 50) {

       $('.main-flex').addClass('fixed');

    } else {

       $('.main-flex').removeClass('fixed');

    }

});

$(function () {
  $("#datepicker").datepicker({ 
        autoclose: true, 
        todayHighlight: true
  }).datepicker('update', new Date());

    $(document).find("input:radio[name='cancel_type']").click(function() {
        $(".reason-box").fadeOut("fast");

        if ($(this).is(':checked')) {
            if ($(this).hasClass('other-reasons')) {
                $(".reason-box").fadeIn("fast");
            }
        }
    });

    $(document).find('#logout').on("click", function() {
        doLogout();
    });

    if (getCurrentUrlFile() != 'index') {
        $(document).find('#top-left-buttons').addClass('d-flex');
    }
});

/* Prototypes. */
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
