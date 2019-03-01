export { substr, loadScript, httpBuildQuery, parseForm, parseUrl };


function substr(str, len) {
    let i, l = 0, s = '';
    for (i = 0; i < str.length; i++) {
        l += str.charCodeAt(i) > 128 ? 2 : 1;
        s += str.charAt(i);
        if (l >= len) {
            return s + '...';
        }
    }
    return s;
}

let loadScripts = [];
function loadScript(url, force?, callback?) {
    if (!force && loadScripts.indexOf(url) != -1) {
        return callback('success');
    }
    let script = document.createElement('script');
    script.addEventListener('load', (ev) => {
        document.body.removeChild(script);
        if (typeof callback == 'function') {
            callback('success');
        }
        if (loadScripts.indexOf(url) == -1) {
            loadScripts.push(url);
        }
    });
    script.type = 'text/javascript', script.src = url;
    document.body.appendChild(script);
}

function httpBuildQuery(data) {
    if (!data || typeof data != 'object') {
        return data || '';
    }
    if (data.tagName == 'FORM') {
        return parseForm(data);
    }
    let part, ret = [];
    for (let key in data) {
        part = httpBuildQueryDeep(key, data[key]);
        part && ret.push(part);
    }
    return ret.join('&');
}

function httpBuildQueryDeep(key, value) {
    if (value === null) {
        return '';
    }
    if (typeof value == 'object') {
        let k, v, ret = [];
        for (k in value) {
            if (value[k] !== null) {
                v = value[k];
                k = key + '[' + k + ']';
                ret.push(httpBuildQueryDeep(k, v));
            }
        }
        return ret.join('&');
    }
    if (typeof value == 'boolean') {
        return key + '=' + (value ? '1' : '0');
    }
    if (typeof value != 'function') {
        return key + '=' + encodeURIComponent(value);
    }
    return '';
}

function parseForm(form: HTMLFormElement) {
    let field, value, ret = [];
    let push = (k, v) => {
        ret.push(k + '=' + encodeURIComponent(v));
    };
    for (let i = 0, j; i < form.length; ++i) {
        if (!form[i].name) {
            continue;
        }
        field = form[i];
        switch (field.type) {
            case 'select-one':
            case 'select-multiple':
                for (j = 0; j < field.options.length; ++j) {
                    value = field.options[j];
                    if (value.selected) {
                        push(field.name, value.value);
                    }
                }
                break;
            case 'radio':
            case 'checkbox':
                if (field.checked) {
                    push(field.name, field.value);
                }
                break;
            default:
                push(field.name, field.value);
        }
    }
    return ret;
}

function parseUrl(url) {
    let a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: parseUrlSearch(a.search),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

function parseUrlSearch(search) {
    let ret = {};
    let seg = search.replace(/^\?/, '').split('&');
    for (let i = 0, s; i < seg.length; i++) {
        if (seg[i]) {
            s = seg[i].split('=');
            ret[s[0]] = decodeURIComponent(s[1]);

        }
    }
    return ret;
}
