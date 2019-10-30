<?php

// require_once 'Models/Todo.php';
require_once('Models/Todo.php');

//入力されたデータを変数taskに保存
$task = $_POST['task'];

$todo = new Todo();

$todo->create($task);

header('Location: index.php');
