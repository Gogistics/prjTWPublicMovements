/*
 *  init ng-app controllers and the service
 *  original version was contributed by Will Huang(保哥) and modified by Alan Tai
 *  
 *   */

kp_app.value('API', {
	KEY : "kp53f5626b5f4bd7.27954991", // personal api key
	SERVER : "http://api.kptaipei.tw/v1/"
}).controller('MainCtrl', MainController).controller('AlbumCtrl',
		AlbumController).controller('VideoCtrl', VideoController).controller(
		'PaginationCtrl', PaginationController) // dir pagination
.service('kptService', kptService);

// service for retrieving data
kptService.$injector = [ '$http', 'API' ];
function kptService($http, API) {

	// get articles category
	this.getCategory = function(id) {
		console.log(API.SERVER + "category/" + id + "?accessToken=" + API.KEY);
		return $http({
			method : "GET",
			url : API.SERVER + "category/" + id + "?accessToken=" + API.KEY
		});
	};

	// get albums category
	this.getAlbums = function(id) {
		console.log(API.SERVER + "albums/" + id + "?accessToken=" + API.KEY);
		return $http({
			method : "GET",
			url : API.SERVER + "albums/" + id + "?accessToken=" + API.KEY
		})
	};

	// get videos category
	this.getVideos = function(id) {
		console.log(API.SERVER + "videos/" + id + "?accessToken=" + API.KEY);
		return $http({
			method : "GET",
			url : API.SERVER + "videos/" + id + "?accessToken=" + API.KEY
		});
	}

	/* communicate with Google App Engine*/
	// handle geo-info
	this.handleAlbumsGeoInfo = function(arg_new_albums){
		var geo_info_albums = {};
		//loop through albums info; temp latlng is (25.052063, 121.529980)
		angular.forEach(arg_new_albums, function(item, ind) {
			geo_info_albums[item.id] = {
				'album_title' : item.title,
				'album_description' : item.description,
				'album_thumbnail' : item.thumbnails.medium,
				'album_lat' : 25.052063,
				'album_lng' : 121.529980
			};
		});

		// original_geo_info is defined in albums.html and retrieved from database
		var diff_elems = {};
		if(typeof(original_geo_info) === 'undefined'){
			//loop through all info
			diff_elems = geo_info_albums;
			
			console.log(diff_elems);
		}
		else if(typeof(original_geo_info) !== 'undefined'
			&& typeof (geo_info_albums) !== 'undefined'){
			// get keys set for both original and new sets of albums info
			var keys_new_geo_info = Object.keys(geo_info_albums);
			var keys_original_geo_info = Object.keys(original_geo_info);
			
			//get diff keys
			diff_keys = this.getDiff(keys_new_geo_info, keys_original_geo_info);
			
			//get filtered info set
			angular.forEach(diff_keys, function(item,ind){
				diff_elems[item] = geo_info_albums[item];
			});
			
			console.log(JSON.stringify(diff_elems, 2, 2));
		}
		
		if(Object.keys(diff_elems).length > 0){
			// put diff_elems into $.param and will be send to backend
			var geo_data = $.param({'geo_data':JSON.stringify(diff_elems, 2, 2)});
			
			// use $http post to send data back to server and save data in Google datastore
			var response_promise = $http({
	            url: '/albums/geo_info_handler',
	            method: "POST",
	            data: geo_data,
	            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	        });
			response_promise.success(function(data, status, headers, config) {
                console.log(data.processing_status);
            });
			response_promise.error(function(data, status, headers, config) {
                console.log("AJAX failed! " + status);
            });
		}
		else{
			console.log('No data need to update')
		}
	};

	// filter the new albums info; currently jQuery is doing this task
	this.getDiff = function(arg_update_geo_info, arg_original_albums_geo_info) {
		return $(arg_update_geo_info).not(arg_original_albums_geo_info).get();
	}

}

