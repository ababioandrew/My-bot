import * as matcher from "../../helpers/validation";
import {diceyDialog} from "../../helpers/utils";
// import bus from "../components/Bus"
import axios from "axios";

export default Vue.component('verify-user', {
  props: {},
  data: function () {
    return {
      msisdn: '',
      msisdnConfirmButtonText: 'Next',
      submitting: false,
      title: 'We sent a verification code to your phone.',
      showResend: true,
    }
  },
  computed: {
    canSubmit () {
      // let cs
      // = matcher.isEmpty.test(this.msisdn)
      // console.log(cs);
      return matcher.isEmpty.test(this.msisdn)
    }
  },
  methods: {
    verifyMsisdn (e) {
      // $this = $(this);
      e.preventDefault();
      // const serviceOrAccNumber = $("#service-acc-number").val();
      const serviceOrAccNumber = this.msisdn;

      if (!matcher.isEmpty.test(serviceOrAccNumber)) {

        // CREATE BODY CHECK FIBRE COPPER
        const checkFibreCopperBody = {
          action: "checkFibreCopper",
          serviceNo: serviceOrAccNumber,
        }

        // console.log(checkFibreCopperBody);
        //030278309 //030278304
        this.submitting = true;
        this.msisdnConfirmButtonText = "Working on it Please wait....";
        // HIT ENDPOINT TO GET USER TYPE AND REDIRECT TO CORRECT FORM TO REPORT FAULT
        this.sendVerificationCode(checkFibreCopperBody);
      } else {
        // alert()
        diceyDialog({ text: "Please Provide A Valid Service Number Or Account Number" })
      }
    },
    sendVerificationCode: async function (payload) {
      console.log('this method called', payload);
      try {
        let response = await axios.post('/fault-reporting-api', payload);

        if (response) {
          this.submitting = false;
          // GET USER TYPE
          const { data, status } = response;

          if (status === 200) {
            console.log({data});
            if (data.RESPONSEMESSAGE === "Data not found") {
              this.submitting = false;
              this.msisdnConfirmButtonText = 'Retry';
              diceyDialog({
                icon: 'error',
                title: 'Error',
                text: "Sorry, We couldn't find any account associated with the data provided",
              });
            } else if (data.type === "FTTH") {
              console.log("FTTH", data);
              // save the response in localhost
              localStorage.currentFaultReporterData = JSON.stringify(data);
              // $this.text("Fetching Fault Types....");
              this.currentFaultReporterData = data;

              // get all fault types and desc
              try {
                /*$.get(
                  `/fault-reporting-api/fault-types-and-descriptions?productline=${data.product_line}`,
                  (_data, _status, _xhr) => {
                    localStorage.orderType = _data[_data.length - 1].orderType;
                    let _data_ = _data;
                    _data_.pop();
                    localStorage.faultTypesAndDescriptions = JSON.stringify(_data_);
                    console.log(JSON.parse(localStorage.faultTypesAndDescriptions), localStorage.orderType);
                    $this.text("Redirecting....");

                    // redirect to new ftth fr logic
                    window.location.href = "/reportFault/ftth-fault-reporting";

                  }
                )*/

                let faultTypesResponse = await axios.get(`/fault-reporting-api/fault-types-and-descriptions?productline=${data.product_line}`)
                this.msisdnConfirmButtonText = "Fetching Fault Types....";
                this.submitting = true;
                // deal with

                // console.log({ faultTypesResponse });
                if (faultTypesResponse) {
                  this.submitting = false;
                }

                if (faultTypesResponse.status === 200) {
                  let { data } = faultTypesResponse;

                  if (data.RESPONSEMESSAGE === "Data not found") {
                    // alert();
                    diceyDialog({
                      icon: 'error',
                      text: "Sorry, We couldn't find any account associated with the dta provided",
                    });
                  } else {
                    localStorage.orderType = data[data.length - 1].orderType;
                    this.orderType = data[data.length - 1].orderType;

                    let _data = data;
                    _data.pop();
                    // localStorage.faultTypesAndDescriptions = JSON.stringify({ data : _data });
                    localStorage.faultTypesAndDescriptions = JSON.stringify(_data);
                    // localStorage.faultTypesAndDescriptions = _data;
                    this.faultTypesAndDescriptions = _data;
                    this.$emit('ftth-fault-types-changed', _data);
                    console.log('lsFts',localStorage.faultTypesAndDescriptions, localStorage.orderType);

                    // this.msisdnConfirmButtonText = "Redirecting...."; //msg deprecated
                    // redirect to new ftth fr logic
                    // window.location.href = "/reportFault/ftth-fault-reporting"; //msg Deprecated
                    // this.msisdnVerified = true; //FIXME move from here to the end of block

                    console.log('event should be emitted');

                    this.$emit('msisdn-verified-changed', true);
                    this.$emit('is-ftth-changed', true)
                    this.$emit('service-no', this.msisdn)

                  }
                }

              } catch (e) {
                console.log(e);
                this.submitting = false;
                this.msisdnConfirmButtonText = 'Retry';
                diceyDialog({
                  icon: 'error',
                  title: 'Error',
                  text: "Sorry, We couldn't find any account associated with the data provided",
                });
              }
            } else {
              console.log("COPPER", data);
              // save the reponse in localhost
              localStorage.currentFaultReporterData = JSON.stringify(data);
              this.currentFaultReporterData = data;
              this.$emit('msisdn-verified-changed', true);
              this.$emit('is-ftth-changed', false)
              //  redirect to existing fr logic
              // window.location.href = "/reportFault"; //FIXME where is the existing fr logic
            }
          }

          this.submitting = false;
        }
      } catch (e) {
        this.submitting = false;
        console.log(e);
        diceyDialog({
          icon: 'error',
          title: 'Error',
          text: "Sorry, an error occurred. Please try again in a few moments",
        });
      }
    },


    handleCloseButtonClick (e) {
      console.log('close btn clicked');
      this.$emit('is-broadband-changed', false);
    }

    // msg emit event
    // msisdnVerifiedChanged (newValue) {
    //   // bus.$emit('msisdnVerifiedChanged', newValue)
    //   this.$emit('msisdnVerifiedChanged', newValue)
    // }
  },
  mounted () {
    // let timer = null
    //
    // timer = setTimeout(() => {
    //   this.showResend = true;
    //   clearTimeout(timer)
    // }, 120000)
  },
  created () {
    // bus.$on('msisdnVerifiedChanged', (msisdnVerified) => {
    //   this.msisdnVerified = msisdnVerified
    // });
  },
  template: `
   <div class="overlay position-absolute w-100 h-100 bg-white d-flex">
     <div class=" row w-100">
<!--       <button class="close-modal p-3 position-absolute" @click="handleCloseButtonClick($event)">&times;</button> -->
       <div class="container m-auto col-8 col-md-5">
         <form>
          <div class="form-group">
            <label for="service-acc-number" aria-details="Service Or Account Number" class="w-100 text-center text-smal">
              Please Enter Your Service Number Or User ID
            </label>
            <input v-model.trim="msisdn" type="text" class="form-control rounded-0" id="service-acc-number"
                   placeholder="Eg. 030XXXXX Or kwabs03" required>
          </div>
          <button @click="verifyMsisdn" id="step-one-button" type="submit" class="btn btn-dark rounded-0 w-100"
                  :class="{disabled : canSubmit}">
            {{msisdnConfirmButtonText}}
            <div v-if="submitting" class="load-wrapp">
              <div class="load-3">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
              </div>
            </div>
          </button>
        </form>
       </div>
      </div>
    </div>
  `
});
