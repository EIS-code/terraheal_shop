
import { Post, Get, SUCCESS_CODE, ERROR_CODE, EXCEPTION_CODE } from './networkconst.js';
import { ADD_CLIENT } from './networkconst.js';

$(document).ready(function () {
    $(document).find('#save-client').on("click", addClient);
});

function addClient()
{
    let formInputs = $(document).find('#form-add-new').serializeArray(),
        postData   = {};

    $.each(formInputs, function(key, input) {
        postData[input.name] = input.value;
    });

    Post(ADD_CLIENT, postData, function (res) {
        let data = res.data;

        if (data.code == EXCEPTION_CODE) {
            showError(data.msg);
        } else {
            showSuccess(data.msg);

            resetForm();
        }
    }, function (err) {
        console.log("AXIOS ERROR: ", err);
    });
}

function resetForm()
{
    $(document).find('#form-add-new').get(0).reset();
}
