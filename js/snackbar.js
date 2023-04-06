/**
 * SnackBar.js
 *
 * This small component is borrowed from
 * https://codepen.io/wibblymat/pen/avAjq
 */


var createSnackbar = (function() {
  // Any snackbar that is already shown
  var previous = null;

/*
<div class="paper-snackbar">
  <button class="action">Dismiss</button>
  This is a longer message that won't fit on one line. It is, inevitably, quite a boring thing. Hopefully it is still useful.
</div>
*/

  return function(config) {
    var message = config.message,
      actionText = config.actionText,
      action = config.action,
      duration = config.duration;

    if (previous) {
      previous.dismiss();
    }
    var snackbar = document.createElement('div');
    snackbar.className = 'paper-snackbar';
    snackbar.dismiss = function() {
      this.style.opacity = 0;
    };
    var text = document.createTextNode(message);
    snackbar.appendChild(text);
    if (actionText) {
      if (!action) {
        action = snackbar.dismiss.bind(snackbar);
      }
      var actionButton = document.createElement('button');
      actionButton.className = 'action';
      actionButton.innerHTML = actionText;
      actionButton.addEventListener('click', action);
      snackbar.appendChild(actionButton);
    }
    setTimeout(function() {
      if (previous === this) {
        previous.dismiss();
      }
    }.bind(snackbar), duration || 5000);

    snackbar.addEventListener('transitionend', function(event, elapsed) {
      if (event.propertyName === 'opacity' && this.style.opacity == 0) {
        this.parentElement.removeChild(this);
        if (previous === this) {
          previous = null;
        }
      }
    }.bind(snackbar));



    previous = snackbar;
    document.body.appendChild(snackbar);
    // In order for the animations to trigger, I have to force the original style to be computed, and then change it.
    getComputedStyle(snackbar).bottom;
    snackbar.style.bottom = '0px';
    snackbar.style.opacity = 1;
  };
})();

//------------------------站长推送----------------------
(function () {
  setTimeout(function () {
    var bp          = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
      bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    } else {
      bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
  }, 2000);
})();
//------------------------站长推送----------------------

//------------------------f12----------------------
(function () {
  if(window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') return;
  document.onkeydown = function() {
    let e = window.event || arguments[0];
    if(e.keyCode == 123) {
      return false;
    } else if((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
      return false;
    } else if((e.shiftKey) && (e.keyCode == 121)){
      return false;
    }
  };
  document.oncontextmenu = function() {
    return false;
  }
})();
//------------------------f12----------------------
