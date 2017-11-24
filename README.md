neat-little-uploader (v1.12)
============================

A neat little drag and drop uploader.

A minimalistic HTML5 drag-and-drop file uploader (with image preview) for use with JQuery. 

[This is what it looks like.](https://raw.github.com/lewsid/neat-little-uploader/master/img/example.png)


Installation
------------

**Note:** There is a fully functional example (example.html) already included that utilizes PHP for handling the server-side post.

1. Pop the contents of the repo into your web-accessible document root.
2. Make sure you end up with an *uploads* folder with the appropriate write permissions.
3. Insert the following lines into the header:

    ```html
    <link rel="stylesheet" href="/css/neat-little-uploader.1.11.css">
    <script src="//code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="/js/neat-little-uploader.1.11.js"></script>
    ```
4. Place the following code where you'd like the uploader interface to appear on your page:

    ```html
    <div class="form-group" class="col-sm-3">
      <label for="edit-item-file filedrag-filename" class="control-label">Upload File</label>
      <div class="filedrag neat-little-uploader" id="example-1">
        <div class="filedrag-preview-container" style="display: none;">
          <img src="" class="filedrag-preview">
        </div>
        <div class="filedrag-droparea">
          <div class="filedrag-display-filename"></div>
          <div class="filedrag-remove-button">(<button type="button" class="btn btn-xs btn-link filedrag-remove-file">remove</button>)</div>
        </div>
        <div class="filedrag-progress"></div>
        <input type="file" class="filedrag-input" id="file-input" name="file-input">
        <input class="filedrag-input hidden-original" type="hidden" name="original_filename_1" id="hid-original-filename-1">
        <input class="filedrag-input hidden-new" type="hidden" name="new_filename_1" id="hid-new-filename-1">
      </div>
    </div>
    ```

5. Initialize the uploader:

    ```javascript
    $(function () {
      initUploader('example-1', 'example_post_handler.php');
    });
    ```
    
6. Implement server-side post handling. Here's an example of how this can be achieved in PHP:

    ```php
    $filename = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    $file = file_get_contents('php://input');

    $new_filename = uniqid() . '.' . $ext;

    if(file_put_contents(__DIR__ . '/uploads/' . $new_filename, $file))
    {
      echo json_encode(array('success' => 1, 'error' => 0, 'original_filename' => $filename, 'new_filename' => $new_filename));
    }
    else
    {
      echo json_encode(array('success' => 0, 'error' => 'error writing file'));
      return false;
    }
    ```

    
Usage
-----

1. Click or drag a file into the dotted area to start the upload process. 
2. The file will be placed into the uploads folder and given a unique id to prevent naming collisions.


Browser Compatibility
---------------------

IE10+, Firefox 4+, Safari 5+, Chrome 7+


Configuration Options
---------------------

Examples of these options can be found in `example.html`

You can wire in a custom callback, to be called once the file has been successfully uploaded, an example of which can be found in the included example. It looks like this:

```javascript
//Custom callback example
function responseCallback(response) {
  console.log(response);
}

$(function () {
  initUploader('example-1', 'example_post_handler.php', 'responseCallback');
});
```

To pre-load an existing file (in this case an image):

```javascript
$(function () {
  initUploader('example-1', 'example_post_handler.php', 'responseCallback', '59cbcb7723def.jpg', 'example.png', '/uploads/');
});
```


License
-------

neat-little-uploader is open-sourced software licensed under the MIT License.


Contact
-------

- Christopher Lewis (chris@bluehousegroup.com)
- github.com/lewsid
