
document.addEventListener('turbolinks:load', function(event) {
  var numberEditor = 1;
  var editor;
  //language for syntax highlighting: ace will use this
  const languageMap = {
    js: 'javascript',
    py: 'python',
    rb: 'ruby',
    html: 'html',
    css: 'css',
    md: 'markdown'
  }
  //grab all readonly ace editors and fill content with options
  all_read_only_gist_editors = $('.read_only_gist_editor')
  for(var i = 0; i < all_read_only_gist_editors.length; i++){
    read_editor = all_read_only_gist_editors[i]
    editor_number = $(read_editor).data('editor-number')
    extension_elements = $(read_editor).data('extension-type').split(".")
    content = $(read_editor).find('textarea').val()
    extension_type = extension_elements[extension_elements.length - 1]
    editor = ace.edit("editor_"+editor_number);
    editor.session.setMode("ace/mode/"+languageMap[extension_type]);
    editor.setValue(content, -1)
    editor.setOptions({
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false
    })
      editor.renderer.$cursorLayer.element.style.opacity=0
  }


  //grab all writable ace editors and fill content with options
  all_gist_content_divs = $('.gist_content_div')
  text_exist = false
  for (var i = 0; i < all_gist_content_divs.length; i++) {
    current_editor = all_gist_content_divs[i]
    editor_number = $(current_editor).data('editor-number')
    extension_elements = $(current_editor).find('.gist_editor').data('extension-type').split(".")
    content = $(current_editor).find('textarea').val()
    extension_type = extension_elements[extension_elements.length - 1]
    editor = ace.edit("editor_"+editor_number);
    editor.setValue(content, -1)
    editor.session.setMode("ace/mode/"+languageMap[extension_type]);
    if(content.length > 0){
        text_exist = true;
    }
    if(!text_exist || all_gist_content_divs.length == 1){
      $('.remove_gist_file').css('visibility', 'hidden')
    }else if (all_gist_content_divs.length > 1) {
      $('.remove_gist_file').css('visibility', 'visible')
    }
   }
   //by default the create gist button is disabled on page load
   $('.create_gist').addClass('disabled');
   $('.create_gist').attr("disabled",true);
   //adjust css for ace editor
   fixCSS()

   //on key up check extension_type to user for syntax highlighting
  $(document).on('keyup','.gist_text_field_div_input',function(){
    debugger
    elements = $(this).val().split(".")
    extension = elements[elements.length - 1]
    debugger
    if (languageMap[extension] != undefined ){
      editorNumber = $(this).data('editor-number')
      editor = ace.edit("editor_"+editorNumber);
      editor.session.setMode("ace/mode/"+languageMap[extension]);
      fixCSS();
    }
  });

  //remove gist file
  $(document).on('click', '.remove_gist_file', function(){
    numberOfGistFiles = $('.remove_gist_file').length
    if(numberOfGistFiles > 1){
      $(this).closest('.gist_content_div').remove()
      numberOfGistFiles -= 1
      if(numberOfGistFiles == 1){
        $('.remove_gist_file').css('visibility', 'hidden')
      }
    }else{
      return;
    }
  })




  //selector options for soft wrap, tab, and wrapping
  $(document).on('change','.gist_text_field_item select', function(){
    element_value = $(this).val()
    element_type = $(this).attr('id')
    editorNumber = $(this).data('editor-number')
    editor = ace.edit("editor_"+editorNumber);
    if(element_type == 'gist_tab_size'){
      editor.getSession().setTabSize(element_value);
    }else if (element_type == 'gist_use_soft_tab') {
      editor.getSession().setUseSoftTabs(element_value);
    }else if (element_type == 'gist_wrap_mode') {
      editor.getSession().setUseWrapMode(element_value);
    }
  })


  $( ".ace_text-input" ).keyup(function(e) {
    ace_editors = $(".ace_text-input")
    for (var i = 0; i < ace_editors.length; i++) {
      editorNumber = $(ace_editors[i]).parent().attr('id')
      editor = ace.edit(editorNumber);
      if (editor.getValue().length > 0){
        $('.create_gist').removeClass('disabled');
        $('.create_gist').attr("disabled",false);
        return;
      }
    }
    $('.create_gist').addClass('disabled');
    $('.create_gist').attr("disabled",true);
 })


 $('#cancel_gist').click(function(){
   gistId = $(this).data('gist-id')
   window.location.href = "/gists/"+gistId+"/"
 });

  //all gist are public by default
  $('#create_public_gist').click(function(){
    editorContent = editor.getValue()
    create_gist(true)
  });

  // Late add secret gist
  // $('#create_secret_gist').click(function(){
  //   editorContent = editor.getValue()
  //   create_gist(false)
  // });

  //update gist on update button click
  $('#update_gist').click(function(){
    update_gist()
  });

  //on new gist click redirect
  $('#new_gist').click(function(){
    window.location.href = "/gists/new"
  });

  //add new for gist on click
  $('#add_file').click(function(){
    numberEditor += $('.all_gist_forms').children().length * 2
    $('.remove_gist_file').css('visibility', 'visible')
    $button = $('.gist_content_div').first().clone()
    $button.find('.gist_content_div').attr('data-editor-number', numberEditor)
    $button.attr('data-editor-number', numberEditor)
    $button.find('.gist_editor').empty()
    $button.find('.remove_gist_file').attr('data-editor-number', numberEditor)
    $button.find('.gist_editor').attr('id', 'editor_'+numberEditor)
    $button.find('.gist_editor').attr('data-gist-file-id', '')
    $button.find('.gist_text_field_div_input').val("")
    $button.find('.gist_text_field_div_input').attr('data-editor-number', numberEditor);
    $button.find('.gist_text_field_item select').attr('data-editor-number', numberEditor)
    $('.all_gist_forms').prepend($button);
    all_gist_content_divs = $('.gist_content_div')
    for (var i = 0; i < all_gist_content_divs.length; i++) {
      editor_number = $(all_gist_content_divs[i]).data('editor-number')
      editor = ace.edit("editor_"+editor_number)
     }
     fixCSS()
  })


  //update gist function: grab all gist form children and neccesary elements
  function update_gist(){
    gist_files_attributes = {}
    file_divs = $('.all_gist_forms').children()
    gist_id = $('.all_gist_forms ').data('gist-id')
    description = $('#gist_discription').val()
    for (var i = 0; i < file_divs.length; i++) {
      editor_number = $(file_divs[i]).data('editor-number')
      editor = ace.edit("editor_"+editor_number)
      editor_content = editor.getValue()
      extension_type = $(file_divs[i]).find('.gist_text_field_div_input').last().val()
      gist_files_attributes[i] = {file_content: editor_content, extension_type: extension_type}
      id = $('.gist_content_div[data-editor-number="'+editor_number+'"]').find('.gist_editor').data('gist-file-id')
      gist_files_attributes[i] = {file_content: editor_content, extension_type: extension_type, id: id}
    }
    file = {}
    data = {
      id: gist_id,
      description: description,
      gist_files_attributes: gist_files_attributes
    }
    $.ajax({
        type: "PUT",
        url: 'http://0.0.0.0:3000/gists/'+gist_id,
        data: {gist:data},
        success:  function(){
          console.log('success');
        },
        error: function(){
          console.log('failure');
        }
    });
  }

  //create gist function: grab all gist form children and neccesary elements
  function create_gist(is_gist_public){
    gist_files_attributes = {}
    file_divs = $('.all_gist_forms').children()
    description = $('#gist_discription').val()
    for (var i = 0; i < file_divs.length; i++) {
      editor_number = $(file_divs[i]).data('editor-number')
      editor = ace.edit("editor_"+editor_number)
      editor_content = editor.getValue()
      extension_type = $(file_divs[i]).find('.gist_text_field_div_input').last().val()
      gist_files_attributes[i] = {file_content: editor_content, extension_type: extension_type}
    }
    file = {}
    data = {
      description: description,
      public: is_gist_public,
      gist_files_attributes: gist_files_attributes
    }
    $.ajax({
        type: "POST",
        url: 'http://0.0.0.0:3000/gists',
        data: {gist:data},
        success:  function(){
          console.log('success');
        },
        error: function(){
          console.log('failure');
        }
    });
  }

  //make ace editor pretty function
  function fixCSS(){
    $('.ace_print-margin').ready(function() {
      $('.ace_print-margin').remove();
      $(".ace_active-line").css("background", "white");
    });
  }


})
