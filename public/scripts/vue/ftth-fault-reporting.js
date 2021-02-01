// import * as yup from 'yup';
import regeneratorRuntime from "regenerator-runtime";
import * as matcher from '../helpers/validation'
import moment from "moment";
import {diceyDialog, toTitleCase} from "../helpers/utils";
import yup from "yup";

import axios from "axios";

import FrForm from './fault-reporting/FaultReportingForm'
import VerifyUser from "./fault-reporting/VerifyUser";
// console.log('here');
// const isGhanaMobileNumber = /^(\+233)?0*(([25]){1})(([034678]){1})([0-9]{7})$/;

/*
let errors = {};
      validationError.inner.forEach(field => {
        // let em = error.split(" ");
        errors[field.path] = field.message;
      });

      this.props.onSetFormErrors(errors);
      state.steps[state.currentStep - 1].completed = false;
      state.steps[2].completed = false;
      this.setState({
        canSubmit: false,
        currentStep: state.currentStep,
        steps: state.steps
      });
      scroller.scrollTo('validationError', {
        duration: 600,
        smooth: "easeInOutQuint",
        offset: -100, // Scrolls to element + 50 pixels down the page
      });
 */

//region FormFields
const commonFields = {
  reportType: '',
  reportComment: '',
  incidentDate: '',
  accountNumber : '',
  alternativeContact: '',
  // alternativecontact : ''
}

let mainFormData = {
  ...commonFields
}

let fixedLineFormData = {
  fixedLineFNumber: '',
  accountNumber: '',
  userId : ''
};

let ipServicesFormData = {
  userId: '',
  accountNumber: '',
};

let vodafoneCashFormData = {
  phoneNumber: '',
  userId : '',
};

let mobileFormData = {
  mobileNumber: '',
  latitude: '',
  longitude: '',
  majorLandmark: '',
  userId : ''
};

let enterpriseFormData = {
  userId: '',
  accountNumber: '',
  phoneNumber : ''
};

let fixedBroadbandFormData = {
  userId: '',
  accountNumber: '',
  phoneNumber : ''
};
//endregion

const app = new Vue({
  el: '#app',
  components : { FrForm, VerifyUser},
  data: function () {
    return {
      msisdn: '',
      serviceNo : '',
      isFtth : false,
      msisdnVerified: false,
      msisdnVerificationBusy: '',
      heading: 'Fill the form below to report your fault',
      buttonText: 'See My Subscriptions',
      submitting: false,

      isBroadband : '',
      faultTypesAndDescriptions : [],
      fthhUserData : null
    }
  },
  computed: {
    canSubmit () {
      // let cs = matcher.isEmpty.test(this.msisdn)
      // console.log(cs);
      return matcher.isEmpty.test(this.msisdn)
    }
  },
  methods: {
    updateIsFtth (isFtth) {
      console.log('is-ftth-event-fired', {isFtth});
      this.isFtth = isFtth;
    },
    updateBroadband (bb) {
      console.log('is-bb-event-fired', {bb});
      this.isBroadband = bb;
      if (!bb) {
        FrForm.category = ''
      }
    },

    updateMsisdnVerified (msisdnVerified) {
      console.log('msisdn-event-fired', {msisdnVerified});
      this.msisdnVerified = msisdnVerified;
    },

    updateCategory (category) {
      console.log('cat-event-fired', {category});
      this.category = category;
    },
    updateFaultTypesAndDescriptions (faultTypesAndDescriptions) {
      console.log('ftad-event-fired', {faultTypesAndDescriptions});
      this.faultTypesAndDescriptions = faultTypesAndDescriptions;
    },
    updateServiceNumber (serviceNo) {
      console.log('service-no--event-fired', {serviceNo});
      this.serviceNo = serviceNo;
    }



    /*displayErrorNotification (errorMsg) {
      swal.fire({
        icon: 'error',
        // title: message,
        text: errorMsg,
        timer: 6000,
        timerProgressBar: false
      })
    },*/
    /*
      <option value="Fixed Line">Fixed Line</option>
      <option value="IP Services">IP Services</option>
      <option value="Vodafone Cash">Vodafone Cash</option>
      <option value="Mobile">Mobile</option>
      <option value="Enterprise">Enterprise</option>
      <option value="Fixed Broadband">Fixed Broadband</option>
     */
   /* verifyMsisdn (e) {
      // $this = $(this);
      e.preventDefault();
      // const serviceOrAccNumber = $("#service-acc-number").val();
      const serviceOrAccNumber = this.msisdn;

      if (!matcher.isEmpty.test(serviceOrAccNumber)) {
        //FIXME add proper is not empty check

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
            if (data.RESPONSEMESSAGE === "Data not found") {
              this.submitting = false;
              diceyDialog({
                icon: 'error',
                title: 'Error',
                text: "Sorry, We couldn't find any account associated with the dta provided",
              });
            } else if (data.type === "FTTH") {
              console.log("FTTH", data);
              // save the response in localhost
              localStorage.currentFaultReporterData = JSON.stringify(data);
              // $this.text("Fetching Fault Types....");
              this.currentFaultReporterData = data;

              // get all fault types and desc
              try {
                /!*$.get(
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
                )*!/

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
                    localStorage.faultTypesAndDescriptions = JSON.stringify(_data);
                    this.faultTypesAndDescriptions = _data;
                    console.log(JSON.parse(localStorage.faultTypesAndDescriptions), localStorage.orderType);

                    // this.msisdnConfirmButtonText = "Redirecting...."; //msg deprecated

                    // redirect to new ftth fr logic
                    // window.location.href = "/reportFault/ftth-fault-reporting"; //msg Deprecated
                    this.msisdnVerified = true; //FIXME move from here to the end of block

                  }
                }

              } catch (e) {
                console.log(e);
                diceyDialog({
                  icon: 'error',
                  title: 'Error',
                  text: "Sorry, We couldn't find any account associated with the dta provided",
                });
              }
            } else {
              console.log("COPPER", data);
              // save the reponse in localhost
              localStorage.currentFaultReporterData = JSON.stringify(data);
              this.currentFaultReporterData = data;
              //  redirect to existing fr logic
              // window.location.href = "/reportFault"; //FIXME where is the existing fr logic
            }
          }

          this.submitting = false;
        }
      } catch (e) {
        this.submitting = false;
        console.log(e);
      }
    },

*/
  },
 /* mounted () {
    diceyDialog({ icon: "error", text: "Sorry, your browser does not support HTML5 geolocation.", buttons : ['OK ', "Cancel"] })
  }*/

  created () {
    // v-on:msisdnVerifiedChanged="updateMsisdnVerified"
    // this.$on('msisdnVerifiedChanged', (msisdnVerified) => {
    //   console.log('event-fired');
    //   this.updateMsisdnVerified(msisdnVerified)
    // });
  },
});
// console.log(app);

