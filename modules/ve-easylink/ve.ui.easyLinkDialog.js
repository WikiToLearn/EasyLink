/* Get the Wikitext */
function getWikitext(callback) {
  var dom = ve.init.target.getSurface().getDom();
  ve.init.target.serialize(dom, function(wikitext) {
    callback(wikitext);
  });
};

/* Create a dialog */
ve.ui.easyLinkDialog = function(manager, config) {
  // Parent constructor
  ve.ui.easyLinkDialog.parent.call(this, config);
};

/* Inheritance */
OO.inheritClass(ve.ui.easyLinkDialog, OO.ui.ProcessDialog);

/* Define actions */
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
  return 400;
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
  /* Define panels */
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

  var domainKeys = Object.keys(babelDomains);
  var items = [];
  for(i=0; i<domainKeys.length;i++){
    items.push(new OO.ui.MenuOptionWidget( {
        data: domainKeys[i],
        label: babelDomains[domainKeys[i]],
    } ));
  }

  this.selectDomains = new OO.ui.DropdownWidget( {
    label: 'Seleziona un dominio (opzionale)',
    menu: {
      items: items
    }
  } );
  this.selectDomains.getMenu().selectItemByData( 'ALL' );
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

  /* Add elements to the panels */
  this.panelIntro.$element.append(OO.ui.deferMsg('easylink-ve-dialog-intro-text'), this.inputSetLayout.$element, this.selectDomains.$element);
  this.panelResults.$element.append(this.layoutProgress.$element);
  this.panelHelp.$element.append(OO.ui.deferMsg('easylink-ve-dialog-help-text'));
  /* Add panels to StackLayout */
  this.stackLayout = new OO.ui.StackLayout({
    items: [this.panelIntro, this.panelHelp, this.panelResults]
  });
  /* Add StackLayout to dialog body */
  this.$body.append(this.stackLayout.$element);
};

/* Set the default mode of the dialog */
ve.ui.easyLinkDialog.prototype.getSetupProcess = function(data) {
  return ve.ui.easyLinkDialog.super.prototype.getSetupProcess.call(this, data)
  .next(function() {
    this.actions.setMode('intro');
  }, this);
};

/* Send Wikitext to EasyLinkAPI and get as response a request UUID to polling progress and results*/
ve.ui.easyLinkDialog.prototype.analyze = function(callback) {
  var dialog = this;
  var scoredCandidates = dialog.buttonSelectWidget.getSelectedItem().data;
  var threshold = dialog.numberInputWidget.getNumericValue();
  var babelDomain = dialog.selectDomains.getMenu().getSelectedItem().getData();
  getWikitext(function(wikitext) {
    $.post("/Special:EasyLink", {
      command: 'analyze',
      wikitext: wikitext,
      scoredCandidates: scoredCandidates,
      threshold: threshold,
      babelDomain: babelDomain,
      language: mw.config.get('wgContentLanguage')
    }, function(response, status) {
      if (status === 'success' && response) {
        callback(response);
      }
    });
  });
  dialog.actions.setMode('results');
  dialog.stackLayout.setItem(dialog.panelResults);
};

/* Polling EasyLinkAPI with request UUID to get progress, status and results  */
ve.ui.easyLinkDialog.prototype.pollingAPI = function(requestId) {
  var dialog = this;
  $.getJSON("/Special:EasyLink", {command: 'polling', requestId: requestId}, function(response, status) {
    if (response.status === 'Progress' || response.status === 'Pending') {
      dialog.progressBar.setProgress(response.progress);
      setTimeout(function() {
        dialog.pollingAPI(response.id);
      }, (2 * 1000));
    } else {
      dialog.showResults(response.results);
      $.ajax({
        url: '/Special:EasyLink',
        data: {command: 'delete', requestId: requestId},
        type: 'DELETE',
        success: function(result) {
          //Do nothing
        }
      });
    }
  });
}

/* Show results into results panel and annotate the model*/
ve.ui.easyLinkDialog.prototype.showResults = function(results) {
  var dialog = this;
  dialog.layoutProgress.toggle(false);
  ve.dm.easyLinkAnnotation.static.annotationsList = [];
  if(Array.isArray(results)){
    dialog.processResultsArray(results);
  }else {
    dialog.processResultsMap(results);
  }
  dialog.close();
  dialog.progressBar.setProgress("0");
  dialog.actions.setMode('intro');
  dialog.stackLayout.setItem(dialog.panelIntro);
  ve.init.target.getSurface().execute('window', 'close', 'easyLinkToolbarDialog');
  ve.init.target.getSurface().execute('window', 'open', 'easyLinkToolbarDialog');
};

ve.ui.easyLinkDialog.prototype.processResultsMap = function(results){
  console.log(results);
};

ve.ui.easyLinkDialog.prototype.processResultsArray =  function(results){
  var dialog = this;
  $.each(results, function(key, val) {
    var babelnetId = val['babelnetId'];
    var babelLink = val['babelLink'];
    if(val['wikiLink'] !== null){
      var wikiLink = val['wikiLink'];
    }
    var gloss = val['gloss'];
    var title = val['title'];
    var glossSource = val['glossSource'];
    var glosses = val['glosses'];
    var annotation = new ve.dm.easyLinkAnnotation({
      type: 'link/easyLink',
      attributes: {
        babelnetId: babelnetId,
        title: title,
        gloss: gloss,
        glossSource: glossSource,
        glosses: glosses,
        babelLink: babelLink,
        wikiLink: wikiLink
      }
    });
    dialog.annotate(title, annotation);
  });
};

ve.ui.easyLinkDialog.prototype.annotate = function(title, annotation){
  var veDmSurface = ve.init.target.getSurface().getModel();
  var veDmDocument = veDmSurface.getDocument();

  var range = veDmDocument.findText(title, {
    //noOverlaps: true,
    caseSensitiveString: true,
    wholeWord: true
  });
  if(range.length > 0){
    var transaction = ve.dm.Transaction.newFromAnnotation(veDmDocument, range[0], 'set', annotation);
    veDmDocument.commit(transaction, true);
    ve.dm.easyLinkAnnotation.static.annotationsList.push(annotation);
  }
};

/* Registration Dialog*/
ve.ui.windowFactory.register(ve.ui.easyLinkDialog);
