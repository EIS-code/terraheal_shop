
import { Post, Get, searchClients, SUCCESS_CODE, ERROR_CODE, EXCEPTION_CODE } from './networkconst.js';
import { THERAPISTS, SERVICES, PREFERENCES, SESSIONS, ADD_CLIENT, ADD_NEW_BOOKING, SEARCH_CLIENT } from './networkconst.js';

$(document).ready(function () {
    getTherapists();
    getPreferences();

    var owlServices = initOwlServices();

    getServices(owlServices);

    $(".addGuest").on("click", function() {
        addClient();
    });

    $(".checkout").on("click", function() {
        addBooking();
    });

    $("input:radio[name='physical_condition']").change(
        function() {
            let isTrue = ($(this).val() == '1');

            $("#notes_of_injuries").prop("disabled", !(isTrue));

            if (!isTrue) {
                $("#notes_of_injuries").val("");
            }
        }
    );

    $("input:radio[name='booking_notes']").change(
        function() {
            let isTrue = ($(this).val() == '1');

            $("#special_notes").prop("disabled", !(isTrue));

            if (!isTrue) {
                $("#special_notes").val("");
            }
        }
    );

    $("#autocomplete").on("keyup", function() {
        getClients($(this).val());
    });
});

function initOwlServices() {
    let sliderElement = $('#msg-slider');

    sliderElement.trigger('destroy.owl.carousel');

    sliderElement.empty();

    return sliderElement
        .owlCarousel({
            loop:true,
            margin:0,
            nav:false,
            dots:true,
            responsive:{
                0: {
                    items: 1
                },
                600: {
                    items:1
                },
                1000: {
                    items:1
                }
            }
    });
}

