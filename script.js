
const urlStr = window.location.href;
const url = new URL(urlStr);
const urlParams = url.searchParams;
const path = urlParams.get('p');

window.addEventListener("scroll", function(element) {
    if(window.innerHeight + window.scrollY >= imagepanel.scrollHeight)
    {
        console.log("reached end")
    }
});

window.addEventListener("keyup", function(element) {
    console.log(element.key);

    if(element.key == 'w')
    {
        if(path != "drv0")
        {
            var nextpath = path.substring(0, path.lastIndexOf('/'));
    
            console.log(nextpath);
            location.replace(nextpath);
            
            const nextlink = `?p=${nextpath}`;
            console.log(nextlink);
            location.replace(nextlink);
        }
    }
})


function dirseek(path) {
    var xmlhttp = new XMLHttpRequest();
    var url=`dirseek.php?x=${path}`;
    xmlhttp.open("GET", url, false);
    xmlhttp.send(null);
    return xmlhttp.responseText;
}

var imageviewlayout = document.getElementById("imageviewlayout");
var imageview = document.getElementById("imageview");

imageviewlayout.addEventListener("click", function() {
    imageviewlayout.style.display = "none";
    imageview.style.display = "none";
}) ;

var borderpast=null;
function imgclicked(element) {

    if(borderpast != element)
    {
        var img=document.getElementById(element);

        imageview.src=img.src;
        imageview.style.display = "block";
        imageviewlayout.style.display = "block";
        borderpast = element;
    }
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
    
    const nextlink = `?p=${nextpath}`;
    console.log(nextlink);
    location.replace(nextlink);
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
    <h3>Directory</h3>
    <h5>${val}</h5>
    </div>
    `;
    return html;
}

function mp4clicked(element) {
    console.log(`clicked mp4 ${element}`);
}

function genmp4(ididx, path) {
    var val = path.substring(path.lastIndexOf('/')+1);
    var html=`
    <div id=id${ididx} class="videoitem" onclick="mp4clicked(this.id)">
    <h3>VIDEO</h3>
    <video></video>
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


function reloadimages()
{
    if(dirlistloaduntil < dirlistcount)
    {
        dirlistloaduntil += 20;
        if(dirlistloaduntil > dirlistcount) dirlistloaduntil = dirlistcount;
        
        console.info(`loading to ${dirlistloadfrom} ~ ${dirlistloaduntil}`);
        var imgs = "";
        for(var i=dirlistloadfrom;i<dirlistloaduntil;i++)
        {
            const curr = `${path}${dirlist[i]}`;
            imgs += genimage(curr);
        }
        imagepanel.innerHTML+=imgs;
        dirlistloadfrom = dirlistloaduntil;
    }
    else
    {
        console.info(`ended`);
    }
}




if(path != null)
{
    console.log(`path : ${path}`);
    // const path="drv1/wow/LilyBella/";
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
