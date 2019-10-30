<?php
require_once ('config/dbconnect.php');
// require_once 'config/dbconnect.php';

class Todo
{
    private $table = 'tasks';
    private $db_manager;

    public function __construct()
    {
        $this->db_manager = new DbManager();
        $this->db_manager->connect();
    }
    public function create($name)
    {
        $stmt = $this->db_manager->dbh->prepare('INSERT INTO '.$this->table.' (name) VALUES (?)');
        $stmt->execute([$name]);
    }
    public function all()
    {
        // dbconnect.phpの$dbh = new PDO が $this->dbh = new PDO のclass化表記になっていなかったのでFatal error(スペルミス)のエラーが発生した↓
        $stmt = $this->db_manager->dbh->prepare('SELECT * FROM '.$this->table);
        $stmt->execute();
        $tasks = $stmt->fetchAll();
        return $tasks;
    }
        //editするためのデータを取得
        public function get($id)
        {
            $stmt = $this->db_manager->dbh->prepare('SELECT * FROM '.$this->table.' WHERE id = ?');
            $stmt->execute([$id]);
            $task = $stmt->fetch();
            return $task;
        }
        public function update($name, $id)
        {
            $stmt = $this->db_manager->dbh->prepare('UPDATE '.$this->table.' SET name = ? WHERE id = ?');
            $stmt->execute([$name, $id]);
        }
}