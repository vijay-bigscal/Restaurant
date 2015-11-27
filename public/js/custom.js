// Category List data
var categoryList;
var subCategoryList;
var roleList;
var imagePath = "/categoryImages/";

// DOM Ready =============================================================
$(document).ready(function() {
    $('#cateogryListTable table tbody').on('click','td a.deleteCategory', deleteCategory);
    $('#cateogryListTable table tbody').on('click','td a.editCategory', editCategory);

    $('#subCateogryListTable table tbody').on('click','td a.deleteSubCategory', deleteSubCategory);
    $('#subCateogryListTable table tbody').on('click','td a.editSubCategory', editSubCategory);

    $('#roleListTable table tbody').on('click','td a.deleteRole', deleteRole);
    $('#roleListTable table tbody').on('click','td a.editRole', editRole);

    $('#btn_category_cancel').on('click', cancel);
    $('#btn_sub_category_cancel').on('click', cancel);
    $('#btn_role_cancel').on('click', cancel);
    populateCategory();

});

function cancel() {
    window.location.href = "/categories";
}



// Functions =============================================================

// Fill table with data
function populateCategory() {
    $('#cat_image_view').hide();
    $('#btn_category_cancel').hide();
    $('#btn_sub_category_cancel').hide();
    $('#btn_role_cancel').hide();
    
    
    // jQuery AJAX call for JSON
    $.getJSON( '/getCategories', function( categoryData ) {
        categoryList = categoryData;
        //alert(JSON.stringify(categoryData));
        var cat_list = categoryData["result"];

        var tableContent = '';
        var selectContent = "";
        // For each item in our JSON, add a table row and cells to the content string
        $.each(cat_list, function(){
            selectContent += '<option value="' + this._id+ '">' + this.CategoryName+ ' </option>';

            tableContent += '<tr><td><input type="hidden" name="_id" id="_id" value="'+ this._id +'">' +
            '<a href="/editCategory" class="editCategory btn-primary btn-xs" rel="' + this._id + '"><i class="cursor glyphicon glyphicon-edit"></i></a></td>';
            tableContent += '<td><img src="'+ this.CategoryImage +'"></td>';
            tableContent += '<td><img src="'+ this.CategoryImageSelect +'"></td>';
            tableContent += '<td><img src="'+ this.CategoryImageSelectConsumer +'"></td>';
            tableContent += '<td>'+ this.CategoryName+ '</td>';
            tableContent += '<td><a href="#" class="deleteCategory btn-danger btn-xs" rel="' + this._id + '"><i class="cursor glyphicon glyphicon-trash"></i></a></tr>';

        });
 
        $('#categoryList').html(selectContent);
        
        $('#categoryList').select2();

        $('#cateogryListTable table tbody').html(tableContent);
    });

    // jQuery AJAX call for JSON
    $.getJSON( '/getSubCategories', function( subCategoryData ) {
        subCategoryList = subCategoryData;
        //alert(JSON.stringify(categoryData));
        var sub_cat_list = subCategoryData["result"];
        
        var subTableContent = "";
        // For each item in our JSON, add a table row and cells to the content string
        $.each(sub_cat_list, function(){

            subTableContent += '<tr><td><input type="hidden" name="_id" id="_id" value="'+ this._id +'">' +
            '<a href="/editSubCategory" class="editSubCategory btn-primary btn-xs" rel="' + this._id + '"><i class="cursor glyphicon glyphicon-edit"></i></a></td>'; 
             subTableContent += '<td>'+ this.CategoryName + '</td>';           
            subTableContent += '<td>'+ this.SubCategoryName+ '</td>';
            subTableContent += '<td><a href="#" class="deleteSubCategory btn-danger btn-xs" rel="' + this._id + '"><i class="cursor glyphicon glyphicon-trash"></i></a></tr>';
        });

        $('#subCateogryListTable table tbody').html(subTableContent);
    });  

    $.getJSON( '/getRoles', function( roleData ) {
        roleList = roleData;
        //alert(JSON.stringify(roleData));
        var role_list = roleData["result"];
        
        var tableContent = '';
        // For each item in our JSON, add a table row and cells to the content string
        $.each(role_list, function(){
            // tableContent += '<tr><td><input type="hidden" name="_id" id="_id" value="'+ this._id +'">' +
            // '<a href="/editRole" class="editRole btn-primary btn-xs" rel="' + this._id + '"><i class="cursor glyphicon glyphicon-edit"></i></a></td>';
            tableContent += '<tr>';
            tableContent += '<td>'+ this.Role+ '</td>';
            tableContent += '<tr>';
            // tableContent += '<td><a href="#" class="deleteRole btn-danger btn-xs" rel="' + this._id + '"><i class="cursor glyphicon glyphicon-trash"></i></a></tr>';

        });
        $('#roleListTable table tbody').html(tableContent);
    });  
};

