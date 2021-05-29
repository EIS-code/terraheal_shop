
import { Post, Get, SUCCESS_CODE, ERROR_CODE, EXCEPTION_CODE } from './networkconst.js';
import { GET_ALL_THERAPISTS, GET_ROOMS, CONFIRM_BOOKING, CANCEL_BOOKING, DOWNGRADE_BOOKING, FUTURE_BOOKINGS, COMPLETED_BOOKINGS, CANCELED_BOOKINGS } from './networkconst.js';

var hash       = window.location.hash || '#future-bookings',
    centerType = 1,
    homeType   = 2,
    type       = centerType;

// 1 : In massage center. 2 : Home / Hotel visit.

$(document).ready(function () {
    setType();

    // Get therapists.
    getTherapists();

    // Get rooms.
    getRooms();

    $(document).find('#book-wait-tabs').find('ul').find('a').on("click", function() {
        hash = $(this).attr('href');

        if (hash == '#future-bookings') {
            getFutureBookings();
        } else if (hash == '#completed-bookings') {
            getCompletedBookings();
        } else if (hash == '#canceled-bookings') {
            getCancelledBookings();
        }

        bindEvents();
    });

    loadDatas();
});

function loadDatas()
{
    $(document).find('#book-wait-tabs').find('a[href="' + hash + '"]').click();
}

function setType()
{
    $('#waiting-tabs').find('a').each(function() {
        let self = $(this);

        if (self.hasClass('active')) {
            if (self.attr('id') == 'home_bookings') {
                type = homeType;
            } else {
                type = centerType;
            }
        }
    });
}

