/* init ng-app controllers */
kp_app
.value('API',{
	KEY:"kp53f5626b5f4bd7.27954991", //personal api key
	SERVER:"http://api.kptaipei.tw/v1/"
})
.controller('MainCtrl', MainController)
.controller('AlbumCtrl', AlbumController)
.controller('VideoCtrl', VideoController)
.controller('PaginationCtrl', PaginationController)
.service('kptService', kptService); //

// service for retrieving data
kptService.$injector = ['$http','API'];
function kptService($http,API){
	
	//get articles category
	this.getCategory = function(id) {			
        console.log(API.SERVER+"category/"+id+"?accessToken="+API.KEY);
		return $http({
			method:"GET",
			url: API.SERVER+"category/"+id+"?accessToken="+API.KEY
		});
	};

	//get albums category
	this.getAlbums = function(id){
        console.log(API.SERVER+"albums/"+id+"?accessToken="+API.KEY);
		return $http({
			method:"GET",
			url: API.SERVER+"albums/"+id+"?accessToken="+API.KEY
		})			
	};

	//get videos category
	this.getVideos = function(id){
        console.log(API.SERVER+"videos/"+id+"?accessToken="+API.KEY);
		return $http({
			method:"GET",
			url: API.SERVER+"videos/"+id+"?accessToken="+API.KEY
		})	
	}
}

// articles content
MainController.$injector = ['$sce','kptService'];
function MainController($sce,kptService){
	var vm = this;
	vm.clickOnCategory = clickOnCategory;
	vm.clickOnArticle = clickOnArticle;
	vm.categories = {};
	vm.content = $sce.trustAsHtml("請選擇文章");

	kptService.getCategory("").success(function(results){
				console.log(results);
				var initial_category_id;
				angular.forEach(results.data,function(item,ind){
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
			angular.forEach(results.data,function(item){
				initial_article = initial_article || item;
				vm.categories[category_id].posts.push(item);
			});

			//apply jquery toggle animation
			$('#article_category_' + category_id).toggle("slow");
			
			vm.clickOnArticle(undefined, initial_article);
		});
	};

	function clickOnArticle($event, article) {			
		if(typeof($event) != 'undefined') {
			$event.preventDefault();
			$event.stopPropagation();
		}
		vm.content = $sce.trustAsHtml(article.content);
	};
}

// albums
AlbumController.$injector = ['$sce','kptService'];
function AlbumController($sce,kptService,$scope){
	var vm = this;
	vm.albums = [];
	vm.getAlbum = getAlbum;
	vm.clickOnAlbum = clickOnAlbum;	

	// init albums
	vm.getAlbum("");

	function clickOnAlbum(album_id) {
		vm.getAlbum(album_id);
	};

	function getAlbum(id){
		kptService.getAlbums(id).success(function(results) {			
			if(id == ""){
				vm.albums = results.data;
				vm.clickOnAlbum(results.data[0].id);
			}else{
				vm.album = results.data;
			}
		});
	}
	
	
	//ng-pginator
	$scope.currentPage = 1;
	$scope.pageSize = 5;
	//end of ng-paginator
}

// videos
VideoController.$injector = ['$sce','kptService'];
function VideoController($sce,kptService){
	var vm = this;
	vm.categories = {};
	vm.clickOnCategory = clickOnCategory;
	vm.clickOnVideo = clickOnVideo;
	vm.getVideos = getVideos;

	vm.getVideos("");

	function getVideos(category_id){
		kptService.getVideos(category_id).success(function(results) {		
			var initial_category_id;
			var initial_playlist;
			if(category_id == ""){
				angular.forEach(results.data,function(item,ind){
					initial_category_id = initial_category_id || item.id;
					vm.categories[item.id] = item;
					vm.categories[item.id].videos = [];
				});		
				vm.clickOnCategory(results.data[0].id);			
			}else{
				vm.categories[category_id].videos = [];
				angular.forEach(results.data,function(item){
					initial_playlist = initial_playlist || item;
					vm.categories[category_id].videos.push(item);
				});
				vm.clickOnVideo(undefined, initial_playlist);
			}
		});
	}

	function clickOnCategory(category_id) {
		getVideos(category_id);
		
		//apply jquery toggle animation
		$('#video_category_' + category_id).toggle("slow");
	};

	function clickOnVideo($event, video) {
		console.log(video);
		if(typeof($event) != 'undefined') {
			$event.preventDefault();
			$event.stopPropagation();
		}
		vm.content = video;
		vm.content.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + video.id);
	};

};



/* pagination controller */
function PaginationController($scope) {
	$scope.pageChangeHandler = function(num) {
		console.log('meals page changed to ' + num);
	};
}