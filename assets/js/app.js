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
                <a class="text-danger" href="delete.php?id=${data['id']}">DELETE</a>
            </td>`+
        `</tr>`
      );
    }).fail( (error) => {
      //通信が失敗したプログラム

    })
  });
})