jQuery.noConflict();
jQuery(document).ready(function($){

  // Ad popup close button
  var closeBtn = document.querySelector(".close-ad");
  if (closeBtn) {
    closeBtn.addEventListener("click", function() {
      document.getElementById("custom-ad-popup").style.display = "none";
    });
  }

  // Modern quantity 
  var newvar = jQuery('.quantity_modern input.input-text').attr('id'); 
  if (newvar) {
      newvar = '#' + newvar;

      jQuery(newvar).attr('style', 'display:none;');
      jQuery('#quanity_modern').removeAttr('style');

      jQuery('#quanity_modern').change(function() {
          var selectedValue = jQuery(this).val();

          if (selectedValue == 10) {
              jQuery(newvar).val(10);
              jQuery(this).attr('style', 'display:none;');
              jQuery(newvar).removeAttr('style');
          } else {
              var newvar_name = jQuery(newvar).attr('name');
              jQuery(newvar).removeAttr('name');  
              jQuery(newvar).attr('name', 'newvar_name'); 
          }
      });
  }

});

