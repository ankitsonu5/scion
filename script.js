$(document).ready(function () {
    // Initialize Slick Slider
    $('.hero-slider').slick({
        dots: true,
        infinite: true,
        speed: 1000,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        pauseOnHover: false
    });

    // Categories Carousel
    $('.creative-categories-carousel').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Show 3 items at a time
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        centerMode: true,
        variableWidth: false, // Standard width for rectangular cards
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    // Scroll Reveal Animation
    function reveal() {
        var reveals = $(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 50; // Lower threshold to trigger sooner

            if (elementTop < windowHeight - elementVisible) {
                $(reveals[i]).addClass("active");
            }
        }
    }

    // Navbar Scroll Effect
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
        reveal();
    });

    // Initial Reveal check
    reveal();
});
