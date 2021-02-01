export default  = Vue.component('modal-dialog', {
  props : {
    verificationCode : {
      type : String
    },
    verifyButton : {
      type : String,
      default : 'Verify OTP'
    },
    sendVerification : {
      type : Function
    }
  },
  data: function () {
    return {
      title : 'We sent a verification code to your phone.',
      showResend : true,
    }
  },
  methods : {

  },
  mounted () {

    let timer = null

     timer = setTimeout(() => {
       this.showResend = true;
      clearTimeout(timer)
    }, 120000)
  },
  template: `<div class="modal fade" id="verifyOtpModal" tabindex="-1" role="dialog"
         aria-labelledby="verifyOtpModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-center" id="verifyOtpModalLabel">{{title}}</h5>
<!--  <h5 class="modal-title" id="verifyOtpModalLabel">Please Verify If You Own This Phone By Typing The OTP We Sent You In The Box Below </h5>-->
            <!--<button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>-->
          </div>
          
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="otp-input" class="col-form-label">Enter Verification Code</label>
                <input type="text" class="form-control rounded-0" autocomplete="one-time-code" id="otp-input" v-model="verificationCode">
                
                <small id="msisdnHelp" class="form-text text-muted">Do not share the code with anyone. Didn't receive code?
                  <a href="#" v-if="showResend" @click="sendVerification">Resend</a></small>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary bg-white text-dark border-dark rounded-0" data-dismiss="modal">Close</button>
            <button id="verifyOtpButton" type="button" class="btn btn-primary btn-dark  rounded-0">{{ verifyButton }}</button>
          </div>
        </div>
      </div>
    </div>`
});
