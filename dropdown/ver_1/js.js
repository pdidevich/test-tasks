(function() {
    var elements = document.getElementsByClassName('menu__item');
    for (var i=0, l=elements.length; i<l; i++) {
        elements[i].addEventListener("touchstart", function(){}, true);
    }
})()
