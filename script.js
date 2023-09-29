
const video_default_initial_seeking = 30.0;
const thumbnailinterval = 30.0;

const urlStr = window.location.href;
const url = new URL(urlStr);
const urlParams = url.searchParams;


const drivelist = ["drv0", "drv1", "drv2"];


const parampath = getCookie('parampath');
setCookie('parampath', '', 0);
console.log(`parampath: ${parampath}`);


const paramfind = getCookie('paramfind');
setCookie('paramfind', '', 0);
console.log(`paramfind: ${paramfind}`);


// const parampage = getCookie('parampage');
// setCookie('parampage', '', 0);
// console.log(`parampage: ${parampage}`);


const input_search = document.querySelector(".input_search");
let input_search_typing = false;
let every_input_disable = false;


function setCookie(cname, cvalue, exhours) {
    const d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

document.addEventListener("mouseleave", () => {
    if(!controlpanel_force_visible)
        document.querySelector('.control').style.visibility = 'hidden';
        
    ctrldown = false;
    video_mouseover_playing_show = false;
});

document.addEventListener("mouseenter", (param) => {
    mouseareaenter_past = false;
    if(!controlpanel_force_visible)
        showornotcontrolPanel(param.y);

    ctrldown = false;
});

let loadinglight = document.querySelector('.loadinglight');
loadinglight.addEventListener("click", () => {
    if(videothumbnails_updating) {
        videothumbnails_updating_finish();
    }
    else {
        videothumbnails_updating_start();
    }
});

let listmixbutton = document.querySelector('.listmixbutton');
listmixbutton.addEventListener("click", () => {

    dirlist.sort(() => Math.random() - 0.5);

    showcurrentpage(-1, 0); // 1 to next , 0 to prev , -1 to load current pos
});

let controlpanel_force_visible = false;
function bodybackgroundcolor_default() {
    loadinglight.style.backgroundColor = 'greenyellow';
    document.querySelector('.control').style.visibility = 'hidden';
    controlpanel_force_visible = false;
}

function bodybackgroundcolor_busy_exiting() {
    loadinglight.style.backgroundColor = 'yellow';
}

function bodybackgroundcolor_busy() {
    loadinglight.style.backgroundColor = 'red';
    document.querySelector('.control').style.visibility = 'visible';
    controlpanel_force_visible = true;
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
    
    filteredlsit = dirlist.filter(e => e["d"].toUpperCase().includes(findingstr.toUpperCase()));

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

            setCookie('parampath', parampath, 1);
            setCookie('paramfind', input_search.value, 1);
            
            window.open(window.location.href, "_blank");
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
    if(parampath == '') return;

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
        let nextpath = parampath.substring(0, parampath.lastIndexOf('/'));
        setCookie('parampath', nextpath, 1);
        console.log(nextpath);

        if(ctrldown) {
            window.open(window.location.href, "_blank");
        }
        else {
            location.replace(window.location.href);
        }
    }
};

function showornotcontrolPanel(ypos) {
    if(ypos < window.innerHeight / 10)
        mouseareaenter = true;
    else 
        mouseareaenter = false;

    if(mouseareaenter && !mouseareaenter_past) {
        document.querySelector('.control').style.visibility="visible";
    }
    else if(!mouseareaenter && mouseareaenter_past) {
        if(!controlpanel_force_visible)
            document.querySelector('.control').style.visibility="hidden";
    }
    mouseareaenter_past = mouseareaenter;
}

let mouseareaenter = false;
let mouseareaenter_past = false;
document.addEventListener("mousemove", (param) => {
    showornotcontrolPanel(param.y);
});

document.getElementById("btnback").addEventListener("click", function() {
    if(every_input_disable) return;
    nav_back();
});

