// hover fold effect
$(document).ready(function(){
    $('#grid').hoverfold();
});

window.onload = function() {
  // submit button effect
  var submitBtn = document.querySelectorAll('.progress-button');
  // console.log(submitBtn);
  [].slice.call(submitBtn).forEach(function(btn, pos){
      new UIProgressButton(btn, {
        callback : function( instance ) {
          var progress = 0,
            interval = setInterval( function() {
              progress = Math.min( progress + Math.random() * 0.1, 1 );
              instance.setProgress( progress );

              if( progress === 1 ) {
                instance.stop( pos === 1 || pos === 3 ? -1 : 1 );
                clearInterval( interval );
              }
            }, 150 );
        }
      });
  });

  // button click effect
  initBt1();
  initBt2();
  initBt3();
  initBt4();
}

// mouse tracer effect
(function () {
    Elm.fullscreen(Elm.Main);
    // console.log(Elm);
}.call(this));


function getRandom(min, max){
  return Math.random() * (max - min) + min;
}

// Button 1
function initBt1() {
  var bt = document.querySelectorAll('.distorted-button')[0];
  var turbVal = { val: 0.000001 };
  var turb = document.querySelectorAll('#filter1 feTurbulence')[0];
  var btTl = new TimelineLite({ paused: true, onUpdate: function() {
    turb.setAttribute('baseFrequency', '0.00001 ' + turbVal.val); // Firefox bug is value is 0
  } });

  btTl.to(turbVal, 0.4, { val: 0.4 });
  btTl.to(turbVal, 0.2, { val: 0.000001 });

  bt.addEventListener('click', function() {
    btTl.restart();
  });
}

// Button 2
function initBt2() {
  var bt = document.querySelectorAll('.distorted-button')[1];
  var turbVal = { val: 0.000001 };
  var turb = document.querySelectorAll('#filter2 feTurbulence')[0];
  var btTl = new TimelineLite({ paused: true, onUpdate: function() {
    turb.setAttribute('baseFrequency', '0.00001 ' + turbVal.val); // Firefox bug is value is 0
  } });

  btTl.to(turbVal, 0.2, { val: 0.06 });
  btTl.to(turbVal, 0.2, { val: 0.000001 });

  bt.addEventListener('click', function() {
    btTl.restart();
  });
}

// Button3
function initBt3() {
  var bt = document.querySelectorAll('.distorted-button')[2];
  var particleCount = 12;
  var colors = ['#DE8AA0', '#8AAEDE', '#FFB300', '#60C7DA'];

  bt.addEventListener('click', function() {
    var particles = [];
    var tl = new TimelineLite();
    tl.to(bt.querySelectorAll('.button-bg'), 0.6, { scaleX: 1.05 });
    tl.to(bt.querySelectorAll('.button-bg'), 0.9, { scale: 1, ease: Elastic.easeOut.config(1.2, 0.4) }, 0.6);

    for (var i = 0; i < particleCount; i++) {
      particles.push(document.createElement('span'));
      bt.appendChild(particles[i]);
      particles[i].classList.add(i % 2 ? 'left' : 'right');

      var dir = i % 2 ? '-' : '+';
      var r = i % 2 ? getRandom(-1, 1)*i/2 : getRandom(-1, 1)*i;
      var size = i < 2 ? 1 : getRandom(0.4, 0.8);
      var tl = new TimelineLite({ onComplete: function(i) {
        particles[i].parentNode.removeChild(particles[i]);
        this.kill();
      }, onCompleteParams: [i] });

      tl.set(particles[i], { scale: size });
      tl.to(particles[i], 0.6, { x: dir + 20, scaleX: 3, ease: SlowMo.ease.config(0.1, 0.7, false) });
      tl.to(particles[i], 0.1, { scale: size, x: dir +'=25' }, '-=0.1');
      if(i >= 2) tl.set(particles[i], { backgroundColor: colors[Math.round(getRandom(0, 3))] });
      tl.to(particles[i], 0.6, { x: dir + getRandom(60, 100), y: r*10, scale: 0.1, ease: Power3.easeOut });
      tl.to(particles[i], 0.2, { opacity: 0, ease: Power3.easeOut }, '-=0.2');
    }
  });
}

// Button 4
function initBt4() {
  var bt = document.querySelectorAll('.distorted-button')[3];
  var btTxt = bt.querySelector('.button__text');
  var isPlaying = false;
  var turbVal = { val: 0.000001 };
  var turbValX = { val: 0.000001 };
  var turb = document.querySelectorAll('#filter4 feTurbulence')[0];
  var btTl = new TimelineLite({ paused: true, onUpdate: function() {
    turb.setAttribute('baseFrequency', turbVal.val + ' ' + turbValX.val);
  }, onComplete: function() {
    btTl.reverse();
  }, onReverseComplete: function() {
    btTl.restart();
  } });

  btTl.to(turbValX, 0.4, { val: 0.04, ease: Power0.easeNone }, 0);
  btTl.to(turbVal, 0.1, { val: 0.2 ,ease: Power0.easeNone }, 0);

  bt.addEventListener('click', function() {
    if(isPlaying) {
      btTxt.textContent = 'PLAY';
      btTl.pause()
      var btTl2 = new TimelineLite({ onUpdate: function() {
        turb.setAttribute('baseFrequency', turbVal.val + ' ' + turbValX.val);
      } });
      btTl2.to(turbVal, 0.1, { val: 0.000001 });
      btTl2.to(turbValX, 0.1, { val: 0.000001 }, 0);
      isPlaying = false;
    } else {
      btTxt.textContent = 'PAUSE';
      btTl.play();
      isPlaying = true;
    }
  });
}
