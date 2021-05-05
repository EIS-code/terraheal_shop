import { Post} from './networkconst.js';
import { ONGOING,WAITING} from './networkconst.js';

$(document).ready(function () {
    var userData = localStorage.getItem("userData")
    console.log("userData", userData)

    let user=JSON.parse(userData)

    GetOnGoing(user)
    GetWaiting(user)
    
});


function getTime(unix_timestamp){
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

function GetOnGoing(user){
    let postData = {
        "shop_id": user.id
    }
    Post(ONGOING, postData, function (res) {
        if (res.data.code == 200) {

            console.log("RESPONSE RECEIVED: ", res.data.data);
            console.log("RESPONSE RECEIVED: ", res.data.code);

            var myArray=res.data.data

            $.each( myArray, function( i, item ) {
                
 
                var newListItem = "<tr>"+
                "<td><span class=\"user-icon\"><img src=\"images/single-user.png\" />"+
                "</span>"+item.client_name+"<span class=\"bib\">"+
                "<img src=\"images/bib.png\" /></span></td>"+
                "<td>Hot Yoga Massage ("+item.massage_duration+")</td>"+
                "<td>"+getTime(item.massage_start_time)+" -"+getTime(item.massage_end_time)+"</td>"+
                "<td class=\"text-center\"><span class=\"th-sp orange\">Rita</span></td>"+
                "<td class=\"text-center\">"+item.roomName+"</td>"+
                "<td class=\"text-center\">App</td>"+
                "<td><span class=\"pay-sp\">&#8364; 661</span><i class=\"fas fa-stop-circle\"></i><i class=\"fas fa-arrow-alt-circle-down\"></i></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#notes-modal\"><i class=\"fas fa-sticky-note\"></i></a></td>"+
                "<td class=\"text-center\"><i class=\"fas fa-edit\"></i></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#delete-modal\"><i class=\"far fa-trash-alt\"></i></a></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#detail-modal\"><i class=\"fas fa-eye\"></i></a></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#print-modal\"><i class=\"fas fa-print\"></i></a></td>"+
                "</tr>";
             
                $( ".ongoing" ).append( newListItem );
             
            });


        } else {
            alert(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}


function showNote(){
    $(".obs-inner").append("<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>")
}

function GetWaiting(user){
    let postData = {
        "shop_id": user.id
    }
    Post(WAITING, postData, function (res) {
        if (res.data.code == 200) {

            console.log("RESPONSE RECEIVED: ", res.data.data);
            console.log("RESPONSE RECEIVED: ", res.data.code);

            var myArray=res.data.data

            $.each( myArray, function( i, item ) {
                
               var therapistName="";
               var therapistRoom=""; 
               
               if(item.therapistName==null){
                   therapistName="<td class=\"text-center\"><span class=\"th-sp\"><span class=\"ed-icon\"><a href=\"therapist-all.html\"><img src=\"images/edit-icon.png\" alt=\"\"/></a></span></span></td>" 
               }else{
                therapistName="<td class=\"text-center\"><span class=\"th-sp\">"+item.therapistName+"<span class=\"ed-icon\"></span></span></td>" 
               }
 
                var newListItem = "<tr>"+
                "<td><span class=\"user-icon\"><img src=\"images/double-user.png\" /></span>"+item.client_name+"</td>"+
                "<td>Hot Yoga Massage ("+item.massage_duration+")</td>"+
                "<td>"+getTime(item.massage_start_time)+" -"+getTime(item.massage_end_time)+"</td>"+
                therapistName+
                "<td class=\"text-center\"><span>"+item.roomName+"</span></td>"+
                "<td class=\"text-center\">"+item.book_platform+"</td>"+
                "<td><span class=\"pay-sp bg-orange\">&#8364; 661</span><i class=\"fas fa-play-circle\"></i><i class=\"fas fa-arrow-alt-circle-down\"></i></td>"+
                "<td class=\"text-center orange\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#notes-modal\"><i class=\"fas fa-sticky-note\"></i></a></td>"+
                "<td class=\"text-center\"><i class=\"fas fa-edit\"></i></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#delete-modal\"><i class=\"far fa-trash-alt\"></i></a></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#detail-modal\"><i class=\"fas fa-eye\"></i></a></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#print-modal\"><i class=\"fas fa-print\"></i></a></td>"+
                "<td><span class=\"confirm\"></span></td>"+
            "</tr>";
             
                $( ".waiting" ).append( newListItem );
             
            });


        } else {
            alert(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}