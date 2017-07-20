define([
  'core/js/adapt'
], function(Adapt) {

  var printPageView = Backbone.View.extend({

    initialize: function() {
      if (this.model._showOn == 'navigation') {
        this.renderNavigation();
      } else {
        var blocks = Adapt.findById(Adapt.location._currentId).findDescendants('blocks');
        var lastID = blocks.last().get("_id");
        this.renderBottom(lastID);
      }
    },

    renderNavigation: function() {
      var template = Handlebars.templates["printPage-navigation"];
      this.setElement(template(this.model)).$el.appendTo($(".navigation-inner"));
      this.listenTo(Adapt, {
        "navigation:printPage": function() {
          window.print();
        }
      });
    },

    renderBottom: function(lastID) {
      var template = Handlebars.templates["printPage-bottom"];
      this.setElement(template(this.model)).$el.insertAfter($('.' + lastID));
    }
  });

  Adapt.on("pageView:postRender menuView:postRender", function() {
    $('.printPage-icon').remove();
  });

  Adapt.on("pageView:ready", function(pageView) {
    var model = Adapt.findById(Adapt.location._currentId).get('_printPage');
    if (model == undefined || !model._isEnabled) return;
    new printPageView({
      model: model
    });
  });
});
