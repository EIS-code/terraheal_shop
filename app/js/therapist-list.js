import { Post, Get, SUCCESS_CODE, ERROR_CODE, EXCEPTION_CODE } from './networkconst.js';
import { THERAPISTS } from './networkconst.js';

var filterToday = "0",
    filterAll   = "1";

window.addEventListener("load", function() {
    getTherapists(filterToday);

    $(document).find("ul#th-tabs").find('li').find('a').on("click", function() {
        let tabName = $(this).attr('href'),
            filter  = filterToday;

        if (tabName.toLowerCase() == '#all') {
            filter = filterAll;
        }

        getTherapists(filter);
    });
});

function getTherapists(filter)
{
    let postData = {
        "filter": filter
    };

    Post(THERAPISTS, postData, function (res) {
        if (res.data.code == SUCCESS_CODE) {
            let li = '';

            if (!empty(res.data.data) && Object.keys(res.data.data).length > 0) {
                $.each(res.data.data, function( i, item ) {
                    li += '<li>';
                        li += '<div class="sl-cont">';
                            li += '<span class="name">';
                                li += item.therapistName;
                            li += '</span>';

                            li += '<div class="th-image">';
                                li += '<img src="' + item.therapistPhoto + '" alt="" />';
                            li += '</div>';

                            li += '<div class="avail">';
                                li += getAvailableTime(item.available);
                            li += '</div>';
                        li += '</div>';
                    li += '</li>';
                });
            }

            $(document).find('#list-therapists').empty().html(li);
        } else {
            showError(res.data.msg);
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}
