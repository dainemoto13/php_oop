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
## 一覧の出力(Read)

取得できたデータをトップページに一覧として追加できるようにします。

### 一覧用のUIの追加

index.phpに一覧を表示するhtmlの元になるものを追加します。一覧は```<table>```で出力します。後ほど```<tbody>```内のタグは差し替えます。
```
<section class="mt-5">
  <table class="table table-hover">
      <thead>
        <tr class="bg-primary text-light">
            <th class=>TODO</th>
            <th>DUE DATE</th>
            <th></th>
            <th></th>
        </tr>
      </thead>
      <tbody>
        <!--ここ以下後ほど繰り返し処理する-->
        <tr>
            <td>タスク名</td>
            <td>日付</td>
            <td>
                <a class="text-success" href="">EDIT</a>
            </td>
            <td>
                <a class="text-danger" href="">DELETE</a>
            </td>
        </tr>
        <!--/ ここ以上後ほど繰り返し処理する-->
      </tbody>
  </table>
</section>
```
### 一覧のデータを取得するメソッドを追加する
Models/Todo.php 内に一覧を取得するためのメソッドallを作ります。値は配列として返ってきます。
```
//一覧を呼び出すためのメソッド
    public function all()
    {
        $stmt = $this->db_manager->dbh->prepare('SELECT * FROM '.$this->table);
        $stmt->execute();
        $tasks = $stmt->fetchAll();

        return $tasks;
    }
```
### データ取得テスト
ndex.php内で一覧のデータが取得できるかテストします。```<html> ```コードの上に以下コードを追加します。

**index.php**

```
<?php
    // require_once 'Models/Todo.php';
    require_once('Models/Todo.php');

    //Todoクラスのインスタンス化
    $todo = new Todo();

    //DBからデータを全件取得
    $tasks = $todo->all();

    echo '<pre>';
    var_dump($tasks);
    exit();
?>
```

htmlのタグ ```<pre>``` を使うとデバッグした内容の可読性が上がります。 まずは一覧が取得できているか確認します。 ```var_dump()``` 以降のhtmlコードの表示は必要ありません。処理が終わったら、それ以降を中断するために ```exit()``` を使います。

長いページなどで部分的なデバッグをする際に有効です。

### htmlで出力する
次に、 ```foreach``` を使ってhtmlで一覧を出力します。

html常に出力したい場合は可読性を考慮し、 **コロン構文** を使います。一覧は配列として$tasksに格納したので、以下のようなコードで出力してみましょう。

配列は複数のデータを格納しているので、以下のような書き方をすることが多いです。便利なので覚えておきましょう。

- $tasks >>> $task
- $fruits >>> $fruit
- $lists >>> $list

```
<?php foreach ($tasks as
$task):?>
  <tr>
    <td><?php echo $task['name']; ?></td>
    <td><?php echo $task['due_date']; ?></td>
    <td>NOT YET</td>
    <td>
        <a class="text-success" href="">EDIT</a>
    </td>
    <td>
        <a class="text-danger" href="">DELETE</a>
    </td>
  </tr>
<?php endforeach; ?>
```
テーブルの列( ```<tr> ```)が配列の数だけ繰り返されます。

### エスケープ処理
入力されたデータが装飾されていて、予期しない表示になることがあります。 **XSS(クロスサイトスクリプティング対策)** のために必ずエスケープ処理をしましょう。

現在はFireFox以外のブラウザはJSコードをフォームで送信出来ないようです。

index.phpと同列にfunction.phpファイルを作成します。 関数hを作成します。
```
<?php

function h($str)
{
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}
```

index.phpの上の方で以下のコードを追加して、function.phpを読み込めるようにします。

```
// require_once 'function.php';
require_once('function.php');
```

読み込んだコードを無害化します。

```
<td><?php echo h($task['name']); ?></td>
<td><?php echo h($task['due_date']); ?></td>

```
ここまでのフォルダ構造とコードは以下の通りになります。

