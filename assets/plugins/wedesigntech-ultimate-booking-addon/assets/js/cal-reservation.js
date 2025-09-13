

jQuery(document).ready(function($) {
	"use strict";

    let allowedDays = [];

    function getAllAvailableDates() {

        var $staffid   = $('*[name=staff]').val();
        var $serviceid = $('*[name=services]').val();
        var $staff 	 = $('*[name=staff] :selected').text();
        var $service = $('*[name=services] :selected').text();
        var $monthyear = $('*[name=month_year]').val();

        $.ajax({
            type: 'POST',
            url:    ultimateBookingPro.ajaxurl,
            dataType: "JSON",
            data:   {
                action: 'ultimate_booking_pro_month_available_times',
                staffid   : $staffid,
                staff 	  : $staff ,
                serviceid : $serviceid,
                service   : $service,
                monthyear : $monthyear
            },
            success: function (response) {
                allowedDays = response.availableDates;
            }
        });

    }

    function EnableDates(date) {
        var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
        return [allowedDays.indexOf(string) >= 0];
    }

    $('.show-calendar').on('click', function (e) {

        e.preventDefault();

        $('#caldatepicker').slideDown();
            $('#caldatepicker').parents('.column').find('.cal-loader').show();

        getAllAvailableDates();

        setTimeout( function() {

            $('#caldatepicker').datepicker("option", "beforeShowDay", EnableDates);
            $('#caldatepicker').datepicker("refresh");
            $('#caldatepicker').parents('.column').find('.cal-loader').hide();

        }, 1800 );

    });

    $('#caldatepicker').datepicker({
        minDate: 0,
		dateFormat : 'yy-mm-dd',
		onSelect : function(date, inst) {

            if($('.dt-select-service :selected').val() == '' || $('.dt-select-staff :selected').val() == '') {
                alert(ultimateBookingProCal.staffServiceEmpty)
            } else {

                $(".dt-sc-complete-details").slideUp();

                var $date    = date;
                var $staffid   = $('*[name=staff]').val();
                var $serviceid = $('*[name=services]').val();
                var $staff 	 = $('*[name=staff] :selected').text();
                var $service = $('*[name=services] :selected').text();

                $.ajax({
                    method: 'POST',
                    url:    ultimateBookingPro.ajaxurl,
                    type:   'html',
                    data:   {
                        action: 'ultimate_booking_pro_cal_reserve_available_times',
                        date  	  : $date,
                        staffid   : $staffid,
                        staff 	  : $staff ,
                        serviceid : $serviceid,
                        service   : $service
                    },
                    complete: function(response){

                        $('#caldatepickerContent').slideDown();
                        $('#caldatepickerContent').html(response.responseText);

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

                        // Preparing total cost...
                        $('.total-cinfo-wrapper').find('span.total-cinfo-service').html($('*[name=services] :selected').text());
                        $('.total-cinfo-wrapper').find('span.total-cinfo-staff').html($('*[name=staff] :selected').text());

                        $.ajax({
                            method: 'POST',
                            url:    ultimateBookingPro.ajaxurl,
                            type:   'html',
                            data:   { action: 'ultimate_booking_pro_total_cost',
                                staffid   : $staffid,
                                serviceid : $serviceid
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

                    }
                });

            }

        },
        onChangeMonthYear  : function(year, month, inst) {

            $('#caldatepickerContent').slideUp();
            $(".dt-sc-complete-details").slideUp();
            $('#caldatepickerContent').html('');

            $('.dt-month-year').attr('value', '01-'+month+'-'+year);
            $(this).datepicker( "setDate", year+'-'+month+'-01' );

            setTimeout( function() {
                $('.show-calendar').trigger('click');
            }, 200 );

        }
	});

    jQuery('.dtstaff-drop-down .select-list').on('click', function(){

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

    });


});