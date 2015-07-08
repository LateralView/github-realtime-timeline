function hideBlocks(blocks, offset) {
  blocks.each(function(){
    ( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
  });
}

function showBlocks(blocks, offset) {
  blocks.each(function(){
    ( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
  });
}

$(function() {

  var EVENTS_SIZE = 15;

  // Same URL used in backend side!
  var rootRef = new Firebase("");

  function handleEventAdded(eventSnapshot) {
    var githubEvent = eventSnapshot.val();

    var newEventBlock = $("<div class='cd-timeline-block enter'>");

    // Picture div
    var pictureDiv = $("<div class='cd-timeline-img cd-picture'>");
    pictureDiv.html("<img src='" + githubEvent.avatar + "'></img>");

    // Timeline content
    var timelineContent = $("<div class='cd-timeline-content'>");
    timelineContent.append($("<h2>").html(markdown.toHTML(githubEvent.message)));
    if (githubEvent.extra) timelineContent.append($("<p class='extra'>").html(markdown.toHTML(githubEvent.extra)));
    var date = new Date(githubEvent.date).format('M j, H:i');
    timelineContent.append("<span class='cd-date'>" + date + "</span>");

    newEventBlock.append(pictureDiv);
    newEventBlock.append(timelineContent);

    $("#cd-timeline").prepend(newEventBlock);
  }

  // Create a view to only receive callbacks for the last EVENTS_SIZE events
  var eventsListView = rootRef.limitToLast(EVENTS_SIZE);

  // Add a callback to handle when a new event is added.
  eventsListView.on("child_added", function (newEventSnapshot, prevChildKey) {
    handleEventAdded(newEventSnapshot);
  });

  eventsListView.once("value", function(snap) {
    var timelineBlocks = $('.cd-timeline-block'),
    offset = 0.8;

    //hide timeline blocks which are outside the viewport
    hideBlocks(timelineBlocks, offset);

    //on scolling, show/animate timeline blocks when enter the viewport
    $(window).on('scroll', function(){
      (!window.requestAnimationFrame)
        ? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
        : window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
    });

  });
});