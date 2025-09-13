(function ($) {

  const wdtImageBoxWidgetHandler = function($scope) {
    const instance = new wdtImageBoxWidgetHandlerInit($scope);
    if($scope.find('.wdt-image-box-holder').data('settings')) {
      const settings = $scope.find('.wdt-image-box-holder').data('settings');
      if(settings['enable_popup']) {
        instance.init();
      }
      
      if(settings['enable_hover_class']) {
          instance.hover_active_class();
      }
      if(settings['enable_curve'] === 'yes') {
        const div1Position = settings['div1_position'] || 'top-left';
        const div2Position = settings['div2_position'] || 'bottom-right';
        const flexSpacerPosition = settings['flex_spacer_position'] || 'bottom-right';
        const $columns = $scope.find('.wdt-image-box-holder .wdt-content-item');

        $columns.each(function() {
          const $curveEffect = $(`
            <div class="wdt-curve-effect ${flexSpacerPosition}">
              <div class="wdt-flex-spacer curve1 ${div1Position}"></div>
              <div class="wdt-flex-spacer curve2 ${div2Position}"></div>
            </div>
          `);
          
          $(this).append($curveEffect);
        });
       
      }

    }

    if ($scope.find('.wdt-image-box-holder .wdt-rc-template-process-block')) {
      const settings = $scope.find('.wdt-image-box-holder').data('settings');
      if(settings['enable_click_class'] === 'yes') {
        $scope.find('.wdt-content-media-group .wdt-content-title').on('click', function(e) {
            e.preventDefault();
            var $clickedItem = $(this).closest('.wdt-content-item');
            var $holder = $(this).closest('.wdt-image-box-holder');
            var $detailGroup = $clickedItem.find('.wdt-content-detail-group');
            
            var isActive = $detailGroup.hasClass('wdt-active');
            
            $holder.find('.wdt-content-detail-group').removeClass('wdt-active');
            
            if (!isActive) {
                $detailGroup.addClass('wdt-active');
            }
        });
      }
    }

  };

  const wdtImageBoxWidgetHandlerInit = function($scope) {

    const $self = this;
    $self.init = function() {

      const $image_box_content_repeater = $scope.find('.wdt-content-image-wrapper');
      $image_box_content_repeater.each(function() {
  
        const $this_image_box = $(this);
        const $image_url = $this_image_box.find('img').attr('src');
        $self.onClickInit($this_image_box, $image_url);

      });

    };

    $self.onClickInit = function($this_image_box, $image_url) {

      $this_image_box.magnificPopup({
        items: {
          src: $image_url,
          type: 'image',
        },
        removalDelay: 500,
        showCloseBtn: true,
        enableEscapeKey: true,
        closeOnBgClick: true,
        mainClass: 'wdt-image-box-popup wdt-popup-box-window',
      });

    };

    $self.hover_active_class = function(){

      var $get_scope_name = $scope.find('.wdt-image-box-holder').hasClass('wdt-carousel-holder');

      if( $get_scope_name ) {

        var image_box_wdt_swiper = $scope.find('.wdt-image-box-holder .wdt-image-box-container .wdt-image-box-wrapper .swiper-slide');

        $scope.find('.wdt-image-box-holder .wdt-image-box-container .wdt-image-box-wrapper .swiper-slide:first-child').addClass('wdt-active');
        image_box_wdt_swiper.mouseover( function() {
          if( !($(this).hasClass('wdt-active')) ) {
            $scope.find('.wdt-image-box-holder .wdt-image-box-container .wdt-image-box-wrapper .swiper-slide').removeClass('wdt-active');
            $(this).addClass('wdt-active');
          }
        } );

      } else {

        var image_box_wdt_column = $scope.find('.wdt-image-box-holder .wdt-column-wrapper .wdt-column');

        $scope.find('.wdt-image-box-holder .wdt-column-wrapper .wdt-column:first-child').addClass('wdt-active');
        image_box_wdt_column.mouseover( function() {
          if( !($(this).hasClass('wdt-active')) ) {
            $scope.find('.wdt-image-box-holder .wdt-column-wrapper .wdt-column').removeClass('wdt-active');
            $(this).addClass('wdt-active');
          }
        } );

      }      

    };

  };

  $(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-image-box.default', wdtImageBoxWidgetHandler);
  });

})(jQuery);
