import { Post, Get, searchClients, SUCCESS_CODE, ERROR_CODE, EXCEPTION_CODE } from './networkconst.js';
import {  } from './networkconst.js';

window.addEventListener("load", function() {
    getClients();

    $(document).find('#search-client').on("click", function() {
        let searchInput = $('#search-input').val();

        getClients(searchInput);
    });

    $(document).find('ul#search-alphabet').find('li').on("click", function() {
        let alphabet = $(this).find('a').html();

        if (alphabet.toLowerCase() == 'all') {
            getClients();
        } else {
            getClients(alphabet);
        }
    });
});

function getClients(searchValue)
{
    searchClients(searchValue).then(
        function(response) {
            if (!response || !response.data || response.data.length <= 0) {
                showError("No records found.");
            } else {
                let data = response.data;

                if (data.code == SUCCESS_CODE) {
                    loadCLientHtml(data.data.data);
                } else {
                    showError(data.msg);
                }
            }
        },
        function(error) {
            console.log("AXIOS ERROR: ", error);
        }
    );
}

function loadCLientHtml(data)
{
    let element = $('#tbody-client-list'),
        tbody   = '';

    if (empty(data) || Object.keys(data).length <= 0) {
        element.empty().html('<tr><td colspan="5" class="text-center"><mark>No records found!</mark></td></tr>');

        return false;
    }

    $.each(data, function(key, row) {
        tbody += '<tr>';

            tbody += '<td>';
                tbody += row.name + (!empty(row.surname) ? ' ' + row.surname : '');
            tbody += '</td>';

            tbody += '<td>';
                tbody += row.id;
            tbody += '</td>';

            tbody += '<td>';
                tbody += hideEmail(row.email);
            tbody += '</td>';

            tbody += '<td>';
                tbody += (!empty(row.tel_number) ? (!empty(row.tel_number_code) ? row.tel_number_code + ' ' : '') + hideMobile(row.tel_number) : '-');
            tbody += '</td>';

            tbody += '<td>';
                tbody += '<a href="#" class="cmn-btn">';
                    tbody += 'Details';
                tbody += '</a>';
            tbody += '</td>';

        tbody += '</tr>';
    });

    element.empty().html(tbody);
}
