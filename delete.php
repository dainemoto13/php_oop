<?php
    // var_dump($_GET['id']);

    require_once ('Models/Todo.php');

    $id = $_GET['id'];

    $todo = new Todo();

    $todo->delete($id);
    // ↑の処理でphpmyadminで削除が適用されているか確認する
    // ↓上が確認できたらindex.phpへ戻る機能をつける
    //app.jsのdataType形式でapp.jsへ返す
    echo json_encode($id);
    // header('Location: index.php');