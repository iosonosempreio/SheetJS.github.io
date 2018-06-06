// Based on:
/* oss.sheetjs.com (C) 2014-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */

/** drop target **/
var _target = document.getElementById('drop');
var _file = document.getElementById('file');

var project_data;

/** Spinner **/
var spinner;

var _workstart = function() { spinner = new Spinner().spin(_target); }
var _workend = function() { spinner.stop(); }

/** Alerts **/
var _badfile = function() {
    console.warn('This file does not appear to be a valid Excel file.  If we made a mistake, please send this file to <a href="mailto:dev@sheetjs.com?subject=I+broke+your+stuff">dev@sheetjs.com</a> so we can take a look.', function() {});
};

var _pending = function() {
    console.warn('Please wait until the current file is processed.', function() {});
};

var _large = function(len, cb) {
    console.warn("This file is " + len + " bytes and may take a few moments.  Your browser may lock up during this process.");
};

var _failed = function(e) {
    console.log(e, e.stack);
    console.warn('We unfortunately dropped the ball here.  Please test the file using the <a href="/js-xlsx/">raw parser</a>.  If there are issues with the file processor, please send this file to <a href="mailto:dev@sheetjs.com?subject=I+broke+your+stuff">dev@sheetjs.com</a> so we can make things right.');
};

function _wb(parsed_xlsx) {
    project_data = parsed_xlsx;
    console.log(project_data);
}

/** Drop it like it's hot **/
DropSheet({
    file: _file,
    drop: _target,
    on: {
        workstart: _workstart,
        workend: _workend,
        wb: _wb,
        foo: 'bar'
    },
    errors: {
        badfile: _badfile,
        pending: _pending,
        failed: _failed,
        large: _large,
        foo: 'bar'
    }
})

// load sample
d3.select('#load-sample').on('click', function(d) {
    console.log('load sample, need to write this code');

    var url = "assets/samples/data.xlsx";

    /* set up async GET request */
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";

    req.onload = function(e) {
        var data = new Uint8Array(req.response);
        var workbook = XLSX.read(data, { type: "array" });

        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            if (roa.length > 0) result[sheetName] = roa;
        });
        project_data = result;
        console.log(project_data);
    }

    req.send();

})