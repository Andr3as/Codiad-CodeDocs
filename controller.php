<?php
/*
 * Copyright (c) Codiad & Andr3as, distributed
 * as-is and without warranty under the MIT License. 
 * See http://opensource.org/licenses/MIT for more information.
 * This information must remain intact.
 */
    //error_reporting(0);
    
    require_once('../../common.php');
    checkSession();
    
    
    
    switch($_GET['action']) {
        
        case 'getContent':
            if (isset($_GET['path'])) {
                echo file_get_contents(getWorkspacePath($_GET['path']));
            } else {
                echo '{"status":"error","message":"Missing Parameter"}';
            }
            break;
        
        case 'saveDoc':
            if (isset($_POST['path']) && isset($_POST['result'])) {
                $file = getWorkspacePath($_POST['path']);
                if (file_put_contents($file, $_POST['result']) === false) {
                    echo '{"status":"error","message":"Failed to save documentation"}';
                } else {
                    echo '{"status":"success","message":"Documentation saved"}';
                }
            } else {
                echo '{"status":"error","message":"Missing Parameter"}';
            }
            break;
        
        default:
            echo '{"status":"error","message":"No Type"}';
            break;
    }
    
    
    function getWorkspacePath($path) {
		//Security check
		if (!Common::checkPath($path)) {
			die('{"status":"error","message":"Invalid path"}');
		}
        if (strpos($path, "/") === 0) {
            //Unix absolute path
            return $path;
        }
        if (strpos($path, ":/") !== false) {
            //Windows absolute path
            return $path;
        }
        if (strpos($path, ":\\") !== false) {
            //Windows absolute path
            return $path;
        }
        return WORKSPACE . "/".$path;
    }
?>