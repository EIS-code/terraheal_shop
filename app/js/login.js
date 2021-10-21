import { SIGNIN } from './networkconst.js';
import { Post, SUCCESS_CODE } from './networkconst.js';

$(document).ready(function () {
    clearLocalStorage('shopData');

    $(".login").click(function () {
        let userName = $("#txt_user_name").val(),
            password = $("#txt_password").val();

        if (userName == "") {
            showError("Please enter email address");
        } else if (password == "") {
            showError("Please enter password");
        } else {
            let postData = {
                "email": userName,
                "shop_password": password
            }

            Post(SIGNIN, postData, function(res){
                if (res.data.code == SUCCESS_CODE) {
                    localStorage.setItem('shopData', JSON.stringify(res.data.data));

                    window.location = "home-screen.html"
                } else {
                    showError(res.data.msg);
                }
            },function(err){
                console.log("AXIOS ERROR: ", err);
            });
        }
    });

    setTimeout(function() {
        $('#txt_user_name').focus();
    }, 500);
});