```
php_oop/
  ├ index.php (トップページ)
  ├ create.php (データ登録機能)
  ├ function.php (エスケープ処理)
  ├ config/
  |    └ dbconnect.php（DBとアクセスするための設定など）
  ├ Models/
  |    └ Todo.php（CRUDのやりとり）
  └ assets/
    └ css/(元リポジトリのファイルをコピペなので割愛)
        ├ reset.css
        └ style.css
```
#### index.php
```
<?php

    // require_once 'function.php';
    require_once('function.php');

    // require_once 'Models/Todo.php';
    require_once('Models/Todo.php');

    //Todoクラスのインスタンス化
    $todo = new Todo();

    //DBからデータを全件取得
    $tasks = $todo->all();

    // echo '<pre>';
    // var_dump($tasks);
    // exit();
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
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
        <section class="mt-5">
          <table class="table table-hover">
            <thead>
              <tr class="bg-primary text-light">
                  <th class=>TODO</th>
                  <th>DUE DATE</th>
                  <th>STATUS</th>
                  <th></th>
                  <th></th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($tasks as
              $task):?>
              <tr>
                <td>
                <?php echo h($task['name']); ?>
                </td>
                <td>
                <?php echo h($task['due_date']); ?>
                </td>
                <td>NOT YET</td>
                <td>
                    <a class="text-success" href="">EDIT</a>
                </td>
                <td>
                    <a class="text-danger" href="">DELETE</a>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </section>
    </main>
</body>
</html>
```
#### Models/Todo.php
```
<?php

// require_once 'config/dbconnect.php';
require_once('config/dbconnect.php');

class Todo
{
    private $table = 'tasks';
    private $db_manager;

    // 初期値
    public function __construct()
    {
        $this->db_manager = new DbManager();
        $this->db_manager->connect();
    }

    // ToDo登録メソッド
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
```
#### function.php
```
<?php

function h($str)
{
    // エスケープ処理
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}
```

## データの更新(Update)
タスクの更新処理をします。
### 更新用のページ (UI)を作る
まずは、index.phpの各タスクにリンクを作りGETでedit.phpにidの値を渡せるようにします。ここでポイントとなるのはフォームを使わずに```<a>```タグで 直にパラメータを渡す というところです。
```
<a class="text-success" href="edit.php?id=<?php echo h($task['id']); ?>">EDIT</a>
```
edit.phpのhtmlも追加しておきます。
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>TODO APP</title>
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
            <form class="form-row" action="update.php" method="POST">
                <div class="col-12 col-md-9 py-2">
                    <input type="text" name="task" class="form-control" placeholder="ADD TODO">
                </div>
                <div class="py-2 col-md-3 col-12">
                    <button type="submit" class="col-12 btn btn-primary btn-block">UPDATE</button>
                </div>
            </form>
        </section>
    </main>
</body>
</html>
```
#### GETデータが取得できているかを確認
edit.php のhtmlの前にphpコードを追加します。 index.phpの「EDIT」のリンクをクリックし、データが渡されているか developer tool で確認します。
```
<?php

$id = $_GET['id'];

var_dump($id);

?>
```
#### Todoクラスにupdate用のメソッド追加
Models/Todo.phpにタスクを取得するためのコードを追加します。 取得したidを利用してレコードを取得します。PDOのfetchメソッドを使います。
```
//editするためのデータを取得
    public function get($id)
    {
        $stmt = $this->db_manager->dbh->prepare('SELECT * FROM '.$this->table.' WHERE id = ?');
        $stmt->execute([$id]);
        $task = $stmt->fetch();

        return $task;
    }
```
#### 取得したデータをedit.phpに表示
Todoクラスに作成したgetメソッドを使ってデータを取得します。
```
<?php
    require_once('function.php');
    // require_once 'function.php';

    require_once('Models/Todo.php');
    // require_once 'Models/Todo.php';

    //選択されたtaskのidを取得
    $id = $_GET['id'];

    // var_dump($id);
    // Todoのクラスをインスタンス化してgetメソッドを使ってとりあえず取得したいデータが取れているかだけ確認

    $todo = new Todo();

    $task = $todo->get($id);

?>
```
しつこいようですが、var_dump()でデバッグしちゃんとデータが取得できているか確認します。
```
var_dump($task);
```
表示が確認できたら、```var_dump()``` はコメントアウトしておきましょう。edit.phpのフォームパーツにエスケープ処理した **value属性** を追記します。
```
<input type="text" name="task" class="form-control" placeholder="ADD TODO" value="<?php echo h($task['name']); ?>">

