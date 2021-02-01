if (!window.submitter) {
  var trace_source = "js:web.vodafone.com.gh";
  var serviceDocUrl = "https://gcpsmapi.vodafone.com";
  var headers = {
    "x-vf-trace-source": trace_source,
    "x-vf-trace-source-version": "VF-GH-GCP-PROD",
    "x-vf-trace-application-name": "Vodafone GH",
  };
  var opts = {
    configureNetworkMonitoring: true,
  };
  var submitterVar = new sec.EventSubmitter(serviceDocUrl, headers, opts);
  window.submitter = submitterVar;
  sec.setVerbose = false;
}
