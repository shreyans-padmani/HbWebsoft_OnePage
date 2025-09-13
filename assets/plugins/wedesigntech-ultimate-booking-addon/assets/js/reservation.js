//appointment type2
jQuery(window).on('load', function(){
	if(jQuery('#appointment-step-checker').val() != 'false') {
		jQuery('#appointment-step').val(1);
	} else {
		jQuery('#appointment-step').val(2);
	}
});
// appointment type2

jQuery(document).ready(function($){
	"use strict";

	$(".dt-select-service").on('change', function(){

        // For type 3 template
        if($('#caldatepicker').length) {
            let currentDate = $('.dt-month-year').attr('data-currentdate');
            let currentDateRf = $('.dt-month-year').attr('data-currentdaterf');
            $('.dt-month-year').attr('value', currentDate);
            $('#caldatepicker').datepicker( "setDate", currentDateRf );
            setTimeout( function() {
                $('#caldatepicker').slideUp();
                $('#caldatepickerContent').slideUp();
                $(".dt-sc-complete-details").slideUp();
            }, 200 );
        }

		var $id = $(this).val();
		$.ajax({
			method:'POST',
			url: ultimateBookingPro.ajaxurl,
			type: 'html',
			data:{ action: 'ultimate_booking_pro_fill_staffs', service_id :$id },
			complete: function(response){
				if( response.status === 200 ) {
					var $append = "";
					if( $.trim(response.responseText).length > 0 ) {
						$append += response.responseText;
						$(".dt-select-staff").empty().append($append);
						// Generate Selection List...
						doRegenerateSelect();
					}
				}
			}
		});
	});

	//datepicker 

	$('[id^="datepicker"]').each(function () {
		$(this).datepicker({
			minDate: 0,
			dateFormat: 'yy-mm-dd'
		});
	});

	//appointment type2 starts
	if($('div.dt-sc-reserve-appointment2').length ){
		$('div.dt-sc-reserve-appointment2').on( "click", ".appointment-goback", function(e){

			$('.steps').hide();

			var curr_step_val = $('#appointment-step').val();
			var step_to_show = parseInt(curr_step_val, 10) - 1;

			$('.dt-sc-schedule-progress-wrapper .step'+curr_step_val).removeClass('dt-sc-current-step');
			$('.dt-sc-schedule-progress-wrapper .step'+step_to_show).removeClass('dt-sc-completed-step');
			$('.dt-sc-schedule-progress-wrapper .step'+step_to_show).addClass('dt-sc-current-step');

			$('.step' + step_to_show).fadeIn(800);

			$('#appointment-step').val(step_to_show);

			if(step_to_show == 1) {
				$('.dt-sc-goback-box').hide();
			}
		});

		function ultimate_booking_pro_calculate_step_value() {

			$('.dt-sc-goback-box').show();

			var curr_step_val = $('#appointment-step').val();
			var updated_step_val = parseInt(curr_step_val, 10) + 1;

			$('.dt-sc-schedule-progress-wrapper .dt-sc-schedule-progress').removeClass('dt-sc-current-step');
			$('.dt-sc-schedule-progress-wrapper .step'+curr_step_val).addClass('dt-sc-completed-step');
			$('.dt-sc-schedule-progress-wrapper .step'+updated_step_val).addClass('dt-sc-current-step');

			$('#appointment-step').val(updated_step_val);
			if(updated_step_val == 4 || updated_step_val == 1) { $('.appointment-goback').hide(); $('.dt-sc-goback-box').hide(); }
		}

		$('form[name="dt-sc-appointment-contactdetails-form"]').on('submit', function () {
			// Check the form is valid...
			if( $('form[name="dt-sc-appointment-contactdetails-form"]').valid() ) {
				var $firstname      = $('#firstname').val(),
				$lastname           = $('#lastname').val(),
				$phone              = $('#phone').val(),
				$emailid            = $('#emailid').val(),
				$address            = $('#address').val(),
				$city               = $('#city').val(),
				$state 				= $('#state').val(),
				$country 	 		= $('#country :selected').val(),
				$country_txt 		= $('#country :selected').text(),
				$pincode 			= $('#pincode').val(),
				$about_your_project = $('#about_your_project').val();

				$('#hid_firstname').val($firstname);
				$('#hid_lastname').val($lastname);
				$('#hid_phone').val($phone);
				$('#hid_emailid').val($emailid);
				$('#hid_address').val($address);
				$('#hid_city').val($city);
				$('#hid_state').val($state);
				$('#hid_pincode').val($pincode);
				$('#hid_country').val($country);
				$('#hid_about_your_project').val($about_your_project);

				var contact_details = '<ul>';
					if($firstname != '') { contact_details += '<li><span>'+ultimateBookingPro.name+'</span><p>' + $firstname + ' ' + $lastname + '</p></li>'; }
					if($phone != '') { contact_details += '<li><span>'+ultimateBookingPro.phone+'</span><p>' + $phone + '</p></li>'; }
					if($emailid != '') { contact_details += '<li><span>'+ultimateBookingPro.email+'</span><p>' + $emailid + '</p></li>'; }
					if($address != '') { contact_details += '<li><span>'+ultimateBookingPro.address+'</span><p>' + $address + '<br>' + $city + ', ' + $state + '<br>' + $country_txt + ' - ' + $pincode + '</p></li>'; }
					if($about_your_project != '') { contact_details += '<li><span>'+ultimateBookingPro.message+'</span><p>' + $about_your_project + '</p></li>'; }
				contact_details += '</ul>';

				$('#dt-sc-contact-info').html(contact_details);

				$('.dt-sc-contactdetails-box').hide();
				$('.dt-sc-aboutproject-box').show();
				$('.dt-sc-notification-box').show();

				ultimate_booking_pro_calculate_step_value();
			}

			return false;
		});

		$('body').on( "click", ".generate-schedule", function(e){

			var $serviceid     = $('#serviceid').val();
			var $staffid       = $('#staffid').val();
			var $staffids      = $('#staffids').val();
			var $aptdatepicker = $('#datepicker').val();

			if( $aptdatepicker == "Select Date" || $serviceid.length == "" || $staffid.length == "" ){
				alert(ultimateBookingPro.eraptdatepicker);
				return false;
			}

			$.ajax({
				method:'POST',
				url: ultimateBookingPro.ajaxurl,
				type: 'html',
				data:{ action: 'ultimate_booking_pro_generate_schedule', serviceid :$serviceid, staffid :$staffid, staffids :$staffids, datepicker :$aptdatepicker },
				beforeSend: function(){
					$(".dt-sc-timeslot-box").hide();
					$(".loader").show();
				},
				complete: function(response){
					$(".loader").hide();
					$(".dt-sc-info-box").hide();
					$(".appointment-ajax-holder").html(response.responseText);
					$(".dt-sc-timeslot-box").fadeIn(800);

                    $('.show-time-next').on('click', function (e) {

                        e.preventDefault();

                        var currentDate = $('#datepicker').datepicker( "getDate" );
                        currentDate.setDate(currentDate.getDate() + 1); // Add 1 day
                        $("#datepicker").datepicker( "setDate", currentDate );

                        $(".generate-schedule").trigger('click');

                    });

					$('html, body').animate({
						scrollTop: $('.dt-sc-timeslot-box').offset().top - 200
					}, 2000);
				}
			});

		});

		$('body').on( "click", "a.time-slot", function(e){

			e.preventDefault();

			var $daydate = $(this).data('daydate'),
				$time    = $(this).data('time'),
				$service = $('*[name=serviceid] :selected').text(),
				$staff   = $(this).data('staffname');

			var schedule_details = '<ul>';
				if($service != '') { schedule_details += '<li><span>Department:</span><p>' + $service + '</p></li>'; }
				if($staff != '') { schedule_details += '<li><span>Staff:</span><p>' + $staff + '</p></li>'; }
				if($daydate != '') { schedule_details += '<li><span>Date:</span><p>' + $daydate + '</p></li>'; }
				if($time != '') { schedule_details += '<li><span>Time:</span><p>' + $time + '</p></li>'; }
			schedule_details += '</ul>';

			$('#dt-sc-schedule-details').html(schedule_details);

			$('.dt-sc-schedule-box').hide();
			$('.dt-sc-contactdetails-box').fadeIn(800);

			// Return url update
			$.ajax({
				method: 'POST',
				url: 	ultimateBookingPro.ajaxurl,
				data: 	{
					action:  'ultimate_booking_pro_returnurl_request',
					service: $('.dt-select-service :selected').val(),
					staff: 	 $('.dt-select-staff :selected').val(),
					date:    $('#datepicker').val(),
					start: 	 '',
					end: 	 '',
					url:     $('.dt-sc-contactdetails-box.step2 #reserveloginform2 input[name="redirect_to"]').val()
				},
				dataType: 'html',
				success: function( response ) {
					$('.dt-sc-contactdetails-box.step2 #reserveloginform2 input[name="redirect_to"]').val(response);
				}
			});

			$("a.time-slot").removeClass('selected');
			$(this).addClass('selected');

			$("ul.time-table").find('li,ul.time-slots').removeClass('selected');
			$(this).parentsUntil("ul.time-table").addClass('selected');

			ultimate_booking_pro_calculate_step_value();
		 });

		$(".dt-sc-about-project-form .schedule-it").on('click', function(e){

			e.preventDefault();

			var $staffid   = $('a.time-slot.selected').data('staffid');
			var $serviceid = $('a.time-slot.selected').data('serviceid');
			var $start     = $('a.time-slot.selected').data('start');
			var $end       = $('a.time-slot.selected').data('end');
			var $date      = $('a.time-slot.selected').data('date');
			var $time      = $('a.time-slot.selected').data('time');

			var $userid  			= $(".dt-sc-appointment-contactdetails-form").find('input[name=hiduserid]').val();
			var $firstname          = $(".dt-sc-aboutproject-box #hid_firstname").val();
			var $lastname           = $(".dt-sc-aboutproject-box #hid_lastname").val();
			var $address            = $(".dt-sc-aboutproject-box #hid_address").val();
			var $city 				= $(".dt-sc-aboutproject-box #hid_city").val();
			var $state 				= $(".dt-sc-aboutproject-box #hid_state").val();
			var $pincode 			= $(".dt-sc-aboutproject-box #hid_pincode").val();
			var $country 			= $(".dt-sc-aboutproject-box #hid_country").val();
			var $phone              = $(".dt-sc-aboutproject-box #hid_phone").val();
			var $emailid            = $(".dt-sc-aboutproject-box #hid_emailid").val();
			var $about_your_project = $(".dt-sc-aboutproject-box #hid_about_your_project").val();

			if( typeof($start) != 'undefined' ) {
				$.ajax({
					method: 'POST',
					url:    ultimateBookingPro.ajaxurl,
					data: 	{
						action:    "ultimate_booking_pro_new_reservation2",
						staffid:   $staffid,
						serviceid: $serviceid,
						start: 	   $start,
						end: 	   $end,
						date: 	   $date,
						time: 	   $time,

						userid:    $userid,
						firstname: $firstname,
						lastname:  $lastname,
						address:   $address,
						city: 	   $city,
						state: 	   $state,
						pincode:   $pincode,
						country:   $country,
						phone: 	   $phone,
						emailid:   $emailid,

						aboutyourproject: $about_your_project,
					},
					dataType: 'json',
					beforeSend: function(){
						$('#dt-sc-ajax-load-image').show();
					},
					success: function( response ){
						$('.dt-sc-notification-box').show();
						if(response == 'Success') {
							$('.dt-sc-apt-success-box, .notify-buttons-wrapper').fadeIn(800);
							$("input.schedule-it").attr('disabled', 'disabled');
						} else {
							$('.dt-sc-apt-error-box').fadeIn(800);
						}
					},
					complete: function(){
						$('#dt-sc-ajax-load-image').hide();
						ultimate_booking_pro_calculate_step_value();
					}
				});
			} else {
				$("input.schedule-it").attr('disabled', 'disabled');
			}
		 });
	}

	//dt_admin.js
	jQuery('.select_start').on('change', function(){
		var $row = jQuery(this).parent(),
		$start_select = jQuery(this),
		$end_select = jQuery('.select_end', $row);

		if( $start_select.val() ){
			$end_select.show();
		}else{
			$end_select.hide();
			$start_select.find('option[selected="selected"]').removeAttr('selected');
			$end_select.find('option[selected="selected"]').removeAttr('selected');
		}

        jQuery('option', $end_select).each(function () {
            jQuery(this).show();
        });

		var start_time = $start_select.val();
		$current = $end_select.data('current');

		jQuery('option', $end_select).each(function(){
			if (jQuery(this).val() <= start_time) {
				jQuery(this).hide();
				jQuery(this).removeAttr('selected');
				if( $current < jQuery(this).val() ){
					jQuery('option:visible:first', $end_select).attr('selected', 'selected');
				}
			} else if( !$current || $current == '00:00' ){
				jQuery('option:visible:first', $end_select).attr('selected', 'selected');
			}
		});
	}).each(function(){
		var $row = jQuery(this).parent(),
		$start_select = jQuery(this),
		$end_select = jQuery('.select_end', $row);

		if( !jQuery(this).val() ){
			$end_select.hide();
			$start_select.find('option[selected="selected"]').removeAttr('selected');
			$end_select.find('option[selected="selected"]').removeAttr('selected');
		}
	}).trigger('change');
	//appointment type2 ends

	$(".start-time").on('change', function(){
		var $s_time = $(this).val(),
		$last = $('option:last', $(this));

		$(".end-time").empty();

		if($(this)[0].selectedIndex < $last.index() ){
			$('option', this).each(function () {
				if ($(this).val() > $s_time) {
					$(".end-time").append($(this).clone());
                }
            });
		} else {
			$(".end-time").append($last.clone()).val($last.val());
		}
	});

	function ultimate_booking_pro_staff_reservation() {
		var $date    = $("*[name=date]").val();
		var $stime   = $('*[name=start-time]').val();
		var $etime   = $('*[name=end-time]').val();
		var $staff   = $('*[name=staff]').val();
		var $service = $('*[name=services]').val();

		if( $staff.length > 0 || $service.length > 0 ) {
			//Getting available times...
			$.ajax({
				method: 'POST',
				url:    ultimateBookingPro.ajaxurl,
				type:   'html',
				data:   { action: 'ultimate_booking_pro_available_times',
					date  	  : $date,
					stime 	  : $stime,
					etime 	  : $etime,
					staffid   : $staff,
					staff 	  : $('*[name=staff] :selected').text(),
					serviceid : $service,
					service   : $('*[name=services] :selected').text()
				},
				complete: function(response){
					$(".loader").remove();
					if( response.status === 200 ) {
						var $append = "";
						if( $.trim(response.responseText).length > 0 ) {
							$append += response.responseText;
							$(".available-times").empty().append($append);
                            $('.show-time-next').on('click', function (e) {

                                e.preventDefault();

                                var currentDate = $('#datepicker').datepicker( "getDate" );
                                currentDate.setDate(currentDate.getDate() + 7); // Add 7 days
                                $("#datepicker").datepicker( "setDate", currentDate );

                                $(".show-time").trigger('click');

                            });
						}
					}
				}
			});
			//Preparing total cost...
			$('.total-cinfo-wrapper').find('span.total-cinfo-service').html($('*[name=services] :selected').text());
			$('.total-cinfo-wrapper').find('span.total-cinfo-staff').html($('*[name=staff] :selected').text());
			$.ajax({
				method: 'POST',
				url:    ultimateBookingPro.ajaxurl,
				type:   'html',
				data:   { action: 'ultimate_booking_pro_total_cost',
					staffid   : $staff,
					serviceid : $service
				},
				complete: function(response){
					if( response.status === 200 ) {
						var $append = "";
						if( $.trim(response.responseText).length > 0 ) {
							$append += response.responseText;
							$(".total-cinfo-wrapper span.total-cinfo-price").html($append);
						}
					}
				}
			});
		}else{
			alert("Please choose Service!");
		}
	}

	$(".start-time").each(function() {
		var $service = $('*[name=services]').val();
		if( $service.length > 0 ) {
			ultimate_booking_pro_staff_reservation();
		}
	});
	/* V */

	$(".show-time").on('click', function(e){

		$(".show_loader").show();

    	ultimate_booking_pro_staff_reservation();
		setTimeout(function(){
			$(".show_loader").hide();
		}, 3000);
    
    	e.preventDefault();
	});

	$(".dt-sc-update-details").on('click', function(e){
        $('html, body').animate({
            scrollTop: $('.dt-sc-reserve-appointment').offset().top
        },1200);
		e.preventDefault();
	});

	/* Time Slot Click */
	if( $("div.available-times").length ){
		$('div.available-times').on( "click", "a.time-slot", function(e){
			e.preventDefault();
			$(".dt-sc-complete-details").show();
			$('html, body').animate({
				scrollTop: $('.dt-sc-complete-details').offset().top
			},1200);

			// Return url update
			$.ajax({
				method: 'POST',
				url: 	ultimateBookingPro.ajaxurl,
				data: 	{
					action:  'ultimate_booking_pro_returnurl_request',
					service: $('.dt-select-service :selected').val(),
					staff: 	 $('.dt-select-staff :selected').val(),
					date:    $('#datepicker').val(),
					start: 	 $('.start-time :selected').val(),
					end: 	 $('.end-time :selected').val(),
					url:     $('.personal-info #reserveloginform input[name="redirect_to"]').val()
				},
				dataType: 'html',
				success: function( response ) {
					$('.personal-info #reserveloginform input[name="redirect_to"]').val(response);
				}
			});

			$("div.choose-payment").show();
			$("a.time-slot").removeClass('selected');
			$(this).addClass('selected');

			$("ul.time-table").find('li,ul.time-slots').removeClass('selected');
			$(this).parentsUntil("ul.time-table").addClass('selected');


			var $date    = $('a.time-slot.selected').data('date');
			var $time    = $('a.time-slot.selected').data('time');
            $('.total-cost-info .dt-sc-display-timing span').html($date + ' - ' + $time);

		});
	}

	// Booking login form toggle
	$('.showlogin').on('click', function (e) {
        $('.personal-info #reserveloginform, .dt-sc-contactdetails-box.step2 #reserveloginform2').slideToggle();
        e.preventDefault();
    });

	// Book Schedule
	$('form[name="frm-booking-reserve-default"]').on('submit', function (e) {

		// Check the form is valid...
		if( $('form[name="frm-booking-reserve-default"]').valid() ) {
			var $staff   = $('a.time-slot.selected').data('sid');
			var $service = $('*[name=services]').val();
			var $start   = $('a.time-slot.selected').data('start');
			var $end     = $('a.time-slot.selected').data('end');
			var $date    = $('a.time-slot.selected').data('date');
			var $time    = $('a.time-slot.selected').data('time');

			var $userid  = $("div.personal-info").find('input[name=hiduserid]').val();
			var $name    = $("div.personal-info").find('input[name=name]').val();
			var $lname   = $("div.personal-info").find('input[name=lname]').val();
			var $address = $("div.personal-info").find('input[name=address]').val();
			var $country = $("div.personal-info").find('select[name=cmbcountry]').val();
			var $city    = $("div.personal-info").find('input[name=city]').val();
			var $state   = $("div.personal-info").find('input[name=state]').val();
			var $pincode = $("div.personal-info").find('input[name=pincode]').val();
			var $phone   = $("div.personal-info").find('input[name=phone]').val();
			var $email   = $("div.personal-info").find('input[name=email]').val();
			var $body    = $("div.personal-info").find('textarea[name=note]').val();
			var $totalamount = $(".total-cinfo-price").text().replace('$', '').trim();

			var $payment = $("select[name='payment_type']").val();

			var $action = "ultimate_booking_pro_new_reservation";
			if( $payment == "paypal" ) {
				$action = "ultimate_booking_pro_paypal_request";
			} else if( $payment == "stripe" ) {
				$action = "ultimate_booking_pro_stripe_request";
			}

			if( typeof($start) != 'undefined' ) {
				$.ajax({
					method: 'POST',
					url: 	ultimateBookingPro.ajaxurl,
					data: 	{
						action: $action, staff: $staff, service: $service, start: $start, end: $end,
						userid: $userid, name: $name, lname: $lname, address: $address, country: $country, city: $city, payment_type:$payment,totalamount: $totalamount,
						state: $state, pincode: $pincode, phone: $phone, email: $email, body: $body, date: $date, time: $time
					},
					dataType: 'json',
					beforeSend: function(){
						$("input.schedule-it").attr('disabled', 'disabled').addClass('subloading');
						$('#dt-sc-ajax-load-image').show();
					},
					success: function( response ) {
						if( $payment != "stripe" ) {
							window.location = response.url;
						} else {
							var stripe = Stripe(ultimateBookingPro.stripe_pub_api);
							stripe.redirectToCheckout({ sessionId: response.id });
						}
					},
					complete: function(){
						$('#dt-sc-ajax-load-image').hide();
						$("input.schedule-it").removeAttr('disabled').removeClass('subloading');
					}
				});
			} else {
				$("input.schedule-it").attr('disabled', 'disabled');
			}
		}

		return false;
	});

	// Validate reservation type1 login starts
	$(".personal-info form#reserveloginform, .dt-sc-contactdetails-box.step2 #reserveloginform2").validate({
		rules: {
			log: {
				required: true,
				minlength: 3
			},
			pwd: {
				required: true
			}
		},
		messages: {
			log: '',
			pwd: ''
		}
	}); // Validate reservation type1 login ends

	// Validate reservation type1 starts
	$("form[name='frm-booking-reserve-default']").validate({
		rules: {
			name: {
				required: true,
				minlength: 3
			},
			lname: {
				required: true
			},
			address: {
				required: true,
				minlength: 5
			},
			cmbcountry: {
				required: true
			},
			city: {
				required: true
			},
			state: {
				required: true
			},
			pincode: {
				required: true
			},
			phone: {
				required: true
			},
			email: {
				required: true,
				email: true,
				dt_email_rule: true
			},
			payment_type: {
				required: function (element) {
					return $(".choose-payment").is(":visible");
				}
			},
			captcha: {
				required: true,
				equalTo: "#hiddencaptcha"
			},
			chkterms : {
				required: true
			}
		},
		messages: {
			name: 'First name is required.',
			lname: 'Last name is required.',
			address: 'Address is required.',
			city: 'City is required.',
			state: 'State is required.',
			pincode: 'Pincode is required.',
			phone: 'Phone number is required.',
			email: 'Email is required.',
			payment_type: 'Please select a payment option.',
			captcha: '',
			chkterms: 'Please agree to the terms and conditions.'
		},		
		errorPlacement: function (error, element) {
			if (element.attr("name") === "payment_type") {
				error.insertAfter(".choose-payment select");
			} else {
				error.insertAfter(element);
			}
		}
	}); // Validate reservation type1 ends

	// Validate customer profile starts
	$(".dt-sc-view-reservations form#updateuser").validate({
		rules: {
			name: {
				required: true,
				minlength: 3
			},
			lname: {
				required: true
			},
			address: {
				required: true,
				minlength: 5
			},
			cmbcountry: {
				required: true
			},
			city: {
				required: true
			},
			state: {
				required: true
			},
			pincode: {
				required: true
			},
			phone: {
				required: true
			},
			email: {
				required: true,
				email: true,
				dt_email_rule: true
			},
			pass1: {
				required: true
			},
			pass2: {
				required: true,
				equalTo: "#pass1"
			}
		},
		messages: {
			name: '',
			lname: '',
			address: '',
			cmbcountry: '',
			city: '',
			state: '',
			pincode: '',
			phone: '',
			email: '',
			pass1: '',
			pass2: ''
		}
	}); // Validate customer profile ends

	// Validate reservation type2 starts
	$("form[name='dt-sc-appointment-contactdetails-form']").validate({
		rules: {
			firstname: {
				required: true,
				minlength: 3
			},
			lastname: {
				required: true
			},
			address: {
				required: true,
				minlength: 5
			},
			cmbcountry: {
				required: true
			},
			city: {
				required: true
			},
			state: {
				required: true
			},
			pincode: {
				required: true
			},
			phone: {
				required: true
			},
			emailid: {
				required: true,
				email: true,
				dt_email_rule: true
			},
			about_your_project: true,
			chkterms : {
				required: true
			}
		},
		messages: {
			firstname: 'First name is required.',
			lastname: 'Last name is required.',
			address: 'Address is required.',
			city: 'City is required.',
			state: 'State is required.',
			pincode: 'Pincode is required.',
			phone: 'Phone number is required.',
			emailid: 'Email is required.',
			about_your_project: '',
			chkterms: 'Please agree to the terms and conditions.'
		}		
	}); // Validate reservation type2 ends

	// Reservation Form type2...

	$( ".dt-sc-service-item.type2" ).each(function() {

		var this_div = $(this);
		var datepic = this_div.find('#datepicker');
		var button_div = this_div.find('.dt-sc-button.booking')
		button_div.on("click", function(){
			$('.dt-sc-service-item-type2').addClass("active");
			$('.dt-sc-service-item-type2').removeClass("hidden");
			$('html').css({overflow: 'hidden'});
		});
	});

	$('.dt-sc-service-item-type2-close').on('click', function (e) {
        $(".dt-sc-service-item-type2").removeClass("active");
		$('.dt-sc-service-item-type2').addClass("hidden");
		$('html').css({overflow: 'visible'});
		e.preventDefault();
	});

	$( ".dt-sc-service-item.type2" ).each(function() {
		const $serviceid = $(this).data('id');

		$("form[name='reservation-schedule-form-type2-" + $serviceid + "']").validate({
			rules: {
				services: {
					required: true
				},
				date: {
					required: true
				},
				staff : {
					required: true
				}
			},
			messages: {
				services: '',
				date: '',
				staff: ''
			}
		});

		$("form[name='reservation-schedule-form-type2-" + $serviceid + "'] input.hasDatepicker").on('change', function(e) {
			var $value = $(this).val();

			if($value.length > 0){
				$(this).removeClass('error').addClass('valid');
				$(this).attr('aria-invalid', false);
				$(this).prev('.placeholder').hide();
			}
		});

	});

	// Re-check when the services field value changes
	$( ".dt-sc-reservation-form" ).each(function() {
			
		$("#services").on("change", function() {
			$(".dt-staff-services-frm").find(".placeholder").css('display', 'none');
		});
		if ($("#services").find("valid")){
			$(".dt-staff-services-frm").find(".placeholder").css('display', 'none');
		}

	});

	$('#datepickertype').datepicker({
		minDate: 0,
		dateFormat : 'yy-mm-dd'
	})
	// Reservation Form...
	$("form[name='reservation-schedule-form']").validate({
		rules: {
			cli_name: {
				required: true
			},
			cli_email: {
				required: true,
				email: true
			},
			services: {
				required: true
			},
			date: {
				required: true
			},
			staff : {
				required: true
			}
		},
		messages: {
			cli_name: 'Name is required.',
			cli_email: {
				required: 'Email is required.',
				email: 'Please enter a valid email address.'
			},
			services: 'Please select a service.',
			date: 'Please select a date.',
			staff: 'Please select a staff member.'
		}
	});

	$("form[name='reservation-schedule-form'] input.hasDatepicker ").on('change', function(e) {
		var $value = $(this).val();

		if($value.length > 0){
			$(this).removeClass('error').addClass('valid');
			$(this).attr('aria-invalid', false);
			$(this).prev('.placeholder').hide();
		}
	});

	$('.placeholder').on('click', function() {
  		$(this).siblings('input').focus();
	});
	$('.frm-control').on('focus', function() {
  		$(this).siblings('.placeholder').hide();
	});

	$('.frm-control').on('blur', function() {
		var $this = $(this);
		var val = $this.val();
		if (!val || val.length === 0) {
			$(this).siblings('.placeholder').show();
		}
	});
	$('.frm-control').blur();

	$.validator.addMethod("dt_email_rule", function(value, element) {
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}, "Enter a valid email address.");
	/* Book Schedule */


	//Services list widget 
	$('.dt-sc-content-media-group').each(function() {
        var $group = $(this);
        var $elementsGroup = $group.find('.dt-sc-content-media-elements-group');

        if ($elementsGroup.length) {
            var height = $elementsGroup.outerHeight(true); 
            $group.css('--wdt-media-group-height', height + 'px');
            // $group.css('height', height + 'px');
        }
    });

	// services list click class

	$('.wdt-services-active-class').each(function() {
		var $wrapper = $(this);
		var $items = $wrapper.find('.dt-sc-content-item');
		$items.first().addClass('wdt-active');
		
		$items.on('click', function() {
			if (!$(this).hasClass('wdt-active')) {
				$items.removeClass('wdt-active');
				$(this).addClass('wdt-active');
			}
		});
	});


});
jQuery(document).ready(function ($) {
    $('#ubpro-login-form').on('submit', function (e) {
        e.preventDefault(); 

        let formData = $(this).serialize(); 
        let errorContainer = $('#ubpro-login-error');

        $.ajax({
            type: 'POST',
            url: ultimateBookingPro.ajaxurl,
            data: formData,
            dataType: 'json',
            beforeSend: function () {
                errorContainer.hide().text('');
            },
            success: function (response) {
                let message = $('<div>').html(response.data.message).text();

                if (response.success) {
                    errorContainer.css('color', 'green').text(message).show();
                    setTimeout(function () {
                        location.reload();
                    }, 1500);
                } else {
                    errorContainer.css('color', 'red').text(message).show();
                }
            }
        });
    });
});

jQuery(document).ready(function ($) {
	let loginForm = $('#ubpro-login-form');

	loginForm.hide();

	$('.showlogin').on('click', function (e) {
		e.preventDefault();
		loginForm.slideToggle();
	});
});