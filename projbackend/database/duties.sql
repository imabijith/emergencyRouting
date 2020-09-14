create table duties(
	id serial primary key,
	officer_id int references trafficofficers(id),
	station_id int references trafficoffices(gid),
	duty_type varchar(50) not null,
	duty_description varchar(250) not null,
	duty_date date, 
	start_duty_time time, 
	end_duty_date date, 
	duty_location geometry,
	is_live boolean DEFAULT FALSE,
	is_done boolean DEFAULT FALSE,
	is_active boolean DEFAULT TRUE
	)