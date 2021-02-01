const isGhanaMobileNumber = /^(\+233)?0*(([25]){1})(([034678]){1})([0-9]{7})$/;

const app = new Vue({
  el : '#app',
  data : function () {
    return {
      buttonText : 'See My Subscriptions',
      submitting : false
    }
  },
  methods : {
    sendVerificationCode : function(e){
      e.preventDefault();

      let that = $(this);
      const msisdn = $("#msisdn").val();
      const isACorrectVodafoneNumber = isGhanaMobileNumber.test(msisdn);

      console.log({ isACorrectVodafoneNumber });
      this.buttonText = "Sending Otp...";
      // that.addClass('disabled')

      if (isACorrectVodafoneNumber) { // SEND OTP
        axios.post('/otps/send',
          { msisdn },
          function(data, status, jqXHR) {
            // {"statusCode":"200","orderId":"N7OQJNOADV","message":"Your verification code has been sent to your phone","msisdn":"0201694902"}
            if (status === 'success' && data.response.statusCode === "200") {
              // chnage the text name back
              that.text("See My Subscriptions");
              localStorage.currentOtpBody = JSON.stringify(data.response);
              // Open Modal
              $("#openVerifyOtpModal").click();

              $("#verifyOtpButton").unbind('click').click(function(){
                thee = $(this);
                const otpInput = $("#otp-input").val();
                const otpInputIsNotEmpty = otpInput !== undefined && otpInput !== "" && otpInput !== "null" && otpInput !== null;
                if (otpInputIsNotEmpty) {
                  // open all subscriptions page upon success
                  const currentOtpBody = JSON.parse(localStorage.currentOtpBody);
                  const verifyOtpBodyToSend = {
                    orderId: currentOtpBody.orderId,
                    otp: otpInput,
                  }
                  // verify otp button logic
                  // 0201694902
                  // 0501195737
                  thee.text("Verifying Otp....");
                  $.post('/otps/verify',
                    { ...verifyOtpBodyToSend },
                    function(newData, newStatus, newJqXHR) {
                      // Fetch Individuals Subscription
                      thee.text("Verify Otp");
                      window.location.href = "/content-management/manage-subscriptions"
                    }
                  ).fail(function(error){
                    const errMessage = error.responseJSON.message
                    thee.text("Verify Otp");
                    alert(errMessage)
                  })

                } else {
                  alert("Error: You have to enter a verification code.")
                }
              });
            } else {
              that.removeClass('disabled')
              alert("An Error Occurred Please Try Again Later")
            }
          })

      }
      ///

    }
  }
});
// console.log(app);
