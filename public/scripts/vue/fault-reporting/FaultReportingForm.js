// import Vue from '../vue.dev'
import yup from "yup";
import * as matcher from "../../helpers/validation";
import {diceyDialog, toTitleCase} from "../../helpers/utils";
// import bus from "../components/Bus"
import axios from "axios";

//region FormFields
const commonFields = {
  reportType: '',
  reportComment: '',
  incidentDate: '',
  accountNumber: '',
  alternativeContact: '',
  // alternativecontact : ''
}

let mainFormData = {
  ...commonFields
}

let fixedLineFormData = {
  fixedLineFNumber: '',
  accountNumber: '',
  userId: ''
};

let ipServicesFormData = {
  userId: '',
  accountNumber: '',
};

let vodafoneCashFormData = {
  phoneNumber: '',
  userId: '',
};

let mobileFormData = {
  mobileNumber: '',
  latitude: '',
  longitude: '',
  majorLandmark: '',
  userId: ''
};

let enterpriseFormData = {
  userId: '',
  accountNumber: '',
  phoneNumber: ''
};

let fixedBroadbandFormData = {
  userId: '',
  accountNumber: '',
  phoneNumber: ''
};
//endregion

export default Vue.component('fr-form', {
  props: {
    faultTypesAndDescriptions: {
      type: Array,
    },
    isFtth: {
      type: Boolean,
      // default: false
    },
    isBroadband: {
      type: Boolean
    },
    serviceNo: {
      type: String
    },
    verificationCode: {
      type: String
    },
    verifyButton: {
      type: String,
      default: 'Verify OTP'
    },
    sendVerification: {
      type: Function
    }
  },
  data: function () {
    return {
      msisdn: '',
      msisdnConfirmButtonText: 'Next',
      msisdnVerificationBusy: '',
      heading: 'Fill the form below to report your fault',
      buttonText: 'See My Subscriptions',
      submitting: false,


      faultCategories: [
        { label: 'Select Report Category', value: '', selected: true },
        { value: "fixed line", label: 'Fixed Line' },
        { value: "ip services", label: 'IP Services' },
        { value: "vodafone cash", label: 'Vodafone Cash' },
        { value: "mobile", label: 'Mobile' },
        // { value: "enterprise", label: 'Enterprise' },
        { value: "fixed broadband", label: 'Fixed Broadband' },
      ],

      //msg these pieces of date are currently being save in local storage for persistence
      //msg we're are re-implementing it to ensure it's managed in one file
      orderType: null,
      currentFaultReporterData: null,
      // faultTypesAndDescriptions: [],
      faultTypesAndDescription: '',
      // selectedFaultTypeTriplicates: [],
      selectedFaultTypeTriplicate: '',

      //<editor-fold desc="field data object">
      commonFields,
      mainFormData,
      fixedLineFormData,
      ipServicesFormData,
      vodafoneCashFormData,
      mobileFormData,
      enterpriseFormData,
      fixedBroadbandFormData,
      //</editor-fold>

      category: '',
    }
  },

  computed: {
    faultTypesAndDescriptions_c () {
      if (!this.faultTypesAndDescriptions) {
        return [];
      }
      return this.faultTypesAndDescriptions.map((item, index) => {
        return {
          ...item,
          val: `${index}=>${item.faultType}=>${item.type}`
        }
      })
    },
    selectedFaultTypeTriplicates () {
      if (!this.faultTypesAndDescription) {
        return [];
      }
      console.log('changed');
      var value = this.faultTypesAndDescription;
      const valueCode = value.split("=>")[0];
      //////////////////////////////////

      return this.faultTypesAndDescriptions[valueCode].faultDescriptions;
    },
    selectedFaultTypeTriplicates_c () {
      return this.selectedFaultTypeTriplicates.map((item, index) => {
        return {
          ...item,
          val: `${index}=>${item.FAULT_DESCRIPTION}=>${item.FAULT_CODE}`
        }
      })
    }
  },

  methods: {
    getGeoCoordinates () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {

          this.mobileFormData.latitude = position.coords.latitude;
          this.mobileFormData.longitude = position.coords.longitude;

          localStorage.setItem("longitude", position.coords.longitude);
          localStorage.setItem("latitude", position.coords.latitude);
        });
      } else {
        // alert();
        diceyDialog({ icon: "error", text: "Sorry, your browser does not support HTML5 geolocation." })
      }
    },

    createCategoryPayload () {
      let category = this.category;
      let fields = {
        reporttype: this.commonFields.reportType,
        incidentdate: this.commonFields.incidentDate,
        alternativecontact: this.commonFields.alternativeContact,
        accountnumber: this.commonFields.accountNumber,
        comment: this.commonFields.reportComment + "\n" + "Incident Date:" + this.commonFields.incidentDate,
      }

      if (category === "" || category === "main form") {
        return { ...fields }
      } else if (category === "fixed line") {
        return {
          ...fields,
          userid: this.fixedLineFormData.userId,
          fixedlineNumber: this.fixedLineFormData.FixedLineNumber,
        }
      } else if (category === "ip services") {
        return {
          ...fields,
          userid: this.ipServicesFormData.userId,
          // accountnumber : this.ipServicesFormData.accountNumber,
        }
      } else if (category === "vodafone cash") {
        return {
          ...fields,
          // accountnumber : this.vodafoneCashFormData.accountNumber,
          msisdn: this.vodafoneCashFormData.phoneNumber,
          userid: this.vodafoneCashFormData.userId,
        }
      } else if (category === "mobile") {
        return {
          ...fields,
          // accountnumber :this.mobileFormData.accountNumber,
          msisdn: this.mobileFormData.mobileNumber,
          userid: this.mobileFormData.userId,
        }
      } else if (category === "enterprise") {
        return {
          ...fields,
          userid: this.enterpriseFormData.userId,
          msisdn: this.enterpriseFormData.phoneNumber,
          // accountnumber : this.enterpriseFormData.accountNumber,
          // username : this.enterpriseFormData.username,
        }
      } else if (category === "fixed broadband") {
        return {
          ...fields,
          // accountnumber : this.fixedBroadbandFormData.accountNumber,
          userid: this.fixedBroadbandFormData.userId,
          msisdn: this.fixedBroadbandFormData.phoneNumber,
        }
      }
    },

    createCategoryValidationSchema () {
      let category = this.category;
      if (category === "" || category === "main form") {
        return null;
      } else if (category === "fixed line") {
        return yup.object().shape({
          reportType: yup.string().required(),
          reportComment: yup.string().required(),
          incidentDate: yup.string().required(),
          alternativeContact: yup.string().matches(matcher.mobileNumber, { message: 'Must be a valid mobile number' }).required(),

          fixedLineFNumber: yup.string().required(),
          accountNumber: yup.string().matches(matcher.mobileNumber, { message: 'Must be a valid mobile number' }).required(),
        });
      } else if (category === "ip services") {
        return yup.object().shape({
          reportType: yup.string().required(),
          reportComment: yup.string().required(),
          incidentDate: yup.string().required(),
          alternativeContact: yup.string().matches(matcher.mobileNumber, { message: 'Must be a valid mobile number' }).required(),

          userId: yup.string().required(),
          accountNumber: yup.string().required(),
        });
      } else if (category === "vodafone cash") {
        return yup.object().shape({
          reportType: yup.string().required(),
          reportComment: yup.string().required(),
          incidentDate: yup.string().required(),
          alternativeContact: yup.string().matches(matcher.mobileNumber, { message: 'Must be a valid mobile number' }).required(),

          phoneNumber: yup.string().matches(matcher.isGhanaMobileNumber, { message: 'Must be a Ghanaian mobile number', }).required(),
        });
      } else if (category === "mobile") {
        return yup.object().shape({
          reportType: yup.string().required(),
          reportComment: yup.string().required(),
          incidentDate: yup.string().required(),
          alternativeContact: yup.string().matches(matcher.mobileNumber, { message: 'Must be a valid mobile number' }).required(),

          mobileNumber: yup.string().required(),
          latitude: yup.string().required(),
          longitude: yup.string().required(),
          majorLandmark: yup.string().required(),
        });
      } else if (category === "enterprise") {
        return yup.object().shape({
          reportType: yup.string().required(),
          reportComment: yup.string().required(),
          incidentDate: yup.string().required(),
          alternativeContact: yup.string().matches(matcher.mobileNumber, { message: 'Must be a valid mobile number' }).required(),

          userId: yup.string().required(),
          accountNumber: yup.string().required(),
        });
      } else if (category === "fixed broadband") {
        return yup.object().shape({
          reportType: yup.string().required(),
          reportComment: yup.string().required(),
          incidentDate: yup.string().required(),
          alternativeContact: yup.string().matches(matcher.mobileNumber, { message: 'Must be a valid mobile number' }).required(),

          userId: yup.string().required(),
          accountNumber: yup.string().required(),
        });
      }
    },

    async sendReportData () {
      try {
        this.submitting = true;
        const genericData = {
          action: "faultReporting",
          msisdn: "0202001234",
          os: "tobi-test",
          username: "Tobi",
          incidentdate: "03/03/2020",
        };

        // var newDateObj = new Date(oldDateObj.getTime() + diff*60000);

        let payload = {
          ...genericData, ...this.createCategoryPayload(),
          incidentDate: new Date(new Date(genericData.incidentdate) + new Date().getTime()),
          reportcategory: toTitleCase(this.category),
        };

        console.log({ payload });
        let response = await axios.post('/report', payload)
        console.log(response);
        let { data, status } = response;

        if (response) {
          this.submitting = false;

          if (status === 200) {
            console.log("success response from server", data);

            if (data.RESPONSEMESSAGE === "Sorry we're not able to process your request at this time. Kindly try again later") {
              // let errorMsg = data.RESPONSEMESSAGE;
              diceyDialog({
                icon: 'error',
                text: data.RESPONSEMESSAGE,
              });

            } else if (data.RESPONSEMESSAGE !== "Sorry we're not able to process your request at this time. Kindly try again later") {
              var message = data.RESPONSEMESSAGE

              window.localStorage.setItem('sessionResponse', message)
              window.localStorage.getItem('sessionResponse');
              // window.location.href = "/success"

              console.log({success : response });
              // if(this.category !== "fixed broadband") {
              diceyDialog({ //FIXME replace redirect logic with dialog
                text: `Dear Customer, ${data.RESPONSEMESSAGE}. We are working speedily to resolve it. To check on the status of your report, <br/> please type "<b>track my report</b> in the chat". </b><br/> The Future is Exciting. Ready?`,
                icon: 'success'
              });
              // }
            } else {
              // let errorMsg = data.RESPONSEMESSAGE;
              diceyDialog({
                'icon': 'info',
                text: data.RESPONSEMESSAGE,
              });
            }
          }
        }
      } catch (e) {
        console.log(e);
        this.submitting = false;

        if (e.status === 404) {
          diceyDialog({
            title: "Error",
            text: "It appears you're offline, please check your network connection and try again",
            timer: null, icon: "error"
          })
        } else if (e.message === "Network Error") {
          diceyDialog({
            title: "Network Error",
            text: "Please check your network connection and try again",
            timer: null, icon: "error"
          })
        } else {
          diceyDialog({
            text: "Error submitting report. Please try again in a few moments",
            timer: null, icon: "error"
          })
        }
      }
    },

    async sendFtthReportData () {
      let faultTypeAndDescription = this.selectedFaultTypeTriplicates_c[this.selectedFaultTypeTriplicate]
      try {
        this.submitting = true;
        const genericData = {
          username: "Tobi",
          action : "createFTTHFault",
          fault_type : faultTypeAndDescription.TYPE,
          fault_desc : faultTypeAndDescription.FAULT_CODE,
          serviceNo : this.serviceNo,
          order_type : "1301",
          modem_serial : "",
          comments : commonFields.reportComment,
        };

        // var newDateObj = new Date(oldDateObj.getTime() + diff*60000);

        let payload = {
          ...genericData,
          // serviceNo: this.serviceNo,
          // incidentDate: new Date(new Date(genericData.incidentdate) + new Date().getTime()),
          reportcategory: toTitleCase(this.category),
        };

        console.log({ payload });
        let response = await axios.post('/fault-reporting-api', payload)
        console.log(response);
        let { data, status } = response;

        if (response) {
          this.submitting = false;

          if (status === 200) {
            console.log("success response from server", data);

            if (data.RESPONSEMESSAGE === "Could not create service order. Unresolved Fault already exists for this subscriber") {
              diceyDialog({
                icon: 'info',
                title : 'Action Failed',
                text: "We've detected you already reported a fault that's pending resolution",
              });
            }
            else if (data.RESPONSEMESSAGE === "Sorry we're not able to process your request at this time. Kindly try again later") {
              // let errorMsg = data.RESPONSEMESSAGE;
              diceyDialog({
                icon: 'error',
                text: data.RESPONSEMESSAGE,
              });

            } else if (data.RESPONSEMESSAGE !== "Sorry we're not able to process your request at this time. Kindly try again later") {
              var message = data.RESPONSEMESSAGE

              window.localStorage.setItem('sessionResponse', message)
              // window.localStorage.getItem('sessionResponse');
              // window.location.href = "/successTwo"
              diceyDialog({ //FIXME replace redirect logic with dialog
                text: `Dear Customer, ${data.RESPONSEMESSAGE}. We are working speedily to resolve it. <br/> The Future is Exciting. Ready?`,
                icon: 'success'
              });
            } else {
              // let errorMsg = data.RESPONSEMESSAGE;
              diceyDialog({
                'icon': 'info',
                text: data.RESPONSEMESSAGE,
              });
            }
          }
        }
      } catch (e) {
        console.log(e);
        this.submitting = false;

        if (e.status === 404) {
          diceyDialog({
            title: "Error",
            text: "It appears you're offline, please check your network connection and try again",
            timer: null, icon: "error"
          })
        } else if (e.message === "Network Error") {
          diceyDialog({
            title: "Network Error",
            text: "Please check your network connection and try again",
            timer: null, icon: "error"
          })
        } else {
          diceyDialog({
            text: "Error submitting report. Please try again in a few moments",
            timer: null, icon: "error"
          })
        }
      }
    },

    submitReport (e) {
      e.preventDefault();
      if (this.isFtth) {
        this.sendFtthReportData();
      } else {
        this.sendReportData();
      }
    },
    handleMobileReportCategoryChange (event) {
      let category = event.target.value;
      console.log({ category });
      if (category === "fixed broadband") {
        this.$emit('is-broadband-changed', true);
      } else {
        this.$emit('is-broadband-changed', false);
      }
    },

    handleMobileReportTypeChange (event) {
      let reportType = event.target.value;

      if (reportType === "Slow Data Speed Issue" || reportType === "No Network Coverage") {
        this.getGeoCoordinates();
      }
    },

    handleFtthTypesChange (e) {
      console.log('changed');
      var value = e.target.value;
      const valueCode = value.split("=>")[0];
      //////////////////////////////////

      this.selectedFaultTypeTriplicates = this.faultTypesAndDescriptions[valueCode].faultDescriptions;

    },
    // msg emit event
    // updateMsisdnVerified (newValue) {
    // bus.$emit('msisdnVerifiedChanged', newValue)
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
  beforeCreate () {
    // let ftd = localStorage.faultTypesAndDescriptions;
    // if (!ftd) {
    //   this.faultTypesAndDescriptions = [];
    // }
    // else {
    // if (typeof ftd === 'string') {
    //   ftd = JSON.parse(localStorage.faultTypesAndDescriptions)
    //
    //   if (ftd.data) {
    //     ftd = ftd.data
    //   }
    // }
    // }
    // console.log({ftacb : ftd});
    // this.faultTypesAndDescriptions = [...(ftd)];
  },
  created () {
    // bus.$on('msisdnVerifiedChanged', (msisdnVerified) => {
    //   this.msisdnVerified = msisdnVerified
    // });
  },
  template: `
  <div class="col-12 col-md-8 col-lg-8 mx-auto">
    <div class="row justify-content-center">
      <div class="col">
        <div class="row justify-content-center">
          <div class="col-md-6 mx-auto ">
            <h5 class="text-center py-3 text-white bg-dark font-weight-light">Report a Fault</h5>
          </div>
        </div>
        <form>
          <!-- show this always -->
          <div class="row justify-content-center main-form-first" id="main-form-first">
            <div class="col-md-6 border-bottom">
              <div class="form-group select-box">
                <label for="reportCategory" class="form-label text-small">Report Category </label>
                <select title="category" class="form-control main_report_category" @change="handleMobileReportCategoryChange"
                        id="report-category" name="reportCategory" v-model.trim="category">
                  <option v-for="(category, c) in faultCategories" :value="category.value">
                    {{category.label}}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="category === 'main form' || category === '' " class="row justify-content-center main-form "
               id="main-form">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label text-small" for="report-type">Report Type</label>
                <input v-model.trim="commonFields.reportType" type="email" class="form-control rounded-0"
                       id="report-type" aria-describedby="emailHelp" name="MainFormReportType"
                       placeholder="Enter your email">
              </div>

              <div class="form-group">
                <label for="report-CommentMainForm"
                       class="form-label text-small">
                  Report Comment</label>
                <textarea v-model.trim="commonFields.reportComment" id="report-CommentMainForm"
                          class="form-control" rows="2" placeholder="Eg. I am not able to ....."
                          name="reportCommentMainform"></textarea>

              </div>

              <div class="form-group">
                <label for="incident-DateMainForm" class="form-label text-small">Incident Date</label>
                <input v-model.trim="commonFields.incidentDate" type="date" id="incident-DateMainForm"
                       placeholder="09/09/2020" class="form-control datepicker" name="incidentDateMainform">
              </div>

              <div class="form-group">
                <label for="alternative-ContactsMainform" class="form-label text-small">
                  Alternative Contact <span class="text-muted0">(Another number you can be reached on)</span>
                </label>
                <!-- class="form-label text-small">Alternative Contact (Another number you can be reached on)</label> -->
                <!-- <span class="text-muted00">(Another number you can be reached on)</span> -->
                <input v-model.trim="commonFields.alternativeContact" id="alternative-ContactsMainform"
                       class="form-control" placeholder="Eg. 0202xxxxxx"
                       name="alternativeContactsMainform">
                <!-- <span class="text-muted0">(Another number you can be reached on)</span> -->
              </div>
            </div>
          </div>

          <div v-if="category === 'fixed line'" id="fixed-lineform" class="row justify-content-center fixedLine-form">
            <div class="col-md-6">
              <div class="form-group">
                <label for="fixed-lineNumber" class="form-label text-small">Fixed Line Number</label>
                <input v-model.trim="fixedLineFormData.fixedLineFNumber" id="fixed-lineNumber"
                       class="form-control" placeholder="Eg. 0300xxxxxx" name="FixedLineNumber">
              </div>
              <div class="form-group">
                <label for="accountNumberFixedLine" class="form-label text-small">Account Number</label>
                <input v-model.trim="commonFields.accountNumber" type="text" id="account-numberFixedLine"
                       class="form-control" placeholder="Eg. 1112xxxx" name="accountNumberFixedLine">
              </div>

              <div class="form-group">
                <label for="accountNumberFixedLine" class="form-label text-small">User Id</label>
                <input v-model.trim="fixedLineFormData.userId" type="text" id="account-numberFixedLine"
                       class="form-control" placeholder="Eg. 1112xxxx" name="accountNumberFixedLine">
              </div>

              <div class="form-group">
                <label for="fixed-line-report-type" class="form-label text-small">Report Type</label>
                <div class="select-box">
                  <select v-model.trim="commonFields.reportType" class="form-control  required"
                          name="reportTypeFixedLine" id="fixed-line-report-type">
                    <option selected value="" style="font-weight: bold;">Select Category type</option>
                    <option value="Cannot Recieve Calls">Cannot Recieve Calls</option>
                    <option value="Password Request">Password Request</option>
                    <option value="Call Fowarding Request">Call Fowarding Request</option>
                    <option value="Caller id Presentation Request">Caller id Presentation Request</option>
                    <option value="No Dial Tone">No Dial Tone</option>
                    <option value="Noise on FixedLine">Noise on FixedLine</option>
                    <option value="Call Hunting Request">Call Hunting Request</option>
                    <option value="Cannot Make Calls">Cannot Make Calls</option>
                    <option value="IDD/International Call Request">IDD/International Call Request</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="report-commentFixedline" class="form-label text-small">Report Comment</label>
                <textarea v-model.trim="commonFields.reportComment" id="report-commentFixedline"
                          class="form-control" rows="2" placeholder="Eg. I am not able to ....."
                          name="reportCommentFixedLine"></textarea>
              </div>
              <div class="form-group">
                <label for="incident-dateFixedLine" class="form-label text-small">Incident Date</label>
                <input v-model.trim="commonFields.incidentDate" type="date" id="incident-dateFixedLine"
                       placeholder="09/09/2020" class="form-control datepicker" name="incidentDateFixedLine">
              </div>

              <div class="form-group">
                <label for="alternative-contactsFixedLine" class="form-label text-small">Alternative
                  Contact <span class="text-muted0">(Another number you can be reached on)</span>
                </label>
                <input v-model.trim="commonFields.alternativeContact" type="text" id="alternative-contactsFixedLine"
                       class="form-control" placeholder="Eg. 0202xxxxxx" name="alternativeContactsFixedLine">
              </div>
            </div>
          </div>

          <div v-if="category === 'ip services'" class="row justify-content-center ip-services-form"
               id="ip-services-form">
            <div class="col-md-6">
              <div class="form-group">
                <label for="user-idIpServices" class="form-label text-small">User ID</label>
                <input v-model.trim="ipServicesFormData.userId" type="text" id="user-idIpServices"
                       class="form-control" name="useridIpServices">
              </div>
              <div class="form-group">
                <label for="account-numberIpServices" class="form-label text-small">Account Number</label>
                <input v-model.trim="commonFields.accountNumber" type="text" id="account-numberIpServices"
                       class="form-control" placeholder="Eg. 111xxxxxx" name="accountNumberIpServices">
              </div>
              <div class="form-group">
                <label for="report-typeIpservices" class="form-label text-small">Report Type</label>
                <div class="select-box">
                  <select v-model.trim="commonFields.reportType" class="form-control  required"
                          name="reportTypeIpservices" id="report-typeIpservices">
                    <option selected value="" style="font-weight: bold;">Select
                      Category type
                    </option>
                    <option value="Fixed Line">Fixed Line</option>
                    <option value="Fixed Broadband">Fixed Broadband</option>
                    <option value="Ip issues">Ip issues</option>
                    <option value="Ip Activation Issues">Ip Activation Issues
                    </option>
                    <option value="Fixed IP Request">Fixed IP Request</option>
                    <option value="Fixed IP not working">Fixed IP not working
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="report-CommentIpServices"
                       class="form-label text-small">Report
                  Comment</label>
                <textarea v-model.trim="commonFields.reportComment" id="report-CommentIpServices"
                          class="form-control"
                          name="reportCommentIpServices" rows="2"
                          placeholder="Eg. I am not able to ....."></textarea>
              </div>
              <div class="form-group">
                <label for="incident-dateIpservices"
                       class="form-label text-small">Incident
                  Date</label>
                <input v-model.trim="commonFields.incidentDate" type="date" id="incident-dateIpservices"
                       placeholder="09/09/2020" class="form-control datepicker"
                       name="incidentDateIpservices">
              </div>

              <div class="form-group">
                <label for="alternative-contactIpServices" class="form-label text-small">Alternative Contact</label>
                <span class="text-muted0">(Another number you can be reached on)</span>
                <input v-model.trim="commonFields.alternativeContact" type="text"
                       id="alternative-contactIpServices"
                       class="form-control" placeholder="Eg. 0202xxxxxx"
                       name="alternativeContactIpServices">
              </div>
            </div>
          </div>

          <div v-if="category === 'vodafone cash'" id="vodafone-form"
               class="row justify-content-center vodafone-cash-form">
            <div class="col-md-6">
              <div class="form-group">
                <label for="vodafone-number" class="form-label text-small">Vodafone Number</label>
                <input v-model.trim="vodafoneCashFormData.phoneNumber" id="vodafone-number"
                       class="form-control" placeholder="Eg. 050xxxxxxx" name="vodafoneNumber">
              </div>
              <div class="form-group">
                <label for="accountNumberFixedLine"
                       class="form-label text-small">User Id</label>
                <input v-model.trim="vodafoneCashFormData.userId" type="text" id="account-numberFixedLine"
                       class="form-control" placeholder="Eg. 1112xxxx" name="accountNumberFixedLine">
              </div>
              <div class="form-group select-box">
                <label for="reportTypeVodacash" class="form-label text-small">Report Type</label>
                <select v-model.trim="commonFields.reportType" class="form-control required"
                        id="reportTypeVodacash" name="reportTypeVodacash">
                  <option selected value="" style="font-weight: bold;">Select Category type</option>
                  <option value="Register Request">Register Request</option>
                  <option value="Customer Request For Reversal">Customer Request For Reversal</option>
                  <option value="Cash Not Dispensed-atm-">Cash Not Dispensed-atm-</option>
                  <option value="Request For Account Suspension">Request For Account Suspension</option>
                  <option value="Account Balance Challenges">Account Balance Challenges</option>
                  <option value="Change Account Details">Change Account Details</option>
                  <option value="Agent Account Issues">Agent Account Issues</option>
                  <option value="Airtime Purchase Complains">Airtime Purchase Complains</option>
                  <option value="Bill Payment Issues">Bill Payment Issues</option>
                  <option value="Online Payment Issues">Online Payment Issues</option>
                  <option value="Fraudulent Issues">Fraudulent Issues</option>
                  <option value="Request For Reversal">Request For Reversal</option>
                  <option value="Cannot Receive SMS Notification">Cannot Receive SMS Notification</option>
                  <option value="Customer Voucher Complaints">Customer Voucher Complaints</option>
                  <option value="PIN Management">PIN Management</option>
                  <option value="Data Purchase Complaints">Data Purchase Complaints</option>
                  <option value="MMI Issues">MMI Issues</option>
                </select>
              </div>
              <div class="form-group">
                <label for="report-commentVodacash" class="form-label text-small">Report Comment</label>
                <textarea v-model.trim="commonFields.reportComment" id="report-commentVodacash"
                          class="form-control" rows="2" placeholder="Eg. I am not able to ....."
                          name="reportCommentVodacash">
                          </textarea>
              </div>
              <div class="form-group">
                <label for="incident-dateVodafonecash" class="form-label text-small">Incident Date</label>
                <input v-model.trim="commonFields.incidentDate" type="date" id="incident-dateVodafonecash"
                       placeholder="09/09/2020" class="form-control datepicker" name="incidentdateVodacash">
              </div>

              <div class="form-group">
                <label for="alternative-contactsVodacash" class="form-label text-small">Alternative Contact
                  <span class="text-muted0">(Another number you can be reached on)</span>
                </label>
                <input v-model.trim="commonFields.alternativeContact" type="text" id="alternative-contactsVodacash"
                       class="form-control" placeholder="Eg. 0202xxxxxx" name="alternativeContactVodacash">
              </div>
            </div>
          </div>

          <div v-if="category === 'mobile'" id="mobile-form" class="row justify-content-center mobile-form">
            <div class="col-md-6">
              <div class="form-group">
                <label for="mobile-numberForm" class="form-label text-small">Mobile Number</label>
                <input v-model.trim="mobileFormData.mobileNumber" type="text" id="mobile-numberForm"
                       class="form-control" placeholder="Eg. 0504xxxxxx" name="mobileNumberform">
              </div>
              <div class="form-group select-box">
                <label for="reportTypeMobile" class="form-label">Report Type</label>
                <select title="category type" v-model.trim="commonFields.reportType"
                        @change="handleMobileReportTypeChange"
                        class="form-control  required" name="reportTypeMobile" id="report-typeMobile">
                  <option selected value="" style="font-weight: bold;">Select Category type</option>
                  <option value="Cannot Bundle">Cannot Bundle</option>
                  <option value="Cannot Browse"> Cannot Browse</option>
                  <option value="Bundle Refunds">Bundle Refunds</option>
                  <option value="Cannot Recharge">Cannot Recharge</option>
                  <option value="Over Scatched Card">Over Scatched Card</option>
                  <option value="Recharge Not Reflecting">Recharge Not Reflecting</option>
                  <option value="SMS Issues">SMS Issues</option>
                  <option value="Cannot Send SMS">Cannot Send SMS</option>
                  <option value="Cannot Receive Calls">Cannot Receive Calls</option>
                  <option value="Roaming Issues">Roaming Issues</option>
                  <option value="Cannot Receive Receive SMS">Cannot Receive Receive SMS</option>
                  <option value="Lost Credit">Lost Credit</option>
                  <option value="Slow Data Speed Issue">Slow Data Speed</option>
                  <option value="No Network Coverage">No Network Coverage</option>
                </select>
              </div>
              <div class="form-group">
                <label for="reportCommentMobile" class="form-label text-small">Report Comment</label>
                <textarea title="comment" v-model.trim="commonFields.reportComment" id="report-commentMobile"
                          class="form-control" name="reportCommentMobile" rows="2"
                          placeholder="Eg. I am not able to .....">
                </textarea>
              </div>
              <div class="form-group">
                <label for="incidentDateMobile" class="form-label text-small">Incident Date</label>
                <input title="date" v-model.trim="commonFields.incidentDate" type="date" id="incident-dateMobile"
                       placeholder="03/03/2020" class="form-control datepicker" name="incidentDateMobile">
              </div>

<!--              <div class="form-group">-->
<!--                <label class="col-md-3  col-form-label text-small d-md-block d-none d-sm-none"></label>-->
<!--                <div class="col-md-9 col-6 col-sm-2 text-md-left"><p id="locale"></p></div>-->
<!--              </div>-->

              <!-- <div class="form-group">
                  <label class="col-md-10  col-form-label text-small d-md-block d-none d-sm-none"></label>
                  <div class="col-md-10 col-12 col-sm-12 text-md-right"><p id= "locale"></p></div>
              </div> -->
              <!-- <center><p id= "locale"></p></center> -->
              <div class="form-group"
                   v-show="commonFields.reportType === 'Slow Data Speed Issue' || commonFields.reportType === 'No Network Coverage'">
                <label for="Latitude" class="form-label text-small">Latitude<span
                    class="text-muted text-small">(correct if wrong)</span></label>
                <input title="latitude" v-model.trim="mobileFormData.latitude" id="lat" placeholder="Eg. -2.45334"
                       class="form-control" name="Latitude">
              </div>

              <div class="form-group"
                   v-show="commonFields.reportType === 'Slow Data Speed Issue' || commonFields.reportType === 'No Network Coverage'">
                <label for="Longitude" class="form-label text-small">Longitude
                  <span class="text-muted text-small">(correct if wrong)</span>
                </label>
                <input title="longitude" v-model.trim="mobileFormData.longitude" id="long"
                       placeholder="Eg. Near KFC" class="form-control" name="Longitude">
              </div>

              <div class="form-group">
                <label for="landmark-location" class="form-label text-small">Major Landmark <span
                    class="text-danger">*</span></label>
                <input v-model.trim="mobileFormData.majorLandmark" id="landmark-location"
                       placeholder="Eg. Near KFC" class="form-control" name="landmarkFromUser">
              </div>
              <div class="form-group">
                <label for="alternative-contactMobile" class="form-label text-small">Alternative Contact</label>
                <span class="text-muted0">(Another number you can be reached on)</span>
                <input v-model.trim="commonFields.alternativeContact" id="alternative-contactMobile"
                       class="form-control" placeholder="Eg. 0202xxxxxx" name="alternativeContactMobile">
              </div>
              <div class="form-group">
<!--                <label class="col-md-3  col-form-label text-small d-md-block d-none d-sm-none"></label>-->
<!--                <div class="col-md-9 col-12 col-sm-12 text-md-left">-->
                  <p class="detail text-muted text-smaller m-0"><span class="name">Please note</span>: By clicking submit, you are
                    agree that we use your location data </p>
<!--                </div>-->
              </div>
            </div>
          </div>

          <!--<div v-if="category === 'enterprise'" id="enterprise-form" class="row justify-content-center enterprise-form">
            <div class="col-md-6">
              <div class="form-group">
                <label for="user-idEnterprise" class="form-label text-small">User ID</label>
                <input v-model.trim="enterpriseFormData.userId" type="text" id="user-idEnterprise"
                       class="form-control"
                       name="userIdEnterprise">
              </div>
              <div class="form-group">
                <label for="accountNumberEnterprise" class="form-label text-small">Account Number</label>
                <input v-model.trim="commonFields.accountNumber" type="text" id="account-numberEnterprise"
                       class="form-control" placeholder="Eg. 1112xxxx"
                       name="accountNumberEnterprise">
              </div>
              <div class="form-group">
                <label for="mobile-numberForm" class="form-label text-small">Phone Number</label>
                <input v-model.trim="enterpriseFormData.phoneNumber" type="text" id="mobile-numberForm"
                       class="form-control" placeholder="Eg. 0504xxxxxx" name="ent-phone-number">
              </div>
              <div class="form-group">
                <label for="reportTypeEnterprise" class="form-label text-small">Report Type</label>
                <div class="select-box">
                  <select id="reportTypeEnterprise" v-model.trim="commonFields.reportType" class="form-control required"
                          name="reportTypeEnterprise">
                    <option selected value="" style="font-weight: bold;">Select Category</option>
                    <option value="Dedicated Internet">Dedicated Internet Issues</option>
                    <option value="Unable To Connect To Internet ">Unable To Connect To Internet</option>
                    <option value="Unstable Internet">Unstable Internet</option>
                    <option value="ISDN Down">ISDN Down</option>
                    <option value="MPLS Issues">MPLS Issues</option>
                    <option value="NLL Issues">NLL Issues</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="reportCommentEnterprise" class="form-label text-small">Report Comment
                </label>
                <textarea title="reportCommentEnterprise" v-model.trim="commonFields.reportComment"
                          id="report-commentEnterprise"
                          class="form-control"
                          name="reportCommentEnterprise" rows="2"
                          placeholder="Eg. I am not able to ....."></textarea>
              </div>
              <div class="form-group">
                <label for="incidentDateEnterprise"
                       class="form-label text-small">Incident Date
                </label>
                <input v-model.trim="commonFields.incidentDate" type="date" id="incident-dateEnterprise"
                       placeholder="09/09/2020" class="form-control datepicker"
                       name="incidentDateEnterprise">
              </div>

              <div class="form-group">
                <label for="alternative-contactFixedLine" class="form-label text-small">Alternative Contact</label>
                <span class="text-muted0">(Another number you can be reached on)</span>
                <input v-model.trim="commonFields.alternativeContact" type="text" id="alternative-contactFixedLine"
                       class="form-control" placeholder="Eg. 0202xxxxxx" name="alternativeContactEnterprise">
              </div>

            </div>
          </div>-->

          <div v-if="category === 'fixed broadband' && !isFtth" class="row justify-content-center fixed-broadband-form"
               id="fixed-broadband-form">
            <div class="col-md-6">
              <div class="form-group">
                <label for="user-idFbb" class="form-label text-small">User ID</label>
                <input v-model.trim="fixedBroadbandFormData.userId" type="text" id="user-idFbb" class="form-control"
                       name="userIdFbb">
              </div>
              <div class="form-group">
                <div class="form-group">
                  <label for="mobile-numberForm" class="form-label text-small">Phone Number</label>
                  <input v-model.trim="fixedBroadbandFormData.phoneNumber" type="text" id="mobile-numberForm"
                         class="form-control" placeholder="Eg. 0504xxxxxx" name="mobileNumberform">
                </div>
                <label for="account-numberFbb" class="form-label text-small">Account Number</label>
                <input v-model.trim="commonFields.accountNumber" type="text" id="account-numberFbb"
                       class="form-control" placeholder="Eg. 111xxxxx" name="accountNumberFbb">
              </div>
              <div class="form-group select-box">
                <label for="report-typeFbb" class="">ReportType</label>
                <select v-model.trim="commonFields.reportType" class="form-control required" name="reportTypeFbb"
                        id="report-typeFbb">
                  <option selected value="" style="font-weight: bold;">Select Category type</option>
                  <option value="FBB Data ReFund">FBB Data ReFund</option>
                  <option value="Link Is Down ">Link Is Down</option>
                  <option value="Cannot Send And Recieve Email">Cannot Send And Recieve E-mail</option>
                  <option value="Create E-mail">Create E-mail</option>
                  <option value="Connection Is Slow">Connection Is Slow</option>
                </select>
              </div>

              <div class="form-group">
                <label for="report-commentFbb" class="form-label text-small">Report Comment</label>
                <textarea v-model.trim="commonFields.reportComment" id="report-commentFbb"
                          class="form-control" rows="2" placeholder="Eg. I am not able to ......."
                          name="reportCommentFbb"></textarea>
              </div>
              <div class="form-group">
                <label for="incident-dateFbb" class="form-label text-small">Incident Date</label>
                <input v-model.trim="commonFields.incidentDate" type="date" id="incident-dateFbb"
                       name="incidentDateFbb" placeholder="09/09/2020" class="form-control datepicker">
              </div>

              <div class="form-group">
                <label for="alternative-contactFbb" class="form-label text-small">Alternative Contact
                  <span class="text-muted0">(Another number you can be reached on)</span>
                </label>
                <input v-model.trim="commonFields.alternativeContact" type="text" id="alternative-contactFbb"
                       class="form-control" placeholder="Eg. 0202xxxxxx" name="alternativeContactsFbb">
              </div>
            </div>
          </div>
          
          <div v-if="category === 'fixed broadband' && isFtth" class="row justify-content-center fixed-broadband-form" id="fixed-broadband-form">
            <div class="col-md-6">
              <div class="form-group select-box" id="faulTypesDiv">
                  <label for="report-typeFbb" class="form-label">Select Fault Type</label>
                  <select v-model.trim="faultTypesAndDescription" @change="handleFtthTypesChange($event)"
                          class="form-control required" name="reportTypeFbb" id="faultTypeSelect">
                    <option selected value="" style="font-weight: bold;">Select an Option</option>
                    <option v-for="(item, index) in faultTypesAndDescriptions_c" :value="item.val" :key="index"> {{item.faultType}} </option>
                  </select>
                </div>

              <div class="form-group" id="faultDescriptionsDiv">
                <label for="report-commentFbb" class="form-label text-small">Select Fault Description</label>
                
                <select v-model.trim="selectedFaultTypeTriplicate" class="form-control required" name="reportTypeFbbDesc" id="faultTypeTriplicates">
                  <option selected value="" style="font-weight: bold;">Select an Option</option>
                  <option v-for="(item, index) in selectedFaultTypeTriplicates_c" :value="index" :key="index"> {{item.FAULT_DESCRIPTION}} </option>
                </select>
              </div>
              <div class="form-group">
                <label for="report-commentFbb" class="form-label text-small">Report Comment</label>
                <textarea v-model.trim="commonFields.reportComment" id="report-commentFbb"
                          class="form-control" rows="2" placeholder="Eg. I am not able to ......."
                          name="reportCommentFbb"></textarea>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
               <div class="col-md-6">
              <div class="form-group">
                <div class="form-group">
                  <button class="btn btn-red d-block rounded-0 text-center border-0 text-white w-100"
                          @click="submitReport" :class="{disabled : submitting || category === ''}">Submit
                  </button>
                </div>
              </div>
            </div>
              </div>
        </form>
      </div>
    </div>
  </div>
  `
});
