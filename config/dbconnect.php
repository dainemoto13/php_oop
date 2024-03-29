<?php

class DbManager
{
    public $dbh;

    public function connect()
    {
      //DBに接続
      $host = 'localhost';
      $dbname = 'Todo';
      $charset = 'utf8mb4';
      $user = 'root';
      //パスワードが必要な人は追記すること。
      $password = '';
      $options = [
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
          PDO::ATTR_EMULATE_PREPARES => false,
      ];
      $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
      try {
        //   class化をした場合 $dbhそのままに代入ではなく、$dbhを$thisに変更してthis->dbhからclass化する↓
        //   $dbh = new PDO($dsn, $user, $password, $options);
        //PDO もともとphpが持ってる設計図
        $this->dbh = new PDO($dsn, $user, $password, $options);
      } catch (\PDOException $e) {
          throw new \PDOException($e->getMessage(), (int) $e->getCode());
      }

    }
}