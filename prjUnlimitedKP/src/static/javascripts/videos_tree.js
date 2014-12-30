var tree_data = {};
var temp_articles_categories = [];
$.get("http://api.kptaipei.tw/v1/"
		+ "videos/?accessToken=kp53f5626b5f4bd7.27954991",
		function(treeData) {
			// console.log(JSON.stringify(treeData, 2, 2));

			$.each(treeData.data, function(ind, item) {

				var category_title = item.title;
				
				$.get("http://api.kptaipei.tw/v1/" + "videos/" + item.id
						+ "?accessToken=kp53f5626b5f4bd7.27954991", function(
						results) {
					// console.log(JSON.stringify(results.data,2,2));

					// upload data to server
					var str_video_data = JSON.stringify( results.data ,2 ,2 );
					upload_video_data(str_video_data);
					function upload_video_data(arg_data){
						$.ajax({
							url : "/videos/videos_info_handler",
							data : { video_data : arg_data},
							type : 'POST',
							success : handle_successful_result,
							error : handle_failed_result
						});
					}
					
					
					function handle_successful_result(response){
						console.log(response.status);
					}
					
					function handle_failed_result(response){
						console.log(response.status);
					}
					
					
					//
					var temp_articles_category = [];
					var temp_articles_obj = {};
					var category_name;

					$.each(results.data, function(ind, item) {
						//console.log(item.title);
						var temp_article_detail = {};

						temp_article_detail['name'] = item.title;
						temp_article_detail['size'] = item.id;
						temp_article_detail['link'] = item.link;

						temp_articles_category.push(temp_article_detail);
					});
					temp_articles_obj['name'] = category_title;
					temp_articles_obj['children'] = temp_articles_category;
					temp_articles_categories.push(temp_articles_obj);


					tree_data['name'] = '柯影集';
					tree_data['children'] = temp_articles_categories;
					//console.log(JSON.stringify(tree_data, 2, 2));
					
					// .then can be changed to $.when.apply($, deferred_ary).done(function(){});
				}).then(function(){
					if(ind === treeData.data.length - 1){
						//console.log(ind + ' ; ' + treeData.data.length );
						tree_data = JSON.decycle(tree_data, 2, 2);

						// delete elements which will not o be used in object
						
						// create tree
						create_tree(tree_data);
					}
				});

			});
		});