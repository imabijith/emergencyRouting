create table trafficOfficers(
	id serial primary key,
	uid varchar(50) not null,
	station_id int references trafficoffices(gid),
	name varchar(50) not null,
	phone varchar(50) not null,
	officer_rank varchar(50) not null,
	shift int not null,
	encry_password varchar(200) not null,
	onDuty boolean DEFAULT FALSE,
	duty_location geometry
)

select * from trafficofficers