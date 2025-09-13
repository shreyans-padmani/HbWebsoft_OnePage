(function ($) {

	const wdtCarouselWidgetHandler = function($scope, $) {

        setTimeout( function() {

            const $carouselItem = $scope.find('.wdt-carousel-holder');
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
            const $free_mode            = ($effect == 'free_mode') ? true : false;
            const $slides_to_show	 	= ($carouselSettings['slides_to_show'] !== undefined) ? parseInt($carouselSettings['slides_to_show']) : 1;
            const $pagination			= ($carouselSettings['pagination'] !== undefined) ? ($carouselSettings['pagination']) : '';
            const $arrows			  	= ($carouselSettings['arrows'] !== undefined) ? ($carouselSettings['arrows'] == 'yes') : false;
            const $speed			 	= ($carouselSettings['speed'] !== undefined && $carouselSettings['speed'] != '') ? parseInt($carouselSettings['speed']) : 400;
            const $autoplay			  	= ($carouselSettings['autoplay'] !== undefined) ? ($carouselSettings['autoplay'] == 'yes') : false;
            const $autoplay_speed	 	= ($carouselSettings['autoplay_speed'] !== undefined && $carouselSettings['autoplay_speed'] != '') ? parseInt($carouselSettings['autoplay_speed']) : 20000;
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
                const $height = parseInt($swiperItem.find('.swiper-slide:first .wdt-content-item').height(), 10) + 20;
                $swiperWrapper.css({'height':$height+'px'});
            }
            // Build swiper options
            const swiperOptions = {
                initialSlide: 0,
                simulateTouch: true,
                keyboardControl: true,
                paginationClickable: true,
                autoHeight: false,
                freeMode: $free_mode,
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
                loop: $loop,
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
                };
            });
            swiperOptions['breakpoints'] = $responsiveData;
            // Arrow pagination
            if ($arrows) {
                swiperOptions.navigation = {
                    prevEl: '.wdt-arrow-pagination-prev-'+$moduleId,
                    nextEl: '.wdt-arrow-pagination-next-'+$moduleId
                };
            }
            // Other pagination
            if ($pagination != '') {
                if( $pagination == 'scrollbar' ) {
                    swiperOptions.scrollbar = {
                        el: '.wdt-swiper-scrollbar-'+$moduleId,
                        type: $pagination,
                        hide: true
                    };
                } else {
                    swiperOptions.pagination = {
                        el: '.wdt-swiper-pagination-'+$moduleId,
                        type: $pagination,
                        clickable: true
                    };
                }
            }

            // Autoplay
            if ($autoplay) {
                swiperOptions.autoplay = {
                    delay: $autoplay_speed,
                    disableOnInteraction: $pause_on_interaction,
                };
            }
            const swiperGallery = new Swiper('#'+$swiperUniqueId, swiperOptions);

            //  Add swiper-pagination-lock conditionally
            const $paginationEl = $scope.find('.wdt-swiper-pagination');

            if (
                swiperGallery.slides.length <= swiperGallery.params.slidesPerView && 
                !swiperGallery.params.loop
            ) {
                $paginationEl.addClass('swiper-pagination-lock');
            } else {
                $paginationEl.removeClass('swiper-pagination-lock');
            }

            if ($mouse_wheel_scroll == true) {

                let currentSlideIndex = 0;
                const totalSlides = swiperGallery.slides.length;

                function disableMousewheel() {
                    swiperGallery.mousewheel.disable();
                }

                function enableMousewheel() {
                    swiperGallery.mousewheel.enable();
                }

                swiperGallery.on('slideChangeTransitionEnd', function () {
                    currentSlideIndex = swiperGallery.activeIndex;
                    if (currentSlideIndex === totalSlides - 1) {
                        disableMousewheel();
                    } else {
                        enableMousewheel();
                    }
                });

            }
            if($direction == 'vertical' && $unequal_height_compatability) {
                swiperGallery.on('slideChangeTransitionStart', function () {
                    const height = parseInt($swiperItem.find('.swiper-slide.swiper-slide-active .wdt-content-item').height(), 10) + 20;
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

	$(window).on('elementor/frontend/init', function () {

		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-advanced-carousel.default', wdtCarouselWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-counter.default', wdtCarouselWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-instagram.default', wdtCarouselWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-team.default', wdtCarouselWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-testimonial.default', wdtCarouselWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-image-box.default', wdtCarouselWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-events.default', wdtCarouselWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-donations.default', wdtCarouselWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-specifications.default', wdtCarouselWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-services.default', wdtCarouselWidgetHandler);

  	});

  })(jQuery);