function getServices(owlServices)
{
    let postData = {
        "type": 0
    }

    Post(SERVICES, postData, function (res) {
        if (res.data.code == SUCCESS_CODE) {

            var myArray = res.data.data.data;

            window.localStorage.removeItem('massages');
            window.localStorage.setItem('massages', JSON.stringify(myArray));

            $.each( myArray, function( i, item ) {
                
                var newListItem = "<li>" + "<input class=\"select-input_service\" type=\"checkbox\" name=\"massages[]\" value="+item.id+" data-type='0'>"+
                "<div class=\"sl-cont\">"+
                "<div class=\"th-image msg-img\">"+
                "<img src="+item.icon+" alt=\"test\"/>"+
                "</div>"+
                "<span class=\"msg-name\">"+item.name+"</span>"+
                "</div>"+ "</li>";
             
                $( "#massages .grid_service" ).append( newListItem );
                
            });

            $('#massages .grid_service .select-input_service').click(function(e) { 
                if (this.value != null) {
                    if (this.checked) {
                        setSelectService(this.value, 0, owlServices);
                    } else {
                        removeSelectService(this.value, 0, owlServices);
                    }
                }
            });

        } else {
            showError(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });

    postData = {
        "type": 1
    }

    Post(SERVICES, postData, function (res) {
        if (res.data.code == SUCCESS_CODE) {

            // console.log("RESPONSE RECEIVED: ", res.data);
            // console.log("RESPONSE RECEIVED: ", res.data.code);

            var myArray = res.data.data.data;

            window.localStorage.removeItem('therapies');
            window.localStorage.setItem('therapies', JSON.stringify(myArray));

            $.each( myArray, function( i, item ) {
                
                var newListItem = "<li>" + "<input class=\"select-input_service\" type=\"checkbox\" name=\"therapies[" + item.id + "]\" value="+item.id+" data-type='1'>"+
                "<div class=\"sl-cont\">"+
                "<div class=\"th-image msg-img\">"+
                "<img src="+item.image+" alt=\"test\"/>"+
                "</div>"+
                "<span class=\"msg-name\">"+item.name+"</span>"+
                "</div>"+ "</li>";
             
                $( "#therapies .grid_service" ).append( newListItem );
                
            });

            $('#therapies .grid_service .select-input_service').click(function(e) {
                if (this.value != null) {
                    if (this.checked) {
                        setSelectService(this.value, 1, owlServices);
                    } else {
                        removeSelectService(this.value, 1, owlServices);
                    }
                }
            });

        } else {
            showError(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function setSelectService(service, type, owlServices)
{
    let selectedData = [],
        liHtml       = "";

    var therapies = JSON.parse(window.localStorage.getItem('therapies')),
        massages  = JSON.parse(window.localStorage.getItem('massages')),
        data      = type == 1 ? therapies : massages;

    $.each(data, function(key, item) {
        if (item.id == service) {
            selectedData = item;
        }
    });

    $.each(selectedData.pricing, function(i, itemPricing) {
        var price    = itemPricing.price,
            duration = 0;

        $.each(selectedData.timing, function(k, itemTiming) {
            if (itemPricing.massage_timing_id == itemTiming.id) {
                duration = itemTiming.time;
            }
        });

        if (type == 1) {
            liHtml += "<li><input type='checkbox' name='therapy_prising_id[]' value='" + itemPricing.id + "' class='select-input' data-type='" + type + "' /><span class=\"durtn\">" + duration + " min</span><span class=\"line-hr\"></span><span class=\"price\"><small>&#8364;</small>" + price + "</span></li>";
        } else {
            liHtml += "<li><input type='checkbox' name='massage_prising_id[]' value='" + itemPricing.id + "' class='select-input' data-type='" + type + "' /><span class=\"durtn\">" + duration + " min</span><span class=\"line-hr\"></span><span class=\"price\"><small>&#8364;</small>" + price + "</span></li>";
        }
    });

    var newListItem = "<div class=\"item item-" + service + "-" + type + "\">" +
                        "<div class=\"msg-right\">"+
                            "<figure>"+
                                "<img src=\"" + selectedData.image + "\" alt=\"\"/>"+
                            "</figure>"+
                            "<div class=\"ms-content\">"+
                                "<h3>" + selectedData.name + "</h3>"+
                                "<div class=\"d-flex justify-content-between\">"+
                                "<span>Duration</span>"+
                                "<span>Price</span>"+
                                "</div>"+
                                "<ul>"+
                                    liHtml
                                "</ul>"+
                            "</div>"+
                        "</div>"+
                    "</div>";

    owlServices.trigger('add.owl.carousel', [newListItem]);

    owlServices.trigger('refresh.owl.carousel');

    let index = getOwlCarouselIndex(service, type, owlServices);

    owlServices.trigger('to.owl.carousel', index);

    // Set subtotal.
    let subtotal = 0;

    let getPrice = function(therapies, massages) {
        let checkedServices = $('.service_info').find(':input[type="checkbox"]:checked');

        subtotal = 0;

        $.each(checkedServices, function(k, service) {
            let input = $(service);

            if (input.data('type') == 1) {
                $.each(therapies, function(key, item) {
                    $.each(item.pricing, function(key, itemPricing) {
                        if (itemPricing.id == input.val()) {
                            subtotal += itemPricing.price;
                        }
                    });
                });
            } else {
                $.each(massages, function(key, item) {
                    $.each(item.pricing, function(key, itemPricing) {
                        if (itemPricing.id == input.val()) {
                            subtotal += itemPricing.price;
                        }
                    });
                });
            }
        });
    };

    let selectedServices = $('.service_info').find(':input[type="checkbox"]');
    selectedServices.on('click', function() {
        let self = $(this);

        if (self.prop('checked')) {
            self.parent('li').addClass('selected');
        } else {
            self.parent('li').removeClass('selected');
        }

        getPrice(therapies, massages);

        $('.subtotal').html('');
        $('.subtotal').html(subtotal);
        $('.subtotal-value').val(subtotal);
    });
}

function getOwlCarouselIndex(service, type, owlServices)
{
    let slider          = owlServices.find('.owl-stage'),
        current         = slider.filter(".item-" + service + "-" + type),
        carouselIndex   = slider.index(current);

    return carouselIndex;
}

function removeSelectService(service, type, owlServices)
{
    owlServices = initOwlServices();

    $('#massages .grid_service .select-input_service').each(function(e) { 
        if (this.value != null) {
            if (this.checked) {
                setSelectService(this.value, 0, owlServices);
            }
        }
    });

    $('#therapies .grid_service .select-input_service').each(function(e) { 
        if (this.value != null) {
            if (this.checked) {
                setSelectService(this.value, 1, owlServices);
            }
        }
    });

    owlServices.trigger('to.owl.carousel', 0);
}

function getTherapists() {
    let postData = {};

    Post(THERAPISTS, postData, function (res) {
        if (res.data.code == SUCCESS_CODE) {

            var myArray = res.data.data;

            $.each( myArray, function( i, item ) {
                var newListItem = "<li>" + "<input class=\"select-input\" type=\"checkbox\" name=\"therapist[]\" value=\"" + item.therapistId + "\" />"+
                "<div class=\"sl-cont\">"+
                "<span class=\"name\">"+item.therapistName+"</span>"+
                "<div class=\"th-image\">"+
                "<img src="+item.therapistPhoto+" alt=\"\"/>"+
                "</div>"+
                "<div class=\"avail\">" + getAvailableTime(item.available) + "</div>"+
                "</div>"+ "</li>";

                $( ".grid" ).append( newListItem );
            });
        } else {
            showError(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function getPreferences()
{
    let postData = {
        "type": 8
    };

    let focusAreas = [];

    Post(PREFERENCES, postData, function (res) {
        let data = res.data.data.preference_options;

        if (Object.keys(data).length > 0) {
            var modelBody = $('#focusmodal').find('.modal-body'),
                modelHtml = "<div class='focus-pref'><ul class='d-flex justify-content-between flex-wrap'>";

            $.each(data, function(key, row) {
                modelHtml += "<li><input class='select-input' type='radio' name='focus_preference' value='" + row.id + "' data-name='" + row.name + "' /><div class='pf-bx'><img src='" + row.icon + "' alt='' /><span class='pf-abs'>" + row.name + "</span></div></li>";
            });

            modelHtml += "</ul></div>";

            modelBody.html("");
            modelBody.html(modelHtml);
        }

        $('input:radio[name="focus_preference"]').change(
            function() {
                if ($(this).is(':checked')) {
                    $('#focus_preference').html($(this).data('name'));
                }

                $('#focusmodal').modal('hide');
            }
        );
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });

    postData = {};

    Get(SESSIONS, postData, function (res) {
        let data = res.data.data;

        if (Object.keys(data).length > 0) {
            var elementDropdown = $('#session'),
                dropdownHtml    = "";

            $.each(data, function(key, row) {
                dropdownHtml += "<li><input type='radio' name='session_type' value='" + row.id + "'><label>" + row.type + "</label></li>";
            });

            elementDropdown.html("");
            elementDropdown.html(dropdownHtml);
        }

        $('#session li').on('click', function() {
            $(this).addClass('selected').siblings().removeClass('selected');

            var getValue = $(this).text();

            $('#dLabel').text(getValue);

            $(this).parents('.dropdown').click();
        });
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });

    postData = {
        "type": 1
    };

    let pressure = [];

    Post(PREFERENCES, postData, function (res) {
        let data = res.data.data.preference_options;

        if (Object.keys(data).length > 0) {
            var elementDropdown = $('#pressure'),
                dropdownHtml    = "";

            $.each(data, function(key, row) {
                dropdownHtml += "<li><input type='radio' name='pressure_preference' value='" + row.id + "'><label>" + row.name + "</label></li>";
            });

            elementDropdown.html("");
            elementDropdown.html(dropdownHtml);
        }

        $('#pressure li').on('click', function() {
            $(this).addClass('selected').siblings().removeClass('selected');

            var getValue = $(this).text();

            $('#pLabel').text(getValue);

            $(this).parents('.dropdown').click();
        });
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function addClient()
{
    let name      = $('#guest_name'),
        telephone = $('#guest_telephone'),
        email     = $('#guest_email'),
        postData  = {
            "name": name.val(),
            "email": email.val(),
            "tel_number": telephone.val()
        };

    Post(ADD_CLIENT, postData, function (res) {
        let data = res.data;

        if (data.code == EXCEPTION_CODE) {
            showError(data.msg);
        } else {
            showSuccess(data.msg);

            name.attr('disabled', true);
            telephone.attr('disabled', true);
            email.attr('disabled', true);

            $('#client_id').val(data.data.id);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function addBooking()
{
    let postData   = {"booking_type": 1, "special_notes": "", "user_id": "", "session_id": "", "booking_date_time": "", "pressure_preference": "", "focus_area_preference": "", "gender_preference": "", "therapist_id": "", "notes_of_injuries": "", "massages": [], "therapies": [], "book_platform": 1},
        formInputs = $('.booking-form').serializeArray(),
        users      = [],
        inc        = 0;

    $.each(formInputs, function(key, input) {
        if (input.name == 'therapist[]') {
            postData.therapist_id = input.value;
        }

        if (input.name == 'special_notes') {
            postData.special_notes = input.value;
        }

        if (input.name == 'client_id') {
            postData.user_id = input.value;
        }

        if (input.name == 'session_type') {
            postData.session_id = input.value;
        }

        postData.booking_date_time = currentUTCTimestamps();

        if (input.name == 'pressure_preference') {
            postData.pressure_preference = input.value;
        }

        if (input.name == 'focus_preference') {
            postData.focus_area_preference = input.value;
        }

        if (input.name == 'notes_of_injuries') {
            postData.notes_of_injuries = input.value;
        }

        if (input.name == 'massage_prising_id[]') {
            postData.massages[inc] = [];

            postData.massages[inc] = {'massage_timing_id': input.value};

            inc++;
        }

        if (input.name == 'therapy_prising_id[]') {
            postData.therapies[inc] = [];

            postData.therapies[inc] = {'therapy_timing_id': input.value};

            inc++;
        }
    });

    Post(ADD_NEW_BOOKING, postData, function (res) {
        let data = res.data;

        if (data.code == EXCEPTION_CODE) {
            showError(data.msg);
        } else {
            showSuccess(data.msg);

            setTimeout(function() {
                window.location = "home-screen.html";
            }, 1000);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function getClients(searchValue)
{
    if (!searchValue) {
        return false;
    }

    searchClients(searchValue).then(
        function(response) {
            if (!response || !response.data || response.data.length <= 0) {
                // showError("No records found.");
            } else {
                let data = response.data;

                if (data.code == SUCCESS_CODE) {
                    let searchData = {};

                    $.each(data.data.data, function(k, item) {
                        searchData[item.id] = item.name + (item.surname != null && item.surname != '' ? " " + item.surname : "");
                    });

                    autoComplete(searchValue, searchData, setSelectedClient, data.data.data);
                } else {
                    showError(data.msg);
                }
            }
        },
        function(error) {
            console.log("AXIOS ERROR: ", error);
        }
    );
}

function setSelectedClient(data)
{
    let selectedClientId = $("#client_id").val();

    if (selectedClientId) {
        $.each(data, function(k, item) {
            if (item.id == selectedClientId) {
                $("#user_name").val(item.name + (item.surname != null && item.surname != '' ? " " + item.surname : ""));
                $("#user_phone").val((item.tel_number_code != '' && item.tel_number_code != null ? " " + item.tel_number_code : "") + (item.tel_number != '' && item.tel_number != null ? item.tel_number : "-"));
                $("#user_email").val(item.email);
            }
        });
    }
}
