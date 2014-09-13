/*
 *  Particles Swarm Optimization
 *  This is a standard PSO to find out optimal solution through out the stochastic spaces
 * 
 * */

particles_swarm_optimization = {
		
		// configuration
		config : {
			parameters_range : [[-15, 15],[-15, 15]], // ranges of particles
			particles_size : 20, // size of particles swarm
			iteration : 100, //iteration number
			max_min_factor : -1, // 1 means to find max; -1 means to find min
			Emax : Number.MAX_VALUE, // maximum value
			Emin : -Number.MAX_VALUE, // minimum value
			Type : 0, // 0 for real number; 1 for integer
			
			c1 : 2.05, // cognitive parameter (original value; would be replaced by linear change)
			c2 : 4.1 - 2.05, // c2 = 4.1 - c1 // social parameter (original value; would be replaced by linear change)
			c : 0.729, // constrain factor
			
			diff_ranges : [], // ranges of each parameter (from low boundary to up boundary)
			low_boundaries : [], //  low boundary
			
			particels_values : [], //  values set of particles
			particles_initial_values : [], // initial values set of particles
			
			particles_velocity : [], // velocity set of particles
			particles_initial_velocity : [], // can be zero or certain reasonable values based on each particle range

			performance_index_set : [], // performance index set
			performance_initial_index_set : [], // initial performance index set
			
			learning_rate : 0, // learning rate
			learning_rate_social_param_min : 0.4, //minimum learning rate of social parameter
			learning_rate_social_param_max : 0.9, //maximum learning rate of social parameter
			learning_rate_congnitive_min : 1.9, //minimum learning rate of cognitive parameter
			learning_rate_congnitive_max : 2.1, //maximum learning rate of cognitive parameter
			
			min_cost : 0, // minimum cost
			mean_cost : 0, // mean value
			local_optimal : 0, // local optimal
			index_local_optimal : 0, // index of global optimal in particles set
			global_optimal : 0, // global optimal
			index_global_optimal : 0, // index of global optimal
			RMS_cost : 0 // root-mean-square cost
		},
		
		// initialization function
		init_pso : function(){
			// get initial data ready for particles swarm optimization
			var particles_swarm_size = this.config.particles_size; //swarm size
			for (var ith = 0; ith < particles_swarm_size; ith++ ){

				var particle_values = [];
				var particle_velocity = [];
				var particle_parameters_length = this.config.parameters_range.length;
				for (var jth = 0; jth < particle_parameters_length ; jth++){
					//
					this.config.diff_ranges.push(this.config.parameters_range[jth][1] - this.config.parameters_range[jth][0]);
					this.config.low_boundaries.push(this.config.parameters_range[jth][0]);
					
					//
					var particle_value = this.config.parameters_range[jth][0] + Math.random()*(this.config.parameters_range[jth][1] - this.config.parameters_range[jth][0]);
					particle_values.push(particle_value.toFixed(5));
					particle_velocity.push([0, 0]); // let's assume the initial velocity is zero
				}
				

				//
				this.config.particels_values.push(particle_values);
				this.config.particles_initial_values.push(particle_values);
				
				//
				this.config.particles_velocity.push(particle_velocity);
				this.config.particles_initial_velocity.push(particle_velocity);
				
				//
				x1 = Number(particle_values[0]);
				x2 = Number(particle_values[1]);
				var PI = ((0.007 * x1 * (-x2-1)) *(Math.cos(x1 + 0.3)-Math.sin(x2))+(1 - Math.sin(x1))).toFixed(6);
				
				//
				this.config.performance_index_set.push(Number(PI));
				this.config.performance_initial_index_set.push(Number(PI));
			}

			//
			var init_min_cost = Math.min.apply(Math, this.config.performance_initial_index_set);
			this.config.min_cost = init_min_cost;
			console.log(this.config.min_cost);
			
			//
			var init_index_local_optimal = this.config.performance_initial_index_set.indexOf(init_min_cost);
			this.config.index_local_optimal = init_index_local_optimal;
			this.config.index_global_optimal = init_index_local_optimal;
			
			var initial_optimal_particle_values = this.config.particels_values[init_index_local_optimal];
			this.config.local_optimal = initial_optimal_particle_values;
			this.config.global_optimal = initial_optimal_particle_values;
			
		},
		
		// go through iteration
		go_iteration : function(){
			//
			var iteration_counter = 0; //
			var c1 = 0, c2 = 0; //
			while (iteration_counter < this.config.iteration){
				iteration_counter += 1; //
				this.config.learning_rate = this.config.learning_rate_social_param_max - (this.config.learning_rate_social_param_max - this.config.learning_rate_social_param_min) * iteration_counter / this.config.iteration;
				c1 = this.config.learning_rate_congnitive_max - (this.config.learning_rate_congnitive_max - this.config.learning_rate_congnitive_min) * iteration_counter / this.config.iteration; // update cognitive parameter
				c2 = 4.1 - c1; // update social parameter
				
				//
				var new_velocity_set = [];
				for (var ith = 0; ith < this.config.particles_size.length ; ith++){
					var new_velocity = 0;
					new_velocity = this.config.c * (this.config.learning_rate * this.config.particles_velocity[ith] + c1 * Math.random() * (this.config.local_optimal));
				}
			}
		},
		
		// start optimization
		start_optimization : function(){
			this.init_pso();
			//console.log(JSON.stringify(this.config.performance_initial_index_set,2,2));
			console.log(JSON.stringify(this.config.particels_values,2,2) + 'local: ' + this.config.local_optimal + ' ; global:' + this.config.index_local_optimal + ' ; min-cost:' + this.config.min_cost);
			
			// test numeric library
			consoloe.log(numeric.add([1,2,3],[6,7,8]));
		}
}

// test
particles_swarm_optimization.start_optimization();