import { Post, Get } from './networkconst.js';
import { ONGOING, WAITING, CONFIRM_BOOKING } from './networkconst.js';

$(document).ready(function () {
    var userData = localStorage.getItem("userData");
    console.log("userData", userData);

    let user = JSON.parse(userData);

    // In massage center.
    GetOnGoing(user, 1);
    GetWaiting(user, 1);

    // Home / Hotel visit.
    GetOnGoing(user, 2);
    GetWaiting(user, 2);

    // Alerts
    $('#alert').on('hidden.bs.modal', function () {
        $('.alert-primary').html('').addClass('d-none');
        $('.alert-secondary').html('').addClass('d-none');
        $('.alert-danger').html('').addClass('d-none');
        $('.alert-warning').html('').addClass('d-none');
        $('.alert-info').html('').addClass('d-none');
        $('.alert-light').html('').addClass('d-none');
        $('.alert-dark').html('').addClass('d-none');
    });
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

function showNote(id)
{
    // $(".obs-inner").append("<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>")
    $("#notes-modal-" + id).modal('show');
}

function GetOnGoing(user, type){
    let postData = {
        "shop_id": user.id,
        "type": type
    }
    Post(ONGOING, postData, function (res) {
        if (res.data.code == 200) {

            console.log("RESPONSE OnGoing ", res.data.data);
            console.log("RESPONSE RECEIVED: ", res.data.code);

            var myArray = res.data.data;

            $( ".ongoing-" + type ).empty();
            $('#notes-modal-static').empty();
            $('#details-modal-static').empty();

            $.each( myArray, function( i, item ) {
                let serviceName = (item.massage_name == '' || item.massage_name == null) ? item.therapy_name : item.massage_name;
 
                var newListItem = "<tr>"+
                "<td><span class=\"user-icon\"><img src=\"images/single-user.png\" />"+
                "</span>"+item.client_name+
                "</td>"+
                "<td>" + serviceName + " ("+item.massage_duration+")</td>"+
                "<td>"+getTime(item.massage_start_time)+" -"+getTime(item.massage_end_time)+"</td>"+
                "<td class=\"text-center\"><span class=\"th-sp orange\">" + item.therapistName + "</span></td>"+
                "<td class=\"text-center\">"+item.roomName+"</td>"+
                "<td class=\"text-center\">App</td>"+
                "<td><span class=\"pay-sp\">&#8364; 661</span><i class=\"fas fa-stop-circle\"></i><i class=\"fas fa-arrow-alt-circle-down\"></i></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#notes-modal-" + item.booking_massage_id + "\"><i class=\"fas fa-sticky-note\"></i></a></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#details-modal-" + item.booking_massage_id + "\"><i class=\"fas fa-eye\"></i></a></td>"+
                "<td class=\"text-center\">00:00</td>"+
                "</tr>";

                $( ".ongoing-" + type ).append( newListItem );

                var notesModel = '<div class="modal fade" id="notes-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
                notesModel += '<div class="modal-dialog modal-dialog-centered modal-lg" role="document">';
                notesModel += '<div class="modal-content">';
                notesModel += '<div class="modal-header">Notes';
                notesModel += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
                notesModel += '<span aria-hidden="true">&times;</span>';
                notesModel += '</button>';
                notesModel += '</div>';
                notesModel += '<div class="modal-body">' + item.notes + '</div>';
                notesModel += '</div></div></div></div>';

                $('#notes-modal-static').append(notesModel);

                var detailsModel = '<div class="modal fade" id="details-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
                detailsModel += '<div class="modal-dialog modal-dialog-centered" role="document">';
                detailsModel += '<div class="modal-content">';
                detailsModel += '<div class="modal-header">Booking ' + item.booking_id;
                detailsModel += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                detailsModel += '</div>';
                detailsModel += '<div class="modal-body">';
                    detailsModel += '<div class="details-inner">';
                    detailsModel += '<div class="d-flex justify-content-between"><a href="#" class="cmn-btn">Start</a><a href="#" class="cmn-btn" data-toggle="modal" data-target="#rating-modal">Finished</a></div>';
                    detailsModel += '<div class="modal-details"><table width="100%" cellpadding="0" cellspacing="0">';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Pressure Preference</td>';
                        detailsModel += '<td>' + item.pressure_preference + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Focus Areas</td>';
                        detailsModel += '<td>' + item.focus_area + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Therapist preference</td>';
                        detailsModel += '<td>' + item.genderPreference + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Any Injury or Physical Condition ?</td>';
                        detailsModel += '<td>' + item.injuries + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Booking Date</td>';
                        detailsModel += '<td>' + item.massage_date + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Booking Time</td>';
                        detailsModel += '<td>' + getTime(item.massage_date) + '</td>';
                    detailsModel += '</tr>';
                detailsModel += '</table>';
                detailsModel += '</div>';
                detailsModel += '</div></div></div></div></div>';

                $('#details-modal-static').append(detailsModel);
            });

        } else {
            alert(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function GetWaiting(user, type){
    let postData = {
        "shop_id": user.id,
        "type": type
    }
    Post(WAITING, postData, function (res) {
        if (res.data.code == 200) {

            console.log("RESPONSE RECEIVED: ", res.data.data);
            console.log("RESPONSE RECEIVED: ", res.data.code);

            var myArray = res.data.data;

            $( ".waiting-" + type ).empty();
            $('#notes-modal-static').empty();
            $('#details-modal-static').empty();

            $.each( myArray, function( i, item ) {
                
                var therapistName="";
                var therapistRoom=""; 
               
                if (item.therapistName == null || item.therapistName == '') {
                    therapistName="<td class=\"text-center\"><span class=\"th-sp\"><span class=\"ed-icon\"><a href=\"therapist-all.html\"><img src=\"images/girl.png\" alt=\"\"/></a></span></span></td>" 
                } else {
                    therapistName="<td class=\"text-center\"><span class=\"th-sp\">"+item.therapistName+"<span class=\"ed-icon\"></span></span></td>" 
                }

                let serviceName = (item.massage_name == '' || item.massage_name == null) ? item.therapy_name : item.massage_name;
 
                var newListItem = "<tr>"+
                "<td><span class=\"user-icon\"><img src=\"images/double-user.png\" /></span>"+item.client_name+"</td>"+
                "<td>" + serviceName + " ("+item.massage_duration+")</td>"+
                "<td>"+getTime(item.massage_start_time)+" -"+getTime(item.massage_end_time)+"</td>"+
                therapistName+
                "<td class=\"text-center\"><span>" + (item.roomName ? item.roomName : '<span class="as-room"><a href="#" data-toggle="modal" data-target="#assign-room-modal">Assign Room</a></span>') + "</span></td>"+
                "<td class=\"text-center\">"+item.book_platform+"</td>"+
                "<td class=\"text-center orange\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#notes-modal-" + item.booking_massage_id + "\"><i class=\"fas fa-sticky-note\"></i></a></td>"+
                "<td class=\"text-center\"><i class=\"fas fa-edit\"></i></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#delete-modal\"><i class=\"far fa-trash-alt\"></i></a></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#details-modal-" + item.booking_massage_id + "\"><i class=\"fas fa-eye\"></i></a></td>"+
                "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#print-modal\"><i class=\"fas fa-print\"></i></a></td>"+
                "<td><span class=\"confirm\"><input type=\"checkbox\" name=\"confirm_booking\" class=\"confirm_booking\" value=\"" + item.booking_massage_id + "\"/><label></label></span></td>"+
            "</tr>";
             
                $( ".waiting-" + type ).append( newListItem );

                $('.confirm_booking').unbind().change(function() {
                    if (this.checked) {
                        let isConfirm = confirm("Are you sure want to confirm this booking ?");

                        if (isConfirm === true) {
                            let bookingMassageId = $(this).val();

                            confirmBookingMassage(bookingMassageId);
                        }
                    }

                    return false;
                });

                var notesModel = '<div class="modal fade" id="notes-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
                notesModel += '<div class="modal-dialog modal-dialog-centered modal-lg" role="document">';
                notesModel += '<div class="modal-content">';
                notesModel += '<div class="modal-header">Notes';
                notesModel += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
                notesModel += '<span aria-hidden="true">&times;</span>';
                notesModel += '</button>';
                notesModel += '</div>';
                notesModel += '<div class="modal-body">' + item.notes + '</div>';
                notesModel += '</div></div></div></div>';

                $('#notes-modal-static').append(notesModel);

                var detailsModel = '<div class="modal fade" id="details-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
                detailsModel += '<div class="modal-dialog modal-dialog-centered" role="document">';
                detailsModel += '<div class="modal-content">';
                detailsModel += '<div class="modal-header">Booking ' + item.booking_id;
                detailsModel += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                detailsModel += '</div>';
                detailsModel += '<div class="modal-body">';
                    detailsModel += '<div class="details-inner">';
                    detailsModel += '<div class="d-flex justify-content-between"><a href="#" class="cmn-btn">Start</a><a href="#" class="cmn-btn" data-toggle="modal" data-target="#rating-modal">Finished</a></div>';
                    detailsModel += '<div class="modal-details"><table width="100%" cellpadding="0" cellspacing="0">';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Pressure Preference</td>';
                        detailsModel += '<td>' + item.pressure_preference + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Focus Areas</td>';
                        detailsModel += '<td>' + item.focus_area + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Therapist preference</td>';
                        detailsModel += '<td>' + item.genderPreference + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Any Injury or Physical Condition ?</td>';
                        detailsModel += '<td>' + item.injuries + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Booking Date</td>';
                        detailsModel += '<td>' + item.massage_date + '</td>';
                    detailsModel += '</tr>';
                    detailsModel += '<tr>';
                        detailsModel += '<td>Booking Time</td>';
                        detailsModel += '<td>' + getTime(item.massage_date) + '</td>';
                    detailsModel += '</tr>';
                detailsModel += '</table>';
                detailsModel += '</div>';
                detailsModel += '</div></div></div></div></div>';

                $('#details-modal-static').append(detailsModel);
             
            });


        } else {
            alert(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function confirmBookingMassage(bookingMassageId)
{
    let userData = localStorage.getItem("userData"),
        user     = JSON.parse(userData);

    let postData = {
        "shop_id": user.id,
        "booking_massage_id": bookingMassageId
    }

    Post(CONFIRM_BOOKING, postData, function (res) {
        let data = res.data;

        if (data.code == 401) {
            $('.alert-danger').removeClass('d-none').html(data.msg);

            $('#alert').modal('show');
        } else {
            // window.location = "waiting-center-booking.html";

            // In massage center.
            GetOnGoing(user, 1);
            GetWaiting(user, 1);

            // Home / Hotel visit.
            GetOnGoing(user, 2);
            GetWaiting(user, 2);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}
