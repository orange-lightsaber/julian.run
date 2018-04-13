var nxtBtn = document.querySelector('#nxt-btn');
var mainView = document.querySelector('#main-view');
var modules = {};

getNextView('/template/boot', '/asset/js/boot.js', 'boot', mainView);
// getNextView('/home', '/assets/js/home.js', 'home', mainView);
setView('boot');

function getNextView(viewModulePath, jsModulePath, moduleName, element) {
    if (typeof modules[moduleName] == 'undefined') {
        modules[moduleName] = {};
    }
    modules[moduleName].element = element;
    getAsset(viewModulePath, moduleName, readNextView);
    if (jsModulePath != '') {
        getAsset(jsModulePath, moduleName, readNextJS);
    } else {
        modules[moduleName].js = '';
    }
}

function getAsset(modulePath, moduleName, next) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', modulePath, true);
    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && next) {
            next(xhr.responseText, moduleName);
        }
    });
    xhr.send(null);
}

function readNextView(resText, moduleName) {
    modules[moduleName].templateStr = resText;
}

function readNextJS(resText, moduleName) {
    modules[moduleName].js = resText;
}

function setView(moduleName) {
    var i = 1;
    var tryTimeout = 2400; // 2400 50ms tries for a two minute timeout
    var tryGo = setInterval(function() {
        if (typeof modules[moduleName].templateStr != 'undefined' && typeof modules[moduleName].js != 'undefined') {
            go(moduleName);
            clearInterval(tryGo);
        } else if (i == tryTimeout) {
            alert('Module request timed out.');
            clearInterval(tryGo);
        }
        i++;
    }, 50);

    function go(moduleName) {
        modules[moduleName].element.innerHTML = modules[moduleName].templateStr;
        var hasScript = !!modules[moduleName].element.getElementsByTagName('script')[0];
        if (hasScript) {
            eval(modules[moduleName].js);
        }
    }
}