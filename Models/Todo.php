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
    $this->db_manager = new DbManager();
    $this->db_manager->connect();
  }

  public function create($name)
  {
    $stmt = $this->db_manager->dbh->prepare('INSERT INTO '.$this->table.' (name) VALUES (?)');
    $stmt->execute([$name]);
  }
    //一覧を呼び出すためのメソッド
   public function all()
   {
    $stmt = $this->db_manager->dbh->prepare('SELECT * FROM '.$this->table);
    $stmt->execute();
    $tasks = $stmt->fetchAll();

    return $tasks;
   }
}