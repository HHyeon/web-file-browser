
const urlStr = window.location.href;
const url = new URL(urlStr);
const urlParams = url.searchParams;
const path = urlParams.get('p');
const drivelist = ["drv0", "drv1"];

document.addEventListener('readystatechange', event => { 
    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        console.log("interactive");
    }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        console.log("complete");
    }
});


var ctrldown = 0;
document.addEventListener("keydown", function(e) {
    if(e.key == "Control") {
        ctrldown = 1;
    }
});
document.addEventListener("keyup", function(e) {
    if(e.key == "Control") {
        ctrldown = 0;
    }
});

if(path == null)
{
    // Proceed To Drive Selection Page
    // const nextlink = `?p=${currentrootpath}`;
    // console.log(nextlink);
    // location.replace(nextlink);
}

window.addEventListener("scroll", function(element) {
    if(window.innerHeight + window.scrollY >= FilesPanel.scrollHeight)
    {
        console.log("reached end")
    }
});

window.addEventListener("keyup", function(element) {
    if(element.key == 'q')
    {
        if(path == null) return;

        if(drivelist.includes(path))
        {
            window.location = window.location.href.split("?")[0];
        }
        else
        {
            var nextpath = path.substring(0, path.lastIndexOf('/'));
            const nextlink = `?p=${nextpath}`;
            console.log(nextlink);
            location.replace(nextlink);
        }
    }
});

function dirseek(path) {
    var xmlhttp = new XMLHttpRequest();
    var url=`dirseek.php?x=${path}`;
    xmlhttp.open("GET", url, false);
    xmlhttp.send(null);
    return xmlhttp.responseText;
};

function imgclicked(element) {
    console.log("imgclicked");

    var newpage = `./imgview.html`;

    window.open(newpage, "_blank");
}

function genimage(ididx, srcpath) {
    var html=`<img id=id${ididx} class="imageitem" src="${srcpath}" onclick="imgclicked(this.id)"></img>`;
    return html;
}

var folderslist = [];

function folderclicked(element) {
    console.log(`clicked folder ${element}`);
    var id = element.substring(element.lastIndexOf("id")+2);
    // console.log(`id : ${id}`);
    var nextpath = folderslist.find(x=> x.id == id).data;
    
    if(ctrldown)
    {
        const nextlink = `?p=${nextpath}`;
        console.log(nextlink);
        window.open(nextlink, "_blank");
    }
    else
    {
        const nextlink = `?p=${nextpath}`;
        console.log(nextlink);
        location.replace(nextlink);
    }

}

function genfolder(ididx, path) {
    var val = path.substring(path.lastIndexOf('/')+1);

    var keyvalue = {
        id: ididx,
        data: path
    };
    folderslist.push(keyvalue);
    
    var html=`
    <div id=id${ididx} class="textitem" onclick="folderclicked(this.id)">
    <h5>Directory</h5>
    <h3>${val}</h3>
    </div>
    `;
    return html;
}

var videoslist = [];

function mp4clicked(element) {
    console.log(`clicked mp4 ${element}`);
    var id = element.substring(element.lastIndexOf("id")+2);
    var nextpath = videoslist.find(x=> x.id == id).data;

    console.log(`nextpath : ${nextpath}`);
    
    var newpage = `./videoview.html?p=${nextpath}`;
    console.log(newpage);
    window.open(newpage, "_blank");
}

var textinfo = document.getElementById("textinfo");

function genmp4(ididx, path) {
    var val = path.substring(path.lastIndexOf('/')+1);
    var keyvalue = {
        id: ididx,
        data: path
    };
    videoslist.push(keyvalue);
    var html=`
    <div id=id${ididx} class="videoview" onclick="mp4clicked(this.id)">
    <video alt="${val}" class="videoitem" preload="metadata" src="${path}#t=10.0"
    ></video>
    </div>
    `;
    return html;
}

var FilesPanel = document.getElementById("FilesPanel");
var title = document.getElementById("title");

var dirlist = null;
var dirlistcount=0;
var dirlistloaduntil=0;
var dirlistloadfrom=0;

if(path != null)
{
    const jsonraw=dirseek(path);
    const jsondata=JSON.parse(jsonraw); 
    
    if(jsondata["ret"])
    {
        // console.info(`Successed`);
    
        dirlist = jsondata["data"];
        dirlist.sort();
        dirlistcount = dirlist.length;
        const dirname = path.substring(path.lastIndexOf('/')+1);
        title.innerText = `${dirname}/${dirlistcount} items`;
    
        var contents = "";
        var ididx=0;
        dirlist.forEach(element => {
            var curr = `${path}`;
            if(path[path.length-1] != '/') curr += '/';
            curr += `${element}`;

            const dot = curr.lastIndexOf('.');
    
            if(dot < 0) // this is a folder
            {
                // console.log(curr);
                contents += genfolder(ididx, curr);
            }
            else
            {
                var fileext=curr.substring(dot+1);
                // console.log(`fileext - ${fileext}`);
    
                if(fileext == "mp4")
                {
                    contents += genmp4(ididx, curr);
                }
                else if(fileext == "jpg" || fileext == "jpeg") {
                    contents += genimage(ididx, curr);
                }
                else
                {
                    contents += genfolder(ididx, curr);
                }
            }
            
            ididx++;
    
        });
        FilesPanel.innerHTML=contents;

        console.info(`folderslist - ${folderslist.length}`);
        console.info(`videoslist - ${videoslist.length}`);
        // reloadimages();
    }
    else
    {
        FilesPanel.innerHTML = `<h1>failed</h1>`
    }
}
else
{
    var contents = "";
    var ididx=0;

    drivelist.forEach(element => {
        contents += genfolder(ididx, element);
        ididx++;
    });
    
    FilesPanel.innerHTML=contents;
}
