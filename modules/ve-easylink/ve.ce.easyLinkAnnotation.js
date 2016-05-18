/**
 * ContentEditable EasyLink annotation.
 *
 * @class
 * @extends ve.ce.Annotation
 * @constructor
 * @param {ve.dm.easyLinkAnnotation} model Model to observe
 * @param {ve.ce.ContentBranchNode} [parentNode] Node rendering this annotation
 * @param {Object} [config] Configuration options
 */
ve.ce.easyLinkAnnotation = function() {
  // Parent constructor
  ve.ce.easyLinkAnnotation.super.apply(this, arguments);

  // Initialization
  this.contentFragment = document.createDocumentFragment();

  this.$element = $('<span>')
    .addClass('ve-ce-easyLinkAnnotation')
    .prop({
      id: this.constructor.static.getId(this.model)
    })
    .attr({
      'data-title': this.constructor.static.getTitle(this.model),
      'data-gloss': this.constructor.static.getGloss(this.model),
      'data-gloss-source': this.constructor.static.getGlossSource(this.model),
      'data-babel-link': this.constructor.static.getBabelLink(this.model),
      'data-wiki-link': this.constructor.static.getWikiLink(this.model)
    });
};

/* Inheritance */

OO.inheritClass(ve.ce.easyLinkAnnotation, ve.ce.Annotation);

/* Static Properties */

ve.ce.easyLinkAnnotation.static.name = 'link/easyLink';

ve.ce.easyLinkAnnotation.static.tagName = 'span';

/* Static Methods */

/**
 * @inheritdoc
 */
ve.ce.easyLinkAnnotation.static.getId = function(model) {
  return model.getId();
}
ve.ce.easyLinkAnnotation.static.getTitle = function(model) {
  return model.getTitle();
};
ve.ce.easyLinkAnnotation.static.getGloss = function(model) {
  return model.getGloss();
};
ve.ce.easyLinkAnnotation.static.getGlossSource = function(model) {
  return model.getGlossSource();
};
ve.ce.easyLinkAnnotation.static.getBabelLink = function(model) {
  return model.getBabelLink();
};

ve.ce.easyLinkAnnotation.static.getWikiLink = function(model) {
  return model.getWikiLink();
};

ve.ce.easyLinkAnnotation.static.getDescription = function(model) {
  //var description = ve.ce.easyLinkAnnotation.static.getTitle(model).toUpperCase();
  //description = description + "<br>" + ve.ce.easyLinkAnnotation.static.getGloss(model);
  return {
    title: ve.ce.easyLinkAnnotation.static.getTitle(model),
    gloss: ve.ce.easyLinkAnnotation.static.getGloss(model),
    glossSource: ve.ce.easyLinkAnnotation.static.getGlossSource(model)
  };
}

/**
 * Create a nail (a zero-width image) to add extra cursor positions around links
 *
 * @param {string} type Nail type, one of 'pre-open', 'pre-close', 'post-open' and 'post-close'
 * @return {HTMLElement} The new nail
 */
ve.ce.easyLinkAnnotation.static.makeNail = function(type) {
  var nail = document.createElement('img');
  nail.src = ve.inputDebug ? ve.ce.nailImgDataUri : ve.ce.minImgDataUri;
  // The following classes can be used here:
  // ve-ce-nail-pre-open
  // ve-ce-nail-pre-close
  // ve-ce-nail-post-open
  // ve-ce-nail-post-close
  nail.className = 've-ce-nail ve-ce-nail-' + type + (ve.inputDebug ? ' ve-ce-nail-debug' : '');
  return nail;
};

/* Methods */

/**
 * @inheritdoc
 */
ve.ce.LinkAnnotation.prototype.getContentContainer = function() {
  return this.contentFragment;
};

/**
 * @inheritdoc
 */
ve.ce.easyLinkAnnotation.prototype.attachContents = function() {
  var element = this.$element[0];
  // Insert post-open nail, annotation contents, and pre-close nail into the element
  element.appendChild(this.constructor.static.makeNail('post-open'));
  element.appendChild(this.contentFragment);
  element.appendChild(this.constructor.static.makeNail('pre-close'));
};

/**
 * @inheritdoc
 */
ve.ce.easyLinkAnnotation.prototype.appendTo = function(node) {
  // Insert pre-open nail, element, and post-close nail into a parent node
  node.appendChild(this.constructor.static.makeNail('pre-open'));
  node.appendChild(this.$element[0]);
  node.appendChild(this.constructor.static.makeNail('post-close'));
};

/* Registration */

ve.ce.annotationFactory.register(ve.ce.easyLinkAnnotation);