function pageLoad() {
    /*
    var options = {
    // collapsed: true,
    rootCollapsable: true
    };
    if (document.getElementById("inputTextJSON").innerHTML != '')
        $('#json-renderer').jsonViewer(JSON.parse(document.getElementById("json-output").innerHTML), options)
   */

    if (document.getElementById('active-element').innerHTML == 'toJSON') {
        document.getElementById('upload').disabled = false;
        document.getElementById('upload').style.backgroundColor = '#29769a';
        openTab('evt', 'jsonContent');
    }

    if (document.getElementById('active-element').innerHTML == 'toCSV') {
        document.getElementById('upload').disabled = true;
        document.getElementById('upload').style.backgroundColor = '#ccc';
        openTab('evt', 'csvContent');
    }

    if (document.getElementById('active-element').innerHTML == 'toTSV') {
        document.getElementById('upload').disabled = true;
        document.getElementById('upload').style.backgroundColor = '#ccc';
        openTab('evt', 'tsvContent');
    }

    if (document.getElementById('selectScripture').innerHTML == 'S')
        document.getElementById('parseSelect').selectedIndex = 1;

    if (document.getElementById('selectType').innerHTML == 'R')
        document.getElementById('parseType').selectedIndex = 1;

    if (document.getElementById("inputTextJSON").innerHTML == '{}' || document.getElementById("active-element").innerHTML == 'toCSV' || document.getElementById("active-element").innerHTML == 'toTSV') {
        document.getElementById("toUSFM").disabled = true;
        document.getElementById("toUSFM").style.backgroundColor = '#777777';
    }
    else {
        document.getElementById("toUSFM").disabled = false;
        document.getElementById("toUSFM").style.backgroundColor = '#0888c3';
    }

    if (document.getElementById("box1_error_content").innerHTML == '') {
        document.getElementById("box1_error").style.display = 'none';
    } else {
        document.getElementById("box1_error").style.display = 'block';
    }

    if (document.getElementById("box2_error_content").innerHTML == '') {
        document.getElementById("box2_error").style.display = 'none';
    } else {
        document.getElementById("box2_error").style.display = 'block';
    }
}

function DisplayProgressMessage(ctl, msg) {
    $(ctl).prop("disabled", true).text(msg);
    $(".submit-progress").removeClass("hidden");
    $("body").addClass("submit-progress-bg");
    return true;
}

function openTab(evt, contentType) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("box2-content");
    
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementById(contentType).style.display = "block";
    if (evt == 'evt')
        document.getElementById(document.getElementById('active-element').innerHTML).className += " active";
    else {
        document.getElementById('toJSON').className += " active";
        document.getElementById('upload').disabled = false;
        document.getElementById("upload").style.backgroundColor = '#29769a';
        document.getElementById("toUSFM").disabled = false;
        document.getElementById("toUSFM").style.backgroundColor = '#0888c3';
    }
}

function downloadJSON() {
    var tabcontent = document.getElementsByClassName("box2-content");
    for (i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].style.display == "block") break;
    }

    var data;
    var type;
    if (tabcontent[i].id == 'jsonContent') {
        data = document.getElementById("inputTextJSON").innerHTML;
        type = '.json';
    } else if (tabcontent[i].id == 'csvContent') {
        data = document.getElementById("inputTextCSV").innerHTML;
        type = '.csv';
    } else {
        data = document.getElementById("inputTextTSV").innerHTML;
        type = '.tsv';
    }

    download(data, type)
}

function downloadUSFM() {
    var data = document.getElementById("inputTextCSV").innerHTML
    download(data, '.usfm')
}

function download(data, type) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', 'usfm-grammar-' + Math.floor(Date.now() / 1000) + type);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
