<?php
/**
 * Created by PhpStorm.
 * User: EZ
 * Date: 2017/6/14
 * Time: 16:11
 */
date_default_timezone_set("PRC");
if($_POST){
    $base64Img=$_POST['imgBase64'];

    if (preg_match('/^(data:\s*image\/(\w+);base64,)/',$base64Img, $result)){
        $type = $result[2]; //jpeg
        $img = base64_decode(str_replace($result[1], '',$base64Img)); //返回文件流
    }else{
        die(json_error('上传失败'));
    }

    $path="img/".date("ymd");
    if(!is_dir($path)){
        mkdir($path,0777,true) || die(json_error('文件夹创建失败'));
    }
    $newImgName=mt_rand(11111,99999).".".$type;
    $path.='/'.$newImgName;
    file_put_contents($path,$img) || die(json_error('上传失败'));
    die(json_success('上传成功',['imgurl'=>$path]));
}


//返回json数据判断成功或错误
function json_success($msg,$data=array()){
    header("content-type:application/json;charset=utf8");
    return json_encode(array('res'=>1,'msg'=>$msg,'data'=>$data),JSON_UNESCAPED_UNICODE);
}
function json_error($msg,$data=array()){
    header("content-type:application/json;charset=utf8");
    return json_encode(array('res'=>0,'msg'=>$msg,'data'=>$data),JSON_UNESCAPED_UNICODE);
}

