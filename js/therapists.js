
import { Post} from './networkconst.js';
import { THERAPISTS, SERVICES} from './networkconst.js';

$(document).ready(function () {
    var userData = localStorage.getItem("userData")
    console.log("userData", userData)

    let user=JSON.parse(userData)
    getTherapists(user)
    getServices(user)

});

function getServices(user){
    let postData = {
        "shop_id": user.id
    }

    Post(SERVICES, postData, function (res) {
        if (res.data.code == 200) {

            console.log("RESPONSE RECEIVED: ", res.data);
            console.log("RESPONSE RECEIVED: ", res.data.code);

            var myArray=res.data.data.data

            $.each( myArray, function( i, item ) {
                
                var sValue=JSON.stringify(item);
                
                console.log("items",sValue);

                var newListItem = "<li>" + "<input class=\"select-input_service\" type=\"radio\" name=\"radio1\" value="+sValue+" data-correct-answer="+sValue+"/>"+
                "<div class=\"sl-cont\">"+
                "<div class=\"th-image msg-img\">"+
                "<img src="+item.icon+" alt=\"test\"/>"+
                "</div>"+
                "<span class=\"msg-name\">"+item.name+"</span>"+
                "</div>"+ "</li>";
             
                $( ".grid_service" ).append( newListItem );
                
            });

            $('.select-input_service').click(function(e) { 
                var isCorrect = $('.select-input_service').data('correct-answer');
                console.log("Resonse",isCorrect);
                // if(this.value!=null)
                // setSelectService(this.value)
            });

        } else {
            alert(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}


function setSelectService(service){
    
    console.log("response",service);
    
    var selectService=JSON.parse(service);

    var newListItem="<div class=\"col-md-3\">"+
        "<div class=\"msg-right\">"+
            "<figure>"+
                "<img src=\"images/msl1.png\" alt=\"\"/>"+
            "</figure>"+
            "<div class=\"ms-content\">"+
                "<h3>"+selectService.name+"</h3>"+
                "<div class=\"d-flex justify-content-between\">"+
                "<span>Duration</span>"+
                "<span>Price</span>"+
                "</div>"+
                "<ul>"+
                    "<li><span class=\"durtn\">20 min</span><span class=\"line-hr\"></span><span class=\"price\"><small>&#8364;</small>25</span></li>"+
                    "<li><span class=\"durtn\">30 min</span><span class=\"line-hr\"></span><span class=\"price\"><small>&#8364;</small>35</span></li>"+
                    "<li><span class=\"durtn\">45 min</span><span class=\"line-hr\"></span><span class=\"price\"><small>&#8364;</small>50</span></li>"+
                    "<li><span class=\"durtn\">60 min</span><span class=\"line-hr\"></span><span class=\"price\"><small>&#8364;</small>60</span></li>"+
                    "<li><span class=\"durtn\">90 min</span><span class=\"line-hr\"></span><span class=\"price\"><small>&#8364;</small>75</span></li>"+
                "</ul>"+
            "</div>"+
        "</div>"+
    "</div>";

    $( ".row" ).append(newListItem);
}

function getTherapists(user){
    let postData = {
        "shop_id": user.id
    }

    Post(THERAPISTS, postData, function (res) {
        if (res.data.code == 200) {

            console.log("RESPONSE RECEIVED: ", res.data);
            console.log("RESPONSE RECEIVED: ", res.data.code);

            var myArray=res.data.data

            $.each( myArray, function( i, item ) {
                
 
                var newListItem = "<li>" + "<input class=\"select-input\" type=\"radio\" name=\"radio1\"/>"+
                "<div class=\"sl-cont\">"+
                "<span class=\"name\">"+item.name+"</span>"+
                "<div class=\"th-image\">"+
                "<img src="+item.profile_photo+" alt=\"test\"/>"+
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