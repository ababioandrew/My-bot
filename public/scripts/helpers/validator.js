import * as yup from 'yup';
import * as matcher from '../../../helpers/validation'

export const isEmpty = function isEmpty (str) { //FIXME this is returning the wrong value
  return null === str || undefined === str ? true : /^[\s\xa0]*$/.test(str);
};

export const individualStep1Schema = yup.object().shape({
  firstName: yup.string().matches(matcher.isValidCustomerName),
  lastName: yup.string().matches(matcher.isValidCustomerName),
  Gender: yup.string().required('Please choose an Option'),
  idType: yup.string().required(),
  idNumber: yup.string().required("ID Number is required"),
  dob: yup.date().required(),
  email: yup.string().email('Must of the form abc@efg.xyz').required(),
  // postalTown: yup.string().required(),
  // region: yup.string().required(),
  // city: yup.string().required(),
  // town: yup.string().required(),
  // installationLocation: yup.string().required(),
  // workOrderType: yup.string().required(),
  mobileNumber: yup.string().matches(matcher.isGhanaMobileNumber, 'Must be a valid mobile number'),
  alternateNumber: yup.string().matches(matcher.mobileNumber, 'Must be a valid mobile number'),

  postalType: yup.string().required(),
  postalNumber: yup.string().required(),
  postalTown: yup.string().required(),
  digitalAddress: yup.string().matches(matcher.isGpDigitalAddress,
    { message: 'Invalid GP Digital Address', excludeEmptyString: true }),
  preferredServiceType: yup.string().required(),
  broadbandPackage: yup.string().required(),
  fixedVoicePackage: yup.string(),
});

export const individualStep2Schema = yup.object().shape({
  street: yup.string().required(),
  location: yup.string().required(),

  BpostalType: yup.string().required(),
  BpostalNumber: yup.string().required(),
  BpostalTown: yup.string().required(),

  majorLandmark: yup.string().required(),

  CPfirstName: yup.string().matches(matcher.isValidCustomerName),
  CPlastName: yup.string().matches(matcher.isValidCustomerName),
  CPemail: yup.string().email().required(),
  CPMobileNumber: yup.string().matches(matcher.isGhanaMobileNumber, 'Must be a valid mobile number'),
  CPalternateNumber: yup.string().matches(matcher.isGhanaMobileNumber, 'Must be a valid mobile number'),
  broadBandUsername: yup.string().required(),
  vodafoneCashNumber: yup.string().matches(matcher.isGhanaMobileNumber,
    { message: 'Must be a Ghanaian mobile number', excludeEmptyString: true }),
  survey: yup.string().required(),

  agentName: yup.string().required(),
  agentCode: yup.string().required(),
});

export const businessStep1Schema = yup.object().shape({
  firstName: yup.string().matches(matcher.isValidCustomerName),
  lastName: yup.string().matches(matcher.isValidCustomerName),
  businessName: yup.string().required(),
  idNumber: yup.string().required("ID Number is required"),
  idType: yup.string().required(),

  delegateIdType1: yup.string().required(),
  delegateIdNumber1: yup.string().required("Delegate 1 ID Number is required"),

  delegateIdType2: yup.string().required(),
  delegateIdNumber2: yup.string().required("Delegate 2 ID Number is required"),

  // dor: yup.string().required(),

  rootAccountId: yup.string(),
  // parentAccountId : yup.string().min(5).required(),
  dor: yup.date().required(),
  mobileNumber: yup.string().matches(matcher.mobileNumber, 'Must be a valid mobile number'),
  alternateNumber: yup.string().matches(matcher.mobileNumber, 'Must be a valid mobile number'),
  email: yup.string().email().required(),

  postalType: yup.string().required(),
  postalNumber: yup.string().required(),
  postalTown: yup.string().required(),
  digitalAddress: yup.string().matches(matcher.isGpDigitalAddress,
    { message: 'invalid GP Digital Address', excludeEmptyString: true }),
  delegateName1: yup.string().required(),
  delegateMobileNumber1: yup.string().matches(matcher.mobileNumber, 'Must be a valid mobile number'),
  delegateEmail1: yup.string().email().required(),
  delegateName2: yup.string().required(),
  delegateMobileNumber2: yup.string().matches(matcher.mobileNumber, 'Must be a valid mobile number'),
  delegateEmail2: yup.string().email().required(),

  // region: yup.string().required(),
  // city: yup.string().required(),
  // town: yup.string().required(),

  // installationLocation: yup.string().required(),


  // workOrderType: yup.string().required(),
  /*postalTypes: yup.string().required(),
  postalNumber: yup.string().required(),
  postalTown: yup.string().required(),
  postalCity: yup.string().required(),
  postalregion: yup.string().required(),*/
});

export const businessStep2Schema = yup.object().shape({
  street: yup.string().required(),
  majorLandmark: yup.string().required(),
  location: yup.string().required(),

  CPfirstName: yup.string().matches(matcher.isValidCustomerName),
  CPlastName: yup.string().matches(matcher.isValidCustomerName),
  CPemail: yup.string().email().required(),
  CPMobileNumber: yup.string().matches(matcher.mobileNumber, 'Must be a valid mobile number'),
  CPalternateNumber: yup.string().matches(matcher.mobileNumber, 'Must be a valid mobile number'),
  broadBandUsername: yup.string().required(),
  vodafoneCashNumber: yup.string().matches(matcher.isGhanaMobileNumber,
    { message: 'Must be a Ghanaian mobile number', excludeEmptyString: true }),
  survey: yup.string().required(),
  // agentName: yup.string().required(),
  agentCode: yup.string().required(),

  preferredServiceType: yup.string().required(),
  broadbandPackage: yup.string().required(),
  fixedVoicePackage: yup.string(),

  delegateName1: yup.string().min(2).required(),
  delegateEmail1: yup.string().min(2).required(),
  delegateMobileNumber1: yup.string().min(2).required(),

  delegateName2: yup.string().min(2).required(),
  delegateEmail2: yup.string().min(2).required(),
  delegateMobileNumber2: yup.string().min(2).required(),
});
