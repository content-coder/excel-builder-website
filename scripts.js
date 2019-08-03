// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  var s = document.createElement("SPAN");
  s.className = "term";
  s.appendChild(t);
  li.appendChild(s);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}

function submitQuery() {
  // Show loader while query is being processed
  var div = document.getElementById("downloadLinkDIV")
  var loader = document.createElement("div")
  loader.setAttribute('class','loader');
  loader.setAttribute('id', 'tempLoader');
  div.appendChild(loader);

  // Log all items in the current query
  var ul = document.getElementById("myUL");
  var li = ul.getElementsByTagName("li");
  var terms =  [];
  for (i = 0; i < li.length; i++){
    var s = li[i].getElementsByClassName("term")[0]
    terms[i] = (s.textContent || s.innerText);
  }
  var query = {};
  query['terms'] = terms;
  console.log(JSON.stringify(query));

  // POST data to Excel Builder
  var request = new XMLHttpRequest()
  request.open('POST', 'https://europe-west1-contentcoder.cloudfunctions.net/itunes-search-terms-to-excel')
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
      // Remove loader
      var loader = document.getElementById('tempLoader');
      loader.parentNode.removeChild(loader);

      // Update the DOM!!
      var div = document.getElementById("downloadLinkDIV")
      var aTag = document.createElement('a');
      aTag.setAttribute('href',data['download_url']);
      aTag.setAttribute('download','download');
      aTag.innerHTML = "Click to download Excel file"; // Make more progressive
      div.appendChild(aTag);

    } else {
      console.log('error')
    }
  }
  request.send(JSON.stringify(query))
}
