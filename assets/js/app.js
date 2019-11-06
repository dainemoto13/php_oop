// HTMLが読み込まれ終わったら起動(更新し終わったら)
$(function () {

  //追加ボタンがクリックされた時 引数(e)
  $('#add-button').on('click',function(e){
    //formタグの送信を(e以外)無効化する(二重投稿を防ぐため)
    e.preventDefault();

    //入力されたタスク名を取得
    let taskName = $('#input-task').val();


    //ajax開始
    $.ajax({
      //通信の設定を書くプログラム
      //キー(決まった文言) :値
      url: 'create.php',
      type: 'POST',  //GET送信 or POST送信 の設定
      // json = JavaScriptの連想配列($_POST)
      dataType: 'json',
      data: {// APIに送信するパラメータの設定
        //キー($_POST送信されるもの) : 値(変数)
        task: taskName
      }

    }).done( (data) => {
      console.log(data);

      //画面に表示(要素の追加)を開始される
      // $('tbody').prepend(`<p>${data['name']}</p>`);
      $('tbody').prepend(
        `<tr>` +
            `<td>${data['name']}</td>` +
            `<td>${data['due_date']}</td>`+
            `<td>NOT YET</td>`+
            `<td>
            <a class="text-success" href="edit.php?id=${data['id']}">EDIT</a>
            </td>`+
            `<td>
                <a data-id="${data['id']}"class="text-danger delete-button" href="delete.php?id=${data['id']}">DELETE</a>
            </td>`+
        `</tr>`
        // ↑// delete-buttonのclass適用
      );
    }).fail( (error) => {
      console.log(error);
      //通信が失敗したプログラム

    })
  });

  //削除のボタンがクリックされた時の処理
  // alertが表示されない時cmmand+sift+rで更新してみる(キャッシュ(２回目以降引っ張ってくるところ))ではなく、本物の場所を持ってくる
  // $('.delete-button').on('click',function(e){ではなく、新しく更新したやつもalertが適用できるようにする
  // $document 画面全体に適用 delete-buttonが押されたら
    $(document).on('click', '.delete-button',function(e){
    e.preventDefault();

  //削除対象のIDを取得
  //クリックされたaタグ本体=$(this)
    let selectedId = $(this).data('id');
    // alert(selectedId);

      //ajaxを開始
      $.ajax({
              //通信の設定を書くプログラム
      //キー(決まった文言) :値
      url: 'delete.php',
      type: 'GET',  //GET送信 or POST送信 の設定
      // json = JavaScriptの連想配列($_POST)
      dataType: 'json',
      data: {// APIに送信するパラメータの設定
        //キー(index.php->delete.phpへ渡す代わりにapp.js->delete.phpへ変更をする) : 値(変数)
        id: selectedId
      }


      }).done((data) => {
        console.log(data);
      }).fail((error) => {
        console.log(error);
      })



  });
})