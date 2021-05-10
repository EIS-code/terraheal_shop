
import { Post, Get } from './networkconst.js';
import { THERAPISTS, SERVICES, PREFERENCES, SESSIONS, ADD_CLIENT, ADD_NEW_BOOKING } from './networkconst.js';

$(document).ready(function () {
    var userData = localStorage.getItem("userData");

    let user = JSON.parse(userData);
    getTherapists(user);
    getServices(user);
    getPreferences(user);

    $(".addGuest").on("click", function() {
        addClient(user);
    });

    $('#alert').on('hidden.bs.modal', function () {
        $('.alert-primary').html('').addClass('d-none');
        $('.alert-secondary').html('').addClass('d-none');
        $('.alert-danger').html('').addClass('d-none');
        $('.alert-warning').html('').addClass('d-none');
        $('.alert-info').html('').addClass('d-none');
        $('.alert-light').html('').addClass('d-none');
        $('.alert-dark').html('').addClass('d-none');
    });

    $(".checkout").on("click", function() {
        addBooking(user);
    });
});

function getServices(user){
    let postData = {
        "type": 0,
        "shop_id": user.id
    }

    Post(SERVICES, postData, function (res) {
        if (res.data.code == 200) {

            // console.log("RESPONSE RECEIVED: ", res.data);
            // console.log("RESPONSE RECEIVED: ", res.data.code);

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
                        setSelectService(this.value, 0);
                    } else {
                        removeSelectService(this.value, 0);
                    }
                }
            });

        } else {
            alert(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });

    postData = {
        "type": 1,
        "shop_id": user.id
    }

    Post(SERVICES, postData, function (res) {
        if (res.data.code == 200) {

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
                        setSelectService(this.value, 1);
                    } else {
                        removeSelectService(this.value, 1);
                    }
                }
            });

        } else {
            alert(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}


function setSelectService(service, type){
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

    var newListItem = "<div class=\"col-md-3 service_info\">"+
        "<div class=\"msg-right\">"+
            "<figure>"+
                "<img src=\"images/msl1.png\" alt=\"\"/>"+
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

    $( "#fragment-2 .wh-content .service_info" ).remove();
    $( "#fragment-2 .wh-content .row" ).append(newListItem);

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

function removeSelectService(service, type)
{
    var isShow = false,
        data   = type == 1 ? JSON.parse(window.localStorage.getItem('therapies')) : JSON.parse(window.localStorage.getItem('massages'));

    $('.select-input_service').each(function(key, checkbox) {
        if (this.checked) {
            isShow  = true;
            service = this.value;

            return true;
        }
    });

    if (!isShow) {
        $( "#fragment-2 .wh-content .service_info" ).remove();
    } else {
        setSelectService(service, data);
    }
}

function getTherapists(user){
    let postData = {
        "shop_id": user.id
    }

    Post(THERAPISTS, postData, function (res) {
        if (res.data.code == 200) {

            // console.log("RESPONSE RECEIVED: ", res.data);
            // console.log("RESPONSE RECEIVED: ", res.data.code);

            var myArray=res.data.data

            $.each( myArray, function( i, item ) {
                
 
                var newListItem = "<li>" + "<input class=\"select-input\" type=\"checkbox\" name=\"therapist[]\" value=\"" + item.id + "\" />"+
                "<div class=\"sl-cont\">"+
                "<span class=\"name\">"+item.name+"</span>"+
                "<div class=\"th-image\">"+
                "<img src="+item.profile_photo+" alt=\"\"/>"+
                "</div>"+
                "<div class=\"avail\">Now</div>"+
                "</div>"+ "</li>";
             
                $( ".grid" ).append( newListItem );
             
            });

        } else {
            alert(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function getPreferences(shop)
{
    let postData = {
        "shop_id": shop.id,
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
            }
        );
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });

    postData = {
        "shop_id": shop.id
    };

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
        });
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });

    postData = {
        "shop_id": shop.id,
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
        });
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function addClient(shop)
{
    let name      = $('#guest_name'),
        telephone = $('#guest_telephone'),
        email     = $('#guest_email'),
        postData  = {
            "shop_id": shop.id,
            "name": name.val(),
            "email": email.val(),
            "tel_number": telephone.val()
        };

    Post(ADD_CLIENT, postData, function (res) {
        let data = res.data;

        if (data.code == 401) {
            $('.alert-danger').removeClass('d-none').html(data.msg);

            $('#alert').modal('show');
        } else {
            $('.alert-success').removeClass('d-none').html(data.msg);

            $('#alert').modal('show');

            name.attr('disabled', true);
            telephone.attr('disabled', true);
            email.attr('disabled', true);

            $('#client_id').val(data.data.id);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function addBooking(shop)
{
    let postData   = {"shop_id": shop.id, "booking_type": 1, "special_notes": "", "user_id": "", "session_id": "", "booking_date_time": "", "pressure_preference": "", "focus_area_preference": "", "gender_preference": "", "therapist_id": "", "notes_of_injuries": "", "massages": [], "therapies": []},
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

        if (data.code == 401) {
            $('.alert-danger').removeClass('d-none').html(data.msg);

            $('#alert').modal('show');
        } else {
            $('.alert-success').removeClass('d-none').html(data.msg);

            $('#alert').modal('show');

            setTimeout(function() {
                window.location = "home-screen.html";
            }, 1000);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}
