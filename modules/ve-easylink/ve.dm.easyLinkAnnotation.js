/**
 * DataModel EasyLink annotation.
 *
 * @class
 * @extends ve.dm.Annotation
 * @constructor
 * @param {Object} element
 */
ve.dm.easyLinkAnnotation = function() {
  // Parent constructor
  ve.dm.easyLinkAnnotation.super.apply(this, arguments);
};

/* Inheritance */

OO.inheritClass(ve.dm.easyLinkAnnotation, ve.dm.Annotation);

/* Static Properties */

ve.dm.easyLinkAnnotation.static.name = 'link/easyLink';

ve.dm.easyLinkAnnotation.static.matchTagNames = ['span'];

ve.dm.easyLinkAnnotation.static.toDataElement = function(domElements) {
  var dialog = this;
  $.get("/Special:EasyLink?annotations=yes", function(response, status) {
    console.warn(response);
  });
  return {
    type: this.name,
    attributes: {
      id: domElements[0].getAttribute('id'),
      title: domElements[0].getAttribute('data-title'),
      //class: domElements[0].getAttribute('class'),
      gloss: domElements[0].getAttribute('data-gloss'),
      glossSource: domElements[0].getAttribute('data-gloss-source'),
      babelLink: domElements[0].getAttribute('data-babel-link'),
      wikiLink: domElements[0].getAttribute('data-wiki-link')
    }
  };
};

ve.dm.easyLinkAnnotation.static.toDomElements = function(dataElement, doc) {
  var domElement = doc.createElement('span');
  domElement.setAttribute('id', this.getId(dataElement));
  //domElement.setAttribute('class', this.getClass(dataElement));
  domElement.setAttribute('data-title', this.getTitle(dataElement));
  domElement.setAttribute('data-gloss', this.getGloss(dataElement));
  domElement.setAttribute('data-gloss-source', this.getGlossSource(dataElement));
  domElement.setAttribute('data-babel-link', this.getBabelLink(dataElement));
  domElement.setAttribute('data-wiki-link', this.getWikiLink(dataElement));
  return [domElement];
};

/**
 * Helper functions for toDomElements.
 */
ve.dm.easyLinkAnnotation.static.getId = function(dataElement) {
  return dataElement.attributes.id;
};

ve.dm.easyLinkAnnotation.static.getClass = function(dataElement) {
  return dataElement.attributes.class;
};

ve.dm.easyLinkAnnotation.static.getTitle = function(dataElement) {
  return dataElement.attributes.title;
};
ve.dm.easyLinkAnnotation.static.getGloss = function(dataElement) {
  return dataElement.attributes.gloss;
};
ve.dm.easyLinkAnnotation.static.getGlossSource = function(dataElement) {
  return dataElement.attributes.glossSource;
};
ve.dm.easyLinkAnnotation.static.getBabelLink = function(dataElement) {
  return dataElement.attributes.babelLink;
};

ve.dm.easyLinkAnnotation.static.getWikiLink = function(dataElement) {
  return dataElement.attributes.wikiLink;
};


/* Methods */

/**
 * Convenience wrappers on the current element.
 */
ve.dm.easyLinkAnnotation.prototype.getId = function() {
  return this.constructor.static.getId(this.element);
};
ve.dm.easyLinkAnnotation.prototype.getClass = function() {
  return this.constructor.static.getClass(this.element);
};
ve.dm.easyLinkAnnotation.prototype.getTitle = function() {
  return this.constructor.static.getTitle(this.element);
};
ve.dm.easyLinkAnnotation.prototype.getGloss = function() {
  return this.constructor.static.getGloss(this.element);
};
ve.dm.easyLinkAnnotation.prototype.getGlossSource = function() {
  return this.constructor.static.getGlossSource(this.element);
};
ve.dm.easyLinkAnnotation.prototype.getBabelLink = function() {
  return this.constructor.static.getBabelLink(this.element);
};

ve.dm.easyLinkAnnotation.prototype.getWikiLink = function() {
  return this.constructor.static.getWikiLink(this.element);
};

/**
 * @inheritdoc
 */
ve.dm.easyLinkAnnotation.prototype.getComparableObject = function() {
  return {
    type: this.getType(),
    id: this.getAttribute('id'),
    //class: this.getAttribute('class'),
    title: this.getAttribute('data-title'),
    gloss: this.getAttribute('data-gloss'),
    glossSource: this.getAttribute('data-gloss-source'),
    babelLink: this.getAttribute('data-babel-link'),
    wikiLink: this.getAttribute('data-wiki-link')

  };
};


/* Registration */

ve.dm.modelRegistry.register(ve.dm.easyLinkAnnotation);