```
### 実際に更新機能を追加する
まずは空のupdate.phpを作成します。 updateする際、idをトリガーとしてレコードを抽出します。 なのでidを ```<input> ```を使ってPOSTできるようにします。 UI上見えるのは美しくないのでhiddenで隠しておきます。
```
<input type="hidden" value="<?php echo h($task['id']); ?>" name="id">
```
UPDATEボタンをクリックしてupdate.phpに遷移して developer tool でid、task(内容)それぞれの値がPOSTされているか確認します。
#### Todo.php に update メソッドを追加
Todoクラスにタスクを更新するためのupdateメソッドを追加します。
```
public function update($name, $id)
{
    $stmt = $this->db_manager->dbh->prepare('UPDATE '.$this->table.' SET name = ? WHERE id = ?');
    $stmt->execute([$name, $id]);
}
```
update.phpでまずは、スーパーグローバル関数でname task、idに格納されたデータを取得できるか確認します。
```
<?php

// $task , $id
// var_dump
$id = $_POST['id'];
$task = $_POST['task'];

var_dump($id);
var_dump($task);
```
さらにTodoクラスをインスタンス化しupdateメソッドを実行できるようにします。
```
<?php

// require_once 'Models/Todo.php';
require_once('Models/Todo.php');


// $task , $id
// var_dump
$id = $_POST['id'];
$task = $_POST['task'];

// var_dump($id);
// var_dump($task);

$todo = new Todo();

$todo->update($task, $id);
```
phpMyAdminにデータが更新されていることが確認できたらトップページにリダイレクト処理をします。
```
header('Location: index.php');
```
ここまでのフォルダ構造とコードは以下の通りになります。
```
php_oop/
  ├ index.php (トップページ)
  ├ create.php (データ登録機能)
  ├ edit.php (データ更新(UI))
  ├ update.php (データ更新機能)
  ├ function.php (エスケープ処理)
  ├ config/
  |    └ dbconnect.php（DBとアクセスするための設定など）
  ├ Models/
  |    └ Todo.php（CRUDのやりとり）
  └ assets/
    └ css/(元リポジトリのファイルをコピペなので割愛)
        ├ reset.css
        └ style.css
```
#### index.php
```
<?php

    // require_once 'function.php';
    require_once('function.php');

    // require_once('Models/Todo.php');
    require_once 'Models/Todo.php';

    //Todoクラスのインスタンス化
    $todo = new Todo();

    //DBからデータを全件取得
    $tasks = $todo->all();

    // echo '<pre>';
    // var_dump($tasks);
    // exit();
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
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
        <section class="mt-5">
          <table class="table table-hover">
            <thead>
              <tr class="bg-primary text-light">
                  <th class=>TODO</th>
                  <th>DUE DATE</th>
                  <th>STATUS</th>
                  <th></th>
                  <th></th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($tasks as
              $task):?>
              <tr>
                <td>
                <?php echo h($task['name']); ?>
                </td>
                <td>
                <?php echo h($task['due_date']); ?>
                </td>
                <td>NOT YET</td>
                <td>
                    <a class="text-success" href="edit.php?id=<?php echo h($task['id']); ?>">EDIT</a>
                </td>
                <td>
                    <a class="text-danger" href="">DELETE</a>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </section>
    </main>

</body>
</html>
```
#### Models/Todo.php
```
<?php

// require_once 'config/dbconnect.php';
require_once('config/dbconnect.php');

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

    //一覧を呼び出すためのメソッド
    public function all()
    {
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
```
#### edit.php
```
<?php
    require_once('function.php');
    // require_once 'function.php';

    require_once('Models/Todo.php');
    // require_once 'Models/Todo.php';

    //選択されたtaskのidを取得
    $id = $_GET['id'];

    // var_dump($id);
    // Todoのクラスをインスタンス化してgetメソッドを使ってとりあえず取得したいデータが取れているかだけ確認

    $todo = new Todo();

    $task = $todo->get($id);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>TODO APP</title>
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
            <form class="form-row" action="update.php" method="POST">
                <div class="col-12 col-md-9 py-2">
                    <input type="text" name="task" class="form-control" placeholder="ADD TODO" value="<?php echo h($task['name']); ?>">
                    <input type="hidden" value="<?php echo h($task['id']); ?>" name="id">
                </div>
                <div class="py-2 col-md-3 col-12">
                    <button type="submit" class="col-12 btn btn-primary btn-block">UPDATE</button>
                </div>
            </form>
        </section>
    </main>
</body>
</html>
```
#### update.php
```
<?php

// require_once 'Models/Todo.php';
require_once('Models/Todo.php');

// スーパーグローバル変数を使ってtask , idの値を取得するコードを書いてください

// $task , $id
// var_dump
$id = $_POST['id'];
$task = $_POST['task'];

// var_dump($id);
// var_dump($task);

$todo = new Todo();

$todo->update($task, $id);

header('Location: index.php')
```