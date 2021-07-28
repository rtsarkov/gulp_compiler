var vw = window.innerWidth;
var vh = window.innerHeight;
var sw = screen.width;
var sh = screen.height;
var pageScroll = window.pageYOffset || document.documentElement.scrollTop;

jQuery(document).ready(function ($) {

	/* PARAMS */

	$(window).resize(function () {
		vw = window.innerWidth;
		vh = window.innerHeight;
		sw = screen.width;
		sh = screen.height;
	});

	$(document).scroll(function () {
		pageScroll = window.pageYOffset || document.documentElement.scrollTop;
	});

	initInput();

	/* ACTIONS */

	// плавный скрол до элемента и отключение действий для ссылок "#"
	$('[href^="#"]').click(function (e) {
		e.preventDefault();
		if ($(this).attr('href').length > 1) {
			scroll2element(
				$($(this).attr('href')),
				1000,
				0,
				false
			);
		}
	});

	// placeholders
	var placeholder = '';
	$(document).on('focusin', 'input, textarea', function () {
		placeholder = $(this).attr('placeholder');
		$(this).attr('placeholder', '');
	});
	$(document).on('focusout', 'input, textarea', function () {
		$(this).attr('placeholder', placeholder);
	});
	// end - placeholders

	// ajax forms
	$(document).on('submit', '[data-form-ajax]', function (e) {
		e.preventDefault();
		sendForm($(this));
	});

	// всплывающие формы
	$('[data-popup-form]').click(function (e) {
		e.preventDefault();
		var form = $(this).data('popup-form');

		$.colorbox({
			href: '/ajax/form/' + form + '-form.html',
			className: 'colorbox-form',
			maxWidth: '100%',
			maxHeight: '100%',
			opacity: false,
		});
	});

	// colorbox
	$('.colorbox').colorbox({
		maxWidth: '100%',
		maxHeight: '100%',
		opacity: false
	});

	// colorbox buttons svg
	$(document).bind('cbox_complete', function () {
		initInput();
		$("#cboxPrevious").html('<svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg>');
		$("#cboxNext").html('<svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg>');
		$("#cboxClose").html('<svg class="icon icon-close"><use xlink:href="#icon-close"></svg>');
	});

	// slick
	$('.slider').slick({
		arrows: true,
		prevArrow: '<i class="slider__arrow slider__arrow--prev"><svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg></i>',
		nextArrow: '<i class="slider__arrow slider__arrow--next"><svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg></i>',

		dots: true,
		dotsClass: 'slider__dots',
		customPaging: function(slider, i) {
			return '';
		},

		autoplay: false,
		autoplaySpeed: 3000,

		infinite: false,
		adaptiveHeight: true,

		slidesToShow: 1,
		slidesToScroll: 1,

		mobileFirst: true,
		responsive: [{
			breakpoint: 1219,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			}
		}]
	});
    $('.top-header__city').colorbox({
        href: '/.ajax/view/header_regions.php',
        transition: "fade",
        maxWidth: '100%',
        maxHeight: '100%',
        opacity: false,
        data: {
            currentRegion: $(this).data('current-city')
        }
    });

    $('.modal-auth').colorbox({
        inline:true,
        maxWidth: '100%',
        maxHeight: '100%',
        opacity: false
    });

    // всплывающие формы
    $('[data-popup-form]').click(function (e) {
        e.preventDefault();
        var form = $(this).data('popup-form');
        $.colorbox({
            href: form,
            className: 'colorbox-form',
            maxWidth: '100%',
            maxHeight: '100%',
            opacity: false,
        });
    });

    $(document).bind('cbox_complete', function () {
        $("#cboxClose").html('<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNMTksNi40MUwxNy41OSw1TDEyLDEwLjU5TDYuNDEsNUw1LDYuNDFMMTAuNTksMTJMNSwxNy41OUw2LjQxLDE5TDEyLDEzLjQxTDE3LjU5LDE5TDE5LDE3LjU5TDEzLjQxLDEyTDE5LDYuNDFaIi8+Cjwvc3ZnPgo=" class="transparent" style="fill: black;"></img>');
    });
    $('.main-slider').slick({
        infinite: true,
        dots: false,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<div class="prev"><svg width="32" height="32" viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg" class="ui-icon ">\n' +
            '<path d="M8.60001 16.6L13.2 12L8.60001 7.4L10 6L16 12L10 18L8.60001 16.6Z" fill="#757575"></path>\n' +
            '</svg></div>',
        nextArrow: '<div class="next"><svg><use xlink:href="../images/icons/spritemap.svg#slider-arrow"></use></svg></div>'
    });


    $('[data-mega-menu-open]').click(function () {
        $('.middle-header__icon').toggleClass('open');
        $('.mega-menu').toggleClass('open');
    });

    $('[data-counter-minus]').click(function () {
        var $counter = $('.' + $(this).data('counter-minus'));
        var min = parseInt($counter.attr('min'));
        var newValue = parseInt($counter.val()) - 1;
        if (newValue < min) {
            $counter.val($counter.val());
        } else {
            $counter.val(newValue);
        }
    });

    $('[data-counter-plus]').click(function () {
        var $counter = $('.' + $(this).data('counter-plus'));
        var max = parseInt($counter.attr('max'));
        var newValue = parseInt($counter.val()) + 1;
        if (newValue > max) {
            $counter.val($counter.val());
        } else {
            $counter.val(newValue);
        }
    });

    $('.catalog-element-tabs__item[data-tab]').click(function () {
        let id = $(this).data('tab');
        $('.catalog-element-tabs__item[data-tab]').removeClass('active');
        $('.catalog-element-tabs__data[data-tab-id]').removeClass('active');
        $(this).addClass('active');
        $('.catalog-element-tabs__data[data-tab-id=' + id + ']').addClass('active');
    });
});

