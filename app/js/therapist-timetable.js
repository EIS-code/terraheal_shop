
import { Post, Get, SUCCESS_CODE, ERROR_CODE, EXCEPTION_CODE } from './networkconst.js';
import { THERAPIST_TIMETABLE } from './networkconst.js';

window.addEventListener("load", function() {
    setYearMonth(true);

    $(document).find('#current-month').on("change", buildHeader);
});

function getSelectedMonth() {
    return new Date($('#current-month').val());
};

function setYearMonth(isCurrent)
{
    if (isCurrent) {
        let currentMonthYear = moment().format('YYYY-MM');

        $('#current-month').val(currentMonthYear);
    }

    buildHeader();
}

function getTotalDays()
{
    let currentMonth = moment(getSelectedMonth().getTime()),
        daysInMonth  = currentMonth.daysInMonth(),
        monthDate    = currentMonth.startOf('month'),
        returnDays   = [];

    for (let i = 0; i < daysInMonth; i++) {
        let newDay = monthDate.clone().add(i,'days');

        returnDays.push(newDay);
    }

    return returnDays;
}

function buildHeader()
{
    let totalDays = getTotalDays(),
        table     = $('#current-table'),
        thead     = "<tr>";

    $.each(totalDays, function(key, day) {
        thead += '<th>';
            thead += day.format('ddd DD/MM');
        thead += '</th>';
    });

    thead += "</tr>";

    table.find('thead').empty().html(thead);

    buildTherapistData();
}

function buildTherapistData()
{
    let selectedMonth = getSelectedMonth(),
        postData      = {
            "date": selectedMonth.getTime()
        };

    Post(THERAPIST_TIMETABLE, postData, function (res) {
        if (res.data.code == SUCCESS_CODE) {
            let data      = res.data.data,
                totalDays = getTotalDays(),
                tbody     = "",
                tableBody = $('#current-body');

            $.each(data, function(index, row) {
                tbody += '<tr>';

                let rowDay    = moment(row.date).format('YYYY-MM-DD'),
                    startTime = new Date(row.therapist_working_schedule_time.start_time).getUTCHours(),
                    endTime   = new Date(row.therapist_working_schedule_time.end_time).getUTCHours(),
                    therapist = row.therapist;

                $.each(totalDays, function(key, day) {
                    tbody += '<td>';

                    let thisDay = day.format('YYYY-MM-DD');

                    if (thisDay == rowDay) {
                        tbody += '<div class="cont">';
                            tbody += startTime + '-' + endTime;

                            tbody += '<span class="c-name">';
                                 tbody += ' ' + therapist.name;
                            tbody += '</span>';
                        tbody += '</div>';
                    } else {
                        tbody += '<mark> - </mark>';
                    }

                    tbody += '</td>';
                });

                tbody += '</tr>';
            });

            if (tbody != "") {
                tableBody.empty().html(tbody);
            } else {
                tableBody.empty().html('<tr><td colspan="31"><mark>No records found!</mark></mark></td></tr>');
            }
        } else {
            showError(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}