let btnprev = document.getElementById("btnprev");
btnprev.addEventListener("click", function() {
    if(every_input_disable) return;

    // let page;
    // if(parampage != '')
    // {
    //     page = Number(parampage);
    //     if(page > 0) page--;
    // }
    // else
    // {
    //     page=0;
    // }

    if(parseInt(dirlistshowposition/dirlistmaxshow) == 0) return;

    // if(parampage == '')
    // {
    //     if(page == 0) return;
    // }
    // else
    // {
    //     if(parseInt(parampage) == page) return;
    // }


    showcurrentpage(0);

    // if(searchingsession)
    // {
    //     showcurrentpage(0);
    // }
    // else
    // {
    //     setCookie('parampath', parampath, 1);
    //     setCookie('parampage', page, 1);

    //     if(ctrldown) {
    //         window.open(window.location.href, "_blank");
    //     }
    //     else {
    //         location.replace(window.location.href);
    //     }
    // }
    

    // showcurrentpage(0); // 1 to next , 0 to prev, -1 to load current pos
});

let btnnext = document.getElementById("btnnext");
btnnext.addEventListener("click", function() {
    if(every_input_disable) return;

    // let page;
    // if(parampage != '')
    // {
    //     page = Number(parampage);
    //     page++;
    // }
    // else
    // {
    //     page=1;
    // }
    
    // if(parseInt((itemcount-1)/dirlistmaxshow) < page)
    // {
    //     return;
    // }
    
    showcurrentpage(1);

    // if(searchingsession)
    // {
    //     showcurrentpage(1);
    // }
    // else
    // {
    //     setCookie('parampath', parampath, 1);
    //     setCookie('parampage', page, 1);

    //     if(ctrldown) {
    //         window.open(window.location.href, "_blank");
    //     }
    //     else {
    //         location.replace(window.location.href);
    //     }
    // }


    // showcurrentpage(1); // 1 to next , 0 to prev, -1 to load current pos
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
    const name = element.substring(element.lastIndexOf('/')+1);
    const newpage = `./imgview.html?p=${parampath}&t=${name}`;
    window.open(newpage, "_blank");
}

function genimage(ididx, srcpath) {
    const imgname = srcpath.substring(srcpath.lastIndexOf('/')+1);
    const html=`
    <div class='imageview'>
    <img id=id${ididx} src="${srcpath}" loading=eager onclick="imgclicked(this.src)">
    <h6>${imgname}</h6>
    </img>
    </div>`;
    return html;
}

let folderslist = [];

function folderclicked(element) {
    if(every_input_disable) return;
    console.log(`clicked folder ${element}`);
    let id = element.substring(element.lastIndexOf("id")+2);

    const nextpath = folderslist.find(x=> x.id == id).data;

    setCookie('parampath', nextpath, 1);
    
    if(ctrldown)
    {
        window.open(window.location.href, "_blank");
    }
    else
    {
        location.replace(window.location.href);
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

function mp4clicked(element) {
    if(every_input_disable) return;
    console.log(`clicked mp4 ${element}`);
    let id = element.substring(element.lastIndexOf("id")+2);
    let nextpath = thumbnailed_video_list.find(x=> x.id == id).src;

    setCookie('parampath',nextpath, 1);
    if(paramfind != '') setCookie('paramfind',paramfind, 1);

    window.open('./videoview.html', "_blank");
}

let thumbnailed_video_list = [];

async function genmp4(ididx, param) {
    let name = param.substring(param.lastIndexOf('/')+1);

    const get_result = await indexedDB_get(name);
    
    return new Promise((resolve) => {
        let imagedthumbnail;

        let videopos___ = video_default_initial_seeking;

        if(get_result == undefined) {
            let html=`
            <div id=id${ididx} class="videoview" onclick="mp4clicked(this.id)">
            <img></img>
            <video buffered src="${param}"></video>
            <h6>${name}</h6>
            </div>
            `;
            resolve(html);
            imagedthumbnail = false;
        }
        else
        {
            videopos___ = Number(get_result['position']);
            if(videopos___ >= thumbnailinterval) videopos___ -= thumbnailinterval;

            let html=`
            <div id=id${ididx} class="videoview" onclick="mp4clicked(this.id)">
            <img src=${get_result['filedata']}></img>
            <video buffered src="${param}"></video>
            <h6>${name}</h6>
            </div>
            `;
            resolve(html);
            imagedthumbnail = true;
        }

        console.log(`add!!! - ${param} , ${videopos___}`);

        thumbnailed_video_list.push(
            {
                id: ididx,
                src: param,
                imagedthumbnail: imagedthumbnail,
                filename: name,
                videopos: videopos___
            }
        );

    });
    
}

let countsforwaitingseekedvideo = 0;

let FilesPanel = document.getElementById("FilesPanel");
let title = document.getElementById("title");

let dirlist = null;
const dirlistmaxshow=20;

let dirlistshowposition=0;
let dirlistshowposition_past=-1;
let itemcount=0;

async function showcurrentpage(isnext, pageidx=-1) {
    folderslist = [];
    thumbnailed_video_list = [];
    countsforwaitingseekedvideo = 0;

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
        console.log(`request page - ${pageidx}`);
    }
    else
    {
        return;
    }

    let maxpageidx = parseInt((itemcount-1)/dirlistmaxshow);

    if(pageidx != -1)
    {
        if(pageidx > maxpageidx) pageidx = maxpageidx;
        dirlistshowposition = parseInt(pageidx*dirlistmaxshow);
    }
    
    let currpageidx = parseInt(dirlistshowposition/dirlistmaxshow);
    btnprev.innerText = `Prev - ${currpageidx}`;
    btnnext.innerText = `Next - ${maxpageidx - currpageidx}`;

    if(dirlistshowposition == dirlistshowposition_past && isnext != -1)
    {
        return;
    }
    
    dirlistshowposition_past = dirlistshowposition;


    let contents = "";
    let until = dirlistshowposition + dirlistmaxshow;
    if(until > itemcount) until = itemcount;

    console.log(`show ${dirlistshowposition} ~ ${until}`);
    for(let ididx=dirlistshowposition;ididx<until;ididx++)
    {
        let curr = `${parampath}`;
        if(parampath[parampath.length-1] != '/') curr += '/';

        let fname;
        if(searchingsession)
            fname = filteredlsit[ididx]["d"];
        else
            fname = dirlist[ididx]["d"];
    
        curr += `${fname}`;

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
                contents += await genmp4(ididx, curr);
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

    console.info(`folderslist - ${folderslist.length}`);
    console.info(`thumbnailed_video_list - ${thumbnailed_video_list.length}`);


    thumbnailed_video_list.forEach((each) => {
        if(!each['imagedthumbnail']) {
            countsforwaitingseekedvideo++;
        }
    })

    console.log(`${countsforwaitingseekedvideo} videos are started seeking`);


        
    document.querySelectorAll('.videoview').forEach(view => {
        let videoviewimg = view.getElementsByTagName('img')[0];
        let videoviewvid = view.getElementsByTagName('video')[0];
        
        let not_found = true;

        thumbnailed_video_list.forEach((each) => {
            const p1 = decodeURI(videoviewvid.src);
            const p2 = each['filename'];

            if(p1.endsWith(p2))
            {
                not_found = false;

                if(each['imagedthumbnail'])
                {
                    videoviewimg.style.display = 'block'; // img
                    videoviewvid.style.display = 'none'; // video
                }
                else
                {
                    videoviewimg.style.display = 'none'; // img 
                    videoviewvid.style.display = 'block'; // video
                    
                    // console.log(`default seek - ${each['filename']}`);
                    // videoviewvid.currentTime = video_default_initial_seeking;
                    
                    console.log(`default seek - ${each['filename']}`);

                    videoviewvid.currentTime = video_default_initial_seeking;
                }
                        
                videoviewvid.addEventListener('seeked', video_onseeked_event);
                view.addEventListener("mouseenter", eachvideo_mouseenter);
                view.addEventListener("mouseleave", eachvideo_mouseleave);
                
            }
        });
        
        if(not_found) {
            console.log(`####################### founding Failed #######################`);
        }

    });

    if(countsforwaitingseekedvideo > 0) {
        bodybackgroundcolor_busy();
        every_input_disable = true;
        videothumbnails_updating_readynext = false;
        videoseekedindex = 0;
    }
    else
    {
        videothumbnails_updating_readynext = true;
    }
}

let videoseekedindex = 0;

function video_onseeked_event(video) {

    if(video_mouseover_playing_show)
    {
        video_mouseover_playing_show = false;
        video_mouseover_playing_img.style.display='none';
        video_mouseover_playing_video.style.display='block';
    }


    let name = video.target.src;
    name = name.substring(name.lastIndexOf('/')+1);

    const imagedatabase64 = video_to_image_base64(video.target);

    indexedDB_addvalue(decodeURI(name), imagedatabase64, video.target.currentTime, () => {
        console.log(`cached - ${name} (${video.target.currentTime})`);
    });

    if(video_mouseover_playing_video_playing)
    {
        eachvideo_interval_playing_next_ready = true;
        return;
    }
    
    videoseekedindex++;
    if(videoseekedindex == countsforwaitingseekedvideo) {
        console.log("videos loading done !!!");

        videoseekedindex = 0;
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

}

let eachvideo_interval_playing_next_ready = false;
let eachvideo_interval_playing_handler = null;
let step_count=0;
function eachvideo_interval_playing_handler_elapsed() {

    step_count++;
    if(step_count >= 5)
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
    // console.log(`eachvideo_mouseenter`);
    
    if(every_input_disable) return;

    if(p.target.tagName == 'VIDEO')
    {
        video_mouseover_playing_video = p.target;
    }
    else
    {
        video_mouseover_playing_video = p.target.getElementsByTagName('video')[0];
        video_mouseover_playing_img = p.target.getElementsByTagName('img')[0];
        video_mouseover_playing_show = true;
    }
    
    if(video_mouseover_staying_check_timer != null) clearTimeout(video_mouseover_staying_check_timer);

    video_mouseover_staying_check_timer = setTimeout(() => {
        console.log(`play !!! - ${video_mouseover_playing_video.src}`);

        video_mouseover_playing_video_playing = true;

        eachvideo_interval_playing_next_ready = true;
        eachvideo_interval_playing_handler = setInterval(eachvideo_interval_playing_handler_elapsed, 100);

    }, 1000);
}

function eachvideo_mouseleave(p) {
    
    video_mouseover_playing_show = false;
    
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
let video_mouseover_playing_img = null;
let video_mouseover_playing_show = false;
let video_mouseover_staying_check_timer = null;
let video_mouseover_playing_video_playing = false;

function update_next_everyvideothumbnail() {
    bodybackgroundcolor_busy();
    every_input_disable = true;

    countsforwaitingseekedvideo = document.querySelectorAll('video').length;
    videoseekedindex = 0;

    document.querySelectorAll('.videoview').forEach(view => {
        let videoviewimg = view.getElementsByTagName('img')[0];
        let videoviewvid = view.getElementsByTagName('video')[0];
        
        videoviewimg.style.display = 'none'; // img 
        videoviewvid.style.display = ''; // video
    });

    thumbnailed_video_list.forEach(each => {
        const vids = document.querySelectorAll('video');
        vids.forEach(vid => {
            if(vid.src.endsWith(each['src']))
            {
                let curr = Number(each['videopos']);

                if(curr + thumbnailinterval > vid.duration) {
                    curr = 0.0;
                }
                else {
                    curr += thumbnailinterval;
                }
                
                vid.currentTime = curr;
                each['videopos'] = curr;
            }
        });
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

function extractlastnumberfromfilename(str) {
    let dotpos = str.lastIndexOf('.');
    if(dotpos == -1) return -1;
    let src1 = str.substring(0, dotpos);

    if(isNaN(src1))
    {
        let cut=-1;
        for(let i=src1.length-1;i>=0;i--)
        {
            if(isNaN(src1[i]))
            {
                cut = i+1;
                break;
            } 
        }
    
        if(cut == -1) return -1;
        let res = src1.substring(cut);
        return Number(res);
    }
    else 
    {
        console.log(`Number`);
        return Number(src1);
    }
}


async function startup() {

    if(parampath != '')
    {
        const jsonraw=dirseek(parampath);
        const jsondata=JSON.parse(jsonraw); 
        
        if(jsondata["ret"])
        {
            // console.info(`Successed`);
        
            dirlist = jsondata["data"];
    
            while(true) {  
                const find__ = dirlist.find((a) => { return a["d"][0] == '.';});
                if(find__ == undefined) break;
                // console.log(`ignore - ${find__["d"]}`);
                const idx = dirlist.lastIndexOf(find__);
                dirlist.splice(idx, 1);
            }
    
            itemcount = dirlist.length;
    
            for(let i=0;i<dirlist.length;i++)
            {
                dirlist[i]["t"] = Date.parse(dirlist[i]["t"]);
            }
    
    
            var imgfileslist = dirlist.filter(x => 
                x["d"].substring(x["d"].lastIndexOf('.')+1) == 'jpeg' || 
                x["d"].substring(x["d"].lastIndexOf('.')+1) == 'jpg'  );
            
            if(imgfileslist.length == 0)
            {
                console.log("Sort by Time !!!!");
                dirlist.sort((a,b) => { return b["t"] - a["t"]; });
            }
            else
            {
                if(imgfileslist.length / dirlist.length > 0.5) // check the Ratio of Image File and another File
                {
                    console.log("Sort by Name !!!!");
                    dirlist.sort((a,b) => {
                        return extractlastnumberfromfilename(a["d"]) - extractlastnumberfromfilename(b["d"]);
                    });
                }
                else
                {
                    console.log("Sort by Time !!!!");
                    dirlist.sort((a,b) => { return b["t"] - a["t"]; });
                }
            }
    
            const dirname = parampath.substring(parampath.lastIndexOf('/')+1);
    
            if(paramfind != '') 
                title.innerText = `${dirname} - ${paramfind}`;
            else
                title.innerText = `${dirname}/${itemcount} items`;
    
            // if(itemcount > dirlistmaxshow)
            // {
            //     let idx= Math.floor(itemcount / dirlistmaxshow);
            //     btnnext.innerText = `Next - ${idx}`;
            // }
    
            if(paramfind != '') {
                submitsearching(paramfind);
            }
            else {
                // let page = -1;
    
                // if(parampage != '')
                // {
                //     page = Number(parampage);
                //     showcurrentpage(-1, page); // 1 to next , 0 to prev , -1 to load current pos
                // }
                // else
                // {
                //     showcurrentpage(-1); // 1 to next , 0 to prev , -1 to load current pos
                // }

                showcurrentpage(-1); // 1 to next , 0 to prev , -1 to load current pos
    
            }
    
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
    
}

function video_to_image_base64(video) {
    const canvas = document.querySelector('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const scale = 0.7;
    const canvasValue = canvas.toDataURL('image/jpeg', scale); // Base64 저장 - 0 ~ 1 퀄리티 범위
    return canvasValue;
}

let DBSession;

function indexedDB_init() {
    const request = window.indexedDB.open('customed-web-browser');
    
    request.onupgradeneeded = (e) => {
        console.log('onupgradeneeded');
        let result = e.target.result.createObjectStore('thumbnailstore', {keyPath: 'filename'});
        // result.createIndex('filename', 'filename', {unique: false});
        // result.createIndex('filedata', 'filedata', {unique: false});
    }

    request.onsuccess = (e) => {
        DBSession = request.result;
        
        startup();
    }
    
    request.onerror = (e) => {
        console.error('indexedDB Error');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    indexedDB_init();
    
}, false)



function indexedDB_addvalue(filename, filedata, videocurrentpos, evt) {
    const transaction = DBSession.transaction(['thumbnailstore'], 'readwrite');
    const store = transaction.objectStore('thumbnailstore');
    
    const item = {
        filename: `${filename}`,
        filedata: `${filedata}`,
        position: `${videocurrentpos}`
    }
    
    const resp = store.put(item);
    
    resp.onsuccess = () => {
        evt(true);
    }

    resp.onerror = () => {
        evt(false);
        console.error("indexedDB_addvalue Failed");
    }
}

async function indexedDB_get(filename) {
    const transaction = DBSession.transaction(['thumbnailstore'], 'readwrite');
    const store = transaction.objectStore('thumbnailstore');

    return new Promise( (resolve) => {
        const resp = store.get(filename);
    
        resp.onsuccess = () => {
            resolve(resp.result);
        }
    
        resp.onerror = () => {
            console.error("indexedDB_get Failed");
            resolve(null);    
        }
    });
    
}

