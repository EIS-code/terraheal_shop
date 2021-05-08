
import { Post} from './networkconst.js';
import { THERAPISTS, SERVICES, PREFERENCES } from './networkconst.js';

$(document).ready(function () {
    var userData = localStorage.getItem("userData");

    let user = JSON.parse(userData);
    getTherapists(user);
    getServices(user);
    getPreferences(user);
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
                
                var newListItem = "<li>" + "<input class=\"select-input_service\" type=\"checkbox\" name=\"massages[" + item.id + "]\" value="+item.id+">"+
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
                
                var newListItem = "<li>" + "<input class=\"select-input_service\" type=\"checkbox\" name=\"therapies[" + item.id + "]\" value="+item.id+">"+
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

    var data = type == 1 ? JSON.parse(window.localStorage.getItem('therapies')) : JSON.parse(window.localStorage.getItem('massages'));

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

        liHtml += "<li><span class=\"durtn\">" + duration + " min</span><span class=\"line-hr\"></span><span class=\"price\"><small>&#8364;</small>" + price + "</span></li>";
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

    $( ".wh-content .service_info" ).remove();
    $( ".wh-content .row" ).append(newListItem);
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
        $( ".wh-content .service_info" ).remove();
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
                
 
                var newListItem = "<li>" + "<input class=\"select-input\" type=\"checkbox\" name=\"therapist["+ item.id +"]\" value=\"" + item.id + "\" />"+
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
                modelHtml += "<li><input class='select-input' type='radio' name='focus_preferences[" + row.id + "]' value='" + row.id + "' /><div class='pf-bx'><img src='" + row.icon + "' alt='' /><span class='pf-abs'>" + row.name + "</span></div></li>";
            });

            modelHtml += "</ul></div>";

            modelBody.html("");
            modelBody.html(modelHtml);
        }
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
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}
