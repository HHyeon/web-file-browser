
const thumbnailinterval = 30.0;

const urlStr = window.location.href;
const url = new URL(urlStr);
const urlParams = url.searchParams;
const parampath = urlParams.get('p');
const paramfind = urlParams.get('f');
const drivelist = ["drv0", "drv1"];

const input_search = document.querySelector(".input_search");
let input_search_typing = false;
let every_input_disable = false;

function bodybackgroundcolor_default() {
    document.querySelector('.loadinglight').style.backgroundColor = 'greenyellow';
}

function bodybackgroundcolor_busy_exiting() {
    document.querySelector('.loadinglight').style.backgroundColor = 'yellow';
}

function bodybackgroundcolor_busy() {
    document.querySelector('.loadinglight').style.backgroundColor = 'red';
}

input_search.onkeypress = function(e) {
    if(every_input_disable) return;
    let chr = String.fromCharCode(e.which);
    // console.log(`chr - ${chr}`);
    if(chr == '/') return false;
}

let searchingsession = false;
let filteredlsit;

let store_dirlistshowposition;
let store_dirlistshowposition_past;
let store_itemcount;

function submitsearching(findingstr) {
    if(findingstr.length == 0) return;

    console.log(`search - ${findingstr}`);
    
    filteredlsit = dirlist.filter(e => e.includes(findingstr));

    searchingsession = true;

    store_dirlistshowposition = dirlistshowposition;
    store_dirlistshowposition_past = dirlistshowposition_past;
    store_itemcount = itemcount;
    
    dirlistshowposition=0;
    dirlistshowposition_past=-1;
    itemcount=filteredlsit.length;

    showcurrentpage(-1);
}

let videothumbnails_updating = false;
let videothumbnails_updating_readynext = false;
let search_panel_visible_state = false;
let ctrldown = false;

document.addEventListener("keydown", function(e) {
    if(e.key == ' ') {
        if(videothumbnails_updating) {
            videothumbnails_updating_finish();
        }
        else {
            videothumbnails_updating_start();
        }
    }
    if(every_input_disable) return;
    console.log(e.key);
    
    if(e.key == "Control") {
        ctrldown = true;
    }
    else if(e.key == 'Escape') {
        
        if(searchingsession) {
            searchingsession = false;
            
            dirlistshowposition=store_dirlistshowposition;
            dirlistshowposition_past=store_dirlistshowposition_past;
            itemcount=store_itemcount;
            
            showcurrentpage(-1);
        }

    }
    else if(e.key == '/') {
        search_panel_visible_state = !search_panel_visible_state;

        if(search_panel_visible_state) {
            document.querySelector(".search-panel").style.visibility = "visible";
            input_search.focus();
            input_search.value="";
            input_search_typing = true;
        }
        else {
            document.querySelector(".search-panel").style.visibility = "hidden";
            input_search_typing = false;
        }

        console.log();
    }
    else if(e.key == 'Enter') {
        
        if(input_search_typing) {
            input_search_typing = false;

            console.log(window.location);
            
            document.querySelector(".search-panel").style.visibility = "hidden";
            search_panel_visible_state = false;
            // code for current-page-searssssching
            // submitsearching(input_search.value);

            const nextlink = `?p=${parampath}&f=${input_search.value}`;
            window.open(nextlink, "_blank");
        }
    }
});

document.addEventListener("keyup", function(e) {
    if(every_input_disable) return;
    if(e.key == "Control") {
        ctrldown = false;
    }
});

document.addEventListener("scroll", function(element) {
    if(every_input_disable) return;
    if(window.innerHeight + window.scrollY >= FilesPanel.scrollHeight)
    {
        console.log("reached end")
    }
});

function nav_back() {
    if(parampath == null) return;

    if(drivelist.includes(parampath)) // reached top
    {
        if(ctrldown) {
            const nextlink = window.location.href.split("?")[0];
            window.open(nextlink, "_blank");
        }
        else {
            window.location = window.location.href.split("?")[0];
        }
    }
    else
    {
        if(ctrldown) {
            let nextpath = parampath.substring(0, parampath.lastIndexOf('/'));
            const nextlink = `?p=${nextpath}`;
            window.open(nextlink, "_blank");
        }
        else {
            let nextpath = parampath.substring(0, parampath.lastIndexOf('/'));
            const nextlink = `?p=${nextpath}`;
            console.log(nextlink);
            location.replace(nextlink);
        }
    }
};

let mouseareaenter = false;
let mouseareaenter_past = false;
document.addEventListener("mousemove", (param) => {
    if(param.y < window.innerHeight / 20)
        mouseareaenter = true;
    else 
        mouseareaenter = false;

    if(mouseareaenter && !mouseareaenter_past) {
        document.querySelector(".control").style.visibility="visible";
    }
    else if(!mouseareaenter && mouseareaenter_past) {
        document.querySelector(".control").style.visibility="hidden";
    }
    mouseareaenter_past = mouseareaenter;
});

document.getElementById("btnback").addEventListener("click", function() {
    if(every_input_disable) return;
    nav_back();
});