/* FUNCTIONS */

function sendForm($el) {
	var $form = $el,
		$btn = $form.find('button'),
		fd = new FormData($form[0]);

	if ($btn.hasClass('is-loading')) return;

	$.ajax({
		url: $form.attr('action'),
		type: $form.attr('method'),
		data: fd,
		processData: false,
		contentType: false,
		dataType: 'json',
		// dataType: 'html',
		beforeSend: function () {
			hideErrorFields($form);
			showBtnLoading($btn);
		},
		success: function (data) {
			// console.log('form success', data);
			setTimeout(function () {
				hideBtnLoading($btn);
				initInput();

				if (data.result) {
					$form[0].reset();
					if (data.message.length) {
						showPopupMessage(data.message);
					}
				} else {
					showErrorFields($form, data.errors);
				}
			}, 1000);
		},
		error: function (data) {
			// console.log('form error:', data);
			setTimeout(function () {
				hideErrorFields($form);
				hideBtnLoading($btn);
			}, 1000);
		}
	});

	function showErrorFields($form, errors) {
		$.each(errors, function (i, val) {
			$el = $form.find("[name='" + val + "']");
			if ($el.length) $el.addClass('is-error');
		});
	}
	function hideErrorFields($form) {
		$form.find('.is-error').removeClass('is-error');
	}

	function showBtnLoading($btn) {
		$btn.addClass('is-loading');
	}
	function hideBtnLoading($btn) {
		$btn.removeClass('is-loading');
	}
}

function showPopupMessage(text) {
	$.colorbox({
		html: '<div class="popup-message">' + text + '</div>',
		maxWidth: '100%',
		maxHeight: '100%',
		opacity: false,
		className: 'colorbox-message'
	});
}

function initInput() {
	if ($().datepicker) {
		$('input.date').datepicker({
			autoClose: true,
			toggleSelected: false,
			keyboardNav: false,
			minDate: new Date()
		});
	}
	if ($().inputmask) {
		$('[data-mask="phone"]').inputmask("+7-999-999-99-99");
	}
	if ($().styler) {
		setTimeout(function () {
			$(":not(.nostyle)").styler({
				singleSelectzIndex: 10,
				filePlaceholder: 'Файл не выбран',
				fileBrowse: 'Выбрать',
				fileNumber: 'Выбрано файлов: %s',
				onFormStyled: function () {
					$('.jq-selectbox__trigger-arrow').html('<svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></svg>');
					$('.jq-checkbox__div').html('<svg class="icon icon-checkbox"><use xlink:href="#icon-checkbox"></svg>');
				}
			});
		}, 100);
	}
}

function scroll2element($el, speed, offset, edges) {
	if (speed == undefined) speed = 'slow';
	if (offset == undefined) offset = 50;
	if (edges == undefined) edges = true;

	var scroll = $el.offset().top - offset,
		topEdge = window.pageYOffset,
		bottomEdge = window.pageYOffset + document.documentElement.clientHeight,
		bNeedScroll = edges ? (scroll < topEdge || scroll > bottomEdge) : true;

	if (bNeedScroll) {
		$('html, body').animate({
			scrollTop: scroll + 'px'
		}, speed);
	}
}