function setDetails(x, y, width, height) {
  $(`input[name="Top"]`).val(Math.round(y * 3));
  $(`input[name="Left"]`).val(Math.round(x * 3));
  $(`input[name="Width"]`).val(Math.ceil(width * 3));
  $(`input[name="Height"]`).val((Math.ceil(height * 3)));
}

function detailEvents() {
  $(`input[name="Top"]`).on('change', function(e) {
    var _this = $(this)
    var pos = _this.val()
    pos = isNaN(parseInt(pos)) || parseInt(pos) < 0 ? 0 : parseInt(pos)
    var selectedHandler = $('.handler-drag.selected');
    var handlerWrapperHeight = selectedHandler.parent().height() - selectedHandler.height();
    handlerWrapperHeight *= 3

    if (pos >= handlerWrapperHeight) 
    {
      _this.val(handlerWrapperHeight)
      pos = handlerWrapperHeight / 3;
    } else {
      _this.val(pos)
      pos = pos/3
    }
    var xAxis = selectedHandler.attr('data-x') || 0;
    xAxis = parseFloat(xAxis)

    selectedHandler.css({transform: `translate(${xAxis}px, ${pos}px)`});
    selectedHandler.attr('data-y', pos)
  });
  $(`input[name="Left"]`).on('change', function() {
    var _this = $(this)
    var pos = _this.val()
    pos = isNaN(parseInt(pos)) || parseInt(pos) < 0 ? 0 : parseInt(pos)
    var selectedHandler = $('.handler-drag.selected');
    var handlerWrapperWidth = selectedHandler.parent().width() - selectedHandler.width();
    handlerWrapperWidth *= 3
    if (pos >= handlerWrapperWidth) 
    {
      _this.val(handlerWrapperWidth)
      pos = handlerWrapperWidth / 3;
    } else {
      _this.val(pos)
      pos = pos/3
    }
    var yAxis = selectedHandler.attr('data-y') || 0;
    yAxis = parseFloat(yAxis)

    selectedHandler.css({transform: `translate(${pos}px, ${yAxis}px)`});
    selectedHandler.attr('data-x', pos)
  });

  $(`input[name="Width"]`).on('change', function() {
    var _this = $(this)
    var pos = _this.val()
    pos = isNaN(parseInt(pos)) || parseInt(pos) < 0 ? 480 : parseInt(pos)
    var selectedHandler = $('.handler-drag.selected');
    var xAxis = selectedHandler.attr('data-x') || 0;
    xAxis = parseInt(xAxis);
    var handlerWrapperWidth = selectedHandler.parent().width() - xAxis;
    handlerWrapperWidth *= 3
    if (pos >= handlerWrapperWidth) {
      _this.val(handlerWrapperWidth)
      pos = Math.round(handlerWrapperWidth / 3);
    } else {
      _this.val(pos)
      pos = pos/3
    }

    selectedHandler.css({width: `${pos}px`});
  });
  $(`input[name="Height"]`).on('change', function() {
    var _this = $(this)
    var pos = _this.val()
    pos = isNaN(parseInt(pos)) || parseInt(pos) < 0 ? 360 : parseInt(pos)
    var selectedHandler = $('.handler-drag.selected')
    var yAxis = selectedHandler.attr('data-y') || 0;
    yAxis = parseInt(yAxis);
    var handlerWrapperHeight = selectedHandler.parent().height() - yAxis;
    handlerWrapperHeight *= 3
    if (pos >= handlerWrapperHeight) {
      _this.val(handlerWrapperHeight)
      pos = Math.round(handlerWrapperHeight / 3);
    } else {
      _this.val(pos)
      pos = pos/3
    }

    selectedHandler.css({height: `${pos}px`});
  });
}
