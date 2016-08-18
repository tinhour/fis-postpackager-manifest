/* fis maifest 文件生成组件 */

/*
 * fis-poster-manifest
 * https://github.com/tinhour
 * author:thinhour
 * 2015-7-21
 */

'use strict';

function trimQuery(url) {
    if (url.indexOf("?") !== -1) {
        url = url.slice(0, url.indexOf("?"));
    }
    return url;
}

function getResourcePathMap(ret, conf, settings, opt) {
    var map = {};
    fis.util.map(ret.map.res, function (subpath, file) {
        map[trimQuery(file.uri)] = subpath;
    });
    fis.util.map(ret.pkg, function (subpath, file) {
        map[trimQuery(file.getUrl(opt.hash, opt.domain))] = file.getId();
    });
    return map;
}

function writeln(content){
    return content+"\r\n";
}

module.exports = function (ret, conf, settings, opt) {  
    if(!settings.manifestName) {
        console.log("mainfest need set settings.postpackager.manifest.manifestName value")
        return ;
    } 
    var pathMap = getResourcePathMap(ret, conf, settings, opt); 
    var maifestContent=writeln("CACHE MANIFEST");
    maifestContent+=writeln("#Generate @"+new Date());
    maifestContent+=writeln("NETWORK:\r\n*");
    maifestContent+=writeln("CACHE:");
    fis.util.map(pathMap,function(subpath,file){
        if(/.*(\.js|\.css|\.gif|\.png|\.jpg|\.jpeg)$/.test(subpath)){            
            maifestContent+=writeln(subpath);
        }        
    })
    var fileExt="manifest";
    var subpath = settings.manifestName;
    var file = fis.file(fis.project.getProjectPath(), subpath);
    ret.pkg[file.subpath] = file;
    var content="CACHE MAINFEST\r\n";
    file.setContent(maifestContent);
    var id = "auto_mainfest";
    ret.map.pkg[id] = {
        uri: file.getUrl(opt.hash, opt.domain),
        type: fileExt
    };
    console.log("\r\n "+settings.manifestName+" generate finished!")
};
