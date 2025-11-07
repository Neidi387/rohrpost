<?php 
    exec('whoami', $output);
    die($output[0]);