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

function currentUTCTimestamps()
{
    return +new Date();
}

function showError(errorMsg)
{
    $('.alert-danger').removeClass('d-none').html(errorMsg);

    $('#alert').modal('show');
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
    $('.backlink').click(function(){
        parent.history.back();
        return false;
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


// delete modal textarea

$( ".others" ).click(function() {
  $( ".reason-box" ).toggle( "fast", function() {
    // Animation complete.
  });
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
});
