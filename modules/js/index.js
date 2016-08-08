/**
* Alert: it's a workaround(hack) to check if the user is starting to edit
* the page.
* It's useless to replace <span> tags with PopupButtonWidgets, so the
* replacement is done only in View mode.
*/
var checkVisualEditor = function(){
  var query = location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] === 'veaction'){
      return true;
    }
  }
  return false;
}
$(function () {
  if(!checkVisualEditor()){
    var annotations = $("span[class='easylink']");
    var popups = [];
    $.each(annotations, function(key, value){
      var popup = new OO.ui.PopupButtonWidget({
        label: value.getAttribute('data-title'),
        framed: false,
        id: value.getAttribute('data-babelnet-id'),
        popup: {
          head: true,
          label: $('<p><strong>' + value.getAttribute('data-title') + '</strong></p>'),
          $content: $('<p>' + value.getAttribute('data-gloss') + '</p><p>' + OO.ui.msg('easylink-ve-dialog-gloss-source') + value.getAttribute('data-gloss-source') + '</p>'),
          $footer: $("<p><a target='_blank' href='" + value.getAttribute('data-babel-link') + "'><img src='http://babelnet.org/imgs/babelnet.png'></a>" + "<a target='_blank' href='" + value.getAttribute('data-wiki-link') + "'><img src='http://image005.flaticon.com/28/png/16/33/33949.png'></a></p>"),
          padded: true,
          framed: true,
          align: 'forwards'
        }
      });
      popups.push(popup);
    });
    for(var i = 0; i< popups.length; i++ ){
      for(var k = 0; k<annotations.length; k++){;
        if(popups[i].label === annotations[k].getAttribute('data-title')){
          $(annotations[k]).replaceWith(popups[i].$element);
          break;
        }
      }
    }
  }
})
