document.addEventListener('click', function(e) { 
  console.log('directed-reading extension activated')
  beginReading(e.target);
});

/**
 * Tries to start reading text inside HTMLElement
 * Reads through all text and then nextSibling
 * text in a loop until there is no nextSibling
 * 
 * @param {HTMLElement} target element user clicks to be read
 */
function beginReading(target) {
  while (target) {
    // console.log for dev/debugging
    console.log('beginReading function called: ')
    console.log(target)

    // read through the text
    doChunkRead(target);

    // update the value of target
    // to be its next sibling 
    if (!target.nextSibling && target.parent) {
      target = target.parent.nextSibling;
    } else {
      target = target.nextSibling;
    }
  }
}

function doChunkRead(elem) {
  if (elem.style) {
    elem.style.color="red";
  }
}