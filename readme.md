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
[▲先頭に戻る▲](# )

## SQLと接続するクラス作成

**SQLのエクスポートとdbconnect.phpに追加したコードをクラスに書き換える**

DbManagerというクラスを作成します。それに伴い、dbconnect.phpのプロパティとメソッドを作成します。
```
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
        $password = '';
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
        try {
            $this->dbh = new PDO($dsn, $user, $password, $options);
        } catch (\PDOException $e) {
            throw new \PDOException($e->getMessage(), (int) $e->getCode());
        }
    }
}
```
**DBの作成とテーブル作成**

phpMyAdminにアクセスしてDB「Todo」を作成します。

[phpMyAdmin](http://localhost/phpmyadmin/)

元リポジトリのdatabase/php_oop.sqlをDL(もしくはコピペ)しておきます。phpMyAdmineからエクスポートしてテーブルをあらかじめ作っておきます。

#### テーブルの作り方

phpMyAdminを使ったやり方は今の所３通りあります。今回は最も簡単な既存のsqlファイルをエクスポートで作成しました。

- sqlファイルのエクスポート
- GUIを利用する
- phpMyAdminからSQL文を実行する
## Todoの処理作成

**データの登録用のUIを先に作成**

index.phpにヘッダーと登録フォームを追加します。
```
<header class="px-5 bg-primary">
    <nav class="navbar navbar-dark">
        <a href="index.php" class="navbar-brand">TODO APP</a>
        <div class="justify-content-end">
            <span class="text-light">
                SeedKun
            </span>
        </div>
    </nav>
</header>
<main class="container py-5">
    <section>
        <form class="form-row justify-content-center" action="create.php" method="POST">
            <div class="col-10 col-md-6 py-2">
                <input type="text" class="form-control" placeholder="ADD TODO" name="task">
            </div>
            <div class="py-2 col-md-3 col-10">
                <button type="submit" class="col-12 btn btn-primary">ADD</button>
            </div>
        </form>
    </section>
    <section>

    </section>
</mai
```
index.phpと同列に空のcreate.phpを作成します。

index.phpからフォームを送信して、create.phpに遷移し、まずはきちんとname属性に格納されたPOSTデータが取得できているかdeveloper toolを使って確認します。

**使いまわせるようにTodo.phpというクラスを作る**

Models/ディレクトリーにTodo.phpを作成します。dbconnect.phpを一度に読み込んで、DB操作をするためのclassを使えるようにします。

#### 初期値の設定
```
require_once('config/dbconnect.php');
// require_once 'config/dbconnect.php';

class Todo
{
    private $table = 'tasks';
    private $db_manager;

    public function__construct()
    {
        $this->db_manager = new DbManager();
        $this->db_manager->connect();
    }
}
```
## createのメソッド作成

空の create.php Todo.phpからクラスを使えるように以下のようにコードを追加します。

このファイルはデータの更新のためにのみ使います。
```
<?php

// require_once 'Models/Todo.php';
require_once('Models/Todo.php');

//入力されたデータを変数taskに保存
$task = $_POST['task'];
```

次に、Models/Todo.phpにデータを登録するメソッドを追加します。 擬似クラス や アロー演算子 を使っているのでコードが長くて混乱してしまいがちですが やっていることは一緒 です。 また アロー演算子 内で使う変数には $ は不要になりますので注意しましょう。

```
    public function create($name)
    {
        $stmt = $this->db_manager->dbh->prepare('INSERT INTO '.$this->table.' (name) VALUES (?)');
        $stmt->execute([$name]);
    }
```

create.phpに以下のコードを追加します。 クラスTodoをインスタンス化しデータ登録のためのcreateメソッドを呼び出しています。

```
$todo = new Todo();

$todo->create($task);

```

ここまでできたらまずはindex.phpにアクセスし、フォームを送信し[phpMyAdmin](http://localhost/phpmyadmin/)を確認してみます。

dbへの反映が確認できたら、もうこのファイルの役割は終わりなのでindex.phpにリダイレクトする以下のコードを追記します。

```
header('Location: index.php');
```

ここまでのフォルダ構造とコードは以下の通りになります。

```
php_oop/
  ├ index.php (トップページ)
  ├ create.php (データ登録機能)
  ├ config/
  |    └ dbconnect.php（DBとアクセスするための設定など）
  ├ Models/
  |    └ Todo.php（CRUDのやりとり）
  └ assets/
    └ css/(元リポジトリのファイルをコピペなので割愛)
        ├ reset.css
        └ style.css
```

index.php

```
<!DOCTYPE html>
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
<header class="px-5 bg-primary">
        <nav class="navbar navbar-dark">
            <a href="index.php" class="navbar-brand">TODO APP</a>
            <div class="justify-content-end">
                <span class="text-light">
                    SeedKun
                </span>
            </div>
        </nav>
    </header>
    <main class="container py-5">
        <section>
            <form class="form-row justify-content-center" action="create.php" method="POST">
                <div class="col-10 col-md-6 py-2">
                    <input type="text" class="form-control" placeholder="ADD TODO" name="task">
                </div>
                <div class="py-2 col-md-3 col-10">
                    <button type="submit" class="col-12 btn btn-primary">ADD</button>
                </div>
            </form>
        </section>
        <section>

        </section>
    </main>

</body>
</html>
```

create.php

```
<?php

require_once('Models/Todo.php');
// require_once 'Models/Todo.php';

//入力されたデータを変数taskに保存
$task = $_POST['task'];

$todo = new Todo();

$todo->create($task);

header('Location: index.php');
```

config/dbconnect.php

```
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
        // パスワードがある場合は追記要
        $password = '';
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
        try {
            $this->dbh = new PDO($dsn, $user, $password, $options);
        } catch (\PDOException $e) {
            throw new \PDOException($e->getMessage(), (int) $e->getCode());
        }
    }
}
```

Models/Todo.php

```
<?php

// require_once 'config/dbconnect.php';
require_once('config/dbconnect.php');

class Todo
{
    private $table = 'tasks';
    private $db_manager;

    //デフォルト値
    public function __construct()
    {
        //dbconnect.phpのクラスをインスタンス化
        $this->db_manager = new DbManager();

        //DBとアクセスできる状態にしておく
        $this->db_manager->connect();
    }

    public function create($name)
    {
        // 引数$nameをDBに追加
        $stmt = $this->db_manager->dbh->prepare('INSERT INTO '.$this->table.' (name) VALUES (?)');
        $stmt->execute([$name]);
    }
}
```