(function ($) {

	const dtCarouselWidgetHandler = function($scope, $) {

        setTimeout( function() {

            const $carouselItem = $scope.find('.dt-carousel-holder');
            const $moduleId = $carouselItem.data('id');
            const $swiperItem = $carouselItem.find('.swiper');
            const $swiperUniqueId = $swiperItem.attr('id');
            const $swiperWrapper = $carouselItem.find('.swiper-wrapper');
            const $carouselSettings = $swiperItem.data('settings');

            if($carouselSettings === undefined) {
                return;
            }

        
            const $direction		  	= ($carouselSettings['direction'] !== undefined) ? ($carouselSettings['direction']) : 'horizontal';
            const $effect		  	    = ($carouselSettings['effect'] !== undefined) ? ($carouselSettings['effect']) : 'default';
            // const $grab_cursor          = ($effect == 'flip' || $effect == 'cards' || $effect == 'creative') ? true : false;
            const $free_mode            = ($effect == 'free_mode') ? true : false;
            const $slides_to_show	 	= ($carouselSettings['slides_to_show'] !== undefined) ? parseInt($carouselSettings['slides_to_show']) : 1;
            const $slides_to_scroll 	= ($carouselSettings['slides_to_scroll'] !== undefined) ? parseInt($carouselSettings['slides_to_scroll']) : 1;
            const $pagination			= ($carouselSettings['pagination'] !== undefined) ? ($carouselSettings['pagination']) : '';
            const $arrows			  	= ($carouselSettings['arrows'] !== undefined) ? ($carouselSettings['arrows'] == 'yes') : false;
            const $speed			 	= ($carouselSettings['speed'] !== undefined && $carouselSettings['speed'] != '') ? parseInt($carouselSettings['speed']) : 400;
            const $autoplay			  	= ($carouselSettings['autoplay'] !== undefined) ? ($carouselSettings['autoplay'] == 'yes') : false;
            const $autoplay_speed	 	= ($carouselSettings['autoplay_speed'] !== undefined && $carouselSettings['autoplay_speed'] != '') ? parseInt($carouselSettings['autoplay_speed']) : 20000;
            const $autoplay_direction   = ($carouselSettings['autoplay_direction'] !== undefined) ? ($carouselSettings['autoplay_direction']) : '';  
            const $allow_touch		    = ($carouselSettings['allow_touch'] !== undefined) ? ($carouselSettings['allow_touch'] == 'yes') : true;  
            const $loop				  	= ($carouselSettings['loop'] !== undefined) ? ($carouselSettings['loop'] == 'yes') : false;
            const $centered_slides		= ($carouselSettings['centered_slides'] !== undefined) ? ($carouselSettings['centered_slides'] == 'yes') : false;
            const $pause_on_interaction = ($carouselSettings['pause_on_interaction'] !== undefined) ? ($carouselSettings['pause_on_interaction'] == 'yes') : false;
            const $overflow_opacity = ($carouselSettings['overflow_opacity'] !== undefined) ? ($carouselSettings['overflow_opacity'] == 'yes') : false;
            const $unequal_height_compatability = ($carouselSettings['unequal_height_compatability'] === 'yes') ? true : false;
            const $space_between_gaps = $carouselSettings['space_between_gaps'];
            var $deviceMode = elementorFrontend.getCurrentDeviceMode();
            const $space_between = $space_between_gaps[$deviceMode] ? $space_between_gaps[$deviceMode] : 0;
            const $mouse_wheel_scroll = ($carouselSettings['mouse_wheel_scroll'] === 'yes') ? true : false;
            const $space_between_is=parseInt($space_between);
            // Initialize height if its vertical carousel
            if($direction == 'vertical') {
                const $height = parseInt($swiperItem.find('.swiper-slide:first .dt-content-item').height(), 10) + 20;
                $swiperWrapper.css({'height':$height+'px'});
            }
            // Build swiper options
            const swiperOptions = {
                initialSlide: 0,
                simulateTouch: true,
                // roundLengths: true,
                keyboardControl: true,
                paginationClickable: true,
                autoHeight: false,
                // grabCursor: $grab_cursor,
                freeMode: $free_mode,
                allowTouchMove: $allow_touch,
                effect: $effect,
                fadeEffect: {
                    crossFade: true
                },
                coverflowEffect: {
                    rotate: 30,
                    slideShadows: false,
                },
                cubeEffect: {
                    slideShadows: false,
                },
                slidesPerView: $slides_to_show,
                slidesPerGroup: $slides_to_scroll,
                loop: $loop,
                // loopFillGroupWithBlank: $loop,
                centeredSlides: $centered_slides,
                direction: $direction,
                speed: $speed,
                spaceBetween: $space_between_is,
                mousewheel: $mouse_wheel_scroll,
                speed: 600,
                parallax: true,
            }
            
            // Update breakpoints
            const $responsiveSettings = $carouselSettings['responsive'];
            const $responsiveData = {};
            $.each($responsiveSettings, function (index, value) {
                $responsiveData[value.breakpoint] = {
                    slidesPerView: value.toshow,
                    slidesPerGroup: value.toscroll
                };
            });
            swiperOptions['breakpoints'] = $responsiveData;
            // Arrow pagination
            if ($arrows) {
                swiperOptions.navigation = {
                    prevEl: '.dt-arrow-pagination-prev-'+$moduleId,
                    nextEl: '.dt-arrow-pagination-next-'+$moduleId
                };
            }

            // Other pagination
            if ($pagination != '') {
                if( $pagination == 'scrollbar' ) {
                    swiperOptions.scrollbar = {
                        el: '.dt-swiper-scrollbar-'+$moduleId,
                        type: $pagination,
                        hide: true
                    };
                } else {
                    swiperOptions.pagination = {
                        el: '.dt-swiper-pagination-'+$moduleId,
                        type: $pagination,
                        clickable: true
                    };
                }
            }
             // Autoplay direction
             $reversedirection = false;
             if($autoplay_direction == 'right') {
                 $reversedirection = true;
             }
            // Autoplay
            if ($autoplay) {
                swiperOptions.autoplay = {
                    delay: $autoplay_speed,
                    disableOnInteraction: $pause_on_interaction,
                    reverseDirection: $reversedirection,
                };
            }
            const swiperGallery = new Swiper('#'+$swiperUniqueId, swiperOptions);


            if($direction == 'vertical' && $unequal_height_compatability) {
                swiperGallery.on('slideChangeTransitionStart', function () {
                    const height = parseInt($swiperItem.find('.swiper-slide.swiper-slide-active .dt-content-item').height(), 10) + 20;
                        $swiperWrapper.animate({height:height}, 400);
                });
            }
            
            if($overflow_opacity) {
                $scope.find('.swiper').css({'overflow': 'visible'});
                // $scope.find('.swiper-slide').css({'opacity': 0.5});
                $scope.find('.swiper-slide.swiper-slide-active').css({'opacity': 1});
                $scope.find('.swiper-slide.swiper-slide-active').nextAll('*:lt('+(+$slides_to_show-1)+')').css({'opacity': 1});
            }

            setTimeout( function() {
                $scope.find('.swiper-slide-duplicate .elementor-invisible').removeClass('elementor-invisible');
            }, 400 );

        }, 400 );

    };

    const dtColumnWidgetHandler = function ($scope, $) {
        const $scopeColumn = $scope.find('.dt-column-wrapper');
        const $deviceMode = elementorFrontend.getCurrentDeviceMode();
    
        if( $scopeColumn.data('column-settings') ) {
            const $customDevices = $scopeColumn.data('column-settings');
            const $get_user_devices = ($customDevices['columnDevices'] !== undefined) ? ($customDevices['columnDevices']) : '';

            if( $get_user_devices != undefined ) {
                if ( $get_user_devices.indexOf($deviceMode) > -1 ) {
                    $scopeColumn.addClass('dt-snap-scroll');
                    $('.dt-column-pagination .dt-snap-scroll-pagination').css({ 'display': 'block' });
                } else {
                    $scopeColumn.removeClass('dt-snap-scroll');
                    $('.dt-column-pagination .dt-snap-scroll-pagination').css({ 'display': 'none' });
                }
            }
        }
    
        function doLayout() {
            const $columns = $scope.find('.dt-column');
            const $container = $scopeColumn[0];
    
            if (!$container || !$columns.length) {
                // console.warn('Container or columns not found within scope:', $scope);
                return;
            }
    
            const $column_width = $columns.outerWidth(true);
            const $prevButton = $scope.find('.dt-snap-scroll-pagination .dt-pagination-prev');
            const $nextButton = $scope.find('.dt-snap-scroll-pagination .dt-pagination-next');
    
            function updateButtonState() {
                const scrollLeft = $container.scrollLeft;
                const maxScroll = $container.scrollWidth - $container.clientWidth;
            
                $prevButton.toggleClass('disabled', scrollLeft <= 0).css('cursor', scrollLeft <= 0 ? 'not-allowed' : '');
                $nextButton.toggleClass('disabled', scrollLeft >= maxScroll).css('cursor', scrollLeft >= maxScroll ? 'not-allowed' : '');
            }
    
            updateButtonState();
    
            $prevButton.off('click').on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    const newScrollLeft = Math.max($container.scrollLeft - $column_width, 0);
                    $container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
                }
            });
    
            $nextButton.off('click').on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    const newScrollLeft = Math.min($container.scrollLeft + $column_width, $container.scrollWidth - $container.clientWidth);
                    $container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
                }
            });
    
            $container.addEventListener('scroll', updateButtonState);
    
        }
    
        doLayout();
    };

	$(window).on('elementor/frontend/init', function () {

		elementorFrontend.hooks.addAction('frontend/element_ready/dt-service-item.default', dtCarouselWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/dt-service-item.default', dtColumnWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/dt-service-list.default', dtCarouselWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/dt-service-list.default', dtColumnWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/dt-staff-item.default', dtCarouselWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/dt-staff-item.default', dtColumnWidgetHandler);

  	});

  })(jQuery);