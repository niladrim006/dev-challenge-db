function CurrencyTable() {
  this.tableMapData = new Map();
}

// Receive response from web socket, parse it and map it to table
CurrencyTable.prototype.subscribeData = function (message) {
  const data = JSON.parse(message.body);
  this.mapData(data);
  this.sortMap();
  this.displaySortedData();
}

// Setting value to the Map Object 
CurrencyTable.prototype.mapData = function (response) {
  const timeStamp = Date.parse(new Date());
  const midPrice = (response.bestBid + response.bestAsk) / 2;

  // extraction of midPrice existing Array or setting empty array;
  const limit = Date.parse(new Date()) - (30 * 1000);
  const midPriceArray = this.tableMapData.get(response.name) ? this.tableMapData.get(response.name).midPrice.filter(mPrice => mPrice.timeStamp > limit) : [];
  midPriceArray.push({ timeStamp, midPrice });
  response.midPrice = midPriceArray;

  // setting currency object to map iteratable object
  this.tableMapData.set(response.name, response);
}


// sort the Map of currency based on the lastChangeBid
CurrencyTable.prototype.sortMap = function () {
  // Sort the currency Map assigning back to the data array
  this.tableMapData = new Map([...this.tableMapData.entries()].sort((a, b) => a[1].lastChangeBid - b[1].lastChangeBid));
}


// Dynamically generate table of data with its content
CurrencyTable.prototype.displaySortedData = function () {
  const tableBodyEl = document.getElementById('table-body');
  tableBodyEl.textContent = '';
  this.tableMapData.forEach(row => {
    const tableRowEl = document.createElement('tr');

    // create cells for text values
    const displayCells = ['name', 'bestBid', 'bestAsk', 'lastChangeBid', 'lastChangeAsk'];
    displayCells.forEach(cell => this.generateTableCell(tableRowEl, row[cell], cell))

    // create cell for sparkline
    const sparkCellEl = document.createElement('td');
    const sparkElement = document.createElement('span')

    // get sparkline array and append cell
    const sparklineData = this.getSparklineGraph(row.midPrice);
    Sparkline.draw(sparkElement, sparklineData);
    sparkCellEl.appendChild(sparkElement);
    tableRowEl.appendChild(sparkCellEl);
    tableBodyEl.appendChild(tableRowEl);
  });
}

// Common method to create table cell element, assign text and append to the parent
CurrencyTable.prototype.generateTableCell = function (parent, data, cell) {
  const tableCellEl = document.createElement('td');
  const text = document.createTextNode(data);
  tableCellEl.appendChild(text);
  parent.appendChild(tableCellEl);
}

// get sparkline data array of values for the last 30 secs
CurrencyTable.prototype.getSparklineGraph = function (data) {
  return data.map(values => values.midPrice);
}

export default CurrencyTable;