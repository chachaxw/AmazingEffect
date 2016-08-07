window.onload = function() {
  initBt7();
  // Button 7
  function initBt7() {
    var bt = document.querySelector('.distorted-button');
    var turbVal = { val: 0.000001 };
    var turb = document.querySelectorAll('#filter feTurbulence')[0];
    var btTl = new TimelineLite({ paused: true, onUpdate: function() {
      turb.setAttribute('baseFrequency', '0.00001 ' + turbVal.val); // Firefox bug is value is 0
    } });

    btTl.to(turbVal, 0.4, { val: 0.4 });
    btTl.to(turbVal, 0.2, { val: 0.000001 });

    bt.addEventListener('click', function() {
      btTl.restart();
    });
  }
}
(function () {
    Elm.fullscreen(Elm.Main);
    // console.log(Elm);
}.call(this));
$(document).ready(function(){
    $('#grid').hoverfold();
});
