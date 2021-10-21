
import { Post, Get, SUCCESS_CODE, ERROR_CODE, EXCEPTION_CODE } from './networkconst.js';
import { SEARCH_VOUCHERS } from './networkconst.js';

const ACTIVE_VOUCHERS = '0';
const USED_VOUCHERS   = '1';

$(document).ready(function () {
    getVouchers(ACTIVE_VOUCHERS);

    $(document).find("ul#voucher-tabs").find('li').find('a').on("click", function() {
        let tabName = $(this).attr('href');

        callByTab(tabName);
    });

    $(document).find('#submit-search').on("click", function() {
        var activeTab = $("ul#voucher-tabs li a.active").attr('href');

        callByTab(activeTab);
    });
});

function callByTab(tabName)
{
    if (tabName == '#active') {
        getVouchers(ACTIVE_VOUCHERS);
    } else {
        getVouchers(USED_VOUCHERS);
    }
}

function getSearchValue()
{
    return $(document).find('#input-search').val() || "";
}

function getVouchers(filter)
{
    let postData = {
        "search_val": getSearchValue(),
        "filter": filter
    }

    Post(SEARCH_VOUCHERS, postData, function (res) {
        if (res.data.code == SUCCESS_CODE) {
            let element = false;

            if (filter === ACTIVE_VOUCHERS) {
                element = $('#tbody-active');
            } else if (filter === USED_VOUCHERS) {
                element = $('#tbody-used');
            }

            if (!empty(res.data.data) && Object.keys(res.data.data).length > 0 && !empty(res.data.data.data) && Object.keys(res.data.data.data).length) {
                if (element) {
                    let tbody = '';

                    $.each(res.data.data.data, function(key, item) {
                        tbody += '<tr>';
                            tbody += '<td>';
                                tbody += item.number;
                            tbody += '</td>';

                            tbody += '<td class="text-left">';
                                tbody += item.name;
                            tbody += '</td>';

                            tbody += '<td>';
                                tbody += item.price;
                            tbody += '</td>';

                            if (filter == USED_VOUCHERS) {
                                tbody += '<td>';
                                    tbody += item.used_value;
                                tbody += '</td>';

                                tbody += '<td>';
                                    tbody += item.available_value;
                                tbody += '</td>';
                            }

                            tbody += '<td>';
                                tbody += getDate(item.expired_date);
                            tbody += '</td>';

                            tbody += '<td>';
                                tbody += '<a href="javascript:void(0);" class="cmn-btn">';
                                    tbody += "Book This";
                                tbody += '</a>';
                            tbody += '</td>';
                        tbody += '</tr>';
                    });

                    element.empty().html(tbody);
                }
            } else if (element) {
                element.empty().html('<tr><td colspan="7"><mark>No records found!</mark></td></tr>');
            }
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}
