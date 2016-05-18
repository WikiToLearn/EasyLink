/* Get the Wikitext */
function getWikitext(callback) {
  var dom = ve.init.target.getSurface().getDom();
  ve.init.target.serialize(dom, function(wikitext) {
    //var noMath = wikitext.replace(/<math>.*<\/math>/g, '');
    //var cleanText = noMath.replace(/<dmath>\n*.*\n*<\/dmath>/g, '');
    callback(wikitext);
  });
}

/* Get HTML text or HTML with tags 
var HTML = (function(){
  var getText = function(){
    var _DOMObj = ve.init.target.getSurface().getDom();
    console.warn("###outerTEXT###");
    return _DOMObj.body.outerText;
  };
  var getHTMLToString = function(){
    var _DOMObj = ve.init.target.getSurface().getDom();
    console.warn("###outerHTML###");
    return _DOMObj.body.outerHTML;
  };
  return{
    getText : getText,
    getHTMLToString : getHTMLToString
  };
})();*/



/* Create a dialog */
ve.ui.easyLinkDialog = function(manager, config) {
  // Parent constructor
  ve.ui.easyLinkDialog.parent.call(this, config);
};

/* Inheritance */

OO.inheritClass(ve.ui.easyLinkDialog, OO.ui.ProcessDialog);

ve.ui.easyLinkDialog.prototype.getActionProcess = function(action) {
  var dialog = this;
  if (action === 'analyze') {
    dialog.layoutProgress.toggle(true);
    return new OO.ui.Process(function() {
      dialog.analyze(function(results) {
        if (results) {
          dialog.pollingAPI(results);
          /*        $.when(dialog.showResults(results)).done(function(){
                    dialog.fieldProgress.toggle(false);
                    dialog.actions.setMode('results');
                    dialog.stackLayout.setItem(dialog.panelResults);
                  });*/
        }
      });
    }, this);
  } else if (action === 'help') {
    this.actions.setMode('help');
    //Show help panel
    this.stackLayout.setItem(this.panelHelp);

  } else if (action === 'back') {
    this.actions.setMode('intro');
    //Show intro panel
    this.stackLayout.setItem(this.panelIntro);
  }
  return ve.ui.easyLinkDialog.super.prototype.getActionProcess.call(this, action);
};

/* Set the body height */
ve.ui.easyLinkDialog.prototype.getBodyHeight = function() {
  return 300;
};

/* Static Properties */
ve.ui.easyLinkDialog.static.name = 'easyLinkDialog';
ve.ui.easyLinkDialog.static.title = OO.ui.deferMsg('easylink-ve-dialog-title');
ve.ui.easyLinkDialog.static.size = 'large';
ve.ui.easyLinkDialog.static.actions = [{
  'action': 'analyze',
  'label': OO.ui.deferMsg('easylink-ve-dialog-analyze'),
  'flags': ['primary', 'constructive'],
  'modes': 'intro',
  'icon': 'search'
}, {
  'label': OO.ui.deferMsg('visualeditor-dialog-action-cancel'),
  'flags': 'safe',
  'modes': 'intro',
  'icon': 'close'
}, {
  'action': 'back',
  'label': OO.ui.deferMsg('visualeditor-dialog-action-goback'),
  'flags': 'safe',
  'modes': ['help', 'results'],
  'icon': 'undo'
}, {
  'action': 'help',
  'label': OO.ui.deferMsg('visualeditor-help-tool'),
  'modes': 'intro',
  'icon': 'help'
}];

/* Initialize the dialog elements */
ve.ui.easyLinkDialog.prototype.initialize = function() {
  ve.ui.easyLinkDialog.parent.prototype.initialize.call(this);
  //Define panels
  this.panelIntro = new OO.ui.PanelLayout({
    '$': this.$,
    'scrollable': true,
    'padded': true
  });
  this.panelHelp = new OO.ui.PanelLayout({
    '$': this.$,
    'scrollable': true,
    'padded': true
  });
  this.panelResults = new OO.ui.PanelLayout({
    '$': this.$,
    'scrollable': true,
    'padded': true
  });

  this.option1 = new OO.ui.ButtonOptionWidget( {
    data: 'ALL',
    label: OO.ui.deferMsg('easylink-ve-dialog-scored-select-all')
} );

this.option2 = new OO.ui.ButtonOptionWidget( {
    data: 'TOP',
    label: OO.ui.deferMsg('easylink-ve-dialog-scored-select-top')
} );

this.buttonSelectWidget = new OO.ui.ButtonSelectWidget( {
    items: [ this.option1, this.option2]
  } );


  this.layoutSelect = new OO.ui.FieldLayout(this.buttonSelectWidget,
          {
            align: 'top',
            label: OO.ui.deferMsg('easylink-ve-dialog-scored-select')
          }
        );
  this.numberInputWidget = new OO.ui.NumberInputWidget( { min: 0, max: 100, step: 5, isInteger: true,  input: { value: 0 }} );
  this.layoutNumberInput =  new OO.ui.FieldLayout(this.numberInputWidget,{
            align: 'top',
            label: 'Coerenza (0 = non scelta):'
  });

  this.buttonSelectWidget.selectItem( this.option2 );

  this.progressBar = new OO.ui.ProgressBarWidget({
    progress: 0
  });

  this.layoutProgress = new OO.ui.FieldLayout(this.progressBar, {
      label: OO.ui.deferMsg('easylink-ve-dialog-progress-text'),
      align: 'top'
    });
  this.inputSetLayout = new OO.ui.FieldsetLayout;
  this.inputSetLayout.addItems([
    this.layoutSelect, this.layoutNumberInput
  ]);

  this.layoutProgress.toggle(false);

  //Add elements to the panels
  this.panelIntro.$element.append(OO.ui.deferMsg('easylink-ve-dialog-intro-text'), this.inputSetLayout.$element);
  this.panelResults.$element.append(this.layoutProgress.$element);
  this.panelHelp.$element.append(OO.ui.deferMsg('easylink-ve-dialog-help-text'));
  //Add panels to the layout
  this.stackLayout = new OO.ui.StackLayout({
    items: [this.panelIntro, this.panelHelp, this.panelResults]
  });
  this.$body.append(this.stackLayout.$element);
};

