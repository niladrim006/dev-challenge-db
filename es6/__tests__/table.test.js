import CurrencyTable from '../table';
import sampleData from '../sampleData.json';

describe('Sorted Datatable functionality test', () => {


  it('should receive message, data assignment and class addition on table', () => {
    const message = { body: JSON.stringify(sampleData[0])};
    document.body.innerHTML = `
      <div id=\"table-body\">\n
        <div></div>\n
      </div>
    `;
    window.Sparkline = { draw: jest.fn() }
    const dataTable = new CurrencyTable();

    jest.spyOn(dataTable, 'subscribeData');
    // tests for subscribeData()
    dataTable.subscribeData(message);

    expect(dataTable.subscribeData).toHaveBeenCalledTimes(1);
    expect(dataTable.subscribeData).toHaveBeenCalledWith(message);

    // // ensure data is consistent
    expect(dataTable.tableMapData.size).toBe(1);

    // check for template
    expect(document.getElementById('table-body')).toBeTruthy();
  });

  it('should invoke mapData, sortMap and displaySortedData when recieves message', () => {
    const message = { body: JSON.stringify(sampleData[0])};
    const dataTable = new CurrencyTable();

    jest.spyOn(dataTable, 'mapData').mockImplementation(()=> null);
    jest.spyOn(dataTable, 'sortMap').mockImplementation(()=> null);
    jest.spyOn(dataTable, 'displaySortedData').mockImplementation(()=> null);

    dataTable.subscribeData(message);
    
    // tests for mapData, sortMap, displaySortedData on  subscribeData() runs
    expect(dataTable.mapData).toHaveBeenCalled();
    expect(dataTable.sortMap).toHaveBeenCalled();
    expect(dataTable.displaySortedData).toHaveBeenCalled();
  })

  it('should set data on tableMapData map object when mapData invokes with data for fresh entry', () => {
    const dataTable = new CurrencyTable();
    dataTable.mapData(sampleData[0])
    expect(dataTable.tableMapData.size).toBe(1);
  })

  it('should set data on tableMapData map object when mapData invokes with data existing data', () => {
    const dataTable = new CurrencyTable();
    dataTable.tableMapData.set(sampleData[0].name, sampleData[0])
    dataTable.mapData(sampleData[0])
    expect(dataTable.tableMapData.size).toBe(1);
  })

  it('should short the table data based on lastChangeBid', () => {
    const dataTable = new CurrencyTable();
    dataTable.tableMapData.set(sampleData[0].name, sampleData[0])
    dataTable.tableMapData.set(sampleData[1].name, sampleData[1])

    // test before sorting
    expect([...dataTable.tableMapData.entries()][0][1].lastChangeBid).toBe(0.02224912511866406);
    dataTable.sortMap()
    // test before sorting
    expect([...dataTable.tableMapData.entries()][1][1].lastChangeBid).toBe(0.02224912511866406);
  })
  
  it('should return array of sparkline point by Taking object', () => {
    const dataTable = new CurrencyTable();
    let data = dataTable.getSparklineGraph(sampleData[1].midPrice)
    expect(Array.isArray(data)).toBeTruthy();
  })

});