import { Post, Get } from './networkconst.js';
import { ONGOING, WAITING, CONFIRM_BOOKING, GET_ALL_THERAPISTS, SUCCESS_CODE, ERROR_CODE, EXCEPTION_CODE, GET_ROOMS, ASSIGN_ROOMS, DOWNGRADE_BOOKING, CANCEL_BOOKING } from './networkconst.js';

$(document).ready(function () {
    // In massage center.
    GetOnGoing(1);
    GetWaiting(1);

    // Home / Hotel visit.
    GetOnGoing(2);
    GetWaiting(2);

    // Get therapists.
    getTherapists();

    // Get rooms.
    getRooms();

    // Bind header filter click events.
    bindHeaderFilterClickEvents();

    // Bind cancel booking events.
    $(document).find('.cancel-booking').on("click", function() {
        let modal        = $('#delete-modal'),
            bookingId    = modal.data('id'),
            cancelType   = $('input:radio[name="cancel_type"]:checked'),
            cancelValue  = cancelType.val().toString(),
            cancelReason = $('#cancel_reason'),
            type         = modal.data('type');

        cancelBooking(bookingId, cancelValue, cancelReason.val(), type);

        $('#delete-modal').data('id', 0).data('type', null).modal('hide');

        cancelType.prop('checked', false);

        $('input:radio[name="cancel_type"][value="0"]').prop('checked', true);

        cancelReason.val('');

        $('.reason-box').fadeOut('fast');
    });

    $('#notes-modal-static').empty();
});

function bindHeaderFilterClickEvents()
{
    $(document).find('.header_filter').change(function() {
        if ($(this).is(':checked')) {
            GetWaiting(1, {"service": $(this).val()});

            $('#service li.has-children.act a').click();

            $('#therapist li.has-children.act a').click();

            $('#room li.has-children.act a').click();

            $('#payment li.has-children.act a').click();
        }
    });

    $(document).find('.room-center ul li').find('input:radio[name="assign_room"]').on("click", function() {
        let self  = $(this),
            modal = $('#assign-rooms-modal');

        modal.modal('hide');

        if (self.is(':checked')) {
            assignRoom(modal.data('id'), self.val(), modal.data('type'));
        }
    });
}

function showNote(id)
{
    $("#notes-modal-" + id).modal('show');
}

