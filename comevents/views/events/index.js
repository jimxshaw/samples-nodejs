'use strict'

exports.find = function(req, res, next){
  req.query.name = req.query.name ? req.query.name : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {};
  if (req.query.username) {
    filters.username = new RegExp('^.*?'+ req.query.username +'.*$', 'i');
  }

  req.app.db.models.Event.pagedFind({
    filters: filters,
    keys: 'name username description',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      res.render('events/index', { data: results.data });
    }
  });
};

exports.read = function(req, res, next){
  req.app.db.models.Event.findById(req.params.id).exec(function(err, event) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(event);
    }
    else {
      res.render('events/details', { event: event });
    }
  });
};

exports.add = function(req, res) {
  if (!req.isAuthenticated()) {
    req.flas('error', "You are not logged in");
    res.location('/events');
    res.redirect('/events');
  }
  res.render('events/add');
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.name) {
      workflow.outcome.errors.push('Please enter a name.');
      return workflow.emit('response');
    }

  });

  workflow.on('createEvent', function() {
    var fieldsToSet = {
      username: req.body.username,
      search: [
        req.body.username
      ]
    };
    req.app.db.models.User.create(fieldsToSet, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = user;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};