function bindEvents()
{
    $(document).find('#center_bookings').unbind().on("click", function() {
        $('#waiting-tabs').find('a').toggleClass('active');

        setType();

        clearFilters();

        if (hash) {
            if (hash == '#future-bookings') {
                getFutureBookings();
            } else if (hash == '#completed-bookings') {
                getCompletedBookings();
            } else if (hash == '#canceled-bookings') {
                getCancelledBookings();
            }
        }
    });

    $(document).find('#home_bookings').unbind().on("click", function() {
        $('#waiting-tabs').find('a').toggleClass('active');

        setType();

        clearFilters();

        if (hash) {
            if (hash == '#future-bookings') {
                getFutureBookings();
            } else if (hash == '#completed-bookings') {
                getCompletedBookings();
            } else if (hash == '#canceled-bookings') {
                getCancelledBookings();
            }
        }
    });

    // Bind cancel booking events.
    $(document).find('.cancel-booking').unbind().on("click", function() {
        let modal        = $('#delete-modal'),
            bookingId    = modal.attr('data-id'),
            cancelType   = $('input:radio[name="cancel_type"]:checked'),
            cancelValue  = cancelType.val().toString(),
            cancelReason = $('#cancel_reason');

        cancelBooking(bookingId, cancelValue, cancelReason.val());

        $('#delete-modal').data('id', 0).data('type', null).modal('hide');

        cancelType.prop('checked', false);

        $('input:radio[name="cancel_type"][value="0"]').prop('checked', true);

        cancelReason.val('');

        $('.reason-box').fadeOut('fast');
    });

    $(document).find(".open-model").on("click", function() {
        $($(this).data('target')).attr('data-id', $(this).data('id'));

        $($(this).data('target')).modal('show');
    });

    $(document).find('.header_filter').unbind().change(function() {
        if ($(this).is(':checked')) {
            $('#date-future, #date-completed, #date-canceled').find('li.has-children.act a').click();

            $('#service-future, #service-completed, #service-canceled').find('li.has-children.act a').click();

            $('#therapist-future, #therapist-completed, #therapist-canceled').find('li.has-children.act a').click();

            $('#room-future, #room-completed, #room-canceled').find('li.has-children.act a').click();

            $('#payment-future, #payment-completed, #payment-canceled').find('li.has-children.act a').click();

            loadDatas();
        }
    });

    if (hash) {
        $(document).find('#center_bookings').attr('href', hash);
        $(document).find('#home_bookings').attr('href', hash);

        window.location.hash = hash;
    }
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

            let dropdownElement = $('#therapist-future, #therapist-completed, #therapist-canceled').find('li ul');

            dropdownElement.empty();
            dropdownElement.html(liHtml);
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
            let liHtml = "";

            $.each(data.data, function(key, item) {
                liHtml += '<li><input type="radio" name="filter_room" class="header_filter" value="' + key + '"/><label>' + item + '</label></li>';
            });

            let dropdownElement = $('#room-future, #room-completed, #room-canceled').find('li ul');

            dropdownElement.empty();
            dropdownElement.html(liHtml);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function cancelBooking(bookingId, cancelType, cancelReason)
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
            loadDatas();
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function confirmBookingMassage(bookingMassageId)
{
    let postData = {
        "booking_massage_id": bookingMassageId
    };

    Post(CONFIRM_BOOKING, postData, function (res) {
        let data = res.data;

        if (data.code == ERROR_CODE) {
            showError(data.msg);
        } else {
            loadDatas();
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function downgradeBooking(bookingMassageId)
{
    let postData = {
        "booking_massage_id": bookingMassageId
    };

    Post(DOWNGRADE_BOOKING, postData, function (res) {
        let data = res.data;

        if (data.code == ERROR_CODE) {
            showError(data.msg);
        } else {
            loadDatas();
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function clearFilters()
{
    $(document).find('form#form-booking-list').find("input[type=text], textarea").val("");

    $(document).find('form#form-booking-list').find("input[type=password]").val("");

    $(document).find('form#form-booking-list').find("input[type=checkbox]").prop('checked', false);

    $(document).find('form#form-booking-list').find('#date-future, #date-completed, #date-canceled').find('input:radio[name="filter_date"]:checked').prop('checked', false);

    $(document).find('form#form-booking-list').find('#service-future, #service-completed, #service-canceled').find('input:radio[name="filter_services"]:checked').prop('checked', false);

    $(document).find('form#form-booking-list').find('#therapist-future, #therapist-completed, #therapist-canceled').find('input:radio[name="filter_therapist"]:checked').prop('checked', false);

    $(document).find('form#form-booking-list').find('#room-future, #room-completed, #room-canceled').find('input:radio[name="filter_room"]:checked').prop('checked', false);

    $(document).find('form#form-booking-list').find('#payment-future, #payment-completed, #payment-canceled').find('input:radio[name="filter_payment"]:checked').prop('checked', false);
}

function filterServices()
{
    let returns = "",
        element = false;

    if (hash == '#future-bookings') {
        element = $('#service-future').find('input:radio[name="filter_services"]:checked');
    } else if (hash == '#completed-bookings') {
        element = $('#service-completed').find('input:radio[name="filter_services"]:checked');
    } else if (hash == '#canceled-bookings') {
        element = $('#service-canceled').find('input:radio[name="filter_services"]:checked');
    }

    returns = element.val() || "";

    return returns;
}

function filterTherapist()
{
    let returns = "",
        element = false;

    if (hash == '#future-bookings') {
        element = $('#therapist-future').find('input:radio[name="filter_therapist"]:checked');
    } else if (hash == '#completed-bookings') {
        element = $('#therapist-completed').find('input:radio[name="filter_therapist"]:checked');
    } else if (hash == '#canceled-bookings') {
        element = $('#therapist-canceled').find('input:radio[name="filter_therapist"]:checked');
    }

    returns = element.val() || "";

    return returns;
}

function filterRoom()
{
    let returns = "",
        element = false;

    if (hash == '#future-bookings') {
        element = $('#room-future').find('input:radio[name="filter_room"]:checked');
    } else if (hash == '#completed-bookings') {
        element = $('#room-completed').find('input:radio[name="filter_room"]:checked');
    } else if (hash == '#canceled-bookings') {
        element = $('#room-canceled').find('input:radio[name="filter_room"]:checked');
    }

    returns = element.val() || "";

    return returns;
}

function filterDate(isCustom)
{
    let returns = "",
        element = false;

    if (hash == '#future-bookings') {
        element = $('#date-future').find('input:radio[name="filter_date"]:checked');
    } else if (hash == '#completed-bookings') {
        element = $('#date-completed').find('input:radio[name="filter_date"]:checked');
    } else if (hash == '#canceled-bookings') {
        element = $('#date-canceled').find('input:radio[name="filter_date"]:checked');
    }

    if (isCustom && element.val() == 5) {

    } else if (!isCustom && element.val() != 5) {
        returns = element.val() || "";
    }

    return returns;
}

function filterData()
{
    let postData = {
        "type": type
    };

    postData["service"]      = filterServices();

    postData["therapist_id"] = filterTherapist();

    postData["room_id"]      = filterRoom();

    postData["date_filter"]  = filterDate(false);

    postData["date"]         = filterDate(true);

    return postData;
}

function getFutureBookings()
{
    let postData = filterData();

    Post(FUTURE_BOOKINGS, postData, function (res) {
        let data = res.data;

        if (data.code == SUCCESS_CODE) {
            let tbody = "";

            $.each(data.data, function(k, item) {
                let serviceName  = (item.massage_name == '' || item.massage_name == null) ? item.therapy_name : item.massage_name,
                    specialNotes = (item.notes != '' && item.notes != null) ? item.notes : false;

                tbody += '<tr>';
                    tbody += '<td class="text-center">' + getDate(item.massage_date) + '</td>';

                    if (item.sessionId == 1 || item.sessionId == 4) {
                        tbody += '<td>';
                            tbody += '<span class="user-icon">';
                                tbody += '<img src="images/single-user.png" alt="" />';
                            tbody += '</span>';
                        tbody += '</td>';
                    } else if (item.sessionId == 2 || item.sessionId == 5 || item.sessionId == 6) {
                        tbody += '<td>';
                            tbody += '<span class="user-icon">';
                                tbody += '<img src="images/couple-user.png" alt="" />';
                            tbody += '</span>';
                        tbody += '</td>';
                    } else if (item.sessionId == 3 || item.sessionId == 7) {
                        tbody += '<td>';
                            tbody += '<span class="user-icon">';
                                tbody += '<img src="images/group-user.png" alt="" />';
                            tbody += '</span>';
                        tbody += '</td>';
                    }

                    tbody += '<td class="text-center">' + item.client_name + '</td>';

                    tbody += '<td>' + serviceName + '</td>';

                    tbody += '<td class="text-center">' + getTime(item.massage_start_time) + " - " + getTime(item.massage_end_time) + '</td>';

                    tbody += '<td class="text-center">' + item.therapistName + '</td>';

                    tbody += '<td class="text-center">' + item.roomName + '</td>';

                    tbody += '<td class="text-center">' + item.book_platform + '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<span class="pay-sp">&#8364; 661';
                        tbody += '</span>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<a href="#" data-toggle="modal" data-target="#notes-modal-' + item.booking_massage_id + '">';
                            tbody += '<i class="fas fa-sticky-note ' + (specialNotes ? 'active' : '') + '">';
                            tbody += '</i>';
                        tbody += '</a>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<i class="fas fa-edit">';
                        tbody += '</i>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<a href="#" class="open-model" data-target="#delete-modal" data-id="' + item.booking_id + '">';
                            tbody += '<i class="far fa-trash-alt">';
                            tbody += '</i>';
                        tbody += '</a>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<a href="#" data-toggle="modal" data-target="#details-modal-' + item.booking_massage_id + '">';
                            tbody += '<i class="fa fa-eye">';
                            tbody += '</i>';
                        tbody += '</a>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<a href="#" data-toggle="modal" data-target="#print-modal">';
                            tbody += '<i class="fa fa-print">';
                            tbody += '</i>';
                        tbody += '</a>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<span class="confirm">';
                            if (item.is_confirm == '1') {
                                tbody += '<input type="checkbox" name="downgrade_booking" class="downgrade_booking" value="' + item.booking_massage_id + '" checked="true" />';
                            } else {
                                tbody += '<input type="checkbox" name="confirm_booking" class="confirm_booking" value="' + item.booking_massage_id + '" />';
                            }
                            tbody += '<label></label>';
                        tbody += '</span>';
                    tbody += '</td>';

                tbody += '</tr>';

                /* Special notes. */
                if (specialNotes) {
                    let notesModel = '<div class="modal fade" id="notes-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
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

                /* Booking details. */
                let detailsModel = '<div class="modal fade" id="details-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
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

            if (!isEmpty(tbody)) {
                $('#tbody-future').empty().html(tbody);
            } else {
                tbody = '<tr>';
                    tbody += '<td colspan="15" class="text-center">';
                        tbody += '<mark>No records found!';
                        tbody += '</mark>';
                    tbody += '</td>';
                tbody += '</tr>';

                $('#tbody-future').empty().html(tbody);
            }

            $(document).find('.confirm_booking').unbind().change(function() {
                if (this.checked) {
                    let bookingMassageId = $(this).val();

                    confirm("Are you sure want to confirm this booking ?", confirmBookingMassage, [bookingMassageId], $(this));
                }

                return false;
            });

            $(document).find('.downgrade_booking').on("click", function() {
                if (!this.checked) {
                    let bookingMassageId = $(this).val();

                    confirm("Are you sure want to downgrade this booking ?", downgradeBooking, [bookingMassageId], $(this));
                }

                return false;
            });

            bindEvents();
        } else {
            showError(data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function getCompletedBookings()
{
    let postData = filterData();

    Post(COMPLETED_BOOKINGS, postData, function (res) {
        let data = res.data;

        if (data.code == SUCCESS_CODE) {
            let tbody = "";

            $.each(data.data, function(k, item) {
                let serviceName  = (item.massage_name == '' || item.massage_name == null) ? item.therapy_name : item.massage_name,
                    specialNotes = (item.notes != '' && item.notes != null) ? item.notes : false;

                tbody += '<tr>';
                    tbody += '<td class="text-center">' + getDate(item.massage_date) + '</td>';

                    tbody += '<td class="text-center">' + getTime(item.massage_time) + '</td>';

                    if (item.sessionId == 1 || item.sessionId == 4) {
                        tbody += '<td>';
                            tbody += '<span class="user-icon">';
                                tbody += '<img src="images/single-user.png" alt="" />';
                            tbody += '</span>';
                        tbody += '</td>';
                    } else if (item.sessionId == 2 || item.sessionId == 5 || item.sessionId == 6) {
                        tbody += '<td>';
                            tbody += '<span class="user-icon">';
                                tbody += '<img src="images/couple-user.png" alt="" />';
                            tbody += '</span>';
                        tbody += '</td>';
                    } else if (item.sessionId == 3 || item.sessionId == 7) {
                        tbody += '<td>';
                            tbody += '<span class="user-icon">';
                                tbody += '<img src="images/group-user.png" alt="" />';
                            tbody += '</span>';
                        tbody += '</td>';
                    }

                    tbody += '<td class="text-center">' + item.client_name + '</td>';

                    tbody += '<td>' + serviceName + '</td>';

                    tbody += '<td class="text-center">' + item.therapistName + '</td>';

                    tbody += '<td class="text-center">' + item.roomName + '</td>';

                    tbody += '<td class="text-center">' + item.book_platform + '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<span class="pay-sp">&#8364; 661';
                        tbody += '</span>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<a href="#" data-toggle="modal" data-target="#notes-modal-' + item.booking_massage_id + '">';
                            tbody += '<i class="fas fa-sticky-note ' + (specialNotes ? 'active' : '') + '">';
                            tbody += '</i>';
                        tbody += '</a>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<i class="fas fa-bookmark">';
                        tbody += '</i>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<a href="#" class="open-model" data-target="#delete-modal" data-id="' + item.booking_id + '">';
                            tbody += '<i class="far fa-trash-alt">';
                            tbody += '</i>';
                        tbody += '</a>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<a href="#" data-toggle="modal" data-target="#details-modal-' + item.booking_massage_id + '">';
                            tbody += '<i class="fa fa-eye">';
                            tbody += '</i>';
                        tbody += '</a>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<i class="fa fa-star">';
                        tbody += '</i>';
                    tbody += '</td>';

                tbody += '</tr>';

                /* Special notes. */
                if (specialNotes) {
                    let notesModel = '<div class="modal fade" id="notes-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
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

                /* Booking details. */
                let detailsModel = '<div class="modal fade" id="details-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
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

            if (!isEmpty(tbody)) {
                $('#tbody-completed').empty().html(tbody);
            } else {
                tbody = '<tr>';
                    tbody += '<td colspan="15" class="text-center">';
                        tbody += '<mark>No records found!';
                        tbody += '</mark>';
                    tbody += '</td>';
                tbody += '</tr>';

                $('#tbody-completed').empty().html(tbody);
            }

            $(document).find('.confirm_booking').unbind().change(function() {
                if (this.checked) {
                    let bookingMassageId = $(this).val();

                    confirm("Are you sure want to confirm this booking ?", confirmBookingMassage, [bookingMassageId], $(this));
                }

                return false;
            });

            $(document).find('.downgrade_booking').on("click", function() {
                if (!this.checked) {
                    let bookingMassageId = $(this).val();

                    confirm("Are you sure want to downgrade this booking ?", downgradeBooking, [bookingMassageId], $(this));
                }

                return false;
            });

            bindEvents();
        } else {
            showError(data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function getCancelledBookings()
{
    let postData = filterData();

    Post(CANCELED_BOOKINGS, postData, function (res) {
        let data = res.data;

        if (data.code == SUCCESS_CODE) {
            let tbody = "";

            $.each(data.data, function(k, item) {
                let serviceName  = (item.massage_name == '' || item.massage_name == null) ? item.therapy_name : item.massage_name,
                    specialNotes = (item.notes != '' && item.notes != null) ? item.notes : false;

                tbody += '<tr>';
                    tbody += '<td class="text-center">' + getDate(item.massage_date) + '</td>';

                    tbody += '<td class="text-center">' + getTime(item.massage_time) + '</td>';

                    if (item.sessionId == 1 || item.sessionId == 4) {
                        tbody += '<td>';
                            tbody += '<span class="user-icon">';
                                tbody += '<img src="images/single-user.png" alt="" />';
                            tbody += '</span>';
                        tbody += '</td>';
                    } else if (item.sessionId == 2 || item.sessionId == 5 || item.sessionId == 6) {
                        tbody += '<td>';
                            tbody += '<span class="user-icon">';
                                tbody += '<img src="images/couple-user.png" alt="" />';
                            tbody += '</span>';
                        tbody += '</td>';
                    } else if (item.sessionId == 3 || item.sessionId == 7) {
                        tbody += '<td>';
                            tbody += '<span class="user-icon">';
                                tbody += '<img src="images/group-user.png" alt="" />';
                            tbody += '</span>';
                        tbody += '</td>';
                    }

                    tbody += '<td class="text-center">' + item.client_name + '</td>';

                    tbody += '<td>' + serviceName + '</td>';

                    tbody += '<td class="text-center">' + item.therapistName + '</td>';

                    tbody += '<td class="text-center">' + item.book_platform + '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<span class="pay-sp">&#8364; 661';
                        tbody += '</span>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<a href="#" data-toggle="modal" data-target="#notes-modal-' + item.booking_massage_id + '">';
                            tbody += '<i class="fas fa-sticky-note ' + (specialNotes ? 'active' : '') + '">';
                            tbody += '</i>';
                        tbody += '</a>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<i class="fas fa-info-circle">';
                        tbody += '</i>';
                    tbody += '</td>';

                    tbody += '<td class="text-center">';
                        tbody += '<a href="#" data-toggle="modal" data-target="#details-modal-' + item.booking_massage_id + '">';
                            tbody += '<i class="fa fa-eye">';
                            tbody += '</i>';
                        tbody += '</a>';
                    tbody += '</td>';

                    tbody += '<td class="text-center" id="recover-booking" data-id="' + item.booking_massage_id + '">';
                        tbody += '<i class="fas fa-arrow-circle-up">';
                        tbody += '</i>';
                    tbody += '</td>';

                tbody += '</tr>';

                /* Special notes. */
                if (specialNotes) {
                    let notesModel = '<div class="modal fade" id="notes-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
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

                /* Booking details. */
                let detailsModel = '<div class="modal fade" id="details-modal-' + item.booking_massage_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
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

            if (!isEmpty(tbody)) {
                $('#tbody-canceled').empty().html(tbody);
            } else {
                tbody = '<tr>';
                    tbody += '<td colspan="15" class="text-center">';
                        tbody += '<mark>No records found!';
                        tbody += '</mark>';
                    tbody += '</td>';
                tbody += '</tr>';

                $('#tbody-canceled').empty().html(tbody);
            }

            $(document).find('.confirm_booking').unbind().change(function() {
                if (this.checked) {
                    let bookingMassageId = $(this).val();

                    confirm("Are you sure want to confirm this booking ?", confirmBookingMassage, [bookingMassageId], $(this));
                }

                return false;
            });

            $(document).find('.downgrade_booking').on("click", function() {
                if (!this.checked) {
                    let bookingMassageId = $(this).val();

                    confirm("Are you sure want to downgrade this booking ?", downgradeBooking, [bookingMassageId], $(this));
                }

                return false;
            });

            bindEvents();
        } else {
            showError(data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}
