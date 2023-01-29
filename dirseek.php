<?php

function console_log($output, $with_script_tags = true) {
    $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . ');';
    if ($with_script_tags) {
        $js_code = '<script>' . $js_code . '</script>';
    }
    echo $js_code;
}



$jsonresult = array();
$jsonresult["ret"]=FALSE;
$data = array();

if(isset($_GET["x"]))
{
    $path=$_GET["x"];

    // console_log($path);

    $dirhandle=opendir($path);
    
    if($dirhandle)
    {
        while(($entry=readdir($dirhandle)) !== FALSE)
        {
            if($entry == "." || $entry == "..") continue;

            // console_log($entry);
            array_push($data, $entry);
        }
        
        $jsonresult["ret"]=TRUE;
    }

    closedir($path);
}
else
{
    // console_log("input params ".$input." not given");
}

// foreach($data as $each) console_log($each);

$jsonresult["data"] = $data;
echo json_encode($jsonresult);
?>