/* Set the default mode of the dialog */
ve.ui.easyLinkDialog.prototype.getSetupProcess = function(data) {
  return ve.ui.easyLinkDialog.super.prototype.getSetupProcess.call(this, data)
    .next(function() {
      this.actions.setMode('intro');
    }, this);
};

/* Send Wikitext to EasyLinkAPI and retrieve annotations */
ve.ui.easyLinkDialog.prototype.analyze = function(callbackProva) {
  var dialog = this;
  var scoredCandidates = dialog.buttonSelectWidget.getSelectedItem().data;
  var threshold = dialog.numberInputWidget.getNumericValue();
  getWikitext(function(wikitext) {
    $.post("/Special:EasyLink", {
      wikitext: wikitext,
      scoredCandidates: scoredCandidates,
      threshold: threshold
    }, function(response, status) {
      if (status === 'success' && response) {
        callbackProva(response);
      }
    });
  });
  dialog.actions.setMode('results');
  dialog.stackLayout.setItem(dialog.panelResults);
};

ve.ui.easyLinkDialog.prototype.pollingAPI = function(requestId) {
  var dialog = this;
  $.get("/Special:EasyLink?id=" + requestId, function(response, status) {
    var responseObj = JSON.parse(response);
    if (responseObj.status === 'Progress' || response.status === 'Pending') {
      dialog.progressBar.setProgress(responseObj.progress);
      setTimeout(function() {
        dialog.pollingAPI(responseObj.id);
      }, (2 * 1000));
    } else {
      dialog.showResults(responseObj.results);
      $.ajax({
        url: '/Special:EasyLink?id=' + requestId,
        type: 'DELETE',
        success: function(result) {
          //Do nothing
        }
      });
    }
  });
}

ve.ui.easyLinkDialog.prototype.showResults = function(results) {
  var dialog = this;
  dialog.layoutProgress.toggle(false);
  dialog.actions.setMode('results');
  dialog.stackLayout.setItem(dialog.panelResults);
  //dialog.panelResults.$element.empty();
  $.each(results, function(key, val) {
    var id = val['id'];
    var babelLink = val['babelLink'];
    var wikiLink = val['wikiLink'];
    var gloss = val['gloss'];
    var title = val['title'];
    var glossSource = val['glossSource'];
    var popup = new OO.ui.PopupButtonWidget({
      label: title,
      framed: false,
      popup: {
        head: true,
        label: $('<p><strong>' + title + '</strong></p>'),
        $content: $('<p>' + gloss + '</p><p>' + OO.ui.msg('easylink-ve-dialog-gloss-source') + glossSource + '</p>'),
        $footer: $("<p><a target='_blank' href='" + babelLink + "'><img src='http://babelnet.org/imgs/babelnet.png'></a>" + "<a target='_blank' href='" + wikiLink + "'><img src='http://image005.flaticon.com/28/png/16/33/33949.png'></a></p>"),
        padded: true,
        framed: true,
        align: 'forwards'
      }
    });
    dialog.panelResults.$element.append(popup.$element, '<br>');
    var annotation = new ve.dm.easyLinkAnnotation({
      type: 'link/easyLink',
      attributes: {
        id: id,
        //class: 'easyLinkAnnotation',
        title: title,
        gloss: gloss,
        glossSource: glossSource,
        babelLink: babelLink,
        wikiLink: wikiLink
      }
    });
    var veDmSurface = ve.init.target.getSurface().getModel();
    var veDmDocument = veDmSurface.getDocument();

    var range = veDmDocument.findText(title, {
      //noOverlaps: true,
      caseSensitiveString: true,
      wholeWord: true
    });
    var transaction = ve.dm.Transaction.newFromAnnotation(veDmDocument, range[0], 'set', annotation);
    veDmDocument.commit(transaction, false);
  });
  var capsule = new OO.ui.FieldLayout(new OO.ui.CapsuleMultiSelectWidget({
    selected: ['Option 1', 'Option 3'],
    menu: {
      items: [
        new OO.ui.MenuOptionWidget({
          data: 'Option 1',
          label: 'Option One'
        }),
        new OO.ui.MenuOptionWidget({
          data: 'Option 2',
          label: 'Option Two'
        }),
        new OO.ui.MenuOptionWidget({
          data: 'Option 3',
          label: 'Option Three'
        }),
        new OO.ui.MenuOptionWidget({
          data: 'Option 4',
          label: 'Option Four'
        }),
        new OO.ui.MenuOptionWidget({
          data: 'Option 5',
          label: 'Option Five'
        })
      ]
    }
  }), {
    label: 'Annotations',
    align: 'top'
  });
  //dialog.panelResults.$element.append(capsule.$element, '<br>');
  /*dialog.layoutProgress.toggle(false);
  dialog.actions.setMode('results');
  dialog.stackLayout.setItem(dialog.panelResults);*/
  //ve.init.target.getSurface().execute('window', 'open', 'easyLinkToolbarDialog');
};

/* Registration Dialog*/
ve.ui.windowFactory.register(ve.ui.easyLinkDialog);