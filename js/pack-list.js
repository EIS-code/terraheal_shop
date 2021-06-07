
import { Post, Get, SUCCESS_CODE, ERROR_CODE, EXCEPTION_CODE } from './networkconst.js';
import { SEARCH_PACKS } from './networkconst.js';

const ACTIVE_PACKS = '0';
const USED_PACKS   = '1';

$(document).ready(function () {
    getPacks(ACTIVE_PACKS);

    $(document).find("ul#pack-tabs").find('li').find('a').on("click", function() {
        let tabName = $(this).attr('href');

        callByTab(tabName);
    });

    $(document).find('#submit-search').on("click", function() {
        var activeTab = $("ul#pack-tabs li a.active").attr('href');

        callByTab(activeTab);
    });
});

function callByTab(tabName)
{
    if (tabName == '#active') {
        getPacks(ACTIVE_PACKS);
    } else {
        getPacks(USED_PACKS);
    }
}

function getSearchValue()
{
    return $(document).find('#input-search').val() || "";
}

function getPacks(filter)
{
    let postData = {
        "search_val": getSearchValue(),
        "filter": filter
    }

    Post(SEARCH_PACKS, postData, function (res) {
        if (res.data.code == SUCCESS_CODE) {
            let element = false;

            if (filter === ACTIVE_PACKS) {
                element = $('#ul-active-list');
            } else if (filter === USED_PACKS) {
                element = $('#ul-used-list');
            }

            if (!empty(res.data.data) && Object.keys(res.data.data).length > 0 && !empty(res.data.data.data) && Object.keys(res.data.data.data).length) {
                if (element) {
                    let ul = '';

                    $.each(res.data.data.data, function(key, item) {
                        ul += '<li>';
                            ul += '<input type="radio" name="selected-pack" />';

                            ul += '<figure>';
                                ul += '<img src="' + item.image + '" alt="' + item.image + '" />';
                            ul += '</figure>';

                            ul += '<p>';
                                ul += '<a href="#" data-toggle="modal" data-target="#">';
                                    ul += item.name;

                                    ul += '<br />';

                                    ul += item.sub_title;
                                ul += '</a>';
                            ul += '</p>';

                            ul += '<div class="prc">';
                                ul += '<span>';
                                    ul += item.total_price;
                                ul += '</span>';

                                ul += item.pack_price;
                            ul += '</div>';
                        ul += '</li>';
                    });

                    element.empty().html(ul);
                }
            } else if (element) {
                element.empty().html('');
            }
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}
