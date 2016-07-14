jQuery(document).ready(function() {
  if(jQuery("body.tab-carousel")) {
    try {
      
      var totalWidth = 0;
      var currentPage = 0;
      var slideWidths = new Array();
      var tabs = jQuery("body.tab-carousel ul#set-rl_tabs-1");
      var tabsContainer = jQuery("body.tab-carousel .item-page > div > div > .nn_tabs-responsive");
      //if its first load then the prev button will be inactive
      tabsContainer.addClass("prev-inactive");
      tabsContainer.prepend('<div id="tab-bleed-hide"></div>');
      tabsContainer.prepend('<div id="tab-carousel-prev">&lt;</div>');
      tabsContainer.append('<div id="tab-carousel-next">&gt;</div>');
      var widthInterval = window.setInterval (function(){tabs.css({width: "8000px"});}, 100);
      window.setTimeout (function(){window.clearInterval(widthInterval)}, 1000);
      tabs.find("li").each(function() {
        if(jQuery(this).hasClass("active")) {
        }
      });
      function adjustSlideWidth() {
        totalWidth = 0;
        slideWidths = new Array(-40, -40);
        var slideArrayPosition = 1;
        //page width minus the area for the buttons
        var pageWidth = jQuery("#g-mainbar").width()-90;
        tabs.find("li").each(function() {
          totalWidth += jQuery(this).outerWidth(true); 
          slideWidths[slideArrayPosition] += jQuery(this).outerWidth(true);
          if(slideWidths[slideArrayPosition]-slideWidths[slideArrayPosition-1] > pageWidth) {
            slideWidths[slideArrayPosition] -= jQuery(this).outerWidth(true);
            slideArrayPosition++;
            slideWidths[slideArrayPosition] = slideWidths[slideArrayPosition-1]+jQuery(this).outerWidth(true);
          }
          if(jQuery(this).hasClass("active")) {
            currentPage = slideArrayPosition;
          }
        });
        slideWidths.pop();
      };
      function hideBleed() {
        var page = 1;
        var prevDiff = 0;
        //page width minus the area for the buttons
        var pageWidth = jQuery("#g-mainbar").width()-90;
        if(typeof tabsContainer.data("page") !== "undefined") {
          page = parseInt(tabsContainer.data("page"));
        }
        if(page > 1) {
          prevDiff = pageWidth-slideWidths[page-1]-20;
        }
        width = pageWidth*page-prevDiff-slideWidths[page]+20;
        jQuery("#tab-bleed-hide").css({width: width});
      }
      function clickPrevious() {
        var page = 0;
        if(typeof tabsContainer.data("page") !== "undefined") {
          page = parseInt(tabsContainer.data("page"));
        }
        if (page > 0) {
          page--;
          left = -slideWidths[page-1];
        } else {
          left = -slideWidths[0];
        }
        tabs.animate({left: left}, 400, "swing", function() {
          tabsContainer.data("page", page);
          tabsContainer.removeClass("next-inactive");
          if(page <= 1) {
            tabsContainer.addClass("prev-inactive");
          }
          hideBleed();
        });
      }
      function clickNext() {
        var page = 1;
        if(typeof tabsContainer.data("page") !== "undefined") {
          page = tabsContainer.data("page");
        }
        if (page >= slideWidths.length) {
          page = slideWidths.length - 1;
        }
        tabs.animate({left: -slideWidths[page]}, 400, "swing", function() {
          page++
          tabsContainer.data("page", page);
          tabsContainer.removeClass("prev-inactive");
          if(page >= slideWidths.length) {
            tabsContainer.addClass("next-inactive");
          }
          hideBleed();
        });
      }
      // Get something set for the slide width right away incase someone is clicking soon
      adjustSlideWidth();
      // Adjust the slide width to be accurate after fonts. etc have loaded
      var fixSizesInterval = window.setInterval(function() {
        adjustSlideWidth();
        hideBleed();
      }, 200);

      window.setTimeout(function() {
        window.clearInterval(fixSizesInterval)
          console.log(currentPage);
        if(currentPage > 0) {
          for(i = 1; i < currentPage; i++) {
            clickNext();
          }
        }
      }, 1001);
      // If the window resizes we need to adjust the slide width again
      jQuery(window).resize(function() {
        adjustSlideWidth();
        hideBleed();
      });
      // if someone clicks in teh correct area of the tabs it will trigger next or previous, we can't capture a click event on a seudo element like :before
      tabsContainer.on("click", "#tab-carousel-next", function(e) {
            clickNext();
      });
      tabsContainer.on("click", "#tab-carousel-prev", function(e) {
            clickPrevious();
      });
    } catch (e) {
      //oh well
    }
  }
});
