

$(document).ready(function() {

  var masks = {};

  var mask0 = new circleMask();
  mask0.init(document.getElementById("mask0"), 121, 0);
  setTimeout(function() { mask0.draw(360); }, 250);

  masks.mask1 = new circleMask();
  masks.mask1.init(document.getElementById("mask1"), 121, 0);

  masks.mask2 = new circleMask();
  masks.mask2.init(document.getElementById("mask2"), 121, 120);

  masks.mask3 = new circleMask();
  masks.mask3.init(document.getElementById("mask3"), 121, 240);


  var $items  = $(".circle-move-container");
  var wHeight = $(window).outerHeight();
  var scrollDown, scrollDirection, lastScrollTop;
  


  if (typeof window.matchMedia !== 'undefined') {

      var mq = window.matchMedia( "(min-width: 1025px)" );

      if (mq.matches) {
          checkStep();

      }
      else {
          $(".circle-moving").addClass("in");
          masks.mask1.draw(120);
          masks.mask2.draw(240);
          masks.mask3.draw(360);
      }
  }
  else {
      $(".circle-moving").addClass("in");
      masks.mask1.draw(120);
      masks.mask2.draw(240);
      masks.mask3.draw(360);
  }






  function checkStep() {

      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

      $items.each(function() {

          var topOffset = $(this).offset().top;
          var el = $(this).find(".get-steps");

          if (scrollTop + (wHeight/2) > topOffset) {

              setTimeout(function() {
                  masks[el.attr("id")].draw(el.attr("data-to"));

              }, 250);
          }

      });

      resizeStepPage();
  }


  function resizeStepPage() {

      $(window).scroll(function() {

          scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

          if (scrollTop > lastScrollTop) {
              scrollDirection = "down";
          } else {
              scrollDirection = "up";
          }
          lastScrollTop = scrollTop;


          $items.each(function() {

              var topOffset = $(this).offset().top;
              var el = $(this).find(".get-steps");
              var elHeight = $(this).outerHeight();

              if (scrollDirection == "down") {

                  if (scrollTop + (wHeight/2) > topOffset) {

                      setTimeout(function() {
                          masks[el.attr("id")].draw(el.attr("data-to"));

                      }, 250);
                  }
              }
              else {

                  if (scrollTop + wHeight < topOffset + elHeight) {

                      masks[el.attr("id")].draw(el.attr("data-from"));
                  }
              }

          });
      });
  }




});




var circleMask = function() {

    this.radius = 1;
    this.angle = 1;
    this.angleTo = 1;
    this.steps = 1;
    this.el = "";
    this.interval = false;
    this.point = {};

    this.init = function(el, radius, angle) {

        this.el = el;
        this.radius = radius;
        this.angle = angle;

        this.point = this.polarToCartesian(this.radius, this.radius, this.radius, this.angle);

        var arch_flag = (angle <= 180) ? 0 : 1;

        var d = "M"+this.radius+","+this.radius+" L"+this.radius+",0  A"+this.radius+","+this.radius+" 0 "
            + arch_flag + ",1 " + this.point.x + "," + this.point.y + " z";

        this.el.setAttribute( 'd', d );
    };

    this.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {

        var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        }
    };

    this.draw = function(angleTo) {

        if (this.interval) {
            clearInterval(this.interval);
        }

        this.angleTo = angleTo;

        this.steps = (this.angleTo - this.angle) / 100;

        var self = this;

        this.interval = setInterval(function() { self.animate() }, 5);
    };

    this.animate = function() {

        this.angle = this.angle + this.steps;

        if (this.angle < 360) {

            this.init(this.el, this.radius, this.angle);
        }
        else {
            this.init(this.el, this.radius, 359.99);
            clearInterval(this.interval);
        }

        if (this.steps > 0) {
            if (this.angle >= this.angleTo) {
                clearInterval(this.interval);
            }
        }
        else {
            if (this.angle <= this.angleTo) {
                clearInterval(this.interval);
            }
        }
    }
};





function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // IE 12 => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}
