 <?php
	$dot_script = $_POST[name];
    
    # 2 new files will be generated, dot_script.gv and image.png
    $fh = fopen('dot_script.gv','w');
    fwrite($fh,$dot_script);
    fclose($fh);
    # 
    $command = 'cat dot_script.gv | dot -Tpng > image.png';
    echo shell_exec($command);
?>