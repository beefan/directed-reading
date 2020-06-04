/**
 * Tries to start reading text inside HTMLElement
 * Reads through all text and then nextSibling
 * text in a loop until there is no nextSibling
 * 
 * @param {HTMLElement} target element user clicks to be read
 */
async function beginReading(target) {
  flipBadge();

  // start with target and keep going through the DOM
  // until we get an undefined target or stop reading
  while (target && isReading) {

    // if the node is a #text node, skip to the next
    if (target.nodeName === "#text") {
      target = target.nextSibling;
      continue;
    }

    // get the options again in case the user updated
    // if we should be disabled now, abort mission
    const options = await getOptions();
    if (options.disable) { 
      stopReading();
      break;
     }

    // make a copy of the target
    const targetCopy = target.cloneNode(true);

    // read through the text and wait
    await doChunkRead(target, options);

    // insert a copy of the original target
    target.insertAdjacentElement('beforebegin', targetCopy);

    // update the value of target to next sibling 
    // and remove previous target
    if (!target.nextSibling && target.parent) {
      target = target.parent.nextSibling;
      target.previousSibling.lastChild.remove();
    } else {
      target = target.nextSibling;
      target.previousSibling.remove();
    }
  }

  stopReading();
}

/**
 * Initializes recursive function to highlight words
 * from an HTML element
 * 
 * @param {HTMLElement} elem Element to read from
 * @param {Object} options js obj with user options
 */
function doChunkRead(elem, options) {
  if (!elem.textContent) { return }

  // scroll to the current element
  elem.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});

  const words = elem.textContent.split(" ");
  
  // initialize recursive highlight function
  return focusWord(words, 0, elem, options);
}

/**
 * Recursive function to handle highlighting of 
 * words one by one in a grouping of words.
 * 
 * @param {Array} words Array of Strings
 * @param {Number} word index of word in words array
 * @param {HTMLElement} elem element to read from
 * @param {Object} options js obj with user options
 */
async function focusWord(words, word, elem, options) {
  // abort if done reading the section
  // or the user has clicked off
  if (word > words.length - 1 || !isReading) { return }

  // replace the HTML with newly rendered
  elem.innerHTML = renderHTML(words, word, options);

  // wait before focusing on the next word
  await timer(options.speed);

  return focusWord(words, word + 1, elem, options);
}

/**
 * Renders HTML according to style options.
 * Turns text data to text data with a focus.
 * 
 * @param {Array} words array of Strings
 * @param {Number} word index of current focus word in words array
 * @param {Object} options js obj with options
 */
function renderHTML(words, word, options) {
  const chunkA = words
                .filter( (v, i) => i < word )
                .join(" ");
  const chunkB = words
                .filter( (v, i) => i > word )
                .join(" ");

  let result = "";
  // switch amongst possible styles.
  // only two for now...
  switch(options.style) {
    case "yellow-hi":
      result = `${chunkA} 
                <span style="background-color: yellow; border-radius: 3px;">
                ${words[word]}
                </span>
                ${chunkB}`;
      break;
    case "bold-text":
      result = `<span style="font-weight: bold;">
                ${chunkA} ${words[word]}
                </span>
                <span style="color: grey">
                ${chunkB}
                </span>`
      break;
  } 

  return result;
}

/**
 *  gets extension options from chrome
 * 
 *  @returns {Object} user options
 */
async function getOptions() {
  let options = null;
  chrome.storage.sync.get({
    speed: 150,
    style: "yellow-hi",
    disable: false
  }, (items) => {options =  items;}
  );

  // wait 200 ms for chrome to 
  // return user options. yes,
  // this function will return
  // null if it takes longer.
  await timer(200);

  return options;
}

function flipBadge(){
  isReading = true;
  chrome.runtime.sendMessage({cmd: "badge-on"}, function(response) {
    console.log(response.msg);
  });
}

function stopReading() {
  isReading = false;
  chrome.runtime.sendMessage({cmd: "badge-off"}, function(response) {
    console.log(response.msg);
  });
}

// create a timer to be reused
const timer = (waitTime) => 
  new Promise(resolve => setTimeout(resolve, waitTime ));
// establish some global variables
let isReading = false;
let chunking = true;

// register dblclick to start reading
document.addEventListener('dblclick', e => { 
  beginReading(e.target);
});

// register click to end reading
document.addEventListener('click', e => stopReading() );