let btnprev = document.getElementById("btnprev");
btnprev.addEventListener("click", function() {
    if(every_input_disable) return;
    showcurrentpage(0); // 1 to next , 0 to prev, -1 to load current pos
});

let btnnext = document.getElementById("btnnext");
btnnext.addEventListener("click", function() {
    if(every_input_disable) return;
    showcurrentpage(1); // 1 to next , 0 to prev, -1 to load current pos
});

function dirseek(param) {
    let xmlhttp = new XMLHttpRequest();
    let url=`dirseek.php?x=${param}`;
    xmlhttp.open("GET", url, false);
    xmlhttp.send(null);
    return xmlhttp.responseText;
};

function imgclicked(element) {
    if(every_input_disable) return;
    console.log("imgclicked");

    let newpage = `./imgview.html`;

    window.open(newpage, "_blank");
}

function genimage(ididx, srcpath) {
    let html=`<img id=id${ididx} class="imageitem" src="${srcpath}" loading=lazy onclick="imgclicked(this.id)"></img>`;
    return html;
}

let folderslist = [];

function folderclicked(element) {
    if(every_input_disable) return;
    console.log(`clicked folder ${element}`);
    let id = element.substring(element.lastIndexOf("id")+2);

    const nextpath = folderslist.find(x=> x.id == id).data;
    
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

function genfolder(ididx, param) {
    let val = param.substring(param.lastIndexOf('/')+1);

    let keyvalue = {
        id: ididx,
        data: param
    };
    folderslist.push(keyvalue);
    
    let html=`
    <div id=id${ididx} class="diritem" onclick="folderclicked(this.id)">
    <div class="vertical-center">
        <h5 class="itemlabel">Directory</h5>
        <h3 class="itemlabel">${val}</h3>
    </div>
    </div>
    `;
    return html;
}

let videoslist = [];

function mp4clicked(element) {
    if(every_input_disable) return;
    console.log(`clicked mp4 ${element}`);
    let id = element.substring(element.lastIndexOf("id")+2);
    let nextpath = videoslist.find(x=> x.id == id).data;

    console.log(`nextpath : ${nextpath}`);
    
    let newpage = `./videoview.html?p=${nextpath}`;
    console.log(newpage);
    window.open(newpage, "_blank");
}

function genmp4(ididx, param) {
    let name = param.substring(param.lastIndexOf('/')+1);
    let keyvalue = {
        id: ididx,
        data: param
    };
    videoslist.push(keyvalue);
    let html=`
    <div id=id${ididx} class="videoview" onclick="mp4clicked(this.id)">
    <video preload="metadata" src="${param}#t=5.0"></video>
    <h6>${name}</h6>
    </div>
    `;
    return html;
}


let FilesPanel = document.getElementById("FilesPanel");
let title = document.getElementById("title");

let dirlist = null;
const dirlistmaxshow=20;

let dirlistshowposition=0;
let dirlistshowposition_past=-1;
let itemcount=0;

function showcurrentpage(isnext) {
    folderslist = [];
    videoslist = [];

    if(isnext == 1)
    {
        if(dirlistshowposition+dirlistmaxshow <= itemcount)
        {
            dirlistshowposition += dirlistmaxshow;
        }
    }
    else if(isnext == 0)
    {
        if(dirlistshowposition >= dirlistmaxshow)
        {
            dirlistshowposition -= dirlistmaxshow;
        }
    }
    else if(isnext == -1)
    {

    }
    else
    {
        return;
    }

    if(dirlistshowposition == dirlistshowposition_past && isnext != -1)
    {
        return;
    }
    
    dirlistshowposition_past = dirlistshowposition;

    btnprev.innerText = `Prev - ${Math.floor(dirlistshowposition/dirlistmaxshow)}`;
    btnnext.innerText = `Next - ${Math.floor(itemcount/dirlistmaxshow) - Math.floor(dirlistshowposition/dirlistmaxshow)}`;

    let contents = "";
    let until = dirlistshowposition + dirlistmaxshow;
    if(until > itemcount) until = itemcount;

    console.log(`show ${dirlistshowposition} ~ ${until}`);
    for(let ididx=dirlistshowposition;ididx<until;ididx++)
    {
        let curr = `${parampath}`;
        if(parampath[parampath.length-1] != '/') curr += '/';

        if(searchingsession) {
            curr += `${filteredlsit[ididx]}`;
        }
        else {
            curr += `${dirlist[ididx]}`;
        }

        const dot = curr.lastIndexOf('.');

        if(dot < 0) // this is a folder
        {
            // console.log(curr);
            contents += genfolder(ididx, curr);
        }
        else
        {
            let fileext=curr.substring(dot+1);
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
    }

    FilesPanel.innerHTML=contents;

    everyvideo = document.querySelectorAll('video');
    if(everyvideo.length > 0) {
        bodybackgroundcolor_busy();
        every_input_disable = true;
        videothumbnails_updating_readynext = false;
        everyvideocounting = 0;
        everyvideo.forEach(vid => {
            vid.addEventListener('seeked', () => {
                
                if(video_mouseover_playing_video_playing)
                {
                    eachvideo_interval_playing_next_ready = true;
                    return;
                }
                
                everyvideocounting++;
                if(everyvideocounting == everyvideo.length) {
                    console.log("videos loading done !!!");
            
                    everyvideocounting = 0;
                    videothumbnails_updating_readynext = true;
                    
                    if(videothumbnails_updating) {
                        console.log("update next !!!");
                        update_next_everyvideothumbnail();
                    }
                    else {
                        console.log("videothumbnails_updating Ended");
                        bodybackgroundcolor_default();
                        every_input_disable = false;
                    }
                }

            });

        });


        everyvideo.forEach(e => {
            e.addEventListener("mouseenter", eachvideo_mouseenter);
            e.addEventListener("mouseleave", eachvideo_mouseleave);
        })

    }
}

let eachvideo_interval_playing_next_ready = false;
let eachvideo_interval_playing_handler = null;
let step_count=0;
function eachvideo_interval_playing_handler_elapsed() {

    step_count++;
    if(step_count >= 3)
    {
        if(eachvideo_interval_playing_next_ready) {
            eachvideo_interval_playing_next_ready = false;
            if(video_mouseover_playing_video.currentTime + thumbnailinterval > video_mouseover_playing_video.duration) {
                video_mouseover_playing_video.currentTime = 0.0;
            }
            else {
                video_mouseover_playing_video.currentTime += thumbnailinterval;
            }
            
            step_count = 0;
        }
    }


}

function eachvideo_mouseenter(p) {
    if(every_input_disable) return;

    video_mouseover_playing_video = p.target;
    if(video_mouseover_staying_check_timer != null) clearTimeout(video_mouseover_staying_check_timer);

    video_mouseover_staying_check_timer = setTimeout(() => {
        // console.log(`play !!! - ${video_mouseover_playing_video.src}`);
        video_mouseover_playing_video_playing = true;

        eachvideo_interval_playing_next_ready = true;
        eachvideo_interval_playing_handler = setInterval(eachvideo_interval_playing_handler_elapsed, 100);

    }, 1000);
}

function eachvideo_mouseleave(p) {
    if(video_mouseover_staying_check_timer != null)
        clearTimeout(video_mouseover_staying_check_timer);
    video_mouseover_staying_check_timer = null;
    
    if(eachvideo_interval_playing_handler != null)
        clearTimeout(eachvideo_interval_playing_handler);
    eachvideo_interval_playing_handler = null;

    if(video_mouseover_playing_video_playing) {
        // console.log(`stopping - ${video_mouseover_playing_video.src}`);
        video_mouseover_playing_video.pause();
    }
    video_mouseover_playing_video = null;
    video_mouseover_playing_video_playing = false;
}

let video_mouseover_playing_video = null;
let video_mouseover_staying_check_timer = null;
let video_mouseover_playing_video_playing = false;

let everyvideo;
let everyvideocounting = 0;

function update_next_everyvideothumbnail() {
    bodybackgroundcolor_busy();
    every_input_disable = true;
    everyvideo.forEach(e1 => {
        if(e1.currentTime + thumbnailinterval > e1.duration) {
            e1.currentTime = 0.0;
        }
        else {
            e1.currentTime += thumbnailinterval;
        }
    });
}

function videothumbnails_updating_start() {
    if(!videothumbnails_updating_readynext) {
        console.log("videothumbnails_updating_start - not ready");
        return;
    }
    
    if(!videothumbnails_updating) {
        videothumbnails_updating = true;
        console.log("starting updating thumbnail videos");
        update_next_everyvideothumbnail();
    }
}

function videothumbnails_updating_finish() {
    if(videothumbnails_updating) {
        console.log("stopping updating thumbnail videos");
        bodybackgroundcolor_busy_exiting();
        videothumbnails_updating = false;
    }
}

if(parampath != null)
{
    const jsonraw=dirseek(parampath);
    const jsondata=JSON.parse(jsonraw); 
    
    if(jsondata["ret"])
    {
        // console.info(`Successed`);
    
        dirlist = jsondata["data"];
        // dirlist.sort();
        dirlist.reverse();
        itemcount = dirlist.length;
        const dirname = parampath.substring(parampath.lastIndexOf('/')+1);

        if(paramfind != null) 
            title.innerText = `${dirname} - ${paramfind}`;
        else
            title.innerText = `${dirname}/${itemcount} items`;

        // if(itemcount > dirlistmaxshow)
        // {
        //     let idx= Math.floor(itemcount / dirlistmaxshow);
        //     btnnext.innerText = `Next - ${idx}`;
        // }

        if(paramfind != null) {
            submitsearching(paramfind);
        }
        else {
            showcurrentpage(-1); // 1 to next , 0 to prev , -1 to load current pos
        }

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
    let contents = "";
    let ididx=0;

    drivelist.forEach(element => {
        contents += genfolder(ididx, element);
        ididx++;
    });

    itemcount = drivelist.length;
    
    FilesPanel.innerHTML=contents;
}