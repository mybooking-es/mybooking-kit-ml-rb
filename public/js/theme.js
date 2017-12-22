require(['jquery', 
         'bootstrap', 'bootstrap.select',
         'superfish','jquery.prettyPhoto','jquery.sticky',
         'jquery.easing','jquery.smoothscroll'
         ],function($){

'use strict';

// Cache
var body = $('body');
var isotopeContainer = $('.isotope');
var toTop = $('#to-top');
var navigation = $('.navigation');
var superfishMenu = $('ul.sf-menu');
var priceSliderRange = $('#slider-range');


// Slide in/out with fade animation function
jQuery.fn.slideFadeToggle = function (speed, easing, callback) {
    return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
};
//
jQuery.fn.slideFadeIn = function (speed, easing, callback) {
    return this.animate({opacity: 'show', height: 'show'}, speed, easing, callback);
};
jQuery.fn.slideFadeOut = function (speed, easing, callback) {
    return this.animate({opacity: 'hide', height: 'hide'}, speed, easing, callback);
};

jQuery(document).ready(function () {
    // Prevent empty links
    // ---------------------------------------------------------------------------------------
    $('a[href=#]').on('click', function (event) {
        event.preventDefault();
    });
    // Sticky header/menu
    // ---------------------------------------------------------------------------------------
    if ($().sticky) {
        $('.header.fixed').sticky({topSpacing: 0});
        //$('.header.fixed').on('sticky-start', function() { console.log("Started"); });
        //$('.header.fixed').on('sticky-end', function() { console.log("Ended"); });
    }
    // SuperFish menu
    // ---------------------------------------------------------------------------------------
    if ($().superfish) {
        superfishMenu.superfish();
    }
    $('ul.sf-menu a').on('click', function () {
        body.scrollspy('refresh');
    });
    // Fixed menu toggle
    $('.menu-toggle').on('click', function () {
        if (navigation.hasClass('opened')) {
            navigation.removeClass('opened').addClass('closed');
        } else {
            navigation.removeClass('closed').addClass('opened');
        }
    });
    $('.menu-toggle-close').on('click', function () {
        if (navigation.hasClass('opened')) {
            navigation.removeClass('opened').addClass('closed');
        } else {
            navigation.removeClass('closed').addClass('opened');
        }
    });
    //
    if ($('.content-area.scroll').length) {
        $('.open-close-area').on('click', function () {
            if ($('.wrapper').hasClass('opened')) {
                $('.wrapper').removeClass('opened').addClass('closed');
            } else {
                $('.wrapper').removeClass('closed').addClass('opened');
            }
        });
    }
    // Smooth scrolling
    // ----------------------------------------------------------------------------------------
    $('.sf-menu a, .scroll-to').on('click', function () {

        $('.sf-menu a').removeClass('active');
        $(this).addClass('active');
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 43
        }, {
            duration: 1200,
            easing: 'easeInOutExpo'
        });
        return false;
    });
    // prettyPhoto
    // ---------------------------------------------------------------------------------------
    if ($().prettyPhoto) {
        $("a[data-gal^='prettyPhoto']").prettyPhoto({
            theme: 'dark_square'
        });
    }
    // Scroll totop button
    // ---------------------------------------------------------------------------------------
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1) {
            toTop.css({bottom: '15px'});
        } else {
            toTop.css({bottom: '-100px'});
        }
    });
    toTop.on('click', function () {
        $('html, body').animate({scrollTop: '0px'}, 800);
        return false;
    });
    // countdown
    // ---------------------------------------------------------------------------------------
    if ($().countdown) {
        var austDay = new Date();
        austDay = new Date(austDay.getFullYear() + 1, 1 - 1, 26);
        $('#dealCountdown1').countdown({until: austDay});
        $('#dealCountdown2').countdown({until: austDay});
        $('#dealCountdown3').countdown({until: austDay});
    }
    // Price range / need jquery ui
    // ---------------------------------------------------------------------------------------
    if ($.ui) {
        if ($(priceSliderRange).length) {
            $(priceSliderRange).slider({
                range: true,
                min: 0,
                max: 500,
                values: [75, 300],
                slide: function (event, ui) {
                    $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
                }
            });
            $("#amount").val(
                    "$" + $("#slider-range").slider("values", 0) +
                    " - $" + $("#slider-range").slider("values", 1)
                    );
        }
    }
    // Shop categories widget slide in/out
    // ---------------------------------------------------------------------------------------
    $('.car-categories .arrow').on('click', function (event) {

        $(this).parent().parent().find('ul.children').removeClass('active');
        $(this).parent().parent().find('.fa-angle-up').addClass('fa-angle-down').removeClass('fa-angle-up');
        if ($(this).parent().find('ul.children').is(":visible")) {
            //$(this).find('.fa-angle-up').addClass('fa-angle-down').removeClass('fa-angle-up');
            //$(this).parent().find('ul.children').removeClass('active');
        }
        else {
            $(this).find('.fa-angle-down').addClass('fa-angle-up').removeClass('fa-angle-down');
            $(this).parent().find('ul.children').addClass('active');
        }
        $(this).parent().parent().find('ul.children').each(function () {
            if (!$(this).hasClass('active')) {
                $(this).slideFadeOut();
            }
            else {
                $(this).slideFadeIn();
            }
        });
    }
    );
    $('.car-categories ul.children').each(function () {
        if (!$(this).hasClass('active')) {
            $(this).hide();
        }
    });
    // Ripple effect on click for buttons
    // ---------------------------------------------------------------------------------------
    $(".ripple-effect").on('click', function (e) {
        var rippler = $(this);

        // create .ink element if it doesn't exist
        if (rippler.find(".ink").length == 0) {
            rippler.append("<span class='ink'></span>");
        }

        var ink = rippler.find(".ink");

        // prevent quick double clicks
        ink.removeClass("animate");

        // set .ink diametr
        if (!ink.height() && !ink.width())
        {
            var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
            ink.css({height: d, width: d});
        }

        // get click coordinates
        var x = e.pageX - rippler.offset().left - ink.width() / 2;
        var y = e.pageY - rippler.offset().top - ink.height() / 2;

        // set .ink position and add class .animate
        ink.css({
            top: y + 'px',
            left: x + 'px'
        }).addClass("animate");
    })
    updater();
});

jQuery(window).load(function () {
    // Scroll to hash
    if (location.hash != '') {
        var hash = '#' + window.location.hash.substr(1);
        if (hash.length) {
            body.delay(0).animate({
                scrollTop: jQuery(hash).offset().top
            }, {
                duration: 1200,
                easing: "easeInOutExpo"
            });
        }
    }

    updater();
});

function updater() {
    if ($().sticky) {
        $('.header.fixed').sticky('update');
    }

}


jQuery(window).scroll(function () {
    if ($().sticky) {
        $('.header.fixed').sticky('update');
    }
});
});