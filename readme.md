# ToDo App を作ろう

目次

1. [下準備](##下準備)
2. DBの設定
3. todoクラスの作成
4. データの登録(Create)
5. 一覧の出力(Read)

## 下準備

まずは以下ripositoryを参考にディレクトリを作成します。

[元repositoryはこちら](https://github.com/camillenexseed/56php_oop)

初期段階でリポジトリのディレクトリ名と用意するファイル
```
php_oop/
  ├ index.php
  └ assets/css/(元リポジトリのファイルをコピペ)
    ├ reset.css
    └ style.css
```

**ファーストコミット**

ファイルを作成したら、ファーストコミットします。initial commitとfirst commitどちらでOKです。
```
initial commit
first commit
```
**index.phpとDB読み込みようにコードを追加**

```
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

</body>
</html>
```

config/dbconnect.phpを作成し、以下コードを追加。
```
<?php

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
    $dbh = new PDO($dsn, $user, $password, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int) $e->getCode());
}
```
[▲先頭に戻る▲](#)

## SQLと接続するクラス作成

## Todoの処理作成

## createのメソッド作成