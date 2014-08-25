/* map cluster */
$('#close_map').click(function(){
	$('#map_albums').toggle("slow");
});
$('#btn_map_cluster').click(function(){
	$('#map_albums').toggle("slow");

	/* leaflet marker cluster */
	var tiles = L
			.tileLayer(
					'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
					{
						maxZoom : 18,
						attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
					}), latlng = L.latLng(22.619673, 120.301826); //replace the geo location with average of all geo data ; 22.639673, 120.301826

	var map = L.map('map_markers_cluster', {
		center : latlng,
		zoom : 13,
		layers : [ tiles ]
	});

	/* cluster */
	var markers = L.markerClusterGroup();
	
	/* marker config */
	var my_icon = L.icon({
		iconUrl : '/leaflet/images/kp_icon_2.png',
		shadowUrl : '/leaflet/images/marker-shadow.png',

		iconSize : [ 48, 50 ],
		shadowSize : [ 50, 50 ],
		iconAnchor : [ 25, 49 ],
		shadowAnchor : [ 12, 48 ],
		popupAnchor : [ -3, -43 ]
	});
	
	/* info array */
	//geo info. will be replaced with real data related to KP albums' info
	var addressPoints = [
	[22.619673, 120.301826, "柯p-1"],
	[22.629673, 120.302826, "柯p-2"],
	[22.639673, 120.321826, "柯p-3"],
	[22.622673, 120.305826, "柯p-4"],
	[22.621673, 120.310826, "柯p-5"],
	[22.620673, 120.317826, "柯p-6"],
	[22.631273, 120.321926, "柯p-7"],
	[22.623373, 120.307626, "柯p-8"],
	[22.623673, 120.314826, "柯p-9"],
	[22.626673, 120.312826, "柯p-10"]
	];

	
	for ( var i = 0; i < addressPoints.length; i++) {
		var a = addressPoints[i];
		var title = a[2];
		var marker = L.marker(new L.LatLng(a[0], a[1]), {
			title : title,
			icon : my_icon
		});
		marker.bindPopup(title);
		markers.addLayer(marker);
	}

	map.addLayer(markers);
});