function getEventInfo(req) {
  var ev = req.headers["x-github-event"];
  var sender = "[" + req.body.sender.login + "](" + req.body.sender.html_url + ")";
  var info = null;

  var repo = req.body.repository.full_name;
  var date = Date.now();

  switch(ev) {
    case "commit_comment":
        var commit_id = req.body.comment.commit_id.substring(0,10);
        var url = req.body.comment.html_url;
        var message = sender + " commented on commit [" + repo + "@" + commit_id + "](" + url + ")";
        var plain_text = sender + " commented on commit " + repo + "@" + commit_id;
        info = { message: message, extra: req.body.comment.body, avatar: req.body.sender.avatar_url, date: date, plain_text: plain_text };
        break;

    case "push":
        var url = req.body.repository.html_url;
        var branch = req.body.ref.match(/([^\/]*)\/*$/)[1];
        var branch_url = url + "/tree/" + branch;
        var message = sender + " pushed to [" + branch + "](" + branch_url + ") at [" + repo + "](" + url + ")";
        var plain_text = sender + " pushed to " + branch + " at " + repo;

        var commits = req.body.commits;
        if (commits.length) {
          var commit_text = (commits.length == 1)? "commit" : "commits";
          var extra = "[" + commits.length + " " + commit_text + "](" + req.body.compare + ")";
          info = { message: message, extra: extra, avatar: req.body.sender.avatar_url, date: date, plain_text: plain_text };
        } else
          info = { message: message, avatar: req.body.sender.avatar_url, date: date, plain_text: plain_text };

        break;

    case "create":
        var type = req.body.ref_type;

        switch(type) {

          case "branch":
            var url = req.body.repository.html_url;
            var branch = req.body.ref;
            var branch_url = url + "/tree/" + branch;
            var message = sender + " created branch [" + branch + "](" + branch_url + ") at [" + repo + "](" + url + ")";
            var plain_text = sender + " created branch " + branch + " at " + repo;
            info = { message: message, avatar: req.body.sender.avatar_url, date: date, plain_text: plain_text };
            break;
        }

        break;

    case "repository":
        var url = req.body.repository.html_url;
        var message = sender + " created repository [" + repo + "](" + url + ")";
        var plain_text = sender + " created repository " + repo;
        info = { message: message, avatar: req.body.sender.avatar_url, date: date, plain_text: plain_text };
        break;

    case "pull_request":
        var type = req.body.action;
        var url = req.body.pull_request.html_url;
        var number = req.body.pull_request.number;
        var extra = req.body.pull_request.title;
        var message = "";
        var plain_text = "";

        switch(type) {

          case "opened":
            message = sender + " opened pull request [" + repo + "#" + number + "](" + url + ")";
            plain_text = sender + " opened pull request " + repo + "#" + number;
            info = { message: message, avatar: req.body.sender.avatar_url, extra: extra, date: date, plain_text: plain_text };
            break;

          case "closed":
            message = sender + " merged pull request [" + repo + "#" + number + "](" + url + ")";
            plain_text = sender + " merged pull request " + repo + "#" + number;
            info = { message: message, avatar: req.body.sender.avatar_url, extra: extra, date: date, plain_text: plain_text };
            break;
        }

        break;

    case "issues":
        var type = req.body.action;
        var url = req.body.issue.html_url;
        var number = req.body.issue.number;
        var extra = req.body.issue.title;
        var message = "";
        var plain_text = "";

        switch(type) {

          case "opened":
            message = sender + " opened issue [" + repo + "#" + number + "](" + url + ")";
            plain_text = sender + " opened issue " + repo + "#" + number;
            info = { message: message, avatar: req.body.sender.avatar_url, extra: extra, date: date, plain_text: plain_text };
            break;

          case "closed":
            message = sender + " closed issue [" + repo + "#" + number + "](" + url + ")";
            plain_text = sender + " closed issue " + repo + "#" + number;
            info = { message: message, avatar: req.body.sender.avatar_url, extra: extra, date: date, plain_text: plain_text };
            break;

          case "reopened":
            message = sender + " reopened issue [" + repo + "#" + number + "](" + url + ")";
            plain_text = sender + " reopened issue " + repo + "#" + number;
            info = { message: message, avatar: req.body.sender.avatar_url, extra: extra, date: date, plain_text: plain_text };
            break;
        }

        break;

    case "issue_comment":
        var url = req.body.comment.html_url;
        var number = req.body.issue.number;
        var extra = req.body.comment.body;
        var message = sender + " commented on issue [" + repo + "#" + number + "](" + url + ")";
        var plain_text = sender + " commented on issue " + repo + "#" + number;
        info = { message: message, extra: req.body.comment.body, avatar: req.body.sender.avatar_url, date: date, plain_text: plain_text };
        break;

    case "pull_request_review_comment":
        var url = req.body.comment.html_url;
        var number = req.body.pull_request.number;
        var extra = req.body.comment.body;
        var message = sender + " commented on pull request [" + repo + "#" + number + "](" + url + ")";
        var plain_text = sender + " commented on pull request " + repo + "#" + number;
        info = { message: message, extra: req.body.comment.body, avatar: req.body.sender.avatar_url, date: date, plain_text: plain_text };
        break;

  }

  return info;
}

exports.getEventInfo = getEventInfo;