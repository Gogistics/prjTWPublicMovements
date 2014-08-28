/*
 * marker cluster 
 * 
 * */

//close map
$('#close_map').click(function(){
	$('#map_albums').toggle("slow");
});

//show map
var map;
$('#btn_show_map_markers_cluster').click(function(){
	$('#map_albums').toggle("slow", function(){
		//init map
		if(typeof(map) === 'undefined'){
			console.log(map);
			/* leaflet marker cluster */
			var tiles = L
					.tileLayer(
							'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
							{
								maxZoom : 16,
								attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
							}), latlng = L.latLng(album_map_center_lat, album_map_center_lng); //replace the geo location with average of all geo data ; 22.639673, 120.301826

			map = L.map('map_markers_cluster', {
				center : latlng,
				zoom : 8,
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
			
			//address_points is defined and obtained in albums.html
			if(typeof(address_points) !== 'undefined'){
				for ( var i = 0; i < address_points.length; i++) {
					var a = address_points[i];
					var title = a['album_title'];
					var popup_content = a['album_popup_content'];
					var marker = L.marker(new L.LatLng(a['album_lat'], a['album_lng']), {
						title : title,
						icon : my_icon
					});
					marker.bindPopup(popup_content, {maxHeight : 500, keepInView: true});
					markers.addLayer(marker);
				}
				map.addLayer(markers);
			}
		}
		//end show markers cluster
		
		//show pie chart
		dataset = [], labels_set = [];
		var sub_data_obj = {}, sub_labels_obj = {}, sub_data_ary = [], sub_labels_ary = [];
		$.each(albums_clusters, function(ith, elem){
			sub_data_ary.push(elem.length);
			sub_labels_ary.push('組-'+ (ith + 1));
		});
		sub_data_obj['data'] = sub_data_ary;
		sub_labels_obj['labels'] = sub_labels_ary;
		dataset.push(sub_data_obj);
		labels_set.push(sub_labels_obj);
		
		albumsGeoInfoPieChart.buildPieStructure();
		albumsGeoInfoPieChart.update(dataset[0].data); //show pie
		
	});

});

/* 
 * 
 * pie chart
 * 
 *  */

//data set
var dataset, labels_set;

// data structure for multi-data purpose
/*var dataset = [{
  data: [53245, 28479, 19697, 24037, 40245, 34, 45, 64]
}, {
  data: [855, 79, 97, 237, 245, 7, 44, 7, 56, 6]
}];*/

//labels set
/*var labels_set = [{
  labels: ['Group-1', 'Group-2', 'Group-3', 'Group-4', 'Group-5', 'Group-6', 'Group-7', 'Group-8']
}, {
  labels: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
}];*/

// pie chart obj
var albumsGeoInfoPieChart = { // theAmazingPie to albumsGeoInfoPieChart
		// constructor
	  buildPieStructure: function () {

      this.width = 300;
      this.height = 300;
      this.radius = Math.min(this.width, this.height) / 2;

      this.color = d3.scale.category20();

      this.pie = d3.layout.pie()
          .sort(null);


      this.arc = d3.svg.arc()
          .innerRadius(this.radius - 100)
          .outerRadius(this.radius - 50);

      this.svg = d3.select("#albums_geo_location_pie_chart").append("svg")
          .attr("width", this.width)
          .attr("height", this.height)
          .append("g")
          .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");


  },
  oldPieData: "",
  pieTween: function (d, i) {
      var that = this;

      var theOldDataInPie = albumsGeoInfoPieChart.oldPieData;
      // Interpolate the arcs in data space

      var s0;
      var e0;

      if (theOldDataInPie[i]) {
          s0 = theOldDataInPie[i].startAngle;
          e0 = theOldDataInPie[i].endAngle;
      } else if (!(theOldDataInPie[i]) && theOldDataInPie[i - 1]) {
          s0 = theOldDataInPie[i - 1].endAngle;
          e0 = theOldDataInPie[i - 1].endAngle;
      } else if (!(theOldDataInPie[i - 1]) && theOldDataInPie.length > 0) {
          s0 = theOldDataInPie[theOldDataInPie.length - 1].endAngle;
          e0 = theOldDataInPie[theOldDataInPie.length - 1].endAngle;
      } else {
          s0 = 0;
          e0 = 0;
      }

      var i = d3.interpolate({
          startAngle: s0,
          endAngle: e0
      }, {
          startAngle: d.startAngle,
          endAngle: d.endAngle
      });

      return function (t) {
          var b = i(t);
          return albumsGeoInfoPieChart.arc(b);
      };
  },
  removePieTween: function (d, i) {
      var that = this;
      s0 = 2 * Math.PI;
      e0 = 2 * Math.PI;
      var i = d3.interpolate({
          startAngle: d.startAngle,
          endAngle: d.endAngle
      }, {
          startAngle: s0,
          endAngle: e0
      });

      return function (t) {
          var b = i(t);
          return albumsGeoInfoPieChart.arc(b);
      };
  },
  update: function (dataSet) {
      console.log("update pie", dataSet);

      var that = this;

      this.piedata = this.pie(dataSet);
      
      //update labels' text (temp solution)
      for (var ith in this.piedata){
          this.piedata[ith].data = labels_set[0].labels[ith];
      }
      
      //create a marker element if it doesn't already exist
      var defs = this.svg.select("defs");
      if (defs.empty() ) {
          defs = this.svg.append("defs");            
      }
      var marker = defs.select("marker#circ");
      if (marker.empty() ) {
          defs.append("marker")
          .attr("id", "circ")
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("refX", 3)
          .attr("refY", 3)
          .append("circle")
          .attr("cx", 3)
          .attr("cy", 3)
          .attr("r", 3);
      }
      
      //Create/select <g> elements to hold the different types of graphics
      //and keep them in the correct drawing order
      var pathGroup = this.svg.select("g.piePaths");
      if (pathGroup.empty() ){
          pathGroup = this.svg.append("g")
                     .attr("class", "piePaths");
      }
      var pointerGroup = this.svg.select("g.pointers")
      if (pointerGroup.empty() ) {
          pointerGroup = this.svg.append("g")
                         .attr("class", "pointers");
      }
      var labelGroup = this.svg.select("g.labels")
      if (labelGroup.empty() ) {
          labelGroup = this.svg.append("g")
                       .attr("class", "labels");
      }
      
      this.path = pathGroup.selectAll("path.pie")
          .data(this.piedata);

      this.path.enter().append("path")
          .attr("class", "pie")
          .attr("fill", function (d, i) {
          return that.color(i);
      });

      this.path.transition()
          .duration(800)
          .attrTween("d", that.pieTween);

      this.path.exit()
          .transition()
          .duration(300)
          .attrTween("d", that.removePieTween)
          .remove();

      var labels = labelGroup.selectAll("text")
          .data(this.piedata
                .sort(function(p1,p2) { return p1.startAngle - p2.startAngle;}) 
               );
      labels.enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("id", function(d,i){ return d.data;}); // add group id to corresponding text
      labels.exit()
          .remove();
      
      
      var labelLayout = d3.geom.quadtree()
          .extent([[-that.width,-that.height], [that.width, that.height] ])
          .x(function(d){return d.x;})
          .y(function(d){return d.y;})
          ([]); //create an empty quadtree to hold label positions
      var maxLabelWidth = 0;
      var maxLabelHeight = 0;
      
      labels.text(function (d,i) {
          // Set the text *first*, so the size of the label can be determined by.getBBox()
         
          return d.data; //return text for each labels ; in this case, labels are Group-1, Grou-2...
      })
      .each(function (d, i) {
          // Move all calculations into the each function.
          // Position values are stored in the data object 
          // so can be accessed later when drawing the line
          
          /* calculate the position of the center marker */
          var a = (d.startAngle + d.endAngle) / 2 ;
          
          //trig functions adjusted to use the angle relative
          //to the "12 o'clock" vector:
          d.cx = Math.sin(a) * (that.radius - 75);
          d.cy = -Math.cos(a) * (that.radius - 75);
          
          /* calculate the default position for the label,
             so that the middle of the label is centered in the arc*/
          var bbox = this.getBBox();
          //bbox.width and bbox.height will 
          //describe the size of the label text
          var labelRadius = that.radius - 20;
          d.x =  Math.sin(a) * (labelRadius);
          d.l = d.x - bbox.width / 2 - 2;
          d.r = d.x + bbox.width / 2 + 2;
          d.y = -Math.cos(a) * (that.radius - 20);
          d.b = d.oy = d.y + 5;
          d.t = d.y - bbox.height - 5 ;
          
          /* check whether the default position 
             overlaps any other labels*/
          var conflicts = [];
          labelLayout.visit(function(node, x1, y1, x2, y2){
              //recurse down the tree, adding any overlapping 
              //node is the node in the quadtree, 
              //node.point is the value that we added to the tree
              //x1,y1,x2,y2 are the bounds of the rectangle that
              //this node covers
              
              if (  (x1 > d.r + maxLabelWidth/2) 
                      //left edge of node is to the right of right edge of label
                  ||(x2 < d.l - maxLabelWidth/2) 
                      //right edge of node is to the left of left edge of label
                  ||(y1 > d.b + maxLabelHeight/2)
                      //top (minY) edge of node is greater than the bottom of label
                  ||(y2 < d.t - maxLabelHeight/2 ) )
                      //bottom (maxY) edge of node is less than the top of label
                  
                    return true; //don't bother visiting children or checking this node
              
              var p = node.point;
              var v = false, h = false;
              if ( p ) { //p is defined, i.e., there is a value stored in this node
                  h =  ( ((p.l > d.l) && (p.l <= d.r))
                     || ((p.r > d.l) && (p.r <= d.r)) 
                     || ((p.l < d.l)&&(p.r >=d.r) ) ); //horizontal conflict
              
                  v =  ( ((p.t > d.t) && (p.t <= d.b))
                     || ((p.b > d.t) && (p.b <= d.b))  
                     || ((p.t < d.t)&&(p.b >=d.b) ) ); //vertical conflict
              
                  if (h&&v)
                      conflicts.push(p); //add to conflict list
              }
                   
          });
          
          if (conflicts.length) {
              console.log(d, " conflicts with ", conflicts);  
              var rightEdge = d3.max(conflicts, function(d2) {
                  return d2.r;
              });

              d.l = rightEdge;
              d.x = d.l + bbox.width / 2 + 5;
              d.r = d.l + bbox.width + 10;
          }
          else console.log("no conflicts for ", d);
          
          /* add this label to the quadtree, so it will show up as a conflict
             for future labels.  */
          labelLayout.add( d );
          var maxLabelWidth = Math.max(maxLabelWidth, bbox.width+10);
          var maxLabelHeight = Math.max(maxLabelHeight, bbox.height+10);
                     
          
      })
      .transition()//we can use transitions now!
      .attr("x", function (d) {
                  return d.x;
              })
              .attr("y", function (d) {
                  return d.y;
              });


      var pointers = pointerGroup.selectAll("path.pointer")
          .data(this.piedata);
      pointers.enter()
          .append("path")
          .attr("class", "pointer")
          .style("fill", "none")
          .style("stroke", "black")
          .attr("marker-end", "url(#circ)");
      pointers.exit().remove();
      
      pointers.transition().attr("d", function (d) {
          if (d.cx > d.l) {
              return "M" + (d.l+2) + "," + d.b + "L" + (d.r-2) + "," + d.b + " " + d.cx + "," + d.cy;
          } else {
              return "M" + (d.r-2) + "," + d.b + "L" + (d.l+2) + "," + d.b + " " + d.cx + "," + d.cy;
          }
      });


      // update pie data
      this.oldPieData = this.piedata;
  }
}
