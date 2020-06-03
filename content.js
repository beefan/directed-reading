const APP_TIMEOUT_MS = 50;
const timer = (waitTime) => 
  new Promise(resolve => setTimeout(resolve, waitTime ));
var isReading = false;

document.addEventListener('click', function(e) { 
  console.log('directed-reading extension activated')  
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
  while (target && isReading) {
    // console.log for dev/debugging
    console.log('beginReading function called: ')
    console.log(target)

    // read through the text
    await doChunkRead(target);

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
  if (!elem.textContent) { return }

  const words = elem.textContent.split(" ");
  
  // initialize recursive highlight function
  focusWord(words, 0, elem);
  return timer(APP_TIMEOUT_MS * words.length + 1)
}

async function focusWord(words, word, elem) {
  // if done reading the section
  // or the user has clicked again
  if (word > words.length - 1 || !isReading) { 
    elem.innerHTML = words.join(" ");
    return 
  }

  elem.innerHTML = renderHTML(words, word);

  await timer(APP_TIMEOUT_MS);

  focusWord(words, word + 1, elem);
}

function renderHTML(words, word) {
  const chunkA = words
                .filter( (v, i) => i < word )
                .join(" ");
  const chunkB = words
                .filter( (v, i) => i > word )
                .join(" ");

  return `${chunkA} 
          <span style="background-color: yellow; border-radius: 3px;">
          ${words[word]}
          </span>
          ${chunkB}`;
}