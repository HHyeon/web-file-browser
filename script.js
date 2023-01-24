
const urlStr = window.location.href;
const url = new URL(urlStr);
const urlParams = url.searchParams;
const path = urlParams.get('p');
const rootdrv="drv0";

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
    const nextlink = `?p=${rootdrv}`;
    console.log(nextlink);
    location.replace(nextlink);
}

window.addEventListener("scroll", function(element) {
    if(window.innerHeight + window.scrollY >= imagepanel.scrollHeight)
    {
        console.log("reached end")
    }
});

window.addEventListener("keyup", function(element) {
    if(element.key == 'w')
    {
        if(path != rootdrv)
        {
            var nextpath = path.substring(0, path.lastIndexOf('/'));
    
            console.log(nextpath);
            location.replace(nextpath);
            
            const nextlink = `?p=${nextpath}`;
            console.log(nextlink);
            location.replace(nextlink);
        }
    }
    else if(element.key == 'r')
    {

    }
});

function dirseek(path) {
    var xmlhttp = new XMLHttpRequest();
    var url=`dirseek.php?x=${path}`;
    xmlhttp.open("GET", url, false);
    xmlhttp.send(null);
    return xmlhttp.responseText;
};

var imageviewlayout = document.getElementById("imageviewlayout");
var imageview = document.getElementById("imageview");

imageviewlayout.addEventListener("click", function() {
    imageviewlayout.style.display = "none";
    imageview.style.display = "none";
}) ;

function imgclicked(element) {
    console.log("imgclicked");

    var newpage = `./imgview.html`;

    window.open(newpage, "_blank");

    // var img=document.getElementById(element);
    // imageview.src=img.src;
    // imageview.style.display = "block";
    // imageviewlayout.style.display = "block";
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

}

function genmp4(ididx, path) {
    var val = path.substring(path.lastIndexOf('/')+1);
    var keyvalue = {
        id: ididx,
        data: path
    };
    videoslist.push(keyvalue);
    var html=`
    <div id=id${ididx} class="videoview" onclick="mp4clicked(this.id)">
    <video class="videoitem" preload="metadata" src="${path}#t=0.1"></video>
    </div>
    `;
    return html;
}

var imagepanel = document.getElementById("imagepanel");
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
        title.innerText = `${dirlistcount} items`;
    
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
        imagepanel.innerHTML=contents;

        console.info(`folderslist - ${folderslist.length}`);
        console.info(`videoslist - ${videoslist.length}`);
        // reloadimages();
    }
    else
    {
        dirlist = null;
        dirlistcount = 0;
        imagepanel.innerHTML = `<h1>failed</h1>`
    }
}
else
{
    dirlist = null;
    dirlistcount = 0;
    imagepanel.innerHTML = `<h1>failed</h1>`
}
