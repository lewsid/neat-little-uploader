//Based on http://www.sitepoint.com/html5-ajax-file-upload/ (but heavily modified)

var MAX_FILE_SIZE = 33554432; //32MB

function resetUploader(div_id) {
	$target_div = $('#'+div_id);
	$target_div.find('.filedrag-display-filename').html('drop file (or click)');
	$target_div.find('.filedrag-input').val('');
	$target_div.find('.filedrag-remove-button').hide();
	$target_div.find('.filedrag-preview-container').hide();
}

function parseFile(div_id, file, callback) {
	$target_div = $('#'+div_id);

	//File size validation
	if(file.size > MAX_FILE_SIZE) {
		alert('File is too large. Max file size: ' + MAX_FILE_SIZE);
		throw new Error('File is too large. Max file size: ' + MAX_FILE_SIZE);
		return false;
	}

	//Toss an image preview in there right from the client-side
	var reader = new FileReader();
	reader.onload = function(e) {
		$target_div.find('.filedrag-preview').attr('src', e.target.result);
		$target_div.find('.filedrag-filename').html(file.name);
		$target_div.find('.filedrag-preview-container').show();
	}
	reader.readAsDataURL(file);

	if(callback) { window[callback]; }
}

function uploadFile(div_id, file, post_target, input_id, onComplete) {
	var xhr = new XMLHttpRequest();
	var response = null;

	$target_div = $('#'+div_id);

	//Create progress bar
	$target_div.find(".filedrag-progress").html('<p>Uploading...</p>');

	//Update progress bar
	xhr.upload.addEventListener("progress", function(e) {
		var pc = parseInt(100 - (e.loaded / e.total * 100));
		$target_div.find(".filedrag-progress p").css("backgroundPosition", pc + "% 0");
	}, false);

	//Upload finished
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4) {
			if(xhr.status == 200) {
				$target_div.find(".filedrag-progress p").addClass("success");
				$target_div.find(".filedrag-progress p").html("Success!");
				$target_div.find(".filedrag-progress p").fadeOut('slow', function() {
					$target_div.find(".filedrag-progress p").html("");
					$target_div.find(".filedrag-progress p").removeClass("success");
				});

				if(!xhr.responseText) {
					$target_div.find('.filedrag-filename').html('Error fetching post response');
					return false;
				}

				response = JSON.parse(xhr.responseText);
				$target_div.find('.file-input').val(response.new_filename);				
				$target_div.find('.filedrag-display-filename').html(response.original_filename );
				$target_div.find('.filedrag-remove-button').show();
				$target_div.find('.filedrag-droparea').addClass('has-file');

				$target_div.find('.hidden-original').val(response.original_filename);
				$target_div.find('.hidden-new').val(response.new_filename);

				if(onComplete) { window[onComplete](response); }
			}
			else {
				$target_div.find('.filedrag-filename').html('Error posting file');
				return false;
			}
		}
	};

	//Start the upload
	xhr.open("POST", post_target + "/filetype/" + file.type.replace("image/", ""), true);
	xhr.setRequestHeader("X-FILENAME", file.name);
	xhr.send(file);
}

function initUploader(div_id, post_target, onComplete) {
	var xhr = new XMLHttpRequest();

	resetUploader(div_id);

	//Only do this stuff if the technology is supported
	if(xhr.upload) {
		$target_div = $('#'+div_id);

		//Handle the dragover event
		$target_div.find('.filedrag-droparea').on("dragover", function(e) {
			e.stopPropagation();
			e.preventDefault();
			if(!$(this).hasClass('hover')) { $(this).addClass('hover'); }
		});

		//And the dragleave event
		$target_div.find('.filedrag-droparea').on("dragleave", function(e) {
			e.stopPropagation();
			e.preventDefault();
			if($(this).hasClass('hover')) { $(this).removeClass('hover'); }
		});

		//Handle remove click
		$target_div.find('.filedrag-remove-button').click(function(e) {
			resetUploader(div_id);
			return false;
		});

		//A file was dragged onto the droppable area, do stuff
		$target_div.find('.filedrag-droparea').on("drop", function(e) {
			//Prevent bubbling or default browser handling of image drag/drop
			e.stopPropagation();
			e.preventDefault();

			//Disable hover state
			if($(this).hasClass('hover')) { $(this).removeClass('hover'); }
			
			//Fetch the images from the FileList object
			var files = e.originalEvent.dataTransfer.files;

			//We'll return this in the response, because it comes in handy sometimes
			var input_id = $(this).siblings('.filedrag-input').attr('id');

			//Process all File objects
			for(var i = 0, f; f = files[i]; i++) {
				parseFile(div_id, f);
				uploadFile(div_id, f, post_target, input_id, onComplete);
			}
		});

		$target_div.find('.filedrag-droparea').on("click", function(event) {
			$(this).siblings('.filedrag-input').trigger('click');
		});

		//Handle file select
		$target_div.find('.filedrag-input').change(function(e){
			var files = e.target.files;

			//We'll return this in the response, because it comes in handy sometimes
			var input_id = $(this).siblings('.filedrag-input').attr('id');

			//Process all File objects
			for(var i = 0, f; f = files[i]; i++) {
				parseFile(div_id, f);
				uploadFile(div_id, f, post_target, input_id, onComplete);
			}
		});

		//Show the drag and drop area
		$target_div.find('.filedrag-droparea').show();
		$target_div.find('.filedrag-input').hide();
	}
}