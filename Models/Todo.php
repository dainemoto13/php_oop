<?php

// require_once('config/dbconnect.php');
require_once 'config/dbconnect.php';


class Todo
{
  private $table = 'tasks';
  private $db_manager;

  public function __construct()
  {
    // new インスタント化
    $this->db_manager = new　DbManager();
    $this->db_manager->connect();
  }
}