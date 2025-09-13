(function ($) {

    const wdtColumnWidgetHandler = function ($scope, $) {
		const $scopeColumn = $scope.find('.wdt-column-wrapper');
		const $deviceMode = elementorFrontend.getCurrentDeviceMode();

		if ($scopeColumn.data('column-settings')) {
			const settings = $scopeColumn.data('column-settings');
			const customDevices = settings['columnDevices'] || [];
			const enableProgress = settings['enableProgress'] === true;

			// Device check
			if (customDevices.indexOf($deviceMode) > -1) {
				$scopeColumn.addClass('wdt-snap-scroll');

				if (enableProgress) {
					$scope.find('.wdt-pagination-progress').show();
					$scope.find('.wdt-column-pagination').hide();
				} else {
					$scope.find('.wdt-pagination-progress').hide();
					$scope.find('.wdt-column-pagination').show();
				}
			} else {
				$scopeColumn.removeClass('wdt-snap-scroll');
				$scope.find('.wdt-pagination-progress').hide();
				$scope.find('.wdt-column-pagination').hide();
			}

			const $columns = $scope.find('.wdt-column');
			const $container = $scopeColumn[0];
			if (!$container || !$columns.length) return;

			const columnWidth = $columns.outerWidth(true);
			const $prevButton = $scope.find('.wdt-pagination-prev');
			const $nextButton = $scope.find('.wdt-pagination-next');

			const isRTL = $('html').attr('dir') === 'rtl';

			function updateProgressBar() {
				if (!enableProgress) return;

				const $progressBar = $scope.find('.wdt-progress-bar');
				if (!$progressBar.length) return;

				let scrollLeft = $container.scrollLeft;
				let maxScroll = $container.scrollWidth - $container.clientWidth;

				if (isRTL) {
					scrollLeft = Math.abs(scrollLeft);
					maxScroll = Math.abs(maxScroll);
				}

				const progress = Math.min((scrollLeft / maxScroll) * 100, 100);
				$progressBar.css('width', progress + '%');
			}

			function updateButtonState() {
				if (enableProgress) return; // no buttons, skip

				let scrollLeft = $container.scrollLeft;
				let maxScroll = $container.scrollWidth - $container.clientWidth;

				if (isRTL) {
					scrollLeft = Math.abs(scrollLeft);
					maxScroll = Math.abs(maxScroll);
				}

				$prevButton.toggleClass('disabled', scrollLeft <= 0).css('cursor', scrollLeft <= 0 ? 'not-allowed' : '');
				$nextButton.toggleClass('disabled', scrollLeft >= maxScroll).css('cursor', scrollLeft >= maxScroll ? 'not-allowed' : '');
			}

			$container.addEventListener('scroll', () => {
				updateProgressBar();
				updateButtonState();
			});

			if (!enableProgress) {
				$prevButton.off('click').on('click', function () {
					if (!$(this).hasClass('disabled')) {
						let newScrollLeft = isRTL
							? $container.scrollLeft + columnWidth
							: Math.max($container.scrollLeft - columnWidth, 0);
						$container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
					}
				});
				$nextButton.off('click').on('click', function () {
					if (!$(this).hasClass('disabled')) {
						let newScrollLeft = isRTL
							? $container.scrollLeft - columnWidth
							: Math.min($container.scrollLeft + columnWidth, $container.scrollWidth - $container.clientWidth);
						$container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
					}
				});
			}

			updateProgressBar();
			updateButtonState();
		}
	};

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-image-box.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-advanced-carousel.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-counter.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-instagram.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-team.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-testimonial.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-specifications.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-events.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-donations.default', wdtColumnWidgetHandler);
    });

})(jQuery);