function GetOnGoing(type)
{
    let postData = {
        "type": type
    }

    Post(ONGOING, postData, function (res) {
        if (res.data.code == SUCCESS_CODE) {
            var myArray = res.data.data;

            $( ".ongoing-" + type ).empty();
            $('#details-modal-static').empty();

            $.each( myArray, function( i, item ) {
                let serviceName  = (item.massage_name == '' || item.massage_name == null) ? item.therapy_name : item.massage_name,
                    specialNotes = (item.notes != '' && item.notes != null) ? item.notes : false;

                var newListItem = "<tr>"+
                    "<td><span class=\"user-icon\"><img src=\"images/single-user.png\" />"+
                    "</span>"+item.client_name+
                    "</td>"+
                    "<td>" + serviceName + " ("+item.massage_duration+")</td>"+
                    "<td>"+getTime(item.massage_start_time)+" -"+getTime(item.massage_end_time)+"</td>"+
                    "<td class=\"text-center\"><span class=\"th-sp orange\">" + item.therapistName + "</span></td>"+
                    "<td class=\"text-center\">"+item.roomName+"</td>"+
                    "<td class=\"text-center\">" + item.book_platform + "</td>"+
                    "<td><span class=\"pay-sp\">&#8364; 661</span><i class=\"fas fa-stop-circle\"></i><i class=\"fas fa-arrow-alt-circle-down downgrade-booking\" data-id=\"" + item.booking_massage_id + "\" data-type=\"" + type + "\"></i></td>"+
                    "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#notes-modal-" + item.booking_massage_id + "\"><i class=\"fas fa-sticky-note " + (specialNotes ? 'active' : '') + "\"></i></a></td>"+
                    "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#details-modal-" + item.booking_massage_id + "\"><i class=\"fas fa-eye\"></i></a></td>"+
                    "<td class=\"text-center\">00:00</td>"+
                "</tr>";

                $( ".ongoing-" + type ).append( newListItem );

                if (specialNotes) {
                    var notesModel = '<div class="modal fade" id="notes-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
                        notesModel += '<div class="modal-dialog modal-dialog-centered modal-lg" role="document">';
                        notesModel += '<div class="modal-content">';
                        notesModel += '<div class="modal-header">Special Notes';
                        notesModel += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
                        notesModel += '<span aria-hidden="true">&times;</span>';
                        notesModel += '</button>';
                        notesModel += '</div>';
                        notesModel += '<div class="modal-body">' + specialNotes + '</div>';
                        notesModel += '</div></div></div></div>';

                    $('#notes-modal-static').append(notesModel);
                }

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
                            detailsModel += '<td>' + getDate(item.massage_date) + '</td>';
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

            $(document).find('.downgrade-booking').on("click", function() {
                let self = $(this);

                confirm("Are you sure want to downgrade this booking ?", downgradeBooking, [self.data('id'), self.data('type')], $(this));
            });

        } else {
            showError(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function GetWaiting(type, filter)
{
    let postData = {
        "type": type
    }

    if (typeof filter == 'object') {
        Object.entries(filter).forEach(([key,value]) => { postData[key] = value })
    }

    Post(WAITING, postData, function (res) {
        if (res.data.code == SUCCESS_CODE) {

            var myArray = res.data.data;

            $( ".waiting-" + type ).empty();
            $('#details-modal-static').empty();

            $.each( myArray, function( i, item ) {
                
                var therapistName="";
                var therapistRoom="";

                let specialNotes = (item.notes != '' && item.notes != null) ? item.notes : false;

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
                    "<td class=\"text-center\"><span>" + (item.roomName ? item.roomName : '<span class="as-room"><a href="#" class="open-model" data-target="#assign-rooms-modal" data-id="' + item.booking_massage_id + '" data-type="' + type + '">00</a></span>') + "</span></td>"+
                    "<td class=\"text-center\">"+item.book_platform+"</td>"+
                    "<td><span class=\"pay-sp\">€ 661</span><i class=\"fas fa-play-circle\"></i></td>"+
                    "<td class=\"text-center orange\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#notes-modal-" + item.booking_massage_id + "\"><i class=\"fas fa-sticky-note " + (specialNotes ? 'active' : '') + "\"></i></a></td>"+
                    "<td class=\"text-center\"><i class=\"fas fa-edit\"></i></td>"+
                    "<td class=\"text-center\"><a href=\"#\" class=\"open-model\" data-target=\"#delete-modal\" data-id=\"" + item.booking_id + "\" data-type=\"" + type + "\"><i class=\"far fa-trash-alt\"></i></a></td>"+
                    "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#details-modal-" + item.booking_massage_id + "\"><i class=\"fas fa-eye\"></i></a></td>"+
                    "<td class=\"text-center\"><a href=\"#\" data-toggle=\"modal\" data-target=\"#print-modal\"><i class=\"fas fa-print\"></i></a></td>"+
                    "<td><span class=\"confirm\"><input type=\"checkbox\" name=\"confirm_booking\" class=\"confirm_booking\" value=\"" + item.booking_massage_id + "\" data-type=\"" + type + "\"/><label></label></span></td>"+
                "</tr>";
             
                $( ".waiting-" + type ).append( newListItem );

                $('.confirm_booking').unbind().change(function() {
                    if (this.checked) {
                        let bookingMassageId = $(this).val(),
                            type             = $(this).data('type');

                        confirm("Are you sure want to confirm this booking ?", confirmBookingMassage, [bookingMassageId, type], $(this));
                    }

                    return false;
                });

                if (specialNotes) {
                    var notesModel = '<div class="modal fade" id="notes-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
                        notesModel += '<div class="modal-dialog modal-dialog-centered modal-lg" role="document">';
                        notesModel += '<div class="modal-content">';
                        notesModel += '<div class="modal-header">Special Notes';
                        notesModel += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
                        notesModel += '<span aria-hidden="true">&times;</span>';
                        notesModel += '</button>';
                        notesModel += '</div>';
                        notesModel += '<div class="modal-body">' + item.notes + '</div>';
                        notesModel += '</div></div></div></div>';

                    $('#notes-modal-static').append(notesModel);
                }

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
                            detailsModel += '<td>' + getDate(item.massage_date) + '</td>';
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

            $(document).find(".open-model").on("click", function() {
                $($(this).data('target')).attr('data-id', $(this).data('id'));

                $($(this).data('target')).attr('data-type', $(this).data('type'));

                $($(this).data('target')).modal('show');
            });


        } else {
            showError(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function confirmBookingMassage(bookingMassageId, type)
{
    let postData = {
        "booking_massage_id": bookingMassageId
    };

    Post(CONFIRM_BOOKING, postData, function (res) {
        let data = res.data;

        if (data.code == ERROR_CODE) {
            showError(data.msg);
        } else {
            // window.location = "waiting-booking.html";

            GetOnGoing(type);
            GetWaiting(type);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function getTherapists()
{
    let postData = {};

    Post(GET_ALL_THERAPISTS, postData, function (res) {
        let data = res.data;

        if (data.code == ERROR_CODE) {
            showError(data.msg);
        } else {
            let liHtml = "";

            $.each(data.data, function(key, item) {
                liHtml += '<li><input type="radio" name="filter_therapist" class="header_filter" value="' + key + '"/><label>' + item + '</label></li>';
            });

            let dropdownElement = $('#therapist li ul');

            dropdownElement.empty();
            dropdownElement.html(liHtml);

            bindHeaderFilterClickEvents();
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function getRooms()
{
    let postData = {};

    Post(GET_ROOMS, postData, function (res) {
        let data = res.data;

        if (data.code == ERROR_CODE) {
            showError(data.msg);
        } else {
            let liHtml            = "",
                liAssignRoomHtml  = "";

            $.each(data.data, function(key, item) {
                liHtml += '<li><input type="radio" name="filter_room" class="header_filter" value="' + key + '"/><label>' + item + '</label></li>';

                liAssignRoomHtml += '<li><input type="radio" name="assign_room" value="' + key + '"/><label>' + item + '</label></li>';
            });

            let dropdownElement   = $('#room li ul'),
                roomAssignElement = $('.room-center ul');

            dropdownElement.empty();
            dropdownElement.html(liHtml);

            roomAssignElement.empty();
            roomAssignElement.html(liAssignRoomHtml);

            bindHeaderFilterClickEvents();
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function assignRoom(bookingMassageId, roomId, type)
{
    let postData = {
        "booking_massage_id": bookingMassageId,
        "room_id": roomId
    };

    Post(ASSIGN_ROOMS, postData, function (res) {
        let data = res.data;

        if (data.code == ERROR_CODE) {
            showError(data.msg);
        } else {
            // showSuccess(data.msg);

            GetOnGoing(type);
            GetWaiting(type);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function downgradeBooking(bookingMassageId, type)
{
    let postData = {
        "booking_massage_id": bookingMassageId
    };

    Post(DOWNGRADE_BOOKING, postData, function (res) {
        let data = res.data;

        if (data.code == ERROR_CODE) {
            showError(data.msg);
        } else {
            // showSuccess(data.msg);

            GetOnGoing(type);
            GetWaiting(type);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function cancelBooking(bookingId, cancelType, cancelReason, type)
{
    let postData = {
        "booking_id": bookingId,
        "cancel_type": cancelType,
        "cancelled_reason": cancelReason
    }

    Post(CANCEL_BOOKING, postData, function (res) {
        let data = res.data;

        if (data.code == ERROR_CODE) {
            showError(data.msg);
        } else {
            // showSuccess(data.msg);

            GetOnGoing(type);
            GetWaiting(type);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}
