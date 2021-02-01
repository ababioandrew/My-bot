Vue.component('modal-footer', {
  props: {
    primaryButton : {
      type : Object,
    },
    secondaryButton : {
      type : Object,
    }
  },
  data: function () {
    return {
    }
  },
  template: `<div class="modal fade" id="verifyOtpModal" tabindex="-1" role="dialog"
         aria-labelledby="verifyOtpModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-footer">  
            <button type="button" class="btn btn-secondary bg-white text-dark border-dark rounded-0" data-dismiss="modal">{{secondaryButton}}</button>
            <button id="verifyOtpButton" type="button" class="btn btn-primary btn-dark  rounded-0">{{primaryButton.title}}</button>
          </div>
        </div>
      </div>
    </div>`
});
