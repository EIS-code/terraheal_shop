
import { SIGNIN } from './networkconst.js';
import { Post } from './networkconst.js';

$(document).ready(function () {
    $(".login").click(function () {

        console.log(SIGNIN);

        var userName = $("#txt_user_name").val();
        var password = $("#txt_password").val();

        if (userName == "") {
            alert("Please enter emil address");
        } else if (password == "") {
            alert("Please enter password");
        } else {
            let postData = {
                "email": userName,
                "shop_password": password
            }
            Post(SIGNIN,postData,function(res){
                if(res.data.code==200){
                        
                    console.log("RESPONSE RECEIVED: ", res.data);
                    console.log("RESPONSE RECEIVED: ", res.data.code);

                    localStorage.setItem('userData', JSON.stringify(res.data.data));

                    window.location = "home-screen.html"
                }else{
                    alert(res.data.msg);
                }
            },function(err){
                console.log("AXIOS ERROR: ", err);
            });
            
        }
    });
});