// articles content
MainController.$injector = [ '$sce', 'kptService' ];
function MainController($sce, kptService) {
	var vm = this;
	vm.clickOnCategory = clickOnCategory;
	vm.clickOnArticle = clickOnArticle;
	vm.categories = {};
	vm.content = $sce.trustAsHtml("請選擇文章");

	kptService.getCategory("").success(function(results) {
		console.log(results);
		var initial_category_id;
		angular.forEach(results.data, function(item, ind) {
			initial_category_id = initial_category_id || item.id;
			vm.categories[item.id] = item;
			vm.categories[item.id].posts = [];
		});
		vm.clickOnCategory(initial_category_id);
	});

	function clickOnCategory(category_id) {
		kptService.getCategory(category_id).success(function(results) {
			console.log(results);
			var initial_article;
			vm.categories[category_id].posts = [];
			angular.forEach(results.data, function(item) {
				initial_article = initial_article || item;
				vm.categories[category_id].posts.push(item);
			});

			// apply jquery toggle animation
			$('#article_category_' + category_id).toggle("slow");

			vm.clickOnArticle(undefined, initial_article);
		});
	}
	;

	function clickOnArticle($event, article) {
		if (typeof ($event) != 'undefined') {
			$event.preventDefault();
			$event.stopPropagation();
		}
		vm.content = $sce.trustAsHtml(article.content);
	}
	;
}

// albums
AlbumController.$injector = [ '$sce', 'kptService' ];
function AlbumController($sce, kptService, $scope) {
	var vm = this;
	vm.albums = [];
	vm.getAlbum = getAlbum;
	vm.clickOnAlbum = clickOnAlbum;

	vm.getAlbum("");

	// click
	function clickOnAlbum(album_id) {
		vm.getAlbum(album_id);
	};

	function getAlbum(id) {
		kptService.getAlbums(id).success(
				function(results) {
					if (id == "") {
						vm.albums = results.data;

						// build geo info. and pass the info. back to server and
						if (vm.albums.length > 0) {
							kptService.handleAlbumsGeoInfo(vm.albums);
						}
						// end

						vm.clickOnAlbum(results.data[0].id);
					} else {
						vm.album = results.data;
					}
				});
	};

	// ng-pginator
	$scope.currentPage = 1;
	$scope.pageSize = 5;
	// end of ng-paginator
}

// videos
VideoController.$injector = [ '$sce', 'kptService' ];
function VideoController($sce, kptService) {
	var vm = this;
	vm.categories = {};
	vm.clickOnCategory = clickOnCategory;
	vm.clickOnVideo = clickOnVideo;
	vm.getVideos = getVideos;

	vm.getVideos("");

	function getVideos(category_id) {
		kptService.getVideos(category_id).success(function(results) {
			var initial_category_id;
			var initial_playlist;
			if (category_id == "") {
				angular.forEach(results.data, function(item, ind) {
					initial_category_id = initial_category_id || item.id;
					vm.categories[item.id] = item;
					vm.categories[item.id].videos = [];
				});
				vm.clickOnCategory(results.data[0].id);
			} else {
				vm.categories[category_id].videos = [];
				angular.forEach(results.data, function(item) {
					initial_playlist = initial_playlist || item;
					vm.categories[category_id].videos.push(item);
				});
				vm.clickOnVideo(undefined, initial_playlist);
			}
		});
	}

	function clickOnCategory(category_id) {
		getVideos(category_id);

		// apply jquery toggle animation
		$('#video_category_' + category_id).toggle("slow");
	}
	;

	function clickOnVideo($event, video) {
		console.log(video);
		if (typeof ($event) != 'undefined') {
			$event.preventDefault();
			$event.stopPropagation();
		}
		vm.content = video;
		vm.content.url = $sce
				.trustAsResourceUrl('http://www.youtube.com/embed/' + video.id);
	}
	;

};

/* pagination controller */
function PaginationController($scope) {
	$scope.pageChangeHandler = function(num) {
		console.log('page changed to ' + num);
	};
}