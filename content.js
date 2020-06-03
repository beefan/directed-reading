const APP_TIMEOUT_MS = 100;
const timer = (waitTime) => 
  new Promise(resolve => setTimeout(resolve, waitTime ));
let isReading = false;
let options = {};

document.addEventListener('dblclick', async function(e) { 
  await getOptions();
  console.log(options);
  
  // abort if user disabled extension
  if (options.disable) { isReading = false; return }

  isReading = !isReading;
  if (isReading) {
    beginReading(e.target);
  }
});

/**
 * Tries to start reading text inside HTMLElement
 * Reads through all text and then nextSibling
 * text in a loop until there is no nextSibling
 * 
 * @param {HTMLElement} target element user clicks to be read
 */
async function beginReading(target) {
  while (target && isReading && !options.disable) {
    // console.log for dev/debugging
    console.log('beginReading function called: ')
    console.log(target)

    // read through the text
    await doChunkRead(target);
    // reload options in case user updated
    await getOptions();

    // update the value of target
    // to be its next sibling 
    if (!target.nextSibling && target.parent) {
      target = target.parent.nextSibling;
    } else {
      target = target.nextSibling;
    }
  }
}

  // loop through the text, one word at
  // a time, moving the <span> tag to 
  // highlight 
function doChunkRead(elem) {
  if (!elem.textContent || elem.nodeName === '#text') { return }

  elem.scrollIntoView();
  const words = elem.textContent.split(" ");
  
  // initialize recursive highlight function
  focusWord(words, 0, elem);
  return timer(options.speed * words.length + 1)
}

async function focusWord(words, word, elem) {
  // if done reading the section
  // or the user has clicked again
  if (word > words.length - 1) { 
    elem.innerHTML = words.join(" ");
    return 
  }else if (!isReading) { return }

  elem.innerHTML = renderHTML(words, word);

  await timer(options.speed);

  focusWord(words, word + 1, elem);
}

function renderHTML(words, word) {
  const chunkA = words
                .filter( (v, i) => i < word )
                .join(" ");
  const chunkB = words
                .filter( (v, i) => i > word )
                .join(" ");

  let result = "";
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

function getOptions() {
  return chrome.storage.sync.get({
    speed: 150,
    style: "yellow-hi",
    disable: false
  }, (items) => {options = items}
  );
}