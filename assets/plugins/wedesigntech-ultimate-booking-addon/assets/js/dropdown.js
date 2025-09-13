jQuery(document).ready(function() {
	"use strict";

	/* Custom select design */
	jQuery('.dtstaff-drop-down').append('<div class="button"></div>');
	jQuery('.dtstaff-drop-down').append('<ul class="select-list"></ul>');
	jQuery('.dtstaff-drop-down select option').each(function() {
		var bg = jQuery(this).css('background-image');
		var text = jQuery(this).text();
  		var pos = text.indexOf("-");
  		var res1 = text.substring(0, pos);
  		var res2 = text.substring(pos+1);

		jQuery('.select-list').append('<li class="clsAnchor"><span value="' + jQuery(this).val() + '" style=background-image:' + bg + '></span><span class="staff-role">' + '<span class="staff-name">' + res1 + '</span>' +' <i>' + res2 + '</i></span></li>');
	});
	jQuery('.dtstaff-drop-down .button').html('<span style=background-image:' + jQuery('.dtstaff-drop-down select').find(':selected').css('background-image') + '></span><span>' + jQuery('.dtstaff-drop-down select').find(':selected').text() + '</span>' + '<a href="javascript:void(0);" class="select-list-link">Arrow</a>');
	jQuery('.dtstaff-drop-down ul li').each(function() {
		if (jQuery(this).find('span').text() == jQuery('.dtstaff-drop-down select').find(':selected').text()) {
			jQuery(this).addClass('active');
		}
	});
	jQuery('.dtstaff-drop-down .select-list').on('click', 'li', function() {
		var dd_text = jQuery(this).find('span.staff-role').text();
		var dd_img = jQuery(this).find('span:first').css('background-image');
		var dd_val = jQuery(this).find('span:first').attr('value');

		jQuery('.dtstaff-drop-down .button').html('<span style=background-image:' + dd_img + '></span>' + '<span class="staff-role">' + dd_text + '</span>' + '<a href="javascript:void(0);" class="select-list-link">Arrow</a>');
		jQuery('.dtstaff-drop-down .select-list span').parent().removeClass('active');
		jQuery(this).parent().addClass('active');
		jQuery('.dtstaff-drop-down select.dt-select-staff').val( dd_val );
		jQuery('.dtstaff-drop-down .select-list li').slideUp();
	});
	jQuery('.dtstaff-drop-down .button').on('click','a.select-list-link', function()
	{
		jQuery('.dtstaff-drop-down ul li').slideToggle();
	});
	/* Close dropdown when clicking outside */
    jQuery(document).on('click', function(event) {
        if (!jQuery(event.target).closest('.dtstaff-drop-down').length) {
            jQuery('.dtstaff-drop-down .select-list li').slideUp();
        }
    });
	/* End */
});
function doRegenerateSelect() {
	jQuery('.dtstaff-drop-down .button').html('');
	jQuery('.select-list').html('');
	jQuery('.dtstaff-drop-down select option').each(function() {
		var bg = jQuery(this).css('background-image');
		var text = jQuery(this).text();
  		var pos = text.indexOf("-");
  		var res1 = text.substring(0, pos);
  		var res2 = text.substring(pos+1);

		jQuery('.select-list').append('<li class="clsAnchor"><span value="' + jQuery(this).val() + '" style=background-image:' + bg + '></span><span class="staff-role">' + '<span class="staff-name">' + res1 + '</span>' +' <i>' + res2 + '</i></span></li>');
	});
	jQuery('.dtstaff-drop-down .button').html('<span style=background-image:' + jQuery('.dtstaff-drop-down select').find(':selected').css('background-image') + '></span><span> '+ jQuery('.dtstaff-drop-down select').find(':selected').text() + '</span>' + '<a href="javascript:void(0);" class="select-list-link">Arrow</a>');
	jQuery('.dtstaff-drop-down ul li').each(function() {
		if (jQuery(this).find('span').text() == jQuery('.dtstaff-drop-down select').find(':selected').text()) {
			jQuery(this).addClass('active');
		}
	});
}