function editCategory(event) {

    $('#CategoryName').val('');
    $('#btn_category_add').text('Add');
    $('#form_product').attr('action','/addCategories');
    $('#cat_title').html('Add Category');

    event.preventDefault();
    var current_id = $(this).attr('rel');

    // For each item in our JSON, add a table row and cells to the content string
    $.each(categoryList["result"], function(){
        if(current_id == this._id){
            $('#cat_image_view').show();
            $('#btn_category_cancel').show();
            
            $('#CategoryImage').removeAttr('required');
            $('#CategoryImageSelect').removeAttr('required');
            $('#CategoryImageSelectConsumer').removeAttr('required');
            var newInput = '<input type=hidden name="_id" id="_id" value="'+ this._id +'">';
            $('#form_category').append(newInput);
            $('#CategoryName').val(this.CategoryName);
            $('#cat_image_view').html('<img src="'+ this.CategoryImage +'">');
            $('#cat_image_select_view').html('<img src="'+ this.CategoryImageSelect +'">');
            $('#cat_image_select_consumer_view').html('<img src="'+ this.CategoryImageSelectConsumer +'">');
            $('#btn_category_add').text('Update');
            $('#form_category').attr('action','/updateCategory');
            $('#cat_title').html('Update Category');
        }
    });
};

function editSubCategory(event) {
    $('#SubCategoryName').val('');
    $('#btn_sub_category_add').text('Add');
    $('#form_product').attr('action','/addSubCategories');
    $('#subcat_title').html('Add Sub Category');

    event.preventDefault();
    var current_id = $(this).attr('rel');

    // For each item in our JSON, add a table row and cells to the content string
    $.each(subCategoryList["result"], function(){
        if(current_id == this._id){
            $('#btn_sub_category_cancel').show();

            var newInput = '<input type=hidden name="_id" id="_id" value="'+ this._id +'">';
            $('#form_subcategory').append(newInput);
            $('#SubCategoryName').val(this.SubCategoryName);

            $('#btn_sub_category_add').text('Update');
            $('#form_subcategory').attr('action','/updateSubCategory');
            $('#subcat_title').html('Update Sub Category');
        }
    });
};

function editRole(event) {
    $('#Role').val('');
    $('#btn_role_add').text('Add');
    $('#form_role').attr('action','/addRole');
    $('#role_title').html('Add Sub Category');

    event.preventDefault();
    var current_id = $(this).attr('rel');

    // For each item in our JSON, add a table row and cells to the content string
    $.each(roleList["result"], function(){
        if(current_id == this._id){
            $('#btn_role_cancel').show();

            var newInput = '<input type=hidden name="_id" id="_id" value="'+ this._id +'">';
            $('#form_role').append(newInput);
            $('#Role').val(this.Role);

            $('#btn_role_add').text('Update');
            $('#form_role').attr('action','/updateRole');
            $('#role_title').html('Update Role');
        }
    });
};

function deleteCategory(event) {
    event.preventDefault();

      var r = confirm("Are you sure you want to delete this?");
        if (r == true) {
              var current_id = $(this).attr('rel');
                $.ajax({
                    type: 'POST',
                    url: '/removeCategoryById/' + current_id
                }).done(function( response ) {
                    // Check for a successful (blank) response
                    if (response.msg != '') {
                        //alert(response.msg);
                    } else {
                        alert(response.error);
                    }
                    // Update the table
                    populateCategory();
                });
                return false;
        } else {
            return false;
        }
};

function deleteSubCategory(event) {
    event.preventDefault();

    var r = confirm("Are you sure you want to delete this?");
    if (r == true) {
        var current_id = $(this).attr('rel');
        $.ajax({
            type: 'POST',
            url: '/removeSubCategoryById/' + current_id
        }).done(function( response ) {
            // Check for a successful (blank) response
            if (response.msg != '') {
              //  alert(response.msg);
            } else {
                alert(response.error);
            }
            // Update the table
            populateCategory();
        });
        return false;
    } else {
        return false;
    }

   
};

function deleteRole(event) {
    event.preventDefault();

    var current_id = $(this).attr('rel');
    $.ajax({
        type: 'POST',
        url: '/removeRoleById/' + current_id
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg != '') {
            alert(response.msg);
        } else {
            alert(response.error);
        }
        // Update the table
        populateCategory();
    });